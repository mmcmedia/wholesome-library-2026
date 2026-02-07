import { Html, Head, Body, Container, Section, Text, Button, Img, Hr, Preview } from '@react-email/components';

interface ReEngagementEmailProps {
  parentName: string;
  childName: string;
  favoriteGenre?: string;
  recommendedStory: { title: string; blurb: string; coverUrl: string; slug: string };
}

export default function ReEngagementEmail({ parentName = 'Parent', childName = 'Your child', favoriteGenre = 'adventure', recommendedStory = { title: 'The Secret of the Starlit Forest', blurb: 'A young explorer discovers a magical forest where the trees glow with starlight and a hidden treasure awaits.', coverUrl: 'https://wholesomelibrary.com/covers/default.png', slug: 'starlit-forest' } }: ReEngagementEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>We miss {childName}! A new story is waiting...</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img src="https://wholesomelibrary.com/logo.png" alt="Wholesome Library" width={150} height={50} style={logo} />
          <Text style={heading}>We miss {childName}! 📚</Text>
          <Text style={paragraph}>Hi {parentName},</Text>
          <Text style={paragraph}>It's been a week since {childName} last visited our library. We've added some great new {favoriteGenre} stories they might love!</Text>
          <Text style={sectionHeading}>Here's a new story waiting for them:</Text>
          <Section style={storyCard}>
            <Img src={recommendedStory.coverUrl} alt={recommendedStory.title} width={200} height={267} style={storyCover} />
            <Text style={storyTitle}>{recommendedStory.title}</Text>
            <Text style={storyBlurb}>{recommendedStory.blurb}</Text>
          </Section>
          <Button style={button} href={`https://wholesomelibrary.com/story/${recommendedStory.slug}`}>Read Now</Button>
          <Text style={smallText}>There are plenty more stories like this in your library.</Text>
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
const paragraph = { fontSize: '16px', lineHeight: '24px', color: '#525252', margin: '0 0 16px' };
const sectionHeading = { fontSize: '18px', fontWeight: '600', color: '#135C5E', margin: '24px 0 16px', textAlign: 'center' as const };
const storyCard = { border: '2px solid #e5e5e5', borderRadius: '8px', padding: '24px', margin: '0 0 24px', textAlign: 'center' as const, backgroundColor: '#fafafa' };
const storyCover = { margin: '0 auto 16px', borderRadius: '4px' };
const storyTitle = { fontSize: '20px', fontWeight: 'bold', color: '#135C5E', margin: '0 0 12px' };
const storyBlurb = { fontSize: '16px', lineHeight: '24px', color: '#525252', margin: '0' };
const button = { backgroundColor: '#135C5E', borderRadius: '6px', color: '#fff', fontSize: '16px', fontWeight: 'bold', textDecoration: 'none', textAlign: 'center' as const, display: 'block', padding: '14px 20px', margin: '0 auto 16px', maxWidth: '200px' };
const smallText = { fontSize: '14px', lineHeight: '20px', color: '#999', textAlign: 'center' as const, margin: '0 0 32px' };
const divider = { borderColor: '#e5e5e5', margin: '32px 0' };
const footer = { fontSize: '14px', lineHeight: '20px', color: '#999', textAlign: 'center' as const, margin: '0' };
const link = { color: '#135C5E', textDecoration: 'underline' };
