import { ApiError } from '../errors';
import type { CreateMemberInput, Member, Plan, PlanName } from '../types';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;

const initialMembers: Member[] = [
  {
    id: 'm1',
    name: 'Alice',
    email: 'alice@example.com',
    plan: 'premium',
    joinDate: '2025-01-15',
    active: true,
  },
  {
    id: 'm2',
    name: 'Bob',
    email: 'bob@example.com',
    plan: 'basic',
    joinDate: '2025-03-10',
    active: true,
  },
  {
    id: 'm3',
    name: 'Charlie',
    email: 'charlie@example.com',
    plan: 'premium',
    joinDate: '2024-11-01',
    active: false,
  },
  {
    id: 'm4',
    name: 'Diana',
    email: 'diana@example.com',
    plan: 'basic',
    joinDate: '2025-06-01',
    active: true,
  },
];

const plans: Record<PlanName, Plan> = {
  basic: { price: 299, maxCheckins: 4, name: 'Basic' },
  premium: { price: 499, maxCheckins: 999, name: 'Premium' },
};

let members: Member[] = initialMembers.map((member) => ({ ...member }));

function isPlanName(value: unknown): value is PlanName {
  return value === 'basic' || value === 'premium';
}

function validateDateOnly(value: string, fieldName: string): void {
  const parsed = new Date(`${value}T00:00:00Z`);
  if (
    !dateOnlyPattern.test(value) ||
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== value
  ) {
    throw new ApiError(`${fieldName} must be a valid YYYY-MM-DD date`, 400, 'VALIDATION_ERROR');
  }
}

export function getAllMembers(): Member[] {
  return members;
}

export function getMemberById(id: string): Member | undefined {
  return members.find((member) => member.id === id);
}

export function requireMember(id: string): Member {
  const member = getMemberById(id);
  if (!member) {
    throw new ApiError('Member not found', 404, 'MEMBER_NOT_FOUND');
  }

  return member;
}

export function getPlan(planName: PlanName): Plan {
  return plans[planName];
}

export function getPlans(): Record<PlanName, Plan> {
  return plans;
}

export function addMember(input: CreateMemberInput): Member {
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
  const id = typeof input.id === 'string' && input.id.trim() ? input.id.trim() : `m${members.length + 1}`;
  const plan = input.plan === undefined ? 'basic' : input.plan;
  const joinDate =
    typeof input.joinDate === 'string' && input.joinDate.trim()
      ? input.joinDate.trim()
      : new Date().toISOString().slice(0, 10);

  if (!name) {
    throw new ApiError('name is required', 400, 'VALIDATION_ERROR');
  }

  if (!emailPattern.test(email)) {
    throw new ApiError('email must be valid', 400, 'VALIDATION_ERROR');
  }

  if (!isPlanName(plan)) {
    throw new ApiError('plan must be basic or premium', 400, 'VALIDATION_ERROR');
  }

  validateDateOnly(joinDate, 'joinDate');

  if (members.some((member) => member.id === id)) {
    throw new ApiError('member id already exists', 400, 'VALIDATION_ERROR');
  }

  const member: Member = {
    id,
    name,
    email,
    plan,
    joinDate,
    active: true,
  };

  members = [...members, member];
  return member;
}

export function resetMembers(): void {
  members = initialMembers.map((member) => ({ ...member }));
}
