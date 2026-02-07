import { pgTable, uuid, text, timestamp, integer, boolean, numeric, jsonb, index, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const readingLevelEnum = pgEnum('reading_level', ['early', 'independent', 'confident', 'advanced']);
export const storyStatusEnum = pgEnum('story_status', ['generating', 'auto_review', 'editor_queue', 'approved', 'published', 'rejected', 'archived']);
export const briefStatusEnum = pgEnum('brief_status', ['queued', 'generating', 'completed', 'failed']);
export const planEnum = pgEnum('plan', ['free', 'family', 'annual']);

// Profiles (extends Supabase auth.users)
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(), // References auth.users(id) in migration SQL
  email: text('email').notNull(),
  displayName: text('display_name'),
  plan: planEnum('plan').default('free'),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  subscriptionStatus: text('subscription_status'), // active, past_due, cancelled, etc.
  subscriptionPeriodEnd: timestamp('subscription_period_end'),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
  trialEndsAt: timestamp('trial_ends_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  stripeCustomerIdIdx: index('profiles_stripe_customer_id_idx').on(table.stripeCustomerId),
}));

// Children
export const children = pgTable('children', {
  id: uuid('id').primaryKey().defaultRandom(),
  parentId: uuid('parent_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  readingLevel: readingLevelEnum('reading_level').notNull(),
  readingLevelSource: text('reading_level_source').default('parent_selected'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  parentIdIdx: index('children_parent_id_idx').on(table.parentId),
}));

// Content Preferences
export const contentPreferences = pgTable('content_preferences', {
  id: uuid('id').primaryKey().defaultRandom(),
  parentId: uuid('parent_id').notNull().references(() => profiles.id, { onDelete: 'cascade' }),
  childId: uuid('child_id').references(() => children.id, { onDelete: 'cascade' }),
  includeFantasyMagic: boolean('include_fantasy_magic').default(true),
  includeMildConflict: boolean('include_mild_conflict').default(true),
  includeFaithThemes: boolean('include_faith_themes').default(false),
  includeSupernatural: boolean('include_supernatural').default(true),
  excludedThemes: text('excluded_themes').array().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  parentChildIdx: index('content_preferences_parent_child_idx').on(table.parentId, table.childId),
}));

// Stories
export const stories = pgTable('stories', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  slug: text('slug').unique(),
  blurb: text('blurb'),
  readingLevel: readingLevelEnum('reading_level').notNull(),
  genre: text('genre').notNull(),
  primaryVirtue: text('primary_virtue').notNull(),
  secondaryVirtues: text('secondary_virtues').array().default([]),
  contentTags: text('content_tags').array().default([]),
  chapterCount: integer('chapter_count').notNull(),
  totalWordCount: integer('total_word_count'),
  estimatedReadMinutes: integer('estimated_read_minutes'),
  coverImageUrl: text('cover_image_url'),
  status: storyStatusEnum('status').default('generating').notNull(),
  qualityScore: numeric('quality_score', { precision: 5, scale: 2 }),
  safetyPassed: boolean('safety_passed'),
  valuesScore: numeric('values_score', { precision: 5, scale: 2 }),
  rejectionReason: text('rejection_reason'),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  statusReadingLevelIdx: index('stories_status_reading_level_idx').on(table.status, table.readingLevel, table.publishedAt),
  slugIdx: index('stories_slug_idx').on(table.slug),
}));

// Chapters
export const chapters = pgTable('chapters', {
  id: uuid('id').primaryKey().defaultRandom(),
  storyId: uuid('story_id').notNull().references(() => stories.id, { onDelete: 'cascade' }),
  chapterNumber: integer('chapter_number').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  wordCount: integer('word_count'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  storyChapterIdx: index('chapters_story_chapter_idx').on(table.storyId, table.chapterNumber),
}));

// Story DNA (generation metadata)
export const storyDna = pgTable('story_dna', {
  id: uuid('id').primaryKey().defaultRandom(),
  storyId: uuid('story_id').notNull().references(() => stories.id, { onDelete: 'cascade' }),
  briefId: uuid('brief_id').references(() => storyBriefs.id),
  dnaData: jsonb('dna_data').notNull(),
  generationVersion: text('generation_version'),
  generationDurationMs: integer('generation_duration_ms'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  storyIdIdx: index('story_dna_story_id_idx').on(table.storyId),
}));

// Story Briefs (generation queue)
export const storyBriefs = pgTable('story_briefs', {
  id: uuid('id').primaryKey().defaultRandom(),
  readingLevel: readingLevelEnum('reading_level').notNull(),
  genre: text('genre').notNull(),
  primaryVirtue: text('primary_virtue').notNull(),
  setting: text('setting'),
  themes: text('themes').array().default([]),
  avoidContent: text('avoid_content').array().default([]),
  targetChapters: integer('target_chapters').notNull(),
  targetWordCount: integer('target_word_count').notNull(),
  specialInstructions: text('special_instructions'),
  status: briefStatusEnum('status').default('queued').notNull(),
  priority: text('priority').default('normal'),
  failureReason: text('failure_reason'),
  attempts: integer('attempts').default(0),
  createdBy: text('created_by').default('system'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  statusPriorityIdx: index('story_briefs_status_priority_idx').on(table.status, table.priority),
}));

// Reading Progress
export const readingProgress = pgTable('reading_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  childId: uuid('child_id').notNull().references(() => children.id, { onDelete: 'cascade' }),
  storyId: uuid('story_id').notNull().references(() => stories.id, { onDelete: 'cascade' }),
  currentChapter: integer('current_chapter').default(1),
  completed: boolean('completed').default(false),
  startedAt: timestamp('started_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
  lastReadAt: timestamp('last_read_at').defaultNow().notNull(),
}, (table) => ({
  childStoryIdx: index('reading_progress_child_story_idx').on(table.childId, table.storyId),
}));

// Editor Reviews (audit trail)
export const editorReviews = pgTable('editor_reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  storyId: uuid('story_id').notNull().references(() => stories.id, { onDelete: 'cascade' }),
  reviewerId: uuid('reviewer_id').notNull().references(() => profiles.id),
  action: text('action').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  storyIdIdx: index('editor_reviews_story_id_idx').on(table.storyId),
}));

// Analytics Events
export const analyticsEvents = pgTable('analytics_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventName: text('event_name').notNull(),
  userId: uuid('user_id').references(() => profiles.id),
  childId: uuid('child_id').references(() => children.id),
  storyId: uuid('story_id').references(() => stories.id),
  properties: jsonb('properties').default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  eventNameIdx: index('analytics_events_event_name_idx').on(table.eventName, table.createdAt),
  userIdIdx: index('analytics_events_user_id_idx').on(table.userId, table.createdAt),
}));

// Relations
export const profilesRelations = relations(profiles, ({ many }) => ({
  children: many(children),
  contentPreferences: many(contentPreferences),
  editorReviews: many(editorReviews),
}));

export const childrenRelations = relations(children, ({ one, many }) => ({
  parent: one(profiles, {
    fields: [children.parentId],
    references: [profiles.id],
  }),
  readingProgress: many(readingProgress),
  contentPreferences: many(contentPreferences),
}));

export const storiesRelations = relations(stories, ({ many }) => ({
  chapters: many(chapters),
  storyDna: many(storyDna),
  readingProgress: many(readingProgress),
  editorReviews: many(editorReviews),
}));

export const chaptersRelations = relations(chapters, ({ one }) => ({
  story: one(stories, {
    fields: [chapters.storyId],
    references: [stories.id],
  }),
}));

export const readingProgressRelations = relations(readingProgress, ({ one }) => ({
  child: one(children, {
    fields: [readingProgress.childId],
    references: [children.id],
  }),
  story: one(stories, {
    fields: [readingProgress.storyId],
    references: [stories.id],
  }),
}));
