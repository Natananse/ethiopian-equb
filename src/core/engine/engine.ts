import type { Contribution, Cycle, DrawRecord, EqubState, Member } from "./types";

export function money(value: number): string {
  return `${Math.round(value).toLocaleString("en-ET")} ETB`;
}

export function expectedCollection(state: EqubState, cycleId: string): number {
  const cycle = state.cycles.find((c) => c.id === cycleId);
  const memberCount = cycle?.participantMemberIds?.length ?? state.members.filter((m) => m.status === "active").length;
  return memberCount * (cycle?.contributionAmount ?? state.contributionAmount);
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

/** Returns the persisted rotation number, defaulting safely for older local saves. */
export function currentRotationNumber(state: EqubState): number {
  return Number.isInteger(state.currentRotation) && (state.currentRotation ?? 0) > 0
    ? state.currentRotation!
    : 1;
}

/** Active members who have not yet won in the requested rotation. */
export function eligibleDrawMembers(
  state: EqubState,
  rotationNumber = currentRotationNumber(state),
  cycleId?: string
): Member[] {
  const previousWinners = new Set(
    (state.draws ?? [])
      .filter((draw) => draw.rotationNumber === rotationNumber)
      .map((draw) => draw.winnerMemberId)
  );
  const cycleMembers = cycleId ? state.cycles.find((cycle) => cycle.id === cycleId)?.participantMemberIds : undefined;
  const cycleMemberIds = cycleMembers ? new Set(cycleMembers) : undefined;
  return state.members.filter(
    (member) => member.status === "active" && (!cycleMemberIds || cycleMemberIds.has(member.id)) && !previousWinners.has(member.id)
  );
}

/** Enforces complete, unique customer and ID values for both new and legacy member records. */
export function validateMemberIdentity(
  state: EqubState,
  input: { customerNumber: string; idNumber: string },
  exceptMemberId?: string
): void {
  const customerNumber = input.customerNumber.trim().toLowerCase();
  const idNumber = input.idNumber.trim().toLowerCase();
  if (!customerNumber || !idNumber) throw new Error("Customer number and ID number are required.");
  if (state.members.some((member) => member.id !== exceptMemberId && member.customerNumber?.trim().toLowerCase() === customerNumber)) {
    throw new Error("A member with this customer number already exists.");
  }
  if (state.members.some((member) => member.id !== exceptMemberId && member.idNumber?.trim().toLowerCase() === idNumber)) {
    throw new Error("A member with this ID number already exists.");
  }
}

/** Active records that need repair before they can safely participate in a draw. */
export function membersWithIdentityIssues(state: EqubState, cycleId?: string): Member[] {
  const participantIds = cycleId
    ? state.cycles.find((cycle) => cycle.id === cycleId)?.participantMemberIds
    : undefined;
  const participants = state.members.filter(
    (member) => member.status === "active" && (!participantIds || participantIds.includes(member.id))
  );
  const customerCounts = new Map<string, number>();
  const idCounts = new Map<string, number>();
  state.members.forEach((member) => {
    const customerNumber = member.customerNumber?.trim().toLowerCase() ?? "";
    const idNumber = member.idNumber?.trim().toLowerCase() ?? "";
    if (customerNumber) customerCounts.set(customerNumber, (customerCounts.get(customerNumber) ?? 0) + 1);
    if (idNumber) idCounts.set(idNumber, (idCounts.get(idNumber) ?? 0) + 1);
  });
  return participants.filter((member) => {
    const customerNumber = member.customerNumber?.trim().toLowerCase() ?? "";
    const idNumber = member.idNumber?.trim().toLowerCase() ?? "";
    return !customerNumber || !idNumber || customerCounts.get(customerNumber) !== 1 || idCounts.get(idNumber) !== 1;
  });
}

/** Selects one eligible member for the active cycle and appends an immutable audit record. */
export function drawWinner(state: EqubState, random: () => number = Math.random): EqubState {
  const cycle = state.cycles.find((item) => item.status === "active");
  if (!cycle) throw new Error("An active cycle is required before drawing a winner.");
  const draws = state.draws ?? [];
  if (draws.some((draw) => draw.cycleId === cycle.id)) {
    throw new Error("A winner has already been drawn for this cycle.");
  }
  const rotationNumber = currentRotationNumber(state);
  if (membersWithIdentityIssues(state, cycle.id).length > 0) {
    throw new Error("Every active member in this cycle must have unique customer and ID numbers before drawing.");
  }
  const eligible = eligibleDrawMembers(state, rotationNumber, cycle.id);
  if (eligible.length === 0) throw new Error("There are no eligible active members left in this rotation.");
  const randomValue = random();
  if (!Number.isFinite(randomValue) || randomValue < 0 || randomValue >= 1) {
    throw new Error("The random draw value must be in the range [0, 1).");
  }

  const sequenceNumber = draws.filter((draw) => draw.rotationNumber === rotationNumber).length + 1;
  const winner = eligible[Math.floor(randomValue * eligible.length)];
  const drawnAt = new Date().toISOString();
  let recordId = `draw-${Date.now()}-${draws.length + 1}`;
  while (draws.some((draw) => draw.id === recordId)) recordId = `${recordId}-next`;
  const record: DrawRecord = {
    id: recordId,
    cycleId: cycle.id,
    winnerMemberId: winner.id,
    winnerName: winner.name,
    winnerCustomerNumber: winner.customerNumber ?? "",
    winnerIdNumber: winner.idNumber ?? "",
    rotationNumber,
    sequenceNumber,
    eligibleBefore: eligible.length,
    drawnAt,
  };
  return {
    ...state,
    cycles: state.cycles.map((item) => item.id === cycle.id ? { ...item, recipientMemberId: winner.id } : item),
    draws: [...draws, record],
  };
}

function nextMonthlyDate(dateValue: string): Date {
  const source = new Date(dateValue);
  if (Number.isNaN(source.getTime())) throw new Error("The active cycle has an invalid due date.");
  const wantedDay = source.getDate();
  const next = new Date(source);
  next.setDate(1);
  next.setMonth(next.getMonth() + 1);
  const lastDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
  next.setDate(Math.min(wantedDay, lastDay));
  return next;
}

function createNextCycle(state: EqubState, rotationNumber: number): EqubState {
  const activeCycle = state.cycles.find((item) => item.status === "active");
  if (!activeCycle) throw new Error("An active cycle is required to create the next cycle.");
  const dueDate = nextMonthlyDate(activeCycle.dueDate);
  const year = dueDate.getFullYear();
  const month = String(dueDate.getMonth() + 1).padStart(2, "0");
  const baseId = `cycle-${year}-${month}`;
  let id = baseId;
  let suffix = 2;
  while (state.cycles.some((cycle) => cycle.id === id)) id = `${baseId}-${suffix++}`;
  const nextCycle: Cycle = {
    id,
    label: dueDate.toLocaleString("en-US", { month: "long", year: "numeric" }),
    dueDate: dueDate.toISOString(),
    contributionAmount: activeCycle.contributionAmount || state.contributionAmount,
    status: "active",
    participantMemberIds: state.members.filter((member) => member.status === "active").map((member) => member.id),
  };
  return {
    ...state,
    currentRotation: rotationNumber,
    cycles: [...state.cycles.map((cycle) => (cycle.id === activeCycle.id ? { ...cycle, status: "completed" as const } : cycle)), nextCycle],
  };
}

/** Completes the drawn cycle and opens the next monthly cycle without resetting winners. */
export function advanceCycle(state: EqubState): EqubState {
  const activeCycle = state.cycles.find((item) => item.status === "active");
  if (!activeCycle) throw new Error("An active cycle is required.");
  const rotationNumber = currentRotationNumber(state);
  const hasWinner = (state.draws ?? []).some(
    (draw) => draw.cycleId === activeCycle.id && draw.rotationNumber === rotationNumber
  );
  if (!hasWinner) throw new Error("Draw a winner before advancing to the next cycle.");
  if (eligibleDrawMembers(state, rotationNumber, activeCycle.id).length === 0) {
    throw new Error("Every active member has won. Start a new rotation instead.");
  }
  return createNextCycle(state, rotationNumber);
}

/** Starts a fresh no-repeat rotation only after every active member has won the current one. */
export function startNextRotation(state: EqubState): EqubState {
  const activeCycle = state.cycles.find((item) => item.status === "active");
  if (!activeCycle) throw new Error("An active cycle is required.");
  const rotationNumber = currentRotationNumber(state);
  const activeMembers = state.members.filter((member) => member.status === "active");
  if (activeMembers.length === 0) throw new Error("Add at least one active member before starting a rotation.");
  const hasWinner = (state.draws ?? []).some(
    (draw) => draw.cycleId === activeCycle.id && draw.rotationNumber === rotationNumber
  );
  if (!hasWinner) throw new Error("Draw the final winner before starting a new rotation.");
  if (eligibleDrawMembers(state, rotationNumber, activeCycle.id).length > 0) {
    throw new Error("The current rotation is not complete yet.");
  }
  return createNextCycle(state, rotationNumber + 1);
}

/** Creates a payment as pending. Call verifyContribution only after an authorized verification. */
export function recordContribution(
  state: EqubState,
  input: Omit<Contribution, "id" | "status" | "paidAt"> & { paidAt?: string }
): EqubState {
  const cycle = state.cycles.find((c) => c.id === input.cycleId);
  const member = state.members.find((m) => m.id === input.memberId);
  if (!cycle || !member || member.status !== "active") throw new Error("Active member and valid cycle are required.");
  if (cycle.participantMemberIds && !cycle.participantMemberIds.includes(member.id)) {
    throw new Error("This member was not part of the selected cycle.");
  }
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
