-- Wholesome Library v2 - Initial Schema Migration
-- Generated: 2026-02-06
-- DO NOT RUN THIS MANUALLY - McKinzie needs to create Supabase project first

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUMS
CREATE TYPE reading_level AS ENUM ('early', 'independent', 'confident', 'advanced');
CREATE TYPE story_status AS ENUM ('generating', 'auto_review', 'editor_queue', 'approved', 'published', 'rejected', 'archived');
CREATE TYPE brief_status AS ENUM ('queued', 'generating', 'completed', 'failed');
CREATE TYPE plan AS ENUM ('free', 'family', 'annual');

-- Profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  plan plan DEFAULT 'free',
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Children
CREATE TABLE children (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  reading_level reading_level NOT NULL,
  reading_level_source TEXT DEFAULT 'parent_selected',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX children_parent_id_idx ON children(parent_id);

-- Content Preferences
CREATE TABLE content_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  parent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  include_fantasy_magic BOOLEAN DEFAULT true,
  include_mild_conflict BOOLEAN DEFAULT true,
  include_faith_themes BOOLEAN DEFAULT false,
  include_supernatural BOOLEAN DEFAULT true,
  excluded_themes TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(parent_id, child_id)
);

CREATE INDEX content_preferences_parent_child_idx ON content_preferences(parent_id, child_id);

-- Stories
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  blurb TEXT,
  reading_level reading_level NOT NULL,
  genre TEXT NOT NULL,
  primary_virtue TEXT NOT NULL,
  secondary_virtues TEXT[] DEFAULT '{}',
  content_tags TEXT[] DEFAULT '{}',
  chapter_count INTEGER NOT NULL,
  total_word_count INTEGER,
  estimated_read_minutes INTEGER,
  cover_image_url TEXT,
  status story_status DEFAULT 'draft' NOT NULL,
  quality_score NUMERIC(5,2),
  safety_passed BOOLEAN,
  values_score NUMERIC(5,2),
  rejection_reason TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX stories_status_reading_level_idx ON stories(status, reading_level, published_at DESC) WHERE status = 'published';
CREATE INDEX stories_slug_idx ON stories(slug);

-- GIN index for content_tags array searching
CREATE INDEX stories_content_tags_idx ON stories USING GIN(content_tags);

-- Chapters
CREATE TABLE chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  chapter_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  word_count INTEGER,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(story_id, chapter_number)
);

CREATE INDEX chapters_story_chapter_idx ON chapters(story_id, chapter_number);

-- Story DNA (generation metadata)
CREATE TABLE story_dna (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  brief_id UUID REFERENCES story_briefs(id),
  dna_data JSONB NOT NULL,
  generation_version TEXT,
  generation_duration_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX story_dna_story_id_idx ON story_dna(story_id);

-- Story Briefs (generation queue)
CREATE TABLE story_briefs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reading_level reading_level NOT NULL,
  genre TEXT NOT NULL,
  primary_virtue TEXT NOT NULL,
  setting TEXT,
  themes TEXT[] DEFAULT '{}',
  avoid_content TEXT[] DEFAULT '{}',
  target_chapters INTEGER NOT NULL,
  target_word_count INTEGER NOT NULL,
  special_instructions TEXT,
  status brief_status DEFAULT 'queued' NOT NULL,
  priority TEXT DEFAULT 'normal',
  failure_reason TEXT,
  attempts INTEGER DEFAULT 0,
  created_by TEXT DEFAULT 'system',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX story_briefs_status_priority_idx ON story_briefs(status, priority);

-- Reading Progress
CREATE TABLE reading_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  current_chapter INTEGER DEFAULT 1,
  completed BOOLEAN DEFAULT false,
  started_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  completed_at TIMESTAMPTZ,
  last_read_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(child_id, story_id)
);

CREATE INDEX reading_progress_child_story_idx ON reading_progress(child_id, story_id);

-- Editor Reviews (audit trail)
CREATE TABLE editor_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES profiles(id),
  action TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX editor_reviews_story_id_idx ON editor_reviews(story_id);

-- Analytics Events
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_name TEXT NOT NULL,
  user_id UUID REFERENCES profiles(id),
  child_id UUID REFERENCES children(id),
  story_id UUID REFERENCES stories(id),
  properties JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX analytics_events_event_name_idx ON analytics_events(event_name, created_at DESC);
CREATE INDEX analytics_events_user_id_idx ON analytics_events(user_id, created_at DESC);

-- Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_dna ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE editor_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only see/edit their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Children: Parents can CRUD their own children
CREATE POLICY "Parents can view own children" ON children FOR SELECT USING (auth.uid() = parent_id);
CREATE POLICY "Parents can insert own children" ON children FOR INSERT WITH CHECK (auth.uid() = parent_id);
CREATE POLICY "Parents can update own children" ON children FOR UPDATE USING (auth.uid() = parent_id);
CREATE POLICY "Parents can delete own children" ON children FOR DELETE USING (auth.uid() = parent_id);

-- Content Preferences: Parents can manage their own preferences
CREATE POLICY "Parents can view own preferences" ON content_preferences FOR SELECT USING (auth.uid() = parent_id);
CREATE POLICY "Parents can insert own preferences" ON content_preferences FOR INSERT WITH CHECK (auth.uid() = parent_id);
CREATE POLICY "Parents can update own preferences" ON content_preferences FOR UPDATE USING (auth.uid() = parent_id);

-- Stories: Public can view published stories, editors can view all
CREATE POLICY "Anyone can view published stories" ON stories FOR SELECT USING (status = 'published');

-- Chapters: Public can view chapters of published stories
CREATE POLICY "Anyone can view published chapters" ON chapters FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM stories WHERE stories.id = chapters.story_id AND stories.status = 'published'
  ));

-- Reading Progress: Users can manage their children's progress
CREATE POLICY "Parents can view children's progress" ON reading_progress FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM children WHERE children.id = reading_progress.child_id AND children.parent_id = auth.uid()
  ));

CREATE POLICY "Parents can insert children's progress" ON reading_progress FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM children WHERE children.id = reading_progress.child_id AND children.parent_id = auth.uid()
  ));

CREATE POLICY "Parents can update children's progress" ON reading_progress FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM children WHERE children.id = reading_progress.child_id AND children.parent_id = auth.uid()
  ));

-- Analytics: Users can insert their own events (no reading)
CREATE POLICY "Users can insert own analytics" ON analytics_events FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_preferences_updated_at BEFORE UPDATE ON content_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stories_updated_at BEFORE UPDATE ON stories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-generate story slug from title
CREATE OR REPLACE FUNCTION generate_story_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := lower(regexp_replace(NEW.title, '[^a-zA-Z0-9]+', '-', 'g'));
    NEW.slug := trim(both '-' from NEW.slug);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_story_slug_trigger
BEFORE INSERT OR UPDATE ON stories
FOR EACH ROW
EXECUTE FUNCTION generate_story_slug();

-- Comments for documentation
COMMENT ON TABLE profiles IS 'User profiles extending Supabase auth.users';
COMMENT ON TABLE children IS 'Child profiles belonging to parent users';
COMMENT ON TABLE content_preferences IS 'Content filtering preferences per child or parent-level defaults';
COMMENT ON TABLE stories IS 'Story content with metadata and status tracking';
COMMENT ON TABLE chapters IS 'Individual story chapters';
COMMENT ON TABLE story_dna IS 'Generation metadata for potential re-generation';
COMMENT ON TABLE story_briefs IS 'Queue of stories to be generated';
COMMENT ON TABLE reading_progress IS 'Per-child reading progress tracking';
COMMENT ON TABLE editor_reviews IS 'Audit trail of editorial decisions';
COMMENT ON TABLE analytics_events IS 'Event tracking for product analytics';
