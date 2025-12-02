package com.hotelvista.controller;

import com.hotelvista.dto.chat.ChatMessageDTO;
import com.hotelvista.dto.chat.ChatSessionDTO;
import com.hotelvista.dto.chat.SendMessageRequest;
import com.hotelvista.service.ChatSupportService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/chat-support")
public class ChatSupportController {

    @Autowired
    private ChatSupportService chatSupportService;

    @GetMapping("/staff/{staffId}/chats")
    public ResponseEntity<List<ChatSessionDTO>> getStaffChats(@PathVariable String staffId) {
        try {
            List<ChatSessionDTO> chats = chatSupportService.getStaffChats(staffId);
            return ResponseEntity.ok(chats);
        } catch (Exception e) {
            log.error("Error getting staff chats: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/pending")
    public ResponseEntity<List<ChatSessionDTO>> getPendingChats() {
        try {
            List<ChatSessionDTO> chats = chatSupportService.getAllPendingChats();
            return ResponseEntity.ok(chats);
        } catch (Exception e) {
            log.error("Error getting pending chats: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/chats/{sessionId}/messages")
    public ResponseEntity<List<ChatMessageDTO>> getChatMessages(@PathVariable String sessionId) {
        try {
            List<ChatMessageDTO> messages = chatSupportService.getChatMessages(sessionId);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            log.error("Error getting chat messages: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/chats/{sessionId}/messages")
    public ResponseEntity<ChatMessageDTO> sendMessage(
            @PathVariable String sessionId,
            @RequestBody SendMessageRequest request) {
        try {
            ChatMessageDTO message = chatSupportService.sendStaffMessage(
                    sessionId,
                    request.getContent(),
                    request.getStaffId()
            );
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            log.error("Error sending message: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/chats/{sessionId}/assign")
    public ResponseEntity<Void> assignChat(
            @PathVariable String sessionId,
            @RequestBody Map<String, String> request) {
        try {
            String staffId = request.get("staffId");
            String staffName = request.get("staffName");
            chatSupportService.assignChatToStaff(sessionId, staffId, staffName);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error assigning chat: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PatchMapping("/chats/{sessionId}/resolve")
    public ResponseEntity<Void> resolveChat(@PathVariable String sessionId) {
        try {
            chatSupportService.markChatAsResolved(sessionId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error resolving chat: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/customers/{customerId}/history")
    public ResponseEntity<List<ChatMessageDTO>> getChatHistory(@PathVariable String customerId) {
        try {
            List<ChatMessageDTO> history = chatSupportService.getChatHistory(customerId);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            log.error("Error getting chat history: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
