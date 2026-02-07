/**
 * Retention & Churn Prevention Logic
 * Handles subscription pausing, cancellation, win-back emails, and retention metrics
 */

import { db } from '@/lib/db';
import { profiles, children, readingProgress, stories } from '@/lib/db/schema';
import { eq, and, gte, lt, lte, sql, desc } from 'drizzle-orm';
import {
  getSubscription,
  pauseSubscription as creemPauseSubscription,
  resumeSubscription as creemResumeSubscription,
  cancelSubscription as creemCancelSubscription,
} from '@/lib/creem';
import {
  sendTrialEndingEmail,
  sendReEngagementEmail,
  sendWinBackEmail,
  sendCancellationEmail,
} from '@/lib/email';

/**
 * Get retention metrics for a user (for displaying on cancellation page)
 * Shows stories read, reading streak, time spent, etc.
 */
export async function getRetentionMetrics(userId: string) {
  try {
    // Get all children for this user
    const userChildren = await db
      .select()
      .from(children)
      .where(eq(children.parentId, userId));

    if (!userChildren.length) {
      return {
        totalStoriesRead: 0,
        totalMinutesRead: 0,
        readingStreak: 0,
        childrenCount: 0,
        mostRecentRead: null,
      };
    }

    const childIds = userChildren.map((c) => c.id);

    // Get total stories read
    const readingStats = await db
      .select({
        totalRead: sql<number>`count(distinct ${readingProgress.storyId})`,
        totalMinutes: sql<number>`coalesce(sum(${stories.estimatedReadMinutes}), 0)`,
      })
      .from(readingProgress)
      .innerJoin(stories, eq(readingProgress.storyId, stories.id))
      .where(
        and(
          sql`${readingProgress.childId} = ANY(${childIds})`,
          eq(readingProgress.completed, true)
        )
      );

    // Calculate reading streak (consecutive days with reading activity)
    const readingStreak = await calculateReadingStreak(childIds);

    // Get most recent story read
    const mostRecent = await db
      .select({
        title: stories.title,
        completedAt: readingProgress.completedAt,
      })
      .from(readingProgress)
      .innerJoin(stories, eq(readingProgress.storyId, stories.id))
      .where(
        and(
          sql`${readingProgress.childId} = ANY(${childIds})`,
          eq(readingProgress.completed, true)
        )
      )
      .orderBy(desc(readingProgress.completedAt))
      .limit(1);

    return {
      totalStoriesRead: readingStats[0]?.totalRead || 0,
      totalMinutesRead: Number(readingStats[0]?.totalMinutes || 0),
      readingStreak: readingStreak,
      childrenCount: userChildren.length,
      mostRecentRead: mostRecent[0] || null,
    };
  } catch (error) {
    console.error('Error getting retention metrics:', error);
    return {
      totalStoriesRead: 0,
      totalMinutesRead: 0,
      readingStreak: 0,
      childrenCount: 0,
      mostRecentRead: null,
    };
  }
}

/**
 * Calculate reading streak (consecutive days with reading activity)
 */
async function calculateReadingStreak(childIds: string[]): Promise<number> {
  try {
    const result = await db.execute(sql`
      WITH daily_reads AS (
        SELECT DISTINCT DATE(${readingProgress.lastReadAt}) as read_date
        FROM ${readingProgress}
        WHERE ${readingProgress.childId} = ANY(${childIds})
        ORDER BY read_date DESC
      ),
      streaks AS (
        SELECT 
          read_date,
          ROW_NUMBER() OVER (ORDER BY read_date DESC) as rn,
          DATE(read_date) - INTERVAL '1 day' * ROW_NUMBER() OVER (ORDER BY read_date DESC) as streak_group
        FROM daily_reads
      )
      SELECT COUNT(*) as streak_length
      FROM streaks
      WHERE streak_group = (SELECT MIN(streak_group) FROM streaks LIMIT 1)
    `);

    const row = result.rows[0] as { streak_length: string };
    return parseInt(row?.streak_length || '0', 10);
  } catch (error) {
    console.error('Error calculating reading streak:', error);
    return 0;
  }
}

/**
 * Check if trial is ending in 2 days and send notification
 * Called by daily cron job
 */
export async function checkTrialEnding(): Promise<void> {
  try {
    // Find users whose trial ends in 2 days (within 2-3 days)
    const now = new Date();
    const in2Days = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    const in3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

    const usersWithEndingTrials = await db
      .select()
      .from(profiles)
      .where(
        and(
          gte(profiles.trialEndsAt, in2Days),
          lt(profiles.trialEndsAt, in3Days),
          eq(profiles.plan, 'free')
        )
      );

    for (const user of usersWithEndingTrials) {
      // Get reading metrics
      const metrics = await getRetentionMetrics(user.id);

      // Get first child's name for personalization
      const firstChild = await db
        .select()
        .from(children)
        .where(eq(children.parentId, user.id))
        .limit(1);

      const childName = firstChild[0]?.name || 'your child';

      // Send email
      await sendTrialEndingEmail({
        to: user.email,
        parentName: user.displayName || 'Parent',
        storiesRead: metrics.totalStoriesRead,
        childName: childName,
      });

      console.log(`Trial ending email sent to ${user.email}`);
    }
  } catch (error) {
    console.error('Error in checkTrialEnding:', error);
  }
}

/**
 * Check for inactive users (no reading activity for 7 days) and send re-engagement email
 * Called by daily cron job
 */
export async function checkInactivity(): Promise<void> {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    // Find children with no activity in 7 days
    const inactiveChildren = await db.execute(sql`
      SELECT DISTINCT c.id, c.name, c.parent_id, p.email, p.display_name
      FROM ${children} c
      JOIN ${profiles} p ON c.parent_id = p.id
      WHERE NOT EXISTS (
        SELECT 1 FROM ${readingProgress} rp
        WHERE rp.child_id = c.id AND rp.last_read_at > ${sevenDaysAgo}
      )
      AND c.created_at < ${sevenDaysAgo}
    `);

    for (const row of inactiveChildren.rows) {
      const inactiveChild = row as {
        id: string;
        name: string;
        parent_id: string;
        email: string;
        display_name: string;
      };

      // Get a recommended story in their favorite genre
      const lastReadStories = await db
        .select({
          genre: stories.genre,
        })
        .from(readingProgress)
        .innerJoin(stories, eq(readingProgress.storyId, stories.id))
        .where(eq(readingProgress.childId, inactiveChild.id))
        .orderBy(desc(readingProgress.completedAt))
        .limit(3);

      const favoriteGenre =
        lastReadStories.length > 0
          ? lastReadStories[0].genre
          : 'adventure';

      // Get a recommended story
      const recommendedStories = await db
        .select()
        .from(stories)
        .where(eq(stories.genre, favoriteGenre))
        .orderBy(desc(stories.publishedAt))
        .limit(1);

      const recommendedStory = recommendedStories[0];

      if (recommendedStory) {
        await sendReEngagementEmail({
          to: inactiveChild.email,
          parentName: inactiveChild.display_name || 'Parent',
          childName: inactiveChild.name,
          favoriteGenre: favoriteGenre,
          recommendedStory: {
            title: recommendedStory.title,
            blurb: recommendedStory.blurb || '',
            coverUrl: recommendedStory.coverImageUrl || '/default-cover.png',
            slug: recommendedStory.slug || recommendedStory.id,
          },
        });

        console.log(`Re-engagement email sent to ${inactiveChild.email} for ${inactiveChild.name}`);
      }
    }
  } catch (error) {
    console.error('Error in checkInactivity:', error);
  }
}

/**
 * Check for win-back opportunity (30 days post-cancel) and send win-back email
 * Called by daily cron job
 */
export async function checkWinBack(): Promise<void> {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const thirtyOneDaysAgo = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000);

    // Find users who cancelled 30 days ago
    const cancelledUsers = await db
      .select()
      .from(profiles)
      .where(
        and(
          eq(profiles.subscriptionStatus, 'cancelled'),
          lte(profiles.updatedAt, thirtyDaysAgo),
          gte(profiles.updatedAt, thirtyOneDaysAgo)
        )
      );

    // Count newly published stories since their cancellation
    for (const user of cancelledUsers) {
      const newStories = await db
        .select()
        .from(stories)
        .where(
          and(
            eq(stories.status, 'published'),
            gte(stories.publishedAt, user.updatedAt)
          )
        );

      if (newStories.length > 0) {
        await sendWinBackEmail({
          to: user.email,
          parentName: user.displayName || 'Parent',
          newStoriesCount: newStories.length,
        });

        console.log(`Win-back email sent to ${user.email}`);
      }
    }
  } catch (error) {
    console.error('Error in checkWinBack:', error);
  }
}

/**
 * Pause a user's subscription for a specified duration
 * Uses Creem's native pause feature
 */
export async function pauseSubscription(
  userId: string,
  durationDays: number = 30
): Promise<{
  success: boolean;
  error?: string;
  resumeDate?: Date;
}> {
  try {
    // Get user's subscription info
    const user = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, userId))
      .limit(1);

    if (!user[0] || !user[0].creemSubscriptionId) {
      return { success: false, error: 'No active subscription found' };
    }

    // Pause the subscription using Creem's native pause feature
    const resumeDate = new Date();
    resumeDate.setDate(resumeDate.getDate() + durationDays);

    // Call Creem pause endpoint
    await creemPauseSubscription(user[0].creemSubscriptionId);

    // Update profile with pause info
    await db
      .update(profiles)
      .set({
        subscriptionStatus: 'paused',
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, userId));

    return {
      success: true,
      resumeDate: resumeDate,
    };
  } catch (error) {
    console.error('Error pausing subscription:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Resume a paused subscription
 */
export async function resumeSubscription(userId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const user = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, userId))
      .limit(1);

    if (!user[0] || !user[0].creemSubscriptionId) {
      return { success: false, error: 'No paused subscription found' };
    }

    // Check if subscription is actually paused
    if (user[0].subscriptionStatus !== 'paused') {
      return { success: false, error: 'Subscription is not paused' };
    }

    // Resume the subscription using Creem's native resume feature
    await creemResumeSubscription(user[0].creemSubscriptionId);

    // Update profile status
    await db
      .update(profiles)
      .set({
        subscriptionStatus: 'active',
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, userId));

    return { success: true };
  } catch (error) {
    console.error('Error resuming subscription:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Log cancellation reason for analytics
 * Creates a record of why users cancelled
 */
export async function logCancelReason(
  userId: string,
  reasons: string[],
  otherReason?: string
): Promise<void> {
  try {
    // In production, you might create a cancellation_reasons table
    // For now, we store this in a metadata field or as an analytics event
    const reasonData = {
      reasons,
      otherReason: otherReason || null,
      cancelledAt: new Date().toISOString(),
    };

    // Log to analytics
    console.log(`Cancellation reasons for user ${userId}:`, reasonData);

    // In a real implementation, you'd save this to a database table:
    // await db.insert(cancellationReasons).values({
    //   userId,
    //   reasons: reasons.join(','),
    //   otherReason,
    //   createdAt: new Date(),
    // });
  } catch (error) {
    console.error('Error logging cancel reason:', error);
  }
}

/**
 * Process full cancellation and send confirmation email
 */
export async function cancelSubscription(
  userId: string,
  reasons?: string[],
  otherReason?: string
): Promise<{
  success: boolean;
  error?: string;
  endDate?: Date;
}> {
  try {
    const user = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, userId))
      .limit(1);

    if (!user[0] || !user[0].creemSubscriptionId) {
      return { success: false, error: 'No active subscription found' };
    }

    // Get subscription to find period end date
    const subscription = await getSubscription(user[0].creemSubscriptionId);

    const endDate = new Date(subscription.current_period_end);

    // Cancel the subscription using Creem's cancel endpoint
    await creemCancelSubscription(user[0].creemSubscriptionId);

    // Update profile
    await db
      .update(profiles)
      .set({
        subscriptionStatus: 'cancelled',
        subscriptionPeriodEnd: endDate,
        updatedAt: new Date(),
      })
      .where(eq(profiles.id, userId));

    // Log cancellation reason
    if (reasons && reasons.length > 0) {
      await logCancelReason(userId, reasons, otherReason);
    }

    // Send cancellation confirmation email
    await sendCancellationEmail({
      to: user[0].email,
      parentName: user[0].displayName || 'Parent',
      endDate: endDate.toLocaleDateString(),
    });

    return {
      success: true,
      endDate: endDate,
    };
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Get subscription status and details
 */
export async function getSubscriptionStatus(userId: string) {
  try {
    const user = await db
      .select()
      .from(profiles)
      .where(eq(profiles.id, userId))
      .limit(1);

    if (!user[0]) {
      return null;
    }

    if (user[0].creemSubscriptionId) {
      const subscription = await getSubscription(user[0].creemSubscriptionId);

      return {
        plan: user[0].plan,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end),
        trialEndsAt: user[0].trialEndsAt,
      };
    }

    return {
      plan: user[0].plan,
      status: user[0].subscriptionStatus,
      currentPeriodEnd: user[0].subscriptionPeriodEnd,
      trialEndsAt: user[0].trialEndsAt,
    };
  } catch (error) {
    console.error('Error getting subscription status:', error);
    return null;
  }
}
