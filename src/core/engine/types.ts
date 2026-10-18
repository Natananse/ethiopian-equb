export type MemberStatus = "active" | "inactive";
export type PaymentStatus = "pending" | "confirmed" | "rejected";
export type PayoutStatus = "scheduled" | "pending_approval" | "paid" | "blocked";
export type CycleStatus = "upcoming" | "active" | "completed";

export interface Member {
  id: string;
  name: string;
  phone: string;
  joinedAt: string;
  status: MemberStatus;
}

export interface Contribution {
  id: string;
  memberId: string;
  cycleId: string;
  amount: number;
  paidAt: string;
  status: PaymentStatus;
  note?: string;
}

export interface Cycle {
  id: string;
  label: string;
  dueDate: string;
  contributionAmount: number;
  status: CycleStatus;
  recipientMemberId: string;
}

export interface Payout {
  id: string;
  cycleId: string;
  recipientMemberId: string;
  grossAmount: number;
  deductions: number;
  netAmount: number;
  status: PayoutStatus;
  approvedAt?: string;
  paidAt?: string;
  evidenceNote?: string;
}

export interface EqubState {
  groupName: string;
  currency: "ETB";
  contributionAmount: number;
  frequency: "monthly";
  members: Member[];
  contributions: Contribution[];
  cycles: Cycle[];
  payouts: Payout[];
}
