import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const memberStatus = v.union(v.literal("active"), v.literal("inactive"));
const paymentStatus = v.union(v.literal("pending"), v.literal("confirmed"), v.literal("rejected"));
const payoutStatus = v.union(
  v.literal("scheduled"),
  v.literal("pending_approval"),
  v.literal("paid"),
  v.literal("blocked"),
);
const cycleStatus = v.union(v.literal("upcoming"), v.literal("active"), v.literal("completed"));

const memberRecord = v.object({
  kind: v.literal("member"),
  id: v.string(),
  name: v.string(),
  customerNumber: v.optional(v.string()),
  idNumber: v.optional(v.string()),
  phone: v.string(),
  joinedAt: v.string(),
  status: memberStatus,
});

const contributionRecord = v.object({
  kind: v.literal("contribution"),
  id: v.string(),
  memberId: v.string(),
  cycleId: v.string(),
  amount: v.number(),
  paidAt: v.string(),
  status: paymentStatus,
  note: v.optional(v.string()),
});

const cycleRecord = v.object({
  kind: v.literal("cycle"),
  id: v.string(),
  label: v.string(),
  dueDate: v.string(),
  contributionAmount: v.number(),
  status: cycleStatus,
  participantMemberIds: v.optional(v.array(v.string())),
  recipientMemberId: v.optional(v.string()),
});

const payoutRecord = v.object({
  kind: v.literal("payout"),
  id: v.string(),
  cycleId: v.string(),
  recipientMemberId: v.string(),
  grossAmount: v.number(),
  deductions: v.number(),
  netAmount: v.number(),
  status: payoutStatus,
  approvedAt: v.optional(v.string()),
  paidAt: v.optional(v.string()),
  evidenceNote: v.optional(v.string()),
});

const drawRecord = v.object({
  kind: v.literal("draw"),
  id: v.string(),
  cycleId: v.string(),
  winnerMemberId: v.string(),
  winnerName: v.string(),
  winnerCustomerNumber: v.string(),
  winnerIdNumber: v.string(),
  rotationNumber: v.number(),
  sequenceNumber: v.number(),
  eligibleBefore: v.number(),
  drawnAt: v.string(),
});

export const equbStateValidator = v.object({
  groupName: v.string(),
  currency: v.literal("ETB"),
  contributionAmount: v.number(),
  frequency: v.literal("monthly"),
  members: v.array(v.object({
    id: v.string(),
    name: v.string(),
    customerNumber: v.optional(v.string()),
    idNumber: v.optional(v.string()),
    phone: v.string(),
    joinedAt: v.string(),
    status: memberStatus,
  })),
  contributions: v.array(v.object({
    id: v.string(),
    memberId: v.string(),
    cycleId: v.string(),
    amount: v.number(),
    paidAt: v.string(),
    status: paymentStatus,
    note: v.optional(v.string()),
  })),
  cycles: v.array(v.object({
    id: v.string(),
    label: v.string(),
    dueDate: v.string(),
    contributionAmount: v.number(),
    status: cycleStatus,
    participantMemberIds: v.optional(v.array(v.string())),
    recipientMemberId: v.optional(v.string()),
  })),
  payouts: v.array(v.object({
    id: v.string(),
    cycleId: v.string(),
    recipientMemberId: v.string(),
    grossAmount: v.number(),
    deductions: v.number(),
    netAmount: v.number(),
    status: payoutStatus,
    approvedAt: v.optional(v.string()),
    paidAt: v.optional(v.string()),
    evidenceNote: v.optional(v.string()),
  })),
  draws: v.optional(v.array(v.object({
    id: v.string(),
    cycleId: v.string(),
    winnerMemberId: v.string(),
    winnerName: v.string(),
    winnerCustomerNumber: v.string(),
    winnerIdNumber: v.string(),
    rotationNumber: v.number(),
    sequenceNumber: v.number(),
    eligibleBefore: v.number(),
    drawnAt: v.string(),
  }))),
  currentRotation: v.optional(v.number()),
});

export default defineSchema({
  equbs: defineTable({
    ownerTokenIdentifier: v.string(),
    groupName: v.string(),
    currency: v.literal("ETB"),
    contributionAmount: v.number(),
    frequency: v.literal("monthly"),
    currentRotation: v.number(),
    importedFromDevice: v.boolean(),
  }).index("by_owner", ["ownerTokenIdentifier"]),
  records: defineTable({
    equbId: v.id("equbs"),
    kind: v.union(
      v.literal("member"),
      v.literal("contribution"),
      v.literal("cycle"),
      v.literal("payout"),
      v.literal("draw"),
    ),
    position: v.number(),
    record: v.union(memberRecord, contributionRecord, cycleRecord, payoutRecord, drawRecord),
  }).index("by_equb_and_kind", ["equbId", "kind"]),
});
