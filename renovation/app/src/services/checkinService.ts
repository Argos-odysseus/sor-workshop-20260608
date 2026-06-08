import { ApiError } from '../errors';
import type { CheckinResult } from '../types';
import { getPlan, requireMember } from './memberService';

let checkins = new Map<string, string[]>();

function parseCheckinDate(dateValue?: unknown): string {
  if (dateValue === undefined) {
    return new Date().toISOString();
  }

  if (typeof dateValue !== 'string') {
    throw new ApiError('date must be a valid date string', 400, 'VALIDATION_ERROR');
  }

  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) {
    throw new ApiError('date must be a valid date string', 400, 'VALIDATION_ERROR');
  }

  return parsed.toISOString();
}

export function getWeekKey(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    throw new ApiError('date must be a valid date string', 400, 'VALIDATION_ERROR');
  }

  const utcDate = new Date(Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate()));
  const day = utcDate.getUTCDay();
  const daysSinceMonday = day === 0 ? 6 : day - 1;
  utcDate.setUTCDate(utcDate.getUTCDate() - daysSinceMonday);

  return utcDate.toISOString().slice(0, 10);
}

export function countForWeek(memberId: string, date: string): number {
  const week = getWeekKey(date);
  return (checkins.get(memberId) ?? []).filter((checkinDate) => getWeekKey(checkinDate) === week).length;
}

export function checkIn(memberId: string, dateValue?: unknown): CheckinResult {
  const member = requireMember(memberId);
  if (!member.active) {
    throw new ApiError('Member is inactive', 400, 'MEMBER_INACTIVE');
  }

  const date = parseCheckinDate(dateValue);
  const plan = getPlan(member.plan);
  const currentCount = countForWeek(memberId, date);

  if (currentCount >= plan.maxCheckins) {
    throw new ApiError('Plan check-in limit exceeded', 400, 'PLAN_LIMIT_EXCEEDED');
  }

  checkins.set(memberId, [...(checkins.get(memberId) ?? []), date]);

  return {
    memberId,
    week: getWeekKey(date),
    count: currentCount + 1,
  };
}

export function getHistory(memberId: string): string[] {
  requireMember(memberId);
  return checkins.get(memberId) ?? [];
}

export function clearAllCheckins(): void {
  checkins = new Map<string, string[]>();
}
