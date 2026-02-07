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

interface WelcomeEmailProps {
  parentName: string;
  childName?: string;
}

export default function WelcomeEmail({
  parentName = 'Parent',
  childName = 'your child',
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Wholesome Library — Your 7-day free trial has started!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://wholesomelibrary.com/logo.png"
            alt="Wholesome Library"
            width={150}
            height={50}
            style={logo}
          />
          
          <Text style={heading}>Welcome to Wholesome Library, {parentName}!</Text>
          
          <Text style={paragraph}>
            We're so excited to have you and {childName} join our community of families who love wholesome stories.
          </Text>

          <Section style={highlightBox}>
            <Text style={highlightText}>
              🎉 Your 7-day free trial has started!
            </Text>
            <Text style={paragraph}>
              Full access to our entire library. No credit card required.
            </Text>
          </Section>

          <Text style={paragraph}>
            Here's how to get started:
          </Text>

          <Section style={stepsList}>
            <Text style={step}>1️⃣ <strong>Add your child</strong> — Set their reading level and preferences</Text>
            <Text style={step}>2️⃣ <strong>Browse the library</strong> — Filter by genre, virtue, and reading level</Text>
            <Text style={step}>3️⃣ <strong>Start reading!</strong> — Every story is safe, reviewed, and ready to enjoy</Text>
          </Section>

          <Button style={button} href="https://wholesomelibrary.com/library">
            Browse the Library
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

const highlightBox = {
  backgroundColor: '#f0f9f9',
  border: '2px solid #135C5E',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const highlightText = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#135C5E',
  margin: '0 0 8px',
};

const stepsList = {
  margin: '16px 0 32px',
};

const step = {
  fontSize: '16px',
  lineHeight: '28px',
  color: '#525252',
  margin: '0 0 12px',
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
  margin: '0 auto 32px',
  maxWidth: '200px',
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
