export type PlanName = 'basic' | 'premium';

export interface Plan {
  name: string;
  price: number;
  maxCheckins: number;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  plan: PlanName;
  joinDate: string;
  active: boolean;
}

export interface CreateMemberInput {
  id?: unknown;
  name?: unknown;
  email?: unknown;
  plan?: unknown;
  joinDate?: unknown;
}

export interface CheckinResult {
  memberId: string;
  week: string;
  count: number;
}

export interface BillingSummary {
  member: string;
  plan: string;
  monthlyFee: number;
  annualCost: number;
  proRatedFirstMonth: number;
  active: boolean;
}
