import { create } from "zustand";

type State = {
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
};

export const useNotificationState = create<State>((set) => ({
  notificationsEnabled: typeof window !== "undefined" ? localStorage.getItem("notificationsEnabled") === "true" : false,
  setNotificationsEnabled: (enabled: boolean) => {
    console.log(`Powiadomienia: ${enabled ? "✅ Włączone" : "❌ Wyłączone"}`);
    localStorage.setItem("notificationsEnabled", String(enabled));
    set({ notificationsEnabled: enabled });
  },
}));
