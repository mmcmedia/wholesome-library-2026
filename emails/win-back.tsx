import { Html, Head, Body, Container, Section, Text, Button, Img, Hr, Preview } from '@react-email/components';

interface WinBackEmailProps {
  parentName: string;
  newStoriesCount: number;
}

export default function WinBackEmail({ parentName = 'Parent', newStoriesCount = 120 }: WinBackEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>We've added {newStoriesCount} new stories — Come back for 50% off!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img src="https://wholesomelibrary.com/logo.png" alt="Wholesome Library" width={150} height={50} style={logo} />
          <Text style={heading}>We've Been Busy!</Text>
          <Text style={paragraph}>Hi {parentName},</Text>
          <Text style={paragraph}>Since you left, we've added <strong>{newStoriesCount} new wholesome stories</strong> to our library. Your family is missing out on so much great reading!</Text>
          <Section style={highlightBox}>
            <Text style={highlightHeading}>🎁 Special Offer Just for You</Text>
            <Text style={offerText}>Come back for <span style={offerPrice}>50% off</span> your first month</Text>
            <Text style={offerPrice}>Just $3.99</Text>
          </Section>
          <Text style={paragraph}>What you'll get:</Text>
          <Section style={featureList}>
            <Text style={feature}>✓ Access to our entire library of {newStoriesCount}+ curated stories</Text>
            <Text style={feature}>✓ New stories added every week</Text>
            <Text style={feature}>✓ Every story reviewed for safety and quality</Text>
            <Text style={feature}>✓ Content filters for your family's values</Text>
            <Text style={feature}>✓ Reading progress tracking</Text>
          </Section>
          <Button style={button} href="https://wholesomelibrary.com/subscription?promo=WINBACK50">Resubscribe for $3.99</Button>
          <Text style={smallText}>Offer valid for your first month only. Cancel anytime.</Text>
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
const heading = { fontSize: '28px', fontWeight: 'bold', color: '#135C5E', textAlign: 'center' as const, margin: '0 0 24px' };
const paragraph = { fontSize: '16px', lineHeight: '24px', color: '#525252', margin: '0 0 16px' };
const highlightBox = { backgroundColor: '#fff9e6', border: '2px solid #f59e0b', borderRadius: '8px', padding: '24px', margin: '24px 0', textAlign: 'center' as const };
const highlightHeading = { fontSize: '20px', fontWeight: 'bold', color: '#f59e0b', margin: '0 0 12px' };
const offerText = { fontSize: '18px', color: '#525252', margin: '0 0 8px' };
const offerPrice = { fontSize: '32px', fontWeight: 'bold', color: '#135C5E' };
const featureList = { margin: '16px 0 32px' };
const feature = { fontSize: '16px', lineHeight: '28px', color: '#525252', margin: '0 0 8px' };
const button = { backgroundColor: '#f59e0b', borderRadius: '6px', color: '#fff', fontSize: '16px', fontWeight: 'bold', textDecoration: 'none', textAlign: 'center' as const, display: 'block', padding: '14px 20px', margin: '0 auto 16px', maxWidth: '250px' };
const smallText = { fontSize: '14px', lineHeight: '20px', color: '#999', textAlign: 'center' as const, margin: '0 0 32px' };
const divider = { borderColor: '#e5e5e5', margin: '32px 0' };
const footer = { fontSize: '14px', lineHeight: '20px', color: '#999', textAlign: 'center' as const, margin: '0' };
const link = { color: '#135C5E', textDecoration: 'underline' };
