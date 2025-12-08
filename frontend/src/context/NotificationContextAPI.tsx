/*eslint-disable */
import React, { createContext, useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { notificationApiService } from '../services/notificationApiService';
import type { BackendNotification } from '../services/notificationApiService';

// Frontend Notification Interface
interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: string;
    isRead: boolean;
    category?: string;
    priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
    needsAction?: boolean;
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (
        notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>,
    ) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    removeNotification: (id: string) => void;
    clearAll: () => void;
    refreshNotifications: () => Promise<void>;
}

export const NotificationContext = createContext<
    NotificationContextType | undefined
>(undefined);

interface NotificationProviderProps {
    children: ReactNode;
    userId?: string;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
    children,
    userId = 'ADMIN_001',
}) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    // Convert backend notification to frontend format
    const convertBackendToFrontend = (
        backendNotif: BackendNotification,
    ): Notification => {
        const getTypeFromCategory = (category: string, type: string) => {
            if (type === 'ALERT') return 'error';
            if (category === 'PAYMENT_ISSUE') return 'warning';
            if (category === 'PROMOTION') return 'success';
            return 'info';
        };

        return {
            id: backendNotif.id,
            title: backendNotif.title,
            message: backendNotif.message,
            type: getTypeFromCategory(backendNotif.category, backendNotif.type),
            timestamp: backendNotif.deliveredAt || backendNotif.createdAt, // Dùng deliveredAt nếu có, fallback to createdAt
            isRead: backendNotif.isRead,
            category: backendNotif.category,
            priority: backendNotif.priority,
            needsAction: backendNotif.needsAction,
        };
    };

    // Load notifications from API cho customer và employee
    const refreshNotifications = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.warn('⚠️ [Context] No token, user not logged in');
                setNotifications([]);
                return;
            }

            console.log('🔄 [Context] Refreshing notifications...');

            // Lấy tất cả notifications (customer hoặc employee)
            const response = await notificationApiService.getMyNotifications(
                0,
                50,
            );

            console.log('📥 [Context] API Response:', {
                success: response.success,
                hasData: !!response.data,
                hasContent: !!response.data?.content,
                contentLength: response.data?.content?.length,
            });

            if (
                response.success &&
                response.data?.content &&
                Array.isArray(response.data.content)
            ) {
                const frontendNotifications = response.data.content.map(
                    convertBackendToFrontend,
                );

                console.log(
                    '✅ [Context] Loaded',
                    frontendNotifications.length,
                    'notifications',
                );
                setNotifications(frontendNotifications);
                return;
            }

            console.log(
                '⚠️ [Context] No content in response, trying unread...',
            );

            // Fallback: lấy unread notifications
            const unreadResponse =
                await notificationApiService.getUnreadNotifications();
            if (
                unreadResponse.success &&
                unreadResponse.data &&
                Array.isArray(unreadResponse.data)
            ) {
                console.log(
                    '📭 [Context] Got',
                    unreadResponse.data.length,
                    'unread notifications',
                );

                const frontendNotifications = unreadResponse.data.map(
                    convertBackendToFrontend,
                );
                setNotifications(frontendNotifications);
                return;
            }

            console.log('ℹ️ [Context] No notifications available');
            setNotifications([]);
        } catch (error) {
            console.error('❌ [Context] Error loading notifications:', error);
            setNotifications([]);
        }
    }, []);

    // Load initial notifications
    useEffect(() => {
        refreshNotifications();
    }, [refreshNotifications]);

    // ⚠️ POLLING DISABLED - Waiting for backend endpoint
    // TODO: Enable after backend /api/notifications endpoint is ready
    // useEffect(() => {
    //     const interval = setInterval(refreshNotifications, 5000);
    //     return () => clearInterval(interval);
    // }, [refreshNotifications]);

    const addNotification = useCallback(
        (
            notificationData: Omit<Notification, 'id' | 'timestamp' | 'isRead'>,
        ) => {
            const newNotification: Notification = {
                ...notificationData,
                id:
                    'local_' +
                    Date.now().toString() +
                    Math.random().toString(36).substr(2, 9),
                timestamp: new Date().toISOString(),
                isRead: false,
            };

            setNotifications((prev) => [newNotification, ...prev]);

            // Browser notification
            if (typeof window !== 'undefined' && 'Notification' in window) {
                if (Notification.permission === 'granted') {
                    new Notification(newNotification.title, {
                        body: newNotification.message,
                        icon: '/vite.svg',
                    });
                } else if (Notification.permission === 'default') {
                    Notification.requestPermission().then((permission) => {
                        if (permission === 'granted') {
                            new Notification(newNotification.title, {
                                body: newNotification.message,
                                icon: '/vite.svg',
                            });
                        }
                    });
                }
            }

            // Try to send to backend API
            const backendType: 'REQUEST' | 'INFO' | 'ALERT' | 'SYSTEM' =
                notificationData.type === 'info'
                    ? 'INFO'
                    : notificationData.type === 'success'
                    ? 'INFO'
                    : notificationData.type === 'warning'
                    ? 'ALERT'
                    : 'ALERT';

            const backendCategory:
                | 'EARLY_CHECKIN'
                | 'LATE_CHECKOUT'
                | 'CANCELLATION'
                | 'PAYMENT_ISSUE'
                | 'MAINTENANCE'
                | 'HOUSEKEEPING'
                | 'PROMOTION'
                | 'SECURITY'
                | 'OTHER' =
                (notificationData.category as
                    | 'EARLY_CHECKIN'
                    | 'LATE_CHECKOUT'
                    | 'CANCELLATION'
                    | 'PAYMENT_ISSUE'
                    | 'MAINTENANCE'
                    | 'HOUSEKEEPING'
                    | 'PROMOTION'
                    | 'SECURITY'
                    | 'OTHER') || 'OTHER';

            notificationApiService
                .createNotification({
                    type: backendType,
                    category: backendCategory,
                    title: notificationData.title,
                    message: notificationData.message,
                    toUserId: userId,
                    needsAction: notificationData.needsAction || false,
                    isRead: false,
                    isRealtime: true,
                    status: 'PENDING',
                    priority: notificationData.priority || 'NORMAL',
                })
                .catch((error) => {
                    console.error(
                        'Error sending notification to backend:',
                        error,
                    );
                });
        },
        [userId],
    );

    const markAsRead = useCallback(async (id: string) => {
        setNotifications((prev) =>
            prev.map((notification) =>
                notification.id === id
                    ? { ...notification, isRead: true }
                    : notification,
            ),
        );

        // Call API if it's a backend notification
        if (!id.startsWith('local_')) {
            try {
                await notificationApiService.markAsRead(id);
            } catch (error) {
                console.error('Error marking as read:', error);
            }
        }
    }, []);

    const markAllAsRead = useCallback(async () => {
        setNotifications((prev) =>
            prev.map((notification) => ({ ...notification, isRead: true })),
        );

        try {
            await notificationApiService.markAllAsRead();
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    }, []);

    const removeNotification = useCallback(async (id: string) => {
        setNotifications((prev) =>
            prev.filter((notification) => notification.id !== id),
        );

        // Call API if it's a backend notification
        if (!id.startsWith('local_')) {
            try {
                await notificationApiService.deleteNotification(id);
            } catch (error) {
                console.error('Error deleting notification:', error);
            }
        }
    }, []);

    const clearAll = useCallback(() => {
        setNotifications([]);
    }, []);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                addNotification,
                markAsRead,
                markAllAsRead,
                removeNotification,
                clearAll,
                refreshNotifications,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

// Hook to use the notification context
export const useNotificationContext = (): NotificationContextType => {
    const context = React.useContext(NotificationContext);
    if (context === undefined) {
        throw new Error(
            'useNotificationContext must be used within a NotificationProvider',
        );
    }
    return context;
};
