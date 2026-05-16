import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getToken, saveToken } from "../../utils/auth";

export type NotificationType = "success" | "info" | "note";

export type AppNotification = {
  id: string;
  title: string;
  text: string;
  type: NotificationType;
  createdAt: string;
};

type AddNotificationInput = {
  title: string;
  text: string;
  type?: NotificationType;
};

type NotificationContextType = {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (payload: AddNotificationInput) => void;
  markAllAsRead: () => void;
};

const NOTIFICATIONS_KEY = "appNotifications";
const UNREAD_KEY = "appNotificationsUnread";

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    async function loadStoredState() {
      try {
        const [savedNotifications, savedUnread] = await Promise.all([
          getToken(NOTIFICATIONS_KEY),
          getToken(UNREAD_KEY),
        ]);

        if (savedNotifications) {
          const parsed = JSON.parse(savedNotifications);
          if (Array.isArray(parsed)) {
            setNotifications(parsed);
          }
        }

        if (savedUnread) {
          const parsedUnread = Number(savedUnread);
          if (!Number.isNaN(parsedUnread)) {
            setUnreadCount(parsedUnread);
          }
        }
      } catch (err) {
        console.warn("Failed to restore notifications", err);
      } finally {
        setHydrated(true);
      }
    }
    loadStoredState();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveToken(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  }, [notifications, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    saveToken(UNREAD_KEY, String(unreadCount));
  }, [unreadCount, hydrated]);

  const addNotification = (payload: AddNotificationInput) => {
    const newItem: AppNotification = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: payload.title,
      text: payload.text,
      type: payload.type ?? "info",
      createdAt: new Date().toISOString(),
    };

    setNotifications((prev) => [newItem, ...prev]);
    setUnreadCount((prev) => prev + 1);
  };

  const markAllAsRead = () => {
    setUnreadCount(0);
  };

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      addNotification,
      markAllAsRead,
    }),
    [notifications, unreadCount]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return ctx;
}

