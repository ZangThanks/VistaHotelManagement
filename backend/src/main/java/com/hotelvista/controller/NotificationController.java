package com.hotelvista.controller;

import com.hotelvista.dto.ApiResponse;
import com.hotelvista.model.Notification;
import com.hotelvista.model.enums.UserRole;
import com.hotelvista.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    /**
     * Lấy danh sách thông báo của user hiện tại
     */
    @GetMapping
    public ResponseEntity<ApiResponse> getMyNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Principal principal) {

        if (principal == null) {
            return ResponseEntity.ok(new ApiResponse(true, "Chào mừng bạn đến với Vista Hotel", null));
        }

        String userId = principal.getName();

        // ============ FIX ROLE PARSING ============
        String rawRole = SecurityContextHolder.getContext()
                .getAuthentication()
                .getAuthorities()
                .stream()
                .findFirst()
                .map(a -> a.getAuthority())
                .orElse("CUSTOMER");

        System.out.println("RAW ROLE = " + rawRole);

        UserRole userRole;

        try {
            // Case 1: chuẩn ROLE_EMPLOYEE
            if (rawRole.startsWith("ROLE_")) {
                userRole = UserRole.valueOf(rawRole.replace("ROLE_", ""));
            }
            // Case 2: dạng "UserRole.EMPLOYEE(role=Employee)"
            else if (rawRole.contains("EMPLOYEE")) {
                userRole = UserRole.EMPLOYEE;
            } else if (rawRole.contains("ADMIN")) {
                userRole = UserRole.ADMIN;
            } else {
                userRole = UserRole.CUSTOMER;
            }
        } catch (Exception e) {
            userRole = UserRole.CUSTOMER;
        }

        Pageable pageable = PageRequest.of(page, size);

        Page<Notification> notifications =
                notificationService.getNotificationsForUser(userId, userRole, pageable);

        return ResponseEntity.ok(
                new ApiResponse(true, "Notifications retrieved successfully", notifications)
        );
    }



    /**
     * Lấy thông báo chưa đọc
     */
    @GetMapping("/unread")
    public ResponseEntity<ApiResponse> getUnreadNotifications(Principal principal) {
        if (principal == null) {
            return ResponseEntity.ok(new ApiResponse(true, "Chào mừng bạn đến với Vista Hotel", null));
        }

        List<Notification> notifications = notificationService.getUnreadNotifications(principal.getName());

        return ResponseEntity.ok(new ApiResponse(true, "Unread notifications retrieved successfully", notifications));
    }

    /**
     * Đếm số thông báo chưa đọc
     */
    @GetMapping("/unread/count")
    public ResponseEntity<ApiResponse> getUnreadCount(Principal principal) {
        if (principal == null) {
            return ResponseEntity.ok(new ApiResponse(true, "Chào mừng bạn đến với Vista Hotel", 0));
        }

        long count = notificationService.countUnreadNotifications(principal.getName());

        return ResponseEntity.ok(new ApiResponse(true, "Unread count retrieved successfully", count));
    }

    /**
     * Đánh dấu thông báo đã đọc
     */
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<ApiResponse> markAsRead(
            @PathVariable String notificationId,
            Principal principal) {

        if (principal == null) {
            return ResponseEntity.ok(new ApiResponse(true, "Chào mừng bạn đến với Vista Hotel", null));
        }

        Notification notification = notificationService.markAsRead(notificationId, principal.getName());

        return ResponseEntity.ok(new ApiResponse(true, "Notification marked as read", notification));
    }

    /**
     * Đánh dấu tất cả thông báo đã đọc
     */
    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse> markAllAsRead(Principal principal) {
        if (principal == null) {
            return ResponseEntity.ok(new ApiResponse(true, "Chào mừng bạn đến với Vista Hotel", null));
        }

        notificationService.markAllAsRead(principal.getName());

        return ResponseEntity.ok(new ApiResponse(true, "All notifications marked as read", null));
    }

    /**
     * Xóa thông báo
     */
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<ApiResponse> deleteNotification(
            @PathVariable String notificationId,
            Principal principal) {

        if (principal == null) {
            return ResponseEntity.ok(new ApiResponse(true, "Chào mừng bạn đến với Vista Hotel", null));
        }

        notificationService.deleteNotification(notificationId, principal.getName());

        return ResponseEntity.ok(new ApiResponse(true, "Notification deleted successfully", null));
    }

    /**
     * Tạo thông báo mới (Admin only)
     */
    @PostMapping
    public ResponseEntity<ApiResponse> createNotification(@RequestBody Notification notification) {
        Notification createdNotification = notificationService.createAndSendNotification(notification);

        return ResponseEntity.ok(new ApiResponse(true, "Notification created and sent", createdNotification));
    }

    /**
     * Xử lý khi client subscribe để nhận thông báo realtime
     */
    @MessageMapping("/notifications.subscribe")
    @SendToUser("/queue/notifications")
    public String subscribeToNotifications(@Payload String userId, Principal principal) {
        if (principal == null) {
            return "Chào mừng bạn đến với Vista Hotel";
        }
        // Có thể thêm logic xác thực ở đây
        return "Subscribed to notifications for user: " + principal.getName();
    }

    /**
     * Xử lý khi client đánh dấu thông báo đã đọc qua WebSocket
     */
    @MessageMapping("/notifications.markRead")
    public void markNotificationAsRead(@Payload String notificationId, Principal principal) {
        if (principal == null) {
            return;
        }
        notificationService.markAsRead(notificationId, principal.getName());
    }
}
