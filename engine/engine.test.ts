import assert from "node:assert/strict";
import { createDemoState } from "./seed";
import {
  confirmedCollection, expectedCollection, outstandingCollection, paidMemberCount,
  collectionProgress, recordContribution, verifyContribution, calculatePayout
} from "./engine";

const state = createDemoState();
const cycleId = state.cycles[0].id;

assert.equal(state.members.length, 40);
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
console.log("All Equb engine tests passed.");
