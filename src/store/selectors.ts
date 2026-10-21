import {
  collectionProgress,
  confirmedCollection,
  expectedCollection,
  outstandingCollection,
  paidMemberCount,
  type Cycle,
  type EqubState,
  type Member,
} from "@/core/engine";

export interface CycleMetrics {
  expected: number;
  collected: number;
  outstanding: number;
  progress: number;
  paidCount: number;
}

export function selectActiveCycle(data: EqubState): Cycle | undefined {
  return data.cycles.find((c) => c.status === "active");
}

export function selectCycleMetrics(data: EqubState, cycleId: string): CycleMetrics {
  if (!cycleId) return { expected: 0, collected: 0, outstanding: 0, progress: 0, paidCount: 0 };
  return {
    expected: expectedCollection(data, cycleId),
    collected: confirmedCollection(data, cycleId),
    outstanding: outstandingCollection(data, cycleId),
    progress: collectionProgress(data, cycleId),
    paidCount: paidMemberCount(data, cycleId),
  };
}

export function selectMemberById(data: EqubState, memberId: string): Member | undefined {
  return data.members.find((m) => m.id === memberId);
}

export function memberName(data: EqubState, memberId: string): string {
  return selectMemberById(data, memberId)?.name
    ?? data.draws?.find((draw) => draw.winnerMemberId === memberId)?.winnerName
    ?? "Unknown member";
}

/** The member's confirmed contribution for a cycle, if they have paid. */
export function selectConfirmedContribution(data: EqubState, memberId: string, cycleId: string) {
  return data.contributions.find(
    (c) => c.memberId === memberId && c.cycleId === cycleId && c.status === "confirmed"
  );
}
