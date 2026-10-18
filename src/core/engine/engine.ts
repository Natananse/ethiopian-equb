import type { Contribution, EqubState } from "./types";

export function money(value: number): string {
  return `${Math.round(value).toLocaleString("en-ET")} ETB`;
}

export function expectedCollection(state: EqubState, cycleId: string): number {
  const activeMembers = state.members.filter((m) => m.status === "active").length;
  const cycle = state.cycles.find((c) => c.id === cycleId);
  return activeMembers * (cycle?.contributionAmount ?? state.contributionAmount);
}

export function confirmedCollection(state: EqubState, cycleId: string): number {
  return state.contributions
    .filter((c) => c.cycleId === cycleId && c.status === "confirmed")
    .reduce((sum, c) => sum + c.amount, 0);
}

export function outstandingCollection(state: EqubState, cycleId: string): number {
  return Math.max(0, expectedCollection(state, cycleId) - confirmedCollection(state, cycleId));
}

export function paidMemberCount(state: EqubState, cycleId: string): number {
  const paidIds = new Set(
    state.contributions
      .filter((c) => c.cycleId === cycleId && c.status === "confirmed")
      .map((c) => c.memberId)
  );
  return paidIds.size;
}

export function collectionProgress(state: EqubState, cycleId: string): number {
  const expected = expectedCollection(state, cycleId);
  if (expected <= 0) return 0;
  return Math.min(100, Math.round((confirmedCollection(state, cycleId) / expected) * 100));
}

export function calculatePayout(
  state: EqubState,
  cycleId: string,
  deductions = 0
): { gross: number; deductions: number; net: number; available: number; eligible: boolean } {
  const gross = confirmedCollection(state, cycleId);
  const safeDeductions = Math.max(0, Math.min(deductions, gross));
  const available = gross;
  return {
    gross,
    deductions: safeDeductions,
    net: gross - safeDeductions,
    available,
    eligible: gross > 0 && safeDeductions <= gross,
  };
}

/** Creates a payment as pending. Call verifyContribution only after an authorized verification. */
export function recordContribution(
  state: EqubState,
  input: Omit<Contribution, "id" | "status" | "paidAt"> & { paidAt?: string }
): EqubState {
  const cycle = state.cycles.find((c) => c.id === input.cycleId);
  const member = state.members.find((m) => m.id === input.memberId);
  if (!cycle || !member || member.status !== "active") throw new Error("Active member and valid cycle are required.");
  if (input.amount <= 0 || !Number.isFinite(input.amount)) throw new Error("Contribution amount must be positive.");
  const duplicate = state.contributions.some(
    (c) => c.cycleId === input.cycleId && c.memberId === input.memberId && c.status !== "rejected"
  );
  if (duplicate) throw new Error("A contribution record already exists for this member and cycle.");
  return {
    ...state,
    contributions: [
      ...state.contributions,
      { ...input, id: `pay-${Date.now()}`, paidAt: input.paidAt ?? new Date().toISOString(), status: "pending" },
    ],
  };
}

export function verifyContribution(state: EqubState, contributionId: string, confirmed: boolean): EqubState {
  const target = state.contributions.find((c) => c.id === contributionId);
  if (!target) throw new Error("Contribution record not found.");
  if (target.status !== "pending") throw new Error("Only pending contributions can be verified.");
  return {
    ...state,
    contributions: state.contributions.map((c) =>
      c.id === contributionId ? { ...c, status: confirmed ? "confirmed" : "rejected" } : c
    ),
  };
}

export function approvePayout(state: EqubState, payoutId: string): EqubState {
  const payout = state.payouts.find((p) => p.id === payoutId);
  if (!payout) throw new Error("Payout not found.");
  if (payout.status !== "pending_approval") throw new Error("Payout is not awaiting approval.");
  const available = confirmedCollection(state, payout.cycleId);
  if (payout.netAmount > available) throw new Error("Payout exceeds confirmed available funds.");
  return {
    ...state,
    payouts: state.payouts.map((p) =>
      p.id === payoutId ? { ...p, status: "paid", approvedAt: new Date().toISOString(), paidAt: new Date().toISOString() } : p
    ),
  };
}
