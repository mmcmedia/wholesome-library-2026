'use server'

import { getRetentionMetrics, pauseSubscription, cancelSubscription, getSubscriptionStatus } from '@/lib/retention'

export async function getRetentionMetricsAction(userId: string) {
  return await getRetentionMetrics(userId)
}

export async function pauseSubscriptionAction(userId: string, pauseDays: number = 30) {
  return await pauseSubscription(userId, pauseDays)
}

export async function cancelSubscriptionAction(userId: string, reasons?: string[], feedback?: string) {
  return await cancelSubscription(userId, reasons, feedback)
}

export async function getSubscriptionStatusAction(userId: string) {
  return await getSubscriptionStatus(userId)
}
