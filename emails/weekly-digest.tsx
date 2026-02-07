import { Html, Head, Body, Container, Section, Text, Button, Img, Hr, Preview } from '@react-email/components';

interface WeeklyDigestEmailProps {
  parentName: string;
  childName: string;
  storiesRead: number;
  storiesReadTitles: string[];
  newStories: Array<{ title: string; genre: string; slug: string }>;
  readingStreak?: number;
}

export default function WeeklyDigestEmail({ parentName = 'Parent', childName = 'Your child', storiesRead = 3, storiesReadTitles = ['The Brave Little Fox', 'Mystery at the Museum', 'The Kind Gardener'], newStories = [{ title: 'Adventure in the Cloud Castle', genre: 'Fantasy', slug: 'cloud-castle' }, { title: 'The Honest Inventor', genre: 'Sci-Fi', slug: 'honest-inventor' }, { title: 'Friendship at Summer Camp', genre: 'Friendship', slug: 'summer-camp' }], readingStreak = 0 }: WeeklyDigestEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{childName} read {storiesRead} stories this week! Here's what's new.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img src="https://wholesomelibrary.com/logo.png" alt="Wholesome Library" width={150} height={50} style={logo} />
          <Text style={heading}>Weekly Reading Summary</Text>
          <Section style={statsBox}>
            <Text style={statsHeading}>📚 {childName} read {storiesRead} {storiesRead === 1 ? 'story' : 'stories'} this week!</Text>
            {readingStreak > 0 && <Text style={streakText}>🔥 {readingStreak}-day reading streak!</Text>}
          </Section>
          {storiesReadTitles.length > 0 && (
            <>
              <Text style={sectionHeading}>Stories Read:</Text>
              <Section style={storyList}>
                {storiesReadTitles.map((title, index) => (
                  <Text key={index} style={storyItem}>• {title}</Text>
                ))}
              </Section>
            </>
          )}
          <Text style={sectionHeading}>New Stories Added This Week:</Text>
          <Section>
            {newStories.map((story, index) => (
              <div key={index} style={storyCard}>
                <Text style={storyTitle}>{story.title}</Text>
                <Text style={storyGenre}>{story.genre}</Text>
                <a href={`https://wholesomelibrary.com/story/${story.slug}`} style={readLink}>Read Now →</a>
              </div>
            ))}
          </Section>
          <Button style={button} href="https://wholesomelibrary.com/library">Browse More Stories</Button>
          <Hr style={divider} />
          <Text style={footer}>Stories created with modern tools + editorial review<br /><a href="https://wholesomelibrary.com/unsubscribe" style={link}>Unsubscribe</a></Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: '#f6f9fc', fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif' };
const container = { backgroundColor: '#ffffff', margin: '0 auto', padding: '40px 20px', marginTop: '40px', marginBottom: '40px', borderRadius: '8px', maxWidth: '600px' };
const logo = { margin: '0 auto 32px' };
const heading = { fontSize: '24px', fontWeight: 'bold', color: '#135C5E', textAlign: 'center' as const, margin: '0 0 24px' };
const statsBox = { backgroundColor: '#f0f9f9', border: '2px solid #135C5E', borderRadius: '8px', padding: '20px', margin: '24px 0', textAlign: 'center' as const };
const statsHeading = { fontSize: '18px', fontWeight: 'bold', color: '#135C5E', margin: '0 0 8px' };
const streakText = { fontSize: '16px', fontWeight: '600', color: '#f59e0b', margin: '8px 0 0' };
const sectionHeading = { fontSize: '18px', fontWeight: '600', color: '#135C5E', margin: '24px 0 12px' };
const storyList = { margin: '0 0 24px' };
const storyItem = { fontSize: '16px', lineHeight: '24px', color: '#525252', margin: '0 0 8px' };
const storyCard = { border: '1px solid #e5e5e5', borderRadius: '8px', padding: '16px', margin: '0 0 16px', backgroundColor: '#fafafa' };
const storyTitle = { fontSize: '16px', fontWeight: 'bold', color: '#135C5E', margin: '0 0 4px' };
const storyGenre = { fontSize: '14px', color: '#999', margin: '0 0 8px' };
const readLink = { fontSize: '14px', color: '#135C5E', fontWeight: '600', textDecoration: 'none' };
const button = { backgroundColor: '#135C5E', borderRadius: '6px', color: '#fff', fontSize: '16px', fontWeight: 'bold', textDecoration: 'none', textAlign: 'center' as const, display: 'block', padding: '14px 20px', margin: '24px auto 32px', maxWidth: '200px' };
const divider = { borderColor: '#e5e5e5', margin: '32px 0' };
const footer = { fontSize: '14px', lineHeight: '20px', color: '#999', textAlign: 'center' as const, margin: '0' };
const link = { color: '#135C5E', textDecoration: 'underline' };
