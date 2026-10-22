import { create } from "zustand";
import type { ComponentProps } from "react";
import type { Ionicons } from "@expo/vector-icons";

export interface ConfirmationOptions {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  danger?: boolean;
  icon?: ComponentProps<typeof Ionicons>["name"];
}

interface ActiveConfirmation extends ConfirmationOptions {
  resolve: (confirmed: boolean) => void;
}

interface FeedbackState {
  confirmation: ActiveConfirmation | null;
  requestConfirmation: (options: ConfirmationOptions) => Promise<boolean>;
  resolveConfirmation: (confirmed: boolean) => void;
}

export const useFeedbackStore = create<FeedbackState>((set, get) => ({
  confirmation: null,
  requestConfirmation: (options) =>
    new Promise<boolean>((resolve) => {
      get().confirmation?.resolve(false);
      set({ confirmation: { ...options, resolve } });
    }),
  resolveConfirmation: (confirmed) => {
    const confirmation = get().confirmation;
    set({ confirmation: null });
    confirmation?.resolve(confirmed);
  },
}));
