import { createContext } from 'react';

export interface Notification {
    id: string; // map từ _id
    type: string;
    category: string;
    title: string;
    message: string;

    fromUserId: string;
    fromUserName: string;
    fromUserType: string;

    toUserId: string;
    toUserType: string;

    status: string;
    priority: string;
    needsAction: boolean;

    isRead: boolean;
    readAt?: string;

    isRealtime: boolean;
    deliveredAt: string;

    dataJson?: string;
}

export interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;

    addNotification: (
        notification: Omit<Notification, 'id' | 'isRead' | 'readAt'>,
    ) => void;

    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    removeNotification: (id: string) => void;
    clearAll: () => void;
}

export const NotificationContext = createContext<
    NotificationContextType | undefined
>(undefined);
