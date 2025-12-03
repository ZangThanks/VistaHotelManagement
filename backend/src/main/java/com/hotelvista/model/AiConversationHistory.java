package com.hotelvista.model;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "ai_conversation_history")
public class AiConversationHistory {

    @Id
    private String id;

    private String userId;
    private String sessionId;

    private List<ConversationEntry> history;

    private LocalDateTime createdAt;
    private LocalDateTime lastUpdated;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ConversationEntry {
        private String role; // "user" or "assistant"
        private String content;
        private LocalDateTime timestamp;
    }

    public void addEntry(String role, String content) {
        if (this.history == null) {
            this.history = new ArrayList<>();
        }
        this.history.add(new ConversationEntry(role, content, LocalDateTime.now()));
        this.lastUpdated = LocalDateTime.now();
    }
}