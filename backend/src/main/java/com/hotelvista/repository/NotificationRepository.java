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

    Page<Notification> findByToUserTypeInOrderByDeliveredAtDesc(
            List<UserRole> roles,
            Pageable pageable
    );

    Page<Notification> findByToUserIdOrderByDeliveredAtDesc(String toUserId, Pageable pageable);

    Page<Notification> findByToUserTypeOrderByDeliveredAtDesc(UserRole toUserType, Pageable pageable);

    // Tìm thông báo chưa đọc
    List<Notification> findByToUserIdAndIsReadFalseOrderByCreatedAtDesc(String toUserId);

    // Đếm thông báo chưa đọc của user
    long countByToUserIdAndIsReadFalse(String toUserId);

    // Tìm thông báo realtime chưa được gửi
    @Query("{'isRealtime': true, 'deliveredAt': null, 'status': {'$ne': 'FAILED'}}")
    List<Notification> findPendingRealtimeNotifications();

    /**
     * Tìm broadcast notifications chưa đọc theo UserRole
     */
    List<Notification> findByToUserIdIsNullAndToUserTypeAndIsReadFalse(UserRole toUserType);

    /**
     * Tìm broadcast notifications chưa đọc theo UserRole
     * (toUserId = null, toUserType = role, isRead = false)
     */
    List<Notification> findByToUserIdIsNullAndToUserTypeAndIsReadFalseOrderByCreatedAtDesc(UserRole toUserType);
}
