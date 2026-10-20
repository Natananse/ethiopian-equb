export type MemberStatus = "active" | "inactive";
export type PaymentStatus = "pending" | "confirmed" | "rejected";
export type PayoutStatus = "scheduled" | "pending_approval" | "paid" | "blocked";
export type CycleStatus = "upcoming" | "active" | "completed";

export interface Member {
  id: string;
  name: string;
  /** Optional only because older installs were saved before these fields existed. */
  customerNumber?: string;
  idNumber?: string;
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
  /** Participant snapshot; absent only on legacy data that predates cycle snapshots. */
  participantMemberIds?: string[];
  /** Absent until a winner is selected; retained as optional for legacy compatibility. */
  recipientMemberId?: string;
}

export interface DrawRecord {
  id: string;
  cycleId: string;
  winnerMemberId: string;
  winnerName: string;
  winnerCustomerNumber: string;
  winnerIdNumber: string;
  rotationNumber: number;
  sequenceNumber: number;
  eligibleBefore: number;
  drawnAt: string;
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
  /** Missing on pre-lottery installs; readers treat it as an empty history. */
  draws?: DrawRecord[];
  /** Each rotation gives every active member one chance before the pool resets. */
  currentRotation?: number;
}
