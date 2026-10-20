import assert from "node:assert/strict";
import { createDemoState } from "./seed";
import {
  confirmedCollection, expectedCollection, outstandingCollection, paidMemberCount,
  collectionProgress, recordContribution, verifyContribution, calculatePayout,
  advanceCycle, currentRotationNumber, drawWinner, eligibleDrawMembers,
  membersWithIdentityIssues, startNextRotation, validateMemberIdentity
} from "./engine";
import { migratePersistedEqubState } from "./migrations";

const state = createDemoState();
const cycleId = state.cycles[0].id;

assert.equal(state.members.length, 40);
assert.equal(state.payouts.length, 0, "the demo does not seed a misleading preselected winner or payout");
assert.equal(expectedCollection(state, cycleId), 200000);
assert.equal(confirmedCollection(state, cycleId), 40000);
assert.equal(outstandingCollection(state, cycleId), 160000);
assert.equal(paidMemberCount(state, cycleId), 8);
assert.equal(collectionProgress(state, cycleId), 20);

const pending = recordContribution(state, {
  memberId: state.members[8].id, cycleId, amount: 5000, note: "test"
});
assert.equal(confirmedCollection(pending, cycleId), 40000, "pending payment must not count as confirmed");
const newPayment = pending.contributions[pending.contributions.length - 1];
const confirmed = verifyContribution(pending, newPayment.id, true);
assert.equal(confirmedCollection(confirmed, cycleId), 45000);
assert.equal(paidMemberCount(confirmed, cycleId), 9);

assert.throws(() => recordContribution(confirmed, {
  memberId: state.members[8].id, cycleId, amount: 5000
}), /already exists/);

const payout = calculatePayout(confirmed, cycleId, 1000);
assert.equal(payout.gross, 45000);
assert.equal(payout.net, 44000);

assert.equal((state.draws ?? []).length, 0);
assert.equal(eligibleDrawMembers(state).length, 40);
assert.throws(() => validateMemberIdentity(state, { customerNumber: " eq-0001 ", idNumber: "NEW-ID" }), /customer number/);
assert.throws(() => validateMemberIdentity(state, { customerNumber: "NEW-CUSTOMER", idNumber: " demo-id-0001 " }), /ID number/);
assert.doesNotThrow(() => validateMemberIdentity(state, { customerNumber: " EQ-NEW ", idNumber: "ID-NEW" }));
const incompleteIdentity = {
  ...state,
  members: state.members.map((member, index) => index === 0 ? { ...member, idNumber: "" } : member),
};
assert.throws(() => drawWinner(incompleteIdentity, () => 0), /Every active member/);
const duplicateLegacyIdentity = {
  ...state,
  members: state.members.map((member, index) => index === 1
    ? { ...member, customerNumber: state.members[0].customerNumber, idNumber: state.members[0].idNumber }
    : member),
};
assert.equal(membersWithIdentityIssues(duplicateLegacyIdentity, cycleId).length, 2);
assert.throws(() => drawWinner(duplicateLegacyIdentity, () => 0), /unique customer and ID numbers/);
const inactiveDuplicate = {
  ...state,
  members: state.members.map((member, index) => index === 1
    ? { ...member, status: "inactive" as const, idNumber: state.members[0].idNumber }
    : member),
};
assert.equal(membersWithIdentityIssues(inactiveDuplicate, cycleId).length, 1);
const oneInactive = {
  ...state,
  members: state.members.map((member, index) => index === 0 ? { ...member, status: "inactive" as const } : member),
};
assert.equal(eligibleDrawMembers(oneInactive).length, 39);
assert.equal(drawWinner(oneInactive, () => 0.999999).draws?.[0].winnerMemberId, state.members[39].id);

const firstDraw = drawWinner(state, () => 0);
assert.equal(firstDraw.draws?.[0].winnerMemberId, state.members[0].id);
assert.equal(firstDraw.draws?.[0].winnerName, state.members[0].name);
assert.equal(firstDraw.draws?.[0].winnerIdNumber, state.members[0].idNumber);
assert.equal(firstDraw.draws?.[0].eligibleBefore, 40);
assert.equal(firstDraw.cycles[0].recipientMemberId, state.members[0].id);
assert.equal(eligibleDrawMembers(firstDraw).length, 39);
assert.throws(() => drawWinner(firstDraw, () => 0), /already been drawn/);
assert.throws(() => advanceCycle(state), /Draw a winner/);

let tenWinners = firstDraw;
for (let draw = 2; draw <= 10; draw += 1) {
  tenWinners = advanceCycle(tenWinners);
  tenWinners = drawWinner(tenWinners, () => 0);
}
assert.equal(tenWinners.draws?.length, 10);
assert.equal(eligibleDrawMembers(tenWinners).length, 30, "after ten winners, the next draw uses only the remaining thirty members");
assert.equal(new Set(tenWinners.draws?.map((item) => item.winnerMemberId)).size, 10);
assert.throws(() => startNextRotation(tenWinners), /not complete/);

let completedRotation = tenWinners;
for (let draw = 11; draw <= 40; draw += 1) {
  completedRotation = advanceCycle(completedRotation);
  completedRotation = drawWinner(completedRotation, () => 0);
}
assert.equal(eligibleDrawMembers(completedRotation).length, 0);
assert.throws(() => drawWinner(completedRotation, () => 0), /already been drawn/);
const exhaustedFreshCycle = {
  ...completedRotation,
  cycles: completedRotation.cycles.map((cycle) =>
    cycle.status === "active" ? { ...cycle, id: `${cycle.id}-empty-pool` } : cycle
  ),
};
assert.throws(() => drawWinner(exhaustedFreshCycle, () => 0), /no eligible active members/);
assert.throws(() => advanceCycle(completedRotation), /Start a new rotation/);
const nextRotation = startNextRotation(completedRotation);
assert.equal(currentRotationNumber(nextRotation), 2);
assert.equal(eligibleDrawMembers(nextRotation).length, 40);
assert.equal(nextRotation.draws?.length, 40, "starting a new rotation preserves the complete previous draw history");
assert.equal(nextRotation.cycles.filter((item) => item.status === "active").length, 1);

const nextCycle = advanceCycle(firstDraw);
const nextActiveCycle = nextCycle.cycles.find((item) => item.status === "active");
assert.ok(nextActiveCycle);
assert.equal(nextActiveCycle.participantMemberIds?.length, 40);
const nextCyclePayment = recordContribution(nextCycle, {
  memberId: state.members[8].id, cycleId: nextActiveCycle.id, amount: 5000,
});
assert.equal(nextCyclePayment.contributions.at(-1)?.cycleId, nextActiveCycle.id);
const memberAddedAfterCycleOpened = {
  ...nextCycle,
  members: [...nextCycle.members, {
    ...state.members[0], id: "member-new", customerNumber: "EQ-NEW", idNumber: "DEMO-NEW", name: "New member",
  }],
};
assert.equal(expectedCollection(memberAddedAfterCycleOpened, cycleId), 200000, "new members do not change a completed cycle’s expected collection");
assert.equal(expectedCollection(memberAddedAfterCycleOpened, nextActiveCycle.id), 200000, "a cycle uses its participant snapshot");
assert.throws(() => recordContribution(memberAddedAfterCycleOpened, {
  memberId: "member-new", cycleId: nextActiveCycle.id, amount: 5000,
}), /not part of the selected cycle/);

const legacyState = migratePersistedEqubState({
  ...state,
  members: state.members.map(({ customerNumber, idNumber, ...member }) => member),
  cycles: state.cycles.map(({ participantMemberIds, ...cycle }) => cycle),
  payouts: [{
    id: "legacy-payout",
    cycleId,
    recipientMemberId: state.members[0].id,
    grossAmount: 40000,
    deductions: 0,
    netAmount: 40000,
    status: "scheduled" as const,
  }],
  draws: undefined,
  currentRotation: 0,
});
assert.ok(legacyState);
assert.equal(legacyState.draws?.length, 0);
assert.equal(currentRotationNumber(legacyState), 1);
assert.equal(legacyState.cycles[0].participantMemberIds?.length, 40);
assert.equal(legacyState.members[0].customerNumber, undefined, "migration does not invent identity numbers");
assert.equal(legacyState.contributions.length, state.contributions.length, "legacy contributions remain intact");
assert.equal(legacyState.payouts[0].id, "legacy-payout", "legacy payout history remains intact");

console.log("All Equb engine tests passed.");
