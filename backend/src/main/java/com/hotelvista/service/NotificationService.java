package com.hotelvista.service;

import com.hotelvista.model.Notification;
import com.hotelvista.model.User;
import com.hotelvista.model.enums.NotificationStatus;
import com.hotelvista.repository.NotificationRepository;
import com.hotelvista.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    private UserRepository userRepository;

    /**
     * Tạo và gửi thông báo realtime
     */
    public Notification createAndSendNotification(Notification notification) {
        try {
            // Lưu vào database
            Notification savedNotification = notificationRepository.save(notification);

            // Gửi realtime nếu được yêu cầu
            if (notification.getIsRealtime()) {
                sendRealtimeNotification(savedNotification);
            }

            return savedNotification;
        } catch (Exception e) {
            log.error("Error creating notification: ", e);
            notification.setStatus(NotificationStatus.FAILED);
            return notificationRepository.save(notification);
        }
    }

    /**
     * Gửi thông báo realtime qua WebSocket
     */
    public void sendRealtimeNotification(Notification notification) {
        try {
            // Gửi đến user cụ thể
            if (notification.getToUserId() != null) {
                messagingTemplate.convertAndSendToUser(
                        notification.getToUserId(),
                        "/queue/notifications",
                        notification
                );
            }

            // Gửi broadcast đến nhiều user
            if (notification.getToUserIds() != null && !notification.getToUserIds().isEmpty()) {
                for (String userId : notification.getToUserIds()) {
                    messagingTemplate.convertAndSendToUser(
                            userId,
                            "/queue/notifications",
                            notification
                    );
                }
            }

            // Gửi đến tất cả user theo role
            if (notification.getToUserType() != null) {
                messagingTemplate.convertAndSend(
                        "/topic/notifications/" + notification.getToUserType().name().toLowerCase(),
                        notification
                );
            }

            // Cập nhật trạng thái đã gửi
            notification.setStatus(NotificationStatus.SENT);
            notification.setDeliveredAt(LocalDateTime.now());
            notificationRepository.save(notification);

        } catch (Exception e) {
            log.error("Error sending realtime notification: ", e);
            notification.setStatus(NotificationStatus.FAILED);
            notificationRepository.save(notification);
        }
    }

    /**
     * Lấy danh sách thông báo của user
     */
    public Page<Notification> getNotificationsForUser(String userId, String userRole, Pageable pageable) {
        Page<Notification> result = notificationRepository.findByToUserIdOrToUserType(
                userId,
                userRole,
                pageable
        );

        return result;
    }
    /**
     * Lấy thông báo với phân trang
     */
    public Page<Notification> getNotificationsForUser(String userId, Pageable pageable) {
        User user = userRepository.findById(userId).orElseThrow();

        // Convert Enum → String
        String userRole = user.getUserRole().name();

        return notificationRepository.findByToUserIdOrToUserType(
                userId,
                userRole,
                pageable
        );
    }

    /**
     * Lấy thông báo chưa đọc
     */
    public List<Notification> getUnreadNotifications(String userId) {
        return notificationRepository.findByToUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }

    /**
     * Đếm số thông báo chưa đọc
     */
    public long countUnreadNotifications(String userId) {
        return notificationRepository.countByToUserIdAndIsReadFalse(userId);
    }

    /**
     * Đánh dấu thông báo đã đọc
     */
    public Notification markAsRead(String notificationId, String userId) {
        Optional<Notification> notificationOpt = notificationRepository.findById(notificationId);

        if (notificationOpt.isPresent()) {
            Notification notification = notificationOpt.get();

            // ✅ FIX: Check cả toUserId VÀ toUserType
            boolean hasAccess = false;

            // Case 1: Personal notification (toUserId specified)
            if (userId.equals(notification.getToUserId())) {
                hasAccess = true;
            }

            // Case 2: Broadcast notification (toUserType specified)
            if (notification.getToUserType() != null && notification.getToUserId() == null) {
                // Get user's role from SecurityContext
                String userRole = SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getAuthorities()
                        .stream()
                        .findFirst()
                        .map(authority -> {
                            String authStr = authority.toString();
                            if (authStr.contains(".EMPLOYEE")) return "EMPLOYEE";
                            if (authStr.contains(".CUSTOMER")) return "CUSTOMER";
                            if (authStr.contains(".ADMIN")) return "ADMIN";
                            return "";
                        })
                        .orElse("");

                // Check if user's role matches notification's toUserType
                if (notification.getToUserType().toString().contains(userRole)) {
                    hasAccess = true;
                }
            }

            // Case 3: Multiple recipients (toUserIds list)
            if (notification.getToUserIds() != null && notification.getToUserIds().contains(userId)) {
                hasAccess = true;
            }

            if (hasAccess) {
                notification.setIsRead(true);
                notification.setReadAt(LocalDateTime.now());
                return notificationRepository.save(notification);
            }
        }

        throw new RuntimeException("Notification not found or access denied");
    }

    /**
     * Đánh dấu tất cả thông báo đã đọc
     */
    public void markAllAsRead(String userId) {
        List<Notification> unreadNotifications = getUnreadNotifications(userId);

        for (Notification notification : unreadNotifications) {
            notification.setIsRead(true);
            notification.setReadAt(LocalDateTime.now());
        }

        notificationRepository.saveAll(unreadNotifications);
    }

    /**
     * Xóa thông báo
     */
    public void deleteNotification(String notificationId, String userId) {
        Optional<Notification> notificationOpt = notificationRepository.findById(notificationId);

        if (notificationOpt.isPresent()) {
            Notification notification = notificationOpt.get();

            // Kiểm tra quyền
            if (userId.equals(notification.getToUserId()) ||
                    (notification.getToUserIds() != null && notification.getToUserIds().contains(userId))) {

                notificationRepository.delete(notification);
                return;
            }
        }

        throw new RuntimeException("Notification not found or access denied");
    }

    /**
     * Gửi lại thông báo realtime chưa được gửi
     */
    public void resendPendingNotifications() {
        List<Notification> pendingNotifications = notificationRepository.findPendingRealtimeNotifications();

        for (Notification notification : pendingNotifications) {
            sendRealtimeNotification(notification);
        }
    }
}
