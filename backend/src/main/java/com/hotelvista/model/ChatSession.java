package com.hotelvista.model;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "chat_sessions")
public class ChatSession {

    @Id
    private String id;

    private String sessionId;

    private CustomerInfo customer;

    // Chat Status
    private ChatStatus status; // WAITING, ACTIVE, RESOLVED

    // Staff Assignment
    private StaffInfo assignedStaff;

    // Last Message Info
    private String lastMessage;
    private LocalDateTime lastMessageTime;

    // Metadata
    private int unreadCount;
    private Priority priority; // LOW, MEDIUM, HIGH
    private String aiHandoffReason;

    // AI Conversation Context
    private List<String> conversationContext; // For AI memory

    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;

    // Customer satisfaction
    private Integer rating; // 1-5 stars
    private String feedback;

    public enum ChatStatus {
        WAITING,
        ACTIVE,
        RESOLVED
    }

    public enum Priority {
        LOW,
        MEDIUM,
        HIGH
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CustomerInfo {
        private String id;
        private String fullName;
        private String email;
        private String avatar;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class StaffInfo {
        private String id;
        private String fullName;
        private String email;
    }
}