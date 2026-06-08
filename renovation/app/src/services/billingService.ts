import type { BillingSummary, Plan, PlanName } from '../types';
import { getPlan, requireMember } from './memberService';

const BILLING_CYCLE_DAYS = 30;
const PAYMENT_GRACE_DAYS = 5;
const OVERDUE_AFTER_DAYS = BILLING_CYCLE_DAYS + PAYMENT_GRACE_DAYS;
const MONTHS_PER_YEAR = 12;
const MS_PER_DAY = 86_400_000;

export function getMonthlyFee(planName: PlanName, plans: Record<PlanName, Plan>): number {
  return plans[planName].price;
}

export function daysBetween(leftDate: Date, rightDate: Date): number {
  return Math.floor((rightDate.getTime() - leftDate.getTime()) / MS_PER_DAY);
}

export function daysSinceLastPayment(lastPaymentDate: string, now = new Date()): number {
  return daysBetween(new Date(lastPaymentDate), now);
}

export function isOverdue(lastPaymentDate: string, now = new Date()): boolean {
  return daysSinceLastPayment(lastPaymentDate, now) > OVERDUE_AFTER_DAYS;
}

export function getAnnualCost(planName: PlanName, plans: Record<PlanName, Plan>): number {
  return getMonthlyFee(planName, plans) * MONTHS_PER_YEAR;
}

export function getProRatedFee(planName: PlanName, plans: Record<PlanName, Plan>, joinDate: string): number {
  const plan = plans[planName];
  const joined = new Date(`${joinDate}T00:00:00Z`);
  const dayOfMonth = joined.getUTCDate();
  const remainingDays = Math.max(0, BILLING_CYCLE_DAYS - dayOfMonth);

  return Math.round((plan.price / BILLING_CYCLE_DAYS) * remainingDays);
}

export function getBillingSummary(memberId: string): BillingSummary {
  const member = requireMember(memberId);
  const plan = getPlan(member.plan);
  const plans = { basic: getPlan('basic'), premium: getPlan('premium') };

  return {
    member: member.name,
    plan: plan.name,
    monthlyFee: getMonthlyFee(member.plan, plans),
    annualCost: getAnnualCost(member.plan, plans),
    proRatedFirstMonth: getProRatedFee(member.plan, plans, member.joinDate),
    active: member.active,
  };
}
