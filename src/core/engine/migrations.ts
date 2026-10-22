import type { EqubState, Member } from "./types";

/**
 * Normalizes the old raw AsyncStorage shape without inventing customer or government ID values.
 * Legacy cycles never saved their roster, so their one-time best-effort snapshot uses members active
 * when this migration first runs. New cycles always receive an exact participant snapshot.
 */
export function migratePersistedEqubState(value: unknown): EqubState | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const source = value as Partial<EqubState>;
  if (
    !Array.isArray(source.members) ||
    !Array.isArray(source.contributions) ||
    !Array.isArray(source.cycles) ||
    !Array.isArray(source.payouts) ||
    typeof source.groupName !== "string" ||
    typeof source.contributionAmount !== "number"
  ) {
    return null;
  }

  const members = source.members as Member[];
  const legacyParticipantIds = members.filter((member) => member.status === "active").map((member) => member.id);
  const cycles = source.cycles.map((cycle) => ({
    ...cycle,
    participantMemberIds: Array.isArray(cycle.participantMemberIds)
      ? cycle.participantMemberIds
      : [...legacyParticipantIds],
  }));
  const currentRotation = Number.isInteger(source.currentRotation) && (source.currentRotation ?? 0) > 0
    ? source.currentRotation
    : 1;

  return {
    ...source,
    currency: "ETB",
    frequency: "monthly",
    members,
    contributions: source.contributions,
    cycles,
    payouts: source.payouts,
    draws: Array.isArray(source.draws) ? source.draws : [],
    currentRotation,
  } as EqubState;
}
