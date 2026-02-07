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

interface LevelUpEmailProps {
  parentName: string;
  childName: string;
  currentLevel: string;
  nextLevel: string;
  recommendedStories: Array<{ title: string; slug: string }>;
}

export default function LevelUpEmail({
  parentName = 'Parent',
  childName = 'Your child',
  currentLevel = 'Early Reader',
  nextLevel = 'Independent',
  recommendedStories = [
    { title: 'The Mystery of the Missing Compass', slug: 'missing-compass' },
    { title: 'Adventure at Willow Creek', slug: 'willow-creek' },
    { title: 'The Brave Little Inventor', slug: 'brave-inventor' },
  ],
}: LevelUpEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>🎉 {childName} is growing! Time for new stories.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://wholesomelibrary.com/logo.png"
            alt="Wholesome Library"
            width={150}
            height={50}
            style={logo}
          />
          
          <Text style={celebrationEmoji}>🎉</Text>
          <Text style={heading}>{childName} is Growing!</Text>
          
          <Text style={paragraph}>
            Hi {parentName},
          </Text>

          <Text style={paragraph}>
            Great news! Based on {childName}'s reading progress, they might be ready for the next level.
          </Text>

          <Section style={levelBox}>
            <div style={levelCard}>
              <Text style={levelLabel}>Current Level</Text>
              <Text style={levelName}>{currentLevel}</Text>
            </div>
            <Text style={arrow}>→</Text>
            <div style={levelCard}>
              <Text style={levelLabel}>Ready For</Text>
              <Text style={levelName}>{nextLevel}</Text>
            </div>
          </Section>

          <Text style={paragraph}>
            Moving to {nextLevel} means more complex stories, richer vocabulary, and longer adventures. It's a sign of {childName}'s growing reading skills!
          </Text>

          <Text style={sectionHeading}>Here are stories at their new level:</Text>

          <Section style={storyList}>
            {recommendedStories.map((story, index) => (
              <div key={index} style={storyItem}>
                <Text style={storyTitle}>📖 {story.title}</Text>
                <a 
                  href={`https://wholesomelibrary.com/story/${story.slug}`} 
                  style={readLink}
                >
                  Read Now →
                </a>
              </div>
            ))}
          </Section>

          <Button style={button} href={`https://wholesomelibrary.com/library?level=${nextLevel.toLowerCase().replace(' ', '-')}`}>
            Explore {nextLevel} Stories
          </Button>

          <Text style={smallText}>
            You can update {childName}'s reading level anytime in your parent dashboard.
          </Text>

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
  margin: '0 auto 20px',
};

const celebrationEmoji = {
  fontSize: '48px',
  textAlign: 'center' as const,
  margin: '0 0 16px',
};

const heading = {
  fontSize: '28px',
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

const levelBox = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '16px',
  margin: '24px 0',
  padding: '24px',
  backgroundColor: '#f0f9f9',
  borderRadius: '8px',
};

const levelCard = {
  textAlign: 'center' as const,
  flex: '1',
};

const levelLabel = {
  fontSize: '12px',
  fontWeight: '600',
  color: '#999',
  textTransform: 'uppercase' as const,
  margin: '0 0 8px',
};

const levelName = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#135C5E',
  margin: '0',
};

const arrow = {
  fontSize: '32px',
  color: '#135C5E',
  fontWeight: 'bold',
};

const sectionHeading = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#135C5E',
  margin: '24px 0 16px',
};

const storyList = {
  margin: '0 0 24px',
};

const storyItem = {
  border: '1px solid #e5e5e5',
  borderRadius: '8px',
  padding: '16px',
  margin: '0 0 12px',
  backgroundColor: '#fafafa',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const storyTitle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#135C5E',
  margin: '0',
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
  margin: '0 auto 16px',
  maxWidth: '250px',
};

const smallText = {
  fontSize: '14px',
  lineHeight: '20px',
  color: '#999',
  textAlign: 'center' as const,
  margin: '0 0 32px',
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
