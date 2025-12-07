package com.hotelvista.repository;

import com.hotelvista.model.Notification;
import com.hotelvista.model.enums.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {

    // Tìm thông báo theo người nhận
    List<Notification> findByToUserIdOrderByCreatedAtDesc(String toUserId);

    // Tìm thông báo chưa đọc
    List<Notification> findByToUserIdAndIsReadFalseOrderByCreatedAtDesc(String toUserId);

    // Tìm thông báo theo loại người dùng
    List<Notification> findByToUserTypeOrderByCreatedAtDesc(UserRole toUserType);

    // Tìm thông báo theo status
    List<Notification> findByStatusOrderByCreatedAtDesc(NotificationStatus status);

    // Tìm thông báo có thể broadcast (toUserIds chứa userId hoặc toUserId = userId)
    @Query("{'$or': [{'toUserId': ?0}, {'toUserIds': {'$in': [?0]}}]}")
    List<Notification> findNotificationsForUser(String userId);

    // Tìm thông báo chưa hết hạn
    List<Notification> findByExpiresAtAfterOrExpiresAtIsNullOrderByCreatedAtDesc(LocalDateTime now);
    List<Notification> findByExpiresAtBefore(LocalDateTime now);

    // Đếm thông báo chưa đọc của user
    long countByToUserIdAndIsReadFalse(String toUserId);

    // Phân trang thông báo của user
    Page<Notification> findByToUserIdOrderByCreatedAtDesc(String toUserId, Pageable pageable);

    // Tìm notification by ID và userId để đảm bảo security
    Optional<Notification> findByIdAndToUserId(String id, String toUserId);

    // Tìm thông báo realtime chưa được gửi
    @Query("{'isRealtime': true, 'deliveredAt': null, 'status': {'$ne': 'FAILED'}}")
    List<Notification> findPendingRealtimeNotifications();

    // Thống kê theo status
    long countByStatus(NotificationStatus status);

    // Thống kê theo type
    long countByType(NotificationType type);

    // Thống kê theo category
    long countByCategory(NotificationCategory category);

    // Thống kê theo thời gian
    long countByCreatedAtAfter(LocalDateTime date);
    Page<Notification> findByToUserIdOrToUserType(
            String toUserId,
            String toUserType,
            Pageable pageable
    );

    /**
     * FIX: Get unread notifications by userId OR userRole
     * Query: { $or: [ { toUserId: ?0 }, { toUserType: ?1 } ], isRead: false }
     */
    List<Notification> findByToUserIdOrToUserTypeAndIsReadFalse(
            String toUserId,
            String toUserType
    );

    /**
     * FIX: Count unread notifications by userId OR userRole
     * Query: COUNT WHERE { $or: [ { toUserId: ?0 }, { toUserType: ?1 } ], isRead: false }
     */
    long countByToUserIdOrToUserTypeAndIsReadFalse(
            String toUserId,
            String toUserType
    );

    // ============ Original methods (still useful for specific queries) ============

    /**
     * Get personal notifications only (toUserId specified)
     */
    Page<Notification> findByToUserId(String toUserId, Pageable pageable);

    /**
     * Get broadcast notifications only (toUserType specified)
     */
    Page<Notification> findByToUserType(String toUserType, Pageable pageable);

    /**
     * Get unread personal notifications
     */
    List<Notification> findByToUserIdAndIsReadFalse(String toUserId);

    /**
     * Find notifications by type
     */
    List<Notification> findByType(String type);

    // Complex filter method
    @Query("{'toUserId': ?0, " +
            "$and: [" +
            "{'$expr': {'$cond': [{'$ne': [?1, null]}, {'$eq': ['$status', ?1]}, true]}}, " +
            "{'$expr': {'$cond': [{'$ne': [?2, null]}, {'$eq': ['$category', ?2]}, true]}}, " +
            "{'$expr': {'$cond': [{'$ne': [?3, null]}, {'$eq': ['$isRead', ?3]}, true]}}" +
            "]}")
    Page<Notification> findByFilters(String userId,
                                     NotificationStatus status,
                                     NotificationCategory category,
                                     Boolean isRead,
                                     Pageable pageable);


}
