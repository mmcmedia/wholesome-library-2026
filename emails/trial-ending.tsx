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

interface TrialEndingEmailProps {
  parentName: string;
  storiesRead: number;
  childName?: string;
}

export default function TrialEndingEmail({
  parentName = 'Parent',
  storiesRead = 5,
  childName = 'Your child',
}: TrialEndingEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your free trial ends in 2 days — Keep the reading going!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://wholesomelibrary.com/logo.png"
            alt="Wholesome Library"
            width={150}
            height={50}
            style={logo}
          />
          
          <Text style={heading}>Hi {parentName}!</Text>
          
          <Section style={highlightBox}>
            <Text style={highlightText}>
              Your free trial ends in 2 days
            </Text>
          </Section>

          <Text style={paragraph}>
            {childName} has read <strong>{storiesRead} {storiesRead === 1 ? 'story' : 'stories'}</strong> so far! 📚
          </Text>

          <Text style={paragraph}>
            Don't let the reading stop. Keep access to our entire library of wholesome, curated stories.
          </Text>

          <Section style={pricingBox}>
            <div style={pricingOption}>
              <Text style={pricingTitle}>Monthly</Text>
              <Text style={pricingPrice}>$7.99/mo</Text>
              <Text style={pricingDesc}>Cancel anytime</Text>
            </div>
            <div style={pricingOption}>
              <Text style={pricingTitle}>Annual</Text>
              <Text style={pricingPrice}>$59.99/yr</Text>
              <Text style={pricingDesc}>Save 37% • Just $5/mo</Text>
              <Text style={badge}>BEST VALUE</Text>
            </div>
          </Section>

          <Button style={button} href="https://wholesomelibrary.com/subscription">
            Subscribe Now
          </Button>

          <Text style={smallText}>
            All plans include unlimited reading, all filters, and up to 5 child profiles.
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
  textAlign: 'center' as const,
};

const highlightBox = {
  backgroundColor: '#fff9e6',
  border: '2px solid #f59e0b',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const highlightText = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#f59e0b',
  margin: '0',
};

const pricingBox = {
  display: 'flex',
  gap: '16px',
  margin: '24px 0',
  justifyContent: 'center',
};

const pricingOption = {
  flex: '1',
  border: '2px solid #e5e5e5',
  borderRadius: '8px',
  padding: '20px',
  textAlign: 'center' as const,
};

const pricingTitle = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#999',
  textTransform: 'uppercase' as const,
  margin: '0 0 8px',
};

const pricingPrice = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#135C5E',
  margin: '0 0 8px',
};

const pricingDesc = {
  fontSize: '14px',
  color: '#666',
  margin: '0 0 4px',
};

const badge = {
  display: 'inline-block',
  backgroundColor: '#135C5E',
  color: '#fff',
  fontSize: '12px',
  fontWeight: 'bold',
  padding: '4px 8px',
  borderRadius: '4px',
  margin: '8px 0 0',
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
  maxWidth: '200px',
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
