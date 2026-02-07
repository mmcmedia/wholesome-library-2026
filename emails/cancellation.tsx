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

interface CancellationEmailProps {
  parentName: string;
  endDate: string; // e.g., "March 15, 2026"
}

export default function CancellationEmail({
  parentName = 'Parent',
  endDate = 'March 15, 2026',
}: CancellationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>We're sorry to see you go — Your access continues until {endDate}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://wholesomelibrary.com/logo.png"
            alt="Wholesome Library"
            width={150}
            height={50}
            style={logo}
          />
          
          <Text style={heading}>We're Sorry to See You Go</Text>
          
          <Text style={paragraph}>
            Hi {parentName},
          </Text>

          <Text style={paragraph}>
            Your subscription has been cancelled. We're sad to see you go, but we understand.
          </Text>

          <Section style={infoBox}>
            <Text style={infoHeading}>📅 Your access continues until:</Text>
            <Text style={dateText}>{endDate}</Text>
            <Text style={infoSubtext}>
              You can keep reading until then — no extra charges.
            </Text>
          </Section>

          <Text style={paragraph}>
            If you change your mind, you can resubscribe anytime. All your preferences and reading progress will be saved.
          </Text>

          <Button style={button} href="https://wholesomelibrary.com/subscription">
            Resubscribe Anytime
          </Button>

          <Hr style={divider} />

          <Text style={sectionHeading}>We'd love your feedback</Text>

          <Text style={paragraph}>
            Your input helps us improve Wholesome Library for families like yours. Would you mind sharing why you cancelled?
          </Text>

          <Section style={feedbackButtons}>
            <a href="https://wholesomelibrary.com/feedback?reason=lost-interest" style={feedbackLink}>
              Child lost interest
            </a>
            <a href="https://wholesomelibrary.com/feedback?reason=too-expensive" style={feedbackLink}>
              Too expensive
            </a>
            <a href="https://wholesomelibrary.com/feedback?reason=not-enough-content" style={feedbackLink}>
              Not enough content
            </a>
            <a href="https://wholesomelibrary.com/feedback?reason=values-mismatch" style={feedbackLink}>
              Didn't match our values
            </a>
            <a href="https://wholesomelibrary.com/feedback?reason=other" style={feedbackLink}>
              Other reason
            </a>
          </Section>

          <Hr style={divider} />

          <Text style={footer}>
            Thank you for being part of our community.
            <br />
            Stories created with modern tools + editorial review
            <br />
            <a href="https://wholesomelibrary.com/unsubscribe" style={link}>Unsubscribe from emails</a>
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

const infoBox = {
  backgroundColor: '#f0f9f9',
  border: '2px solid #135C5E',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const infoHeading = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#135C5E',
  margin: '0 0 12px',
};

const dateText = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#135C5E',
  margin: '0 0 8px',
};

const infoSubtext = {
  fontSize: '14px',
  color: '#666',
  margin: '0',
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
  margin: '24px auto',
  maxWidth: '200px',
};

const divider = {
  borderColor: '#e5e5e5',
  margin: '32px 0',
};

const sectionHeading = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#135C5E',
  margin: '0 0 16px',
  textAlign: 'center' as const,
};

const feedbackButtons = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '8px',
  margin: '16px 0 24px',
};

const feedbackLink = {
  display: 'block',
  padding: '12px 16px',
  backgroundColor: '#fafafa',
  border: '1px solid #e5e5e5',
  borderRadius: '6px',
  color: '#525252',
  fontSize: '14px',
  textAlign: 'center' as const,
  textDecoration: 'none',
  transition: 'background-color 0.2s',
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
