import { create } from "zustand";

interface NotificationStore {
  notification: { text: string } | undefined;

  setNotification: (notification: { text: string } | undefined) => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notification: undefined,
  setNotification: (notification) =>
    set(() => ({ notification: notification })),
}));
