package com.hotelvista.controller;

import com.hotelvista.dto.aichat.AiChatRequest;
import com.hotelvista.dto.aichat.AiChatResponse;
import com.hotelvista.dto.aichat.ChatHistoryDTO;
import com.hotelvista.dto.aichat.MessageDTO;
import com.hotelvista.model.AiConversationHistory;
import com.hotelvista.service.AiConciergeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/ai")
public class AiController {

    @Autowired
    private AiConciergeService aiConciergeService;

    @PostMapping("/chat")
    public ResponseEntity<AiChatResponse> chat(@RequestBody AiChatRequest request) {
        try {
            String response = aiConciergeService.getChatResponse(
                    request.getUserId(),
                    request.getMessage()
            );
            boolean showCards = aiConciergeService.shouldShowRoomCards(request.getMessage());

            return ResponseEntity.ok(new AiChatResponse(response, showCards));

        } catch (Exception e) {
            log.error("Error in chat endpoint: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(new AiChatResponse(
                            "Sorry, I'm having trouble processing your request. Please try again.",
                            false
                    ));
        }
    }

    @PostMapping("/chat/new")
    public ResponseEntity<Map<String, String>> newChat(@RequestParam String userId) {
        try {
            log.info("Starting new chat for user: {}", userId);
            String sessionId = aiConciergeService.startNewChatSession(userId);

            return ResponseEntity.ok(Map.of("sessionId", sessionId));

        } catch (Exception e) {
            log.error("Error starting new chat for user {}: {}", userId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/chat/history/{userId}")
    public ResponseEntity<List<ChatHistoryDTO>> getUserChatHistory(@PathVariable String userId) {
        try {
            log.info("Fetching chat history for user: {}", userId);
            List<ChatHistoryDTO> histories = aiConciergeService.getUserChatHistory(userId);

            return ResponseEntity.ok(histories);

        } catch (Exception e) {
            log.error("Error fetching chat history for user {}: {}", userId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/chat/session/{sessionId}/messages")
    public ResponseEntity<List<MessageDTO>> getSessionMessages(
            @PathVariable String sessionId,
            @RequestParam String userId) {
        try {
            log.info("Fetching messages for session {} and user {}", sessionId, userId);
            List<MessageDTO> messages = aiConciergeService.getSessionMessages(userId, sessionId);

            if (messages == null || messages.isEmpty()) {
                log.warn("No messages found for session {} and user {}", sessionId, userId);
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(messages);

        } catch (Exception e) {
            log.error("Error fetching session messages: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/chat/session/{sessionId}")
    public ResponseEntity<Void> deleteChatSession(
            @PathVariable String sessionId,
            @RequestParam String userId) {
        try {
            log.info("Deleting chat session {} for user {}", sessionId, userId);
            aiConciergeService.deleteChatSession(userId, sessionId);

            return ResponseEntity.ok().build();

        } catch (Exception e) {
            log.error("Error deleting session {}: {}", sessionId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Vista Hotel AI Concierge is running!");
    }
}