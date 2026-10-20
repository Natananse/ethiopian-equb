import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import {
  advanceCycle as advanceCycleState,
  approvePayout,
  createDemoState,
  drawWinner as drawWinnerState,
  migratePersistedEqubState,
  recordContribution,
  startNextRotation as startNextRotationState,
  validateMemberIdentity,
  verifyContribution,
  type Contribution,
  type EqubState,
  type Member,
} from "@/core/engine";

/** Same key the legacy single-file app used, so existing installs keep their data. */
export const EQUB_STORAGE_KEY = "ethiopian-equb-state-v1";

/**
 * Storage adapter that preserves the legacy on-device format.
 *
 * The old App.tsx wrote the raw EqubState JSON under EQUB_STORAGE_KEY.
 * Zustand persist normally wraps state in a `{ state, version }` envelope;
 * this adapter unwraps on write (raw EqubState, byte-compatible with the
 * legacy format) and re-wraps legacy payloads on read, so no user data is
 * lost or reformatted by the migration to Zustand.
 */
const legacyCompatibleStorage: StateStorage = {
  getItem: async (name) => {
    const raw = await AsyncStorage.getItem(name);
    if (!raw) return null;
    try {
      const parsed: unknown = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
      const parsedRecord = parsed as Record<string, unknown>;
      const storedState = parsedRecord.state && typeof parsedRecord.state === "object"
        ? parsedRecord.state as Record<string, unknown>
        : undefined;
      const hasEnvelope = Boolean(storedState && "data" in storedState);
      const legacyData = hasEnvelope ? storedState?.data : parsed;
      const migrated = migratePersistedEqubState(legacyData);
      if (!migrated) return null;
      if (hasEnvelope && storedState) {
        return JSON.stringify({ ...parsedRecord, state: { ...storedState, data: migrated } });
      }
      return JSON.stringify({ state: { data: migrated }, version: 1 });
    } catch {
      return null;
    }
  },
  setItem: async (name, value) => {
    const parsed = JSON.parse(value) as { state: { data: EqubState } };
    await AsyncStorage.setItem(name, JSON.stringify(parsed.state.data));
  },
  removeItem: async (name) => {
    await AsyncStorage.removeItem(name);
  },
};

interface EqubStore {
  data: EqubState;
  addMember: (input: { name: string; customerNumber: string; idNumber: string; phone?: string }) => Member;
  updateMember: (memberId: string, input: { name: string; customerNumber: string; idNumber: string; phone?: string }) => void;
  recordPayment: (input: { memberId: string; cycleId: string; amount: number; note?: string }) => void;
  verifyPayment: (contributionId: string, confirmed: boolean) => void;
  approvePayoutById: (payoutId: string) => void;
  drawWinner: () => void;
  advanceCycle: () => void;
  startNextRotation: () => void;
  resetDemo: () => void;
}

export const useEqubStore = create<EqubStore>()(
  persist(
    (set, get) => ({
      data: createDemoState(),

      addMember: (input) => {
        const name = input.name.trim();
        const customerNumber = input.customerNumber.trim();
        const idNumber = input.idNumber.trim();
        const phone = input.phone?.trim() ?? "";
        if (!name || !customerNumber || !idNumber) {
          throw new Error("Name, customer number, and ID number are required.");
        }
        const existingData = get().data;
        const members = existingData.members;
        validateMemberIdentity(existingData, { customerNumber, idNumber });
        if (phone && members.some((member) => member.phone.trim() === phone)) {
          throw new Error("A member with this phone number already exists.");
        }
        let id = `member-${Date.now()}`;
        let suffix = 2;
        while (members.some((member) => member.id === id)) id = `member-${Date.now()}-${suffix++}`;
        const member: Member = {
          id,
          name,
          customerNumber,
          idNumber,
          phone,
          joinedAt: new Date().toISOString(),
          status: "active",
        };
        set((s) => {
          const activeIds = s.data.members.filter((existing) => existing.status === "active").map((existing) => existing.id);
          const cycles = s.data.cycles.map((cycle) => {
            if (cycle.status !== "active") return cycle;
            const participantIds = cycle.participantMemberIds ?? activeIds;
            return {
              ...cycle,
              participantMemberIds: participantIds.includes(member.id) ? participantIds : [...participantIds, member.id],
            };
          });
          return { data: { ...s.data, members: [...s.data.members, member], cycles } };
        });
        return member;
      },

      updateMember: (memberId, input) => {
        const currentState = get().data;
        const name = input.name.trim();
        const customerNumber = input.customerNumber.trim();
        const idNumber = input.idNumber.trim();
        const phone = input.phone?.trim() ?? "";
        if (!currentState.members.some((member) => member.id === memberId)) throw new Error("Member not found.");
        if (!name) throw new Error("Member name is required.");
        validateMemberIdentity(currentState, { customerNumber, idNumber }, memberId);
        if (phone && currentState.members.some((member) => member.id !== memberId && member.phone.trim() === phone)) {
          throw new Error("A member with this phone number already exists.");
        }
        set((state) => ({
          data: {
            ...state.data,
            members: state.data.members.map((member) => member.id === memberId
              ? { ...member, name, customerNumber, idNumber, phone }
              : member),
          },
        }));
      },

      recordPayment: (input) =>
        set((s) => ({
          data: recordContribution(s.data, {
            memberId: input.memberId,
            cycleId: input.cycleId,
            amount: input.amount,
            note: input.note?.trim() || "Entered in app",
          } satisfies Omit<Contribution, "id" | "status" | "paidAt">),
        })),

      verifyPayment: (contributionId, confirmed) =>
        set((s) => ({ data: verifyContribution(s.data, contributionId, confirmed) })),

      approvePayoutById: (payoutId) => set((s) => ({ data: approvePayout(s.data, payoutId) })),

      drawWinner: () => set((s) => ({ data: drawWinnerState(s.data) })),

      advanceCycle: () => set((s) => ({ data: advanceCycleState(s.data) })),

      startNextRotation: () => set((s) => ({ data: startNextRotationState(s.data) })),

      resetDemo: () => set({ data: createDemoState() }),
    }),
    {
      name: EQUB_STORAGE_KEY,
      version: 1,
      // createJSONStorage handles the envelope (de)serialization; the adapter
      // underneath translates between that envelope and the legacy raw format.
      // No partialize: JSON.stringify drops the action functions, and the
      // default shallow merge restores them from the initial state on hydrate.
      storage: createJSONStorage(() => legacyCompatibleStorage),
    }
  )
);
