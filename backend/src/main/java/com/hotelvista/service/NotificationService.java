package com.hotelvista.service;

import com.hotelvista.model.Customer;
import com.hotelvista.model.Employee;
import com.hotelvista.model.Notification;
import com.hotelvista.model.User;
import com.hotelvista.model.enums.NotificationStatus;
import com.hotelvista.model.enums.UserRole;
import com.hotelvista.repository.CustomerRepository;
import com.hotelvista.repository.EmployeeRepository;
import com.hotelvista.repository.NotificationRepository;
import com.hotelvista.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
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
    private CustomerRepository customerRepository;  // ← MongoDB

    @Autowired
    private EmployeeRepository employeeRepository;  // ← MongoDB

    @Autowired
    private UserRepository userRepository;

    /**
     * Tạo và gửi thông báo realtime
     */
    public Notification createAndSendNotification(Notification notification) {
        try {
            System.out.println("Creating notification:");
            System.out.println("   - toUserId: " + notification.getToUserId());
            System.out.println("   - toUserIds: " + notification.getToUserIds());
            System.out.println("   - toUserType: " + notification.getToUserType());
            System.out.println("   - title: " + notification.getTitle());
            System.out.println("   - type: " + notification.getType());
            System.out.println("   - category: " + notification.getCategory());

            if (notification.getCreatedAt() == null) {
                notification.setCreatedAt(LocalDateTime.now());
            }
            if (notification.getIsRead() == null) {
                notification.setIsRead(false);
            }
            if (notification.getIsRealtime() == null) {
                notification.setIsRealtime(true);
            }
            if (notification.getStatus() == null) {
                notification.setStatus(NotificationStatus.PENDING);
            }

            Notification savedNotification = notificationRepository.save(notification);
            System.out.println("Notification SAVED with ID: " + savedNotification.getId());

            if (Boolean.TRUE.equals(savedNotification.getIsRealtime())) {
                sendRealtimeNotification(savedNotification);
            }

            return savedNotification;
        } catch (Exception e) {
            System.err.println("Error creating notification: " + e.getMessage());
            e.printStackTrace();

            notification.setStatus(NotificationStatus.FAILED);
            return notificationRepository.save(notification);
        }
    }

    /**
     * Gửi thông báo realtime qua WebSocket
     */
    public void sendRealtimeNotification(Notification notification) {
        try {
            // Gửi đến 1 user cụ thể (personal)
            if (notification.getToUserId() != null) {

                messagingTemplate.convertAndSendToUser(
                        notification.getToUserId(),
                        "/queue/notifications",
                        notification
                );
            }

            // Gửi đến nhiều user cụ thể (multi-recipient)
            if (notification.getToUserIds() != null && !notification.getToUserIds().isEmpty()) {
                for (String userId : notification.getToUserIds()) {
                    messagingTemplate.convertAndSendToUser(
                            userId,
                            "/queue/notifications",
                            notification
                    );
                }
            }

            // Broadcast theo role (EMPLOYEE, ADMIN, CUSTOMER)
            if (notification.getToUserType() != null) {
                String topic = "/topic/notifications/" +
                        notification.getToUserType().name().toLowerCase();

                messagingTemplate.convertAndSend(topic, notification);
            }

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
    public Page<Notification> getNotificationsForUser(String userId, UserRole role, Pageable pageable) {

        switch (role) {

            case CUSTOMER:
                Page<Notification> customerNoti =
                        notificationRepository.findByToUserIdOrderByDeliveredAtDesc(userId, pageable);
                System.out.println("CUSTOMER result count = " + customerNoti.getTotalElements());
                return customerNoti;

            case EMPLOYEE:
                // thấy tất cả thông báo broadcast cho EMPLOYEE
                Page<Notification> empNoti =
                        notificationRepository.findByToUserTypeOrderByDeliveredAtDesc(UserRole.EMPLOYEE, pageable);

                System.out.println("EMPLOYEE result count = " + empNoti.getTotalElements());
                return empNoti;

            case ADMIN:
                // thấy tất cả thông báo broadcast cho ADMIN và EMPLOYEE
                Page<Notification> adminNoti =
                        notificationRepository.findByToUserTypeInOrderByDeliveredAtDesc(
                                List.of(UserRole.ADMIN, UserRole.EMPLOYEE),
                                pageable
                        );

                System.out.println("ADMIN result count = " + adminNoti.getTotalElements());
                return adminNoti;
        }

        return Page.empty();
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
     * Hỗ trợ cả personal notifications và broadcast notifications
     */
    public Notification markAsRead(String notificationId, String userId) {
        Optional<Notification> notificationOpt = notificationRepository.findById(notificationId);

        if (notificationOpt.isEmpty()) {
            System.out.println("Notification not found: " + notificationId);
            return null;
        }

        Notification notification = notificationOpt.get();

        boolean canMark = false;

        // Case 1: Personal notification
        if (notification.getToUserId() != null && notification.getToUserId().equals(userId)) {
            canMark = true;
            System.out.println("Personal notification - marking as read");
        }

        // Case 2: Broadcast notification (toUserId = null)
        if (notification.getToUserId() == null) {
            canMark = true;
            System.out.println("Broadcast notification - marking as read for user: " + userId);
        }

        // Case 3: Multi-recipient
        if (notification.getToUserIds() != null && notification.getToUserIds().contains(userId)) {
            canMark = true;
            System.out.println("Multi-recipient notification - marking as read");
        }

        if (canMark) {
            notification.setIsRead(true);
            notification.setReadAt(LocalDateTime.now());
            Notification saved = notificationRepository.save(notification);
            System.out.println("Notification " + notificationId + " marked as read successfully");
            return saved;
        }

        System.out.println("Access denied for user " + userId + " to notification " + notificationId);
        return null;
    }

    /**
     * Đánh dấu tất cả thông báo đã đọc
     * - CUSTOMER: Mark personal notifications của customer đó
     * - EMPLOYEE: Mark broadcast notifications cho EMPLOYEE role
     * - ADMIN: Mark broadcast notifications cho ADMIN + EMPLOYEE role
     */
    public void markAllAsRead(String userId) {

        // Xác định UserRole từ userId
        UserRole userRole = determineUserRole(userId);

        if (userRole == null) {
            return;
        }

        System.out.println("📧 User Role: " + userRole);

        List<Notification> notificationsToMarkAsRead = new java.util.ArrayList<>();

        // CASE 1: CUSTOMER - Chỉ mark personal notifications
        if (userRole == UserRole.CUSTOMER) {
            List<Notification> personalNotifications =
                    notificationRepository.findByToUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);

            notificationsToMarkAsRead.addAll(personalNotifications);
        }

        // CASE 2: EMPLOYEE - Mark broadcast notifications cho EMPLOYEE
        else if (userRole == UserRole.EMPLOYEE) {
            List<Notification> broadcastNotifications =
                    notificationRepository.findByToUserIdIsNullAndToUserTypeAndIsReadFalseOrderByCreatedAtDesc(UserRole.EMPLOYEE);

            notificationsToMarkAsRead.addAll(broadcastNotifications);

        }

        // CASE 3: ADMIN - Mark broadcast cho ADMIN + EMPLOYEE
        else if (userRole == UserRole.ADMIN) {
            List<Notification> adminBroadcast =
                    notificationRepository.findByToUserIdIsNullAndToUserTypeAndIsReadFalseOrderByCreatedAtDesc(UserRole.ADMIN);

            List<Notification> employeeBroadcast =
                    notificationRepository.findByToUserIdIsNullAndToUserTypeAndIsReadFalseOrderByCreatedAtDesc(UserRole.EMPLOYEE);

            notificationsToMarkAsRead.addAll(adminBroadcast);
            notificationsToMarkAsRead.addAll(employeeBroadcast);
        }

        // Mark all as read
        if (notificationsToMarkAsRead.isEmpty()) {
            return;
        }

        LocalDateTime now = LocalDateTime.now();
        for (Notification notification : notificationsToMarkAsRead) {
            notification.setIsRead(true);
            notification.setReadAt(now);
        }

        notificationRepository.saveAll(notificationsToMarkAsRead);
    }

    /**
     * Xác định UserRole từ userId
     * Kiểm tra trong CustomerRepository và EmployeeRepository
     */
    private UserRole determineUserRole(String userId) {
        // Kiểm tra Customer
        Optional<Customer> customerOpt = customerRepository.findById(userId);
        if (customerOpt.isPresent()) {
            return customerOpt.get().getUserRole();
        }

        // Kiểm tra Employee
        Optional<Employee> employeeOpt = employeeRepository.findById(userId);
        if (employeeOpt.isPresent()) {
            return employeeOpt.get().getUserRole();
        }

        return null;
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
    /**
     * Mark notification as read - với userRole để hỗ trợ broadcast notifications
     */
    public Notification markAsRead(String notificationId, String userId, String userRole) {
        Optional<Notification> notificationOpt = notificationRepository.findById(notificationId);

        if (!notificationOpt.isPresent()) {
            System.out.println("Notification not found: " + notificationId);
            return null;
        }

        Notification notification = notificationOpt.get();
        boolean hasAccess = false;

        // Case 1: Personal notification
        if (userId != null && userId.equals(notification.getToUserId())) {
            hasAccess = true;
        }

        // Case 2: Broadcast notification (toUserId = null, có toUserType)
        if (notification.getToUserId() == null && notification.getToUserType() != null) {
            String notifType = notification.getToUserType().toString();
            if (notifType.contains(userRole) || userRole.equals("ADMIN")) {
                hasAccess = true;
            }
        }

        // Case 3: Multi-recipient
        if (notification.getToUserIds() != null && notification.getToUserIds().contains(userId)) {
            hasAccess = true;
        }

        if (hasAccess) {
            notification.setIsRead(true);
            notification.setReadAt(java.time.LocalDateTime.now());
            return notificationRepository.save(notification);
        }

        return null;
    }


}
