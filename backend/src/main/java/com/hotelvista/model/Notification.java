// java
package com.hotelvista.model;

import com.hotelvista.model.enums.*;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;

    @Enumerated(EnumType.STRING)
    private NotificationType type;
    
    @Enumerated(EnumType.STRING)
    private NotificationCategory category;
    
    private String title;
    private String message;

    private String fromUserId;
    private String fromUserName;
    
    @Enumerated(EnumType.STRING)
    private UserRole fromUserType;

    private String toUserId;
    private List<String> toUserIds;
    
    @Enumerated(EnumType.STRING)
    private UserRole toUserType;

    @Enumerated(EnumType.STRING)
    private NotificationStatus status;
    
    @Enumerated(EnumType.STRING)
    private NotificationPriority priority;

    private Boolean needsAction;

    private Boolean isRead = false;
    private LocalDateTime readAt;

    private Boolean isRealtime = true;
    private LocalDateTime deliveredAt;
    private String channel;

    private String dataJson;

    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
