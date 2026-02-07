import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Img,
  Hr,
  Preview,
} from '@react-email/components';

interface StoryNotificationEmailProps {
  parentName: string;
  childName: string;
  newStories: Array<{
    title: string;
    blurb: string;
    genre: string;
    readingLevel: string;
    coverUrl: string;
    slug: string;
  }>;
}

export default function StoryNotificationEmail({
  parentName = 'Parent',
  childName = 'Your child',
  newStories = [
    {
      title: 'The Honest Astronaut',
      blurb: 'When a space mission goes wrong, telling the truth becomes the only way to save the crew.',
      genre: 'Sci-Fi',
      readingLevel: 'Independent',
      coverUrl: 'https://wholesomelibrary.com/covers/astronaut.png',
      slug: 'honest-astronaut',
    },
    {
      title: 'Mystery at Maple Hill',
      blurb: 'A young detective discovers clues that lead to an unexpected friendship.',
      genre: 'Mystery',
      readingLevel: 'Independent',
      coverUrl: 'https://wholesomelibrary.com/covers/maple-hill.png',
      slug: 'maple-hill-mystery',
    },
    {
      title: 'The Kind Dragon',
      blurb: 'A misunderstood dragon shows a village that kindness is more powerful than fear.',
      genre: 'Fantasy',
      readingLevel: 'Independent',
      coverUrl: 'https://wholesomelibrary.com/covers/kind-dragon.png',
      slug: 'kind-dragon',
    },
  ],
}: StoryNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{newStories.length} new stories for {childName} this week!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://wholesomelibrary.com/logo.png"
            alt="Wholesome Library"
            width={150}
            height={50}
            style={logo}
          />
          
          <Text style={heading}>
            {newStories.length} New {newStories.length === 1 ? 'Story' : 'Stories'} for {childName}!
          </Text>
          
          <Text style={paragraph}>
            Hi {parentName},
          </Text>

          <Text style={paragraph}>
            We've added {newStories.length} new {newStories.length === 1 ? 'story' : 'stories'} that match {childName}'s reading level and preferences. Here's what's waiting:
          </Text>

          {newStories.map((story, index) => (
            <Section key={index} style={storyCard}>
              <div style={storyCardContent}>
                <Img
                  src={story.coverUrl}
                  alt={story.title}
                  width={120}
                  height={160}
                  style={storyCover}
                />
                <div style={storyDetails}>
                  <Text style={storyTitle}>{story.title}</Text>
                  <Text style={storyMeta}>
                    {story.genre} • {story.readingLevel}
                  </Text>
                  <Text style={storyBlurb}>{story.blurb}</Text>
                  <a 
                    href={`https://wholesomelibrary.com/story/${story.slug}`} 
                    style={readLink}
                  >
                    Start Reading →
                  </a>
                </div>
              </div>
            </Section>
          ))}

          <Button style={button} href="https://wholesomelibrary.com/library">
            Browse All New Stories
          </Button>

          <Hr style={divider} />

          <Text style={footer}>
            Stories created with modern tools + editorial review
            <br />
            <a href="https://wholesomelibrary.com/unsubscribe" style={link}>Unsubscribe</a>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  marginTop: '40px',
  marginBottom: '40px',
  borderRadius: '8px',
  maxWidth: '600px',
};

const logo = {
  margin: '0 auto 32px',
};

const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#135C5E',
  textAlign: 'center' as const,
  margin: '0 0 24px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '24px',
  color: '#525252',
  margin: '0 0 16px',
};

const storyCard = {
  border: '2px solid #e5e5e5',
  borderRadius: '8px',
  padding: '20px',
  margin: '0 0 20px',
  backgroundColor: '#fafafa',
};

const storyCardContent = {
  display: 'flex',
  gap: '16px',
};

const storyCover = {
  borderRadius: '4px',
  flexShrink: 0,
};

const storyDetails = {
  flex: 1,
};

const storyTitle = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#135C5E',
  margin: '0 0 4px',
};

const storyMeta = {
  fontSize: '14px',
  color: '#999',
  margin: '0 0 12px',
};

const storyBlurb = {
  fontSize: '15px',
  lineHeight: '22px',
  color: '#525252',
  margin: '0 0 12px',
};

const readLink = {
  fontSize: '14px',
  color: '#135C5E',
  fontWeight: '600',
  textDecoration: 'none',
};

const button = {
  backgroundColor: '#135C5E',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '14px 20px',
  margin: '24px auto 32px',
  maxWidth: '250px',
};

const divider = {
  borderColor: '#e5e5e5',
  margin: '32px 0',
};

const footer = {
  fontSize: '14px',
  lineHeight: '20px',
  color: '#999',
  textAlign: 'center' as const,
  margin: '0',
};

const link = {
  color: '#135C5E',
  textDecoration: 'underline',
};
