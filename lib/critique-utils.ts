import { ExtendedCritique } from '@/types/index';

export function canGiveCritique(userEmail: string | null | undefined, trackUserId: string, critiques: ExtendedCritique[]): boolean {
  if (!userEmail) return false;
  if (userEmail === trackUserId) return false;
  return !critiques.some(critique => critique.user.email === userEmail);
}

export function canEditCritique(userEmail: string | null | undefined, critique: ExtendedCritique | null): boolean {
  if (!userEmail || !critique) return false;
  const timeSinceCreation = Date.now() - new Date(critique.createdAt).getTime();
  const fifteenMinutesInMs = 15 * 60 * 1000;
  return userEmail === critique.user.email && timeSinceCreation < fifteenMinutesInMs;
}

export function hasGivenCritique(userEmail: string | null | undefined, critiques: ExtendedCritique[]): boolean {
  if (!userEmail) return false;
  return critiques.some(critique => critique.user.email === userEmail);
}

export function getUserCritique(userEmail: string | null | undefined, critiques: ExtendedCritique[]): ExtendedCritique | null {
  if (!userEmail) return null;
  return critiques.find(critique => critique.user.email === userEmail) || null;
}