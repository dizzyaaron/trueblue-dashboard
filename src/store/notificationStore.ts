import { create } from 'zustand';

interface NotificationAction {
  label: string;
  onClick: () => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  actions?: NotificationAction[];
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'createdAt'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (notification) => set((state) => ({
    notifications: [
      ...state.notifications,
      { ...notification, createdAt: new Date().toISOString() }
    ]
  })),
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id)
  })),
  clearNotifications: () => set({ notifications: [] })
}));