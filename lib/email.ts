import { Resend } from 'resend';
import WelcomeEmail from '@/emails/welcome';
import TrialEndingEmail from '@/emails/trial-ending';
import WeeklyDigestEmail from '@/emails/weekly-digest';
import ReEngagementEmail from '@/emails/re-engagement';
import WinBackEmail from '@/emails/win-back';
import LevelUpEmail from '@/emails/level-up';
import StoryNotificationEmail from '@/emails/story-notification';
import CancellationEmail from '@/emails/cancellation';

// Initialize Resend with API key from environment
const resend = new Resend(process.env.RESEND_API_KEY || 'placeholder-key');

// Base email configuration
const FROM_EMAIL = 'Wholesome Library <hello@wholesomelibrary.com>';

interface SendEmailOptions {
  to: string;
  subject: string;
  react: React.ReactElement;
}

/**
 * Base send email function
 */
async function sendEmail({ to, subject, react }: SendEmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject,
      react,
    });

    if (error) {
      console.error('Email send error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email send exception:', error);
    return { success: false, error };
  }
}

/**
 * Send welcome email when user signs up
 */
export async function sendWelcomeEmail({
  to,
  parentName,
  childName,
}: {
  to: string;
  parentName: string;
  childName?: string;
}) {
  return sendEmail({
    to,
    subject: 'Welcome to Wholesome Library! 🎉',
    react: WelcomeEmail({ parentName, childName }),
  });
}

/**
 * Send trial ending notification (2 days before expiration)
 */
export async function sendTrialEndingEmail({
  to,
  parentName,
  storiesRead,
  childName,
}: {
  to: string;
  parentName: string;
  storiesRead: number;
  childName?: string;
}) {
  return sendEmail({
    to,
    subject: 'Your free trial ends in 2 days',
    react: TrialEndingEmail({ parentName, storiesRead, childName }),
  });
}

/**
 * Send weekly reading digest (every Sunday)
 */
export async function sendWeeklyDigestEmail({
  to,
  parentName,
  childName,
  storiesRead,
  storiesReadTitles,
  newStories,
  readingStreak,
}: {
  to: string;
  parentName: string;
  childName: string;
  storiesRead: number;
  storiesReadTitles: string[];
  newStories: Array<{ title: string; genre: string; slug: string }>;
  readingStreak?: number;
}) {
  return sendEmail({
    to,
    subject: `${childName} read ${storiesRead} ${storiesRead === 1 ? 'story' : 'stories'} this week!`,
    react: WeeklyDigestEmail({
      parentName,
      childName,
      storiesRead,
      storiesReadTitles,
      newStories,
      readingStreak,
    }),
  });
}

/**
 * Send re-engagement email (7 days inactive)
 */
export async function sendReEngagementEmail({
  to,
  parentName,
  childName,
  favoriteGenre,
  recommendedStory,
}: {
  to: string;
  parentName: string;
  childName: string;
  favoriteGenre?: string;
  recommendedStory: {
    title: string;
    blurb: string;
    coverUrl: string;
    slug: string;
  };
}) {
  return sendEmail({
    to,
    subject: `We miss ${childName}! 📚`,
    react: ReEngagementEmail({
      parentName,
      childName,
      favoriteGenre,
      recommendedStory,
    }),
  });
}

/**
 * Send win-back offer (30 days post-cancel)
 */
export async function sendWinBackEmail({
  to,
  parentName,
  newStoriesCount,
}: {
  to: string;
  parentName: string;
  newStoriesCount: number;
}) {
  return sendEmail({
    to,
    subject: `We've added ${newStoriesCount} new stories — Come back for 50% off!`,
    react: WinBackEmail({ parentName, newStoriesCount }),
  });
}

/**
 * Send reading level celebration
 */
export async function sendLevelUpEmail({
  to,
  parentName,
  childName,
  currentLevel,
  nextLevel,
  recommendedStories,
}: {
  to: string;
  parentName: string;
  childName: string;
  currentLevel: string;
  nextLevel: string;
  recommendedStories: Array<{ title: string; slug: string }>;
}) {
  return sendEmail({
    to,
    subject: `🎉 ${childName} is growing!`,
    react: LevelUpEmail({
      parentName,
      childName,
      currentLevel,
      nextLevel,
      recommendedStories,
    }),
  });
}

/**
 * Send new stories notification (weekly)
 */
export async function sendStoryNotificationEmail({
  to,
  parentName,
  childName,
  newStories,
}: {
  to: string;
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
}) {
  return sendEmail({
    to,
    subject: `${newStories.length} new ${newStories.length === 1 ? 'story' : 'stories'} for ${childName}!`,
    react: StoryNotificationEmail({
      parentName,
      childName,
      newStories,
    }),
  });
}

/**
 * Send cancellation confirmation
 */
export async function sendCancellationEmail({
  to,
  parentName,
  endDate,
}: {
  to: string;
  parentName: string;
  endDate: string;
}) {
  return sendEmail({
    to,
    subject: 'Your Wholesome Library subscription has been cancelled',
    react: CancellationEmail({ parentName, endDate }),
  });
}

// Export the Resend client for advanced use cases
export { resend };
