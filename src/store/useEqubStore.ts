import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist, type StateStorage } from "zustand/middleware";
import {
  approvePayout,
  createDemoState,
  recordContribution,
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
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && "state" in parsed) return raw; // already an envelope
      return JSON.stringify({ state: { data: parsed }, version: 1 }); // legacy raw EqubState
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
  addMember: (name: string, phone: string) => Member;
  recordPayment: (input: { memberId: string; cycleId: string; amount: number; note?: string }) => void;
  verifyPayment: (contributionId: string, confirmed: boolean) => void;
  approvePayoutById: (payoutId: string) => void;
  resetDemo: () => void;
}

export const useEqubStore = create<EqubStore>()(
  persist(
    (set, get) => ({
      data: createDemoState(),

      addMember: (name, phone) => {
        const trimmedName = name.trim();
        const trimmedPhone = phone.trim();
        if (!trimmedName || !trimmedPhone) throw new Error("Please enter a member name and phone number.");
        if (get().data.members.some((m) => m.phone === trimmedPhone)) {
          throw new Error("A member with this phone number already exists.");
        }
        const member: Member = {
          id: `member-${Date.now()}`,
          name: trimmedName,
          phone: trimmedPhone,
          joinedAt: new Date().toISOString(),
          status: "active",
        };
        set((s) => ({ data: { ...s.data, members: [...s.data.members, member] } }));
        return member;
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
