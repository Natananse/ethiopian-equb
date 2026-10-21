import { mutation, query } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import {
  advanceCycle,
  approvePayout,
  drawWinner,
  recordContribution,
  startNextRotation,
  validateMemberIdentity,
  verifyContribution,
} from "../src/core/engine/engine";
import type {
  Contribution,
  Cycle,
  DrawRecord,
  EqubState,
  Member,
  Payout,
} from "../src/core/engine/types";
import { equbStateValidator } from "./schema";

const recordKinds = ["member", "contribution", "cycle", "payout", "draw"] as const;
type RecordKind = (typeof recordKinds)[number];
type RecordData =
  | ({ kind: "member" } & Member)
  | ({ kind: "contribution" } & Contribution)
  | ({ kind: "cycle" } & Cycle)
  | ({ kind: "payout" } & Payout)
  | ({ kind: "draw" } & DrawRecord);
type StoredRecords = Record<RecordKind, Doc<"records">[]>;

const MAX_RECORDS: Record<RecordKind, number> = {
  member: 500,
  contribution: 8000,
  cycle: 500,
  payout: 1000,
  draw: 1000,
};

async function ownerTokenIdentifier(ctx: QueryCtx | MutationCtx): Promise<string> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new ConvexError("Sign in is required.");
  return identity.tokenIdentifier;
}

async function getOwnedEqub(ctx: QueryCtx | MutationCtx, owner: string): Promise<Doc<"equbs">> {
  const equb = await ctx.db
    .query("equbs")
    .withIndex("by_owner", (q) => q.eq("ownerTokenIdentifier", owner))
    .unique();
  if (!equb) throw new ConvexError("Your Equb account has not been initialized.");
  return equb;
}

async function readRecords(ctx: QueryCtx | MutationCtx, equbId: Id<"equbs">): Promise<StoredRecords> {
  const entries = await Promise.all(recordKinds.map(async (kind) => {
    const docs = await ctx.db
      .query("records")
      .withIndex("by_equb_and_kind", (q) => q.eq("equbId", equbId).eq("kind", kind))
      .take(MAX_RECORDS[kind] + 1);
    if (docs.length > MAX_RECORDS[kind]) {
      throw new ConvexError(`This Equb has reached the supported ${kind} record limit.`);
    }
    return [kind, docs] as const;
  }));
  return Object.fromEntries(entries) as StoredRecords;
}

function recordsToState(equb: Doc<"equbs">, stored: StoredRecords): EqubState {
  const members: Member[] = stored.member.flatMap(({ record }) => {
    if (record.kind !== "member") throw new ConvexError("Stored member data is invalid.");
    const { kind: _kind, ...member } = record;
    return [member];
  });
  const contributions: Contribution[] = stored.contribution.flatMap(({ record }) => {
    if (record.kind !== "contribution") throw new ConvexError("Stored contribution data is invalid.");
    const { kind: _kind, ...contribution } = record;
    return [contribution];
  });
  const cycles: Cycle[] = stored.cycle.flatMap(({ record }) => {
    if (record.kind !== "cycle") throw new ConvexError("Stored cycle data is invalid.");
    const { kind: _kind, ...cycle } = record;
    return [cycle];
  });
  const payouts: Payout[] = stored.payout.flatMap(({ record }) => {
    if (record.kind !== "payout") throw new ConvexError("Stored payout data is invalid.");
    const { kind: _kind, ...payout } = record;
    return [payout];
  });
  const draws: DrawRecord[] = stored.draw.flatMap(({ record }) => {
    if (record.kind !== "draw") throw new ConvexError("Stored draw data is invalid.");
    const { kind: _kind, ...draw } = record;
    return [draw];
  });

  for (const kind of recordKinds) {
    stored[kind].sort((a, b) => a.position - b.position);
  }
  const ordered = <T extends { id: string }>(records: T[], kind: RecordKind): T[] => {
    const positions = new Map(stored[kind].map((doc) => [doc.record.id, doc.position]));
    return records.sort((a, b) => (positions.get(a.id) ?? 0) - (positions.get(b.id) ?? 0));
  };

  return {
    groupName: equb.groupName,
    currency: equb.currency,
    contributionAmount: equb.contributionAmount,
    frequency: equb.frequency,
    currentRotation: equb.currentRotation,
    members: ordered(members, "member"),
    contributions: ordered(contributions, "contribution"),
    cycles: ordered(cycles, "cycle"),
    payouts: ordered(payouts, "payout"),
    draws: ordered(draws, "draw"),
  };
}

function tagStateRecords(state: EqubState): Record<RecordKind, RecordData[]> {
  return {
    member: state.members.map((record) => ({ kind: "member", ...record })),
    contribution: state.contributions.map((record) => ({ kind: "contribution", ...record })),
    cycle: state.cycles.map((record) => ({ kind: "cycle", ...record })),
    payout: state.payouts.map((record) => ({ kind: "payout", ...record })),
    draw: (state.draws ?? []).map((record) => ({ kind: "draw", ...record })),
  };
}

async function saveState(
  ctx: MutationCtx,
  equb: Doc<"equbs">,
  stored: StoredRecords,
  state: EqubState,
): Promise<void> {
  const next = tagStateRecords(state);
  for (const kind of recordKinds) {
    const oldById = new Map(stored[kind].map((doc) => [doc.record.id, doc]));
    const retainedIds = new Set<string>();
    for (const [position, record] of next[kind].entries()) {
      retainedIds.add(record.id);
      const old = oldById.get(record.id);
      if (!old) {
        await ctx.db.insert("records", { equbId: equb._id, kind, position, record });
      } else if (old.position !== position || JSON.stringify(old.record) !== JSON.stringify(record)) {
        await ctx.db.patch(old._id, { position, record });
      }
    }
    for (const old of stored[kind]) {
      if (!retainedIds.has(old.record.id)) await ctx.db.delete(old._id);
    }
  }
  await ctx.db.patch(equb._id, {
    groupName: state.groupName,
    currency: "ETB",
    contributionAmount: state.contributionAmount,
    frequency: "monthly",
    currentRotation: state.currentRotation ?? 1,
  });
}

async function changeState(
  ctx: MutationCtx,
  transform: (state: EqubState) => EqubState,
): Promise<EqubState> {
  const owner = await ownerTokenIdentifier(ctx);
  const equb = await getOwnedEqub(ctx, owner);
  const stored = await readRecords(ctx, equb._id);
  const state = recordsToState(equb, stored);
  const updated = transform(state);
  await saveState(ctx, equb, stored, updated);
  return updated;
}

export const ensureEqub = mutation({
  args: {},
  returns: v.id("equbs"),
  handler: async (ctx) => {
    const owner = await ownerTokenIdentifier(ctx);
    const existing = await ctx.db
      .query("equbs")
      .withIndex("by_owner", (q) => q.eq("ownerTokenIdentifier", owner))
      .unique();
    if (existing) return existing._id;

    const now = new Date();
    const cycleId = `cycle-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const dueDate = new Date(now.getFullYear(), now.getMonth(), 25).toISOString();
    const equbId = await ctx.db.insert("equbs", {
      ownerTokenIdentifier: owner,
      groupName: "My Equb",
      currency: "ETB",
      contributionAmount: 5000,
      frequency: "monthly",
      currentRotation: 1,
      importedFromDevice: false,
    });
    await ctx.db.insert("records", {
      equbId,
      kind: "cycle",
      position: 0,
      record: {
        kind: "cycle",
        id: cycleId,
        label: now.toLocaleString("en-US", { month: "long", year: "numeric" }),
        dueDate,
        contributionAmount: 5000,
        status: "active",
        participantMemberIds: [],
      },
    });
    return equbId;
  },
});

export const getState = query({
  args: {},
  returns: v.union(
    v.null(),
    v.object({ state: equbStateValidator, importedFromDevice: v.boolean() }),
  ),
  handler: async (ctx) => {
    const owner = await ownerTokenIdentifier(ctx);
    const equb = await ctx.db
      .query("equbs")
      .withIndex("by_owner", (q) => q.eq("ownerTokenIdentifier", owner))
      .unique();
    if (!equb) return null;
    const stored = await readRecords(ctx, equb._id);
    return { state: recordsToState(equb, stored), importedFromDevice: equb.importedFromDevice };
  },
});

export const importDeviceState = mutation({
  args: { state: equbStateValidator },
  returns: v.null(),
  handler: async (ctx, { state }) => {
    const owner = await ownerTokenIdentifier(ctx);
    const equb = await getOwnedEqub(ctx, owner);
    if (equb.importedFromDevice) throw new ConvexError("This device's data has already been imported.");

    const stored = await readRecords(ctx, equb._id);
    const current = recordsToState(equb, stored);
    if (current.members.length > 0 || current.contributions.length > 0 || current.draws?.length) {
      throw new ConvexError("Cloud data already exists; refusing to overwrite it with a device import.");
    }
    await saveState(ctx, equb, stored, state);
    await ctx.db.patch(equb._id, { importedFromDevice: true });
    return null;
  },
});

export const addMember = mutation({
  args: {
    name: v.string(),
    customerNumber: v.string(),
    idNumber: v.string(),
    phone: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const name = args.name.trim();
    const customerNumber = args.customerNumber.trim();
    const idNumber = args.idNumber.trim();
    const phone = args.phone?.trim() ?? "";
    if (!name || !customerNumber || !idNumber) throw new ConvexError("Name, customer number, and ID number are required.");
    await changeState(ctx, (state) => {
      validateMemberIdentity(state, { customerNumber, idNumber });
      if (phone && state.members.some((member) => member.phone.trim() === phone)) {
        throw new ConvexError("A member with this phone number already exists.");
      }
      const memberId = `member-${crypto.randomUUID()}`;
      const member: Member = {
        id: memberId,
        name,
        customerNumber,
        idNumber,
        phone,
        joinedAt: new Date().toISOString(),
        status: "active",
      };
      const activeIds = state.members.filter((item) => item.status === "active").map((item) => item.id);
      return {
        ...state,
        members: [...state.members, member],
        cycles: state.cycles.map((cycle) => cycle.status === "active"
          ? { ...cycle, participantMemberIds: [...(cycle.participantMemberIds ?? activeIds), memberId] }
          : cycle),
      };
    });
    return null;
  },
});

export const updateMember = mutation({
  args: {
    memberId: v.string(),
    name: v.string(),
    customerNumber: v.string(),
    idNumber: v.string(),
    phone: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const name = args.name.trim();
    const customerNumber = args.customerNumber.trim();
    const idNumber = args.idNumber.trim();
    const phone = args.phone?.trim() ?? "";
    if (!name) throw new ConvexError("Member name is required.");
    await changeState(ctx, (state) => {
      if (!state.members.some((member) => member.id === args.memberId)) throw new ConvexError("Member not found.");
      validateMemberIdentity(state, { customerNumber, idNumber }, args.memberId);
      if (phone && state.members.some((member) => member.id !== args.memberId && member.phone.trim() === phone)) {
        throw new ConvexError("A member with this phone number already exists.");
      }
      return {
        ...state,
        members: state.members.map((member) => member.id === args.memberId
          ? { ...member, name, customerNumber, idNumber, phone }
          : member),
      };
    });
    return null;
  },
});

export const recordPayment = mutation({
  args: {
    memberId: v.string(),
    cycleId: v.string(),
    amount: v.number(),
    note: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await changeState(ctx, (state) => recordContribution(state, {
      memberId: args.memberId,
      cycleId: args.cycleId,
      amount: args.amount,
      note: args.note?.trim() || "Entered in app",
    }));
    return null;
  },
});

export const verifyPayment = mutation({
  args: { contributionId: v.string(), confirmed: v.boolean() },
  returns: v.null(),
  handler: async (ctx, args) => {
    await changeState(ctx, (state) => verifyContribution(state, args.contributionId, args.confirmed));
    return null;
  },
});

export const approvePayoutById = mutation({
  args: { payoutId: v.string() },
  returns: v.null(),
  handler: async (ctx, { payoutId }) => {
    await changeState(ctx, (state) => approvePayout(state, payoutId));
    return null;
  },
});

export const drawWinnerForCycle = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    await changeState(ctx, (state) => drawWinner(state));
    return null;
  },
});

export const advanceCycleForEqub = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    await changeState(ctx, (state) => advanceCycle(state));
    return null;
  },
});

export const startNextRotationForEqub = mutation({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    await changeState(ctx, (state) => startNextRotation(state));
    return null;
  },
});
