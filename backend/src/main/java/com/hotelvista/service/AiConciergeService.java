package com.hotelvista.service;

import com.hotelvista.dto.aichat.ChatHistoryDTO;
import com.hotelvista.dto.aichat.MessageDTO;
import com.hotelvista.model.*;
import com.hotelvista.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class AiConciergeService {

    private final GeminiService geminiService;
    private final ConversationMemory conversationMemory;
    private final RoomTypeRepository roomTypeRepository;

    @Autowired
    private ChatSessionRepository chatSessionRepository;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private AiConversationHistoryRepository conversationHistoryRepository;

    @Autowired
    private UserService userService;

    @Autowired
    public AiConciergeService(GeminiService geminiService,
                              ConversationMemory conversationMemory,
                              RoomTypeRepository roomTypeRepository) {
        this.geminiService = geminiService;
        this.conversationMemory = conversationMemory;
        this.roomTypeRepository = roomTypeRepository;
    }

    public String getChatResponse(String userId, String message) {
        try {
            AiConversationHistory history = getOrCreateConversationHistory(userId);

            List<String> historyMessages = conversationMemory.get(userId);
            String context = getRelevantContext(message);
            String prompt = buildPrompt(userId, message, context, historyMessages);

            String response = geminiService.generateResponse(prompt);

            conversationMemory.add(userId, "User: " + message);
            conversationMemory.add(userId, "Assistant: " + response);

            saveConversationToMongoDB(userId, history, message, response);

            saveToChatSession(userId, message, response);

            if (shouldHandoffToStaff(message, response)) {
                createStaffHandoffSession(userId, message, response);
            }

            return response;

        } catch (Exception e) {
            log.error("Error processing chat for user {}: {}", userId, e.getMessage(), e);
            return "Sorry, I'm having trouble processing your request. Please try again.";
        }
    }

    public String startNewChatSession(String userId) {
        try {
            String sessionId = UUID.randomUUID().toString();

            AiConversationHistory newHistory = new AiConversationHistory();
            newHistory.setUserId(userId);
            newHistory.setSessionId(sessionId);
            newHistory.setHistory(new ArrayList<>());
            newHistory.setCreatedAt(LocalDateTime.now());
            newHistory.setLastUpdated(LocalDateTime.now());

            newHistory.addEntry("assistant", "Hello! I'm Vista's AI concierge. How can I assist you today?");

            conversationHistoryRepository.save(newHistory);

            conversationMemory.clear(userId);

            log.info("Created new chat session {} for user {}", sessionId, userId);
            return sessionId;

        } catch (Exception e) {
            log.error("Error starting new chat session: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to start new chat session", e);
        }
    }

    public List<ChatHistoryDTO> getUserChatHistory(String userId) {
        try {
            List<AiConversationHistory> histories =
                    conversationHistoryRepository.findByUserIdOrderByLastUpdatedDesc(userId);

            return histories.stream()
                    .map(history -> {
                        String title = generateChatTitle(history);
                        String lastMsg = getLastMessage(history);

                        return new ChatHistoryDTO(
                                history.getSessionId(),
                                title,
                                lastMsg,
                                history.getLastUpdated(),
                                history.getHistory().size()
                        );
                    })
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Error getting chat history for user {}: {}", userId, e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    public List<MessageDTO> getSessionMessages(String userId, String sessionId) {
        try {
            Optional<AiConversationHistory> historyOpt =
                    conversationHistoryRepository.findByUserIdAndSessionId(userId, sessionId);

            if (historyOpt.isEmpty()) {
                log.warn("No session found for user {} and session {}", userId, sessionId);
                return Collections.emptyList();
            }

            AiConversationHistory history = historyOpt.get();

            return history.getHistory().stream()
                    .map(entry -> {
                        boolean showCards = shouldShowRoomCards(entry.getContent());
                        return new MessageDTO(
                                entry.getRole(),
                                entry.getContent(),
                                entry.getTimestamp(),
                                showCards
                        );
                    })
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("Error getting session messages: {}", e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    public void deleteChatSession(String userId, String sessionId) {
        try {
            conversationHistoryRepository.deleteByUserIdAndSessionId(userId, sessionId);
            log.info("Deleted chat session {} for user {}", sessionId, userId);

        } catch (Exception e) {
            log.error("Error deleting session {}: {}", sessionId, e.getMessage(), e);
            throw new RuntimeException("Failed to delete chat session", e);
        }
    }

    private String generateChatTitle(AiConversationHistory history) {
        if (history.getHistory() == null || history.getHistory().isEmpty()) {
            return "New conversation";
        }

        Optional<AiConversationHistory.ConversationEntry> firstUserMsg =
                history.getHistory().stream()
                        .filter(msg -> "user".equals(msg.getRole()))
                        .findFirst();

        if (firstUserMsg.isPresent()) {
            String content = firstUserMsg.get().getContent();
            if (content != null && content.length() > 40) {
                return content.substring(0, 40) + "...";
            }
            return content != null ? content : "New conversation";
        }

        return "New conversation";
    }

    private String getLastMessage(AiConversationHistory history) {
        if (history.getHistory() == null || history.getHistory().isEmpty()) {
            return "";
        }

        AiConversationHistory.ConversationEntry lastMsg =
                history.getHistory().get(history.getHistory().size() - 1);

        return lastMsg.getContent() != null ? lastMsg.getContent() : "";
    }

    private AiConversationHistory getOrCreateConversationHistory(String userId) {
        return conversationHistoryRepository
                .findTopByUserIdOrderByLastUpdatedDesc(userId)
                .orElseGet(() -> {
                    // Auto-create new session if none exists
                    String sessionId = UUID.randomUUID().toString();

                    AiConversationHistory newHistory = new AiConversationHistory();
                    newHistory.setUserId(userId);
                    newHistory.setSessionId(sessionId);
                    newHistory.setHistory(new ArrayList<>());
                    newHistory.setCreatedAt(LocalDateTime.now());
                    newHistory.setLastUpdated(LocalDateTime.now());

                    log.info("Auto-created new session {} for user {}", sessionId, userId);
                    return newHistory;
                });
    }

    private void saveConversationToMongoDB(String userId, AiConversationHistory history,
                                           String userMessage, String aiResponse) {
        try {
            // Add user message using helper method
            history.addEntry("user", userMessage);

            // Add AI response using helper method
            history.addEntry("assistant", aiResponse);

            // Update lastUpdated
            history.setLastUpdated(LocalDateTime.now());

            conversationHistoryRepository.save(history);

            log.debug("Saved conversation to MongoDB for user: {} in session: {}",
                    userId, history.getSessionId());

        } catch (Exception e) {
            log.error("Error saving conversation to MongoDB: {}", e.getMessage(), e);
        }
    }

    private void saveToChatSession(String userId, String userMessage, String aiResponse) {
        try {
            ChatSession session = chatSessionRepository.findByCustomer_Id(userId)
                    .stream()
                    .filter(s -> s.getStatus() != ChatSession.ChatStatus.RESOLVED)
                    .findFirst()
                    .orElseGet(() -> createNewChatSession(userId));

            // Save user message
            ChatMessage userMsg = new ChatMessage();
            userMsg.setSessionId(session.getSessionId());
            userMsg.setSenderId(userId);
            userMsg.setSenderType(ChatMessage.SenderType.CUSTOMER);
            userMsg.setContent(userMessage);
            userMsg.setTimestamp(LocalDateTime.now());
            userMsg.setRead(true);
            chatMessageRepository.save(userMsg);

            // Save AI response
            ChatMessage aiMsg = new ChatMessage();
            aiMsg.setSessionId(session.getSessionId());
            aiMsg.setSenderId("AI");
            aiMsg.setSenderType(ChatMessage.SenderType.AI);
            aiMsg.setContent(aiResponse);
            aiMsg.setTimestamp(LocalDateTime.now());
            aiMsg.setRead(false);
            aiMsg.setShowRoomCards(shouldShowRoomCards(userMessage));
            chatMessageRepository.save(aiMsg);

            // Update session
            session.setLastMessage(aiResponse);
            session.setLastMessageTime(LocalDateTime.now());
            session.setUpdatedAt(LocalDateTime.now());

            // Add to conversation context
            if (session.getConversationContext() == null) {
                session.setConversationContext(new ArrayList<>());
            }
            session.getConversationContext().add(userMessage);
            if (session.getConversationContext().size() > 20) {
                session.getConversationContext().remove(0);
            }

            chatSessionRepository.save(session);

            log.debug("Saved chat to session for user: {}", userId);

        } catch (Exception e) {
            log.error("Error saving chat to session: {}", e.getMessage(), e);
        }
    }

    private ChatSession createNewChatSession(String userId) {
        ChatSession session = new ChatSession();
        session.setSessionId(UUID.randomUUID().toString());

        userService.findById(userId).ifPresentOrElse(
                user -> {
                    ChatSession.CustomerInfo customer = new ChatSession.CustomerInfo();
                    customer.setId(userId);
                    customer.setFullName(user.getFullName());
                    customer.setEmail(user.getEmail());
                    customer.setAvatar(user.getAvatarUrl());
                    session.setCustomer(customer);
                },
                () -> {
                    ChatSession.CustomerInfo customer = new ChatSession.CustomerInfo();
                    customer.setId(userId);
                    customer.setFullName("Guest User");
                    customer.setEmail("guest@example.com");
                    session.setCustomer(customer);
                }
        );

        session.setStatus(ChatSession.ChatStatus.WAITING);
        session.setPriority(ChatSession.Priority.MEDIUM);
        session.setUnreadCount(0);
        session.setCreatedAt(LocalDateTime.now());
        session.setUpdatedAt(LocalDateTime.now());
        session.setConversationContext(new ArrayList<>());

        return chatSessionRepository.save(session);
    }

    private boolean shouldHandoffToStaff(String userMessage, String aiResponse) {
        String lowerMessage = userMessage.toLowerCase();
        String lowerResponse = aiResponse.toLowerCase();

        boolean hasComplexRequest = lowerMessage.contains("accessibility") ||
                lowerMessage.contains("wheelchair") ||
                lowerMessage.contains("special needs") ||
                lowerMessage.contains("disability") ||
                lowerMessage.contains("complaint") ||
                lowerMessage.contains("problem") ||
                lowerMessage.contains("issue") ||
                lowerMessage.contains("manager") ||
                lowerMessage.contains("speak to someone") ||
                lowerMessage.contains("talk to staff") ||
                lowerMessage.contains("human");

        boolean aiSuggestsHandoff = lowerResponse.contains("connect you with") ||
                lowerResponse.contains("staff member") ||
                lowerResponse.contains("team can assist") ||
                lowerResponse.contains("transfer you to");

        return hasComplexRequest || aiSuggestsHandoff;
    }

    private void createStaffHandoffSession(String userId, String userMessage, String aiResponse) {
        try {
            ChatSession session = chatSessionRepository.findByCustomer_Id(userId)
                    .stream()
                    .filter(s -> s.getStatus() == ChatSession.ChatStatus.WAITING)
                    .findFirst()
                    .orElseGet(() -> createNewChatSession(userId));

            session.setStatus(ChatSession.ChatStatus.WAITING);
            session.setPriority(ChatSession.Priority.HIGH);
            session.setAiHandoffReason(determineHandoffReason(userMessage));
            session.setUnreadCount(session.getUnreadCount() + 1);
            session.setUpdatedAt(LocalDateTime.now());

            chatSessionRepository.save(session);

            ChatMessage handoffMsg = new ChatMessage();
            handoffMsg.setSessionId(session.getSessionId());
            handoffMsg.setSenderId("SYSTEM");
            handoffMsg.setSenderType(ChatMessage.SenderType.AI);
            handoffMsg.setContent("This conversation has been flagged for staff assistance. A team member will be with you shortly.");
            handoffMsg.setTimestamp(LocalDateTime.now());
            handoffMsg.setRead(false);
            chatMessageRepository.save(handoffMsg);

            log.info("Created staff handoff session for user: {} - Reason: {}",
                    userId, session.getAiHandoffReason());

        } catch (Exception e) {
            log.error("Error creating staff handoff: {}", e.getMessage(), e);
        }
    }

    private String determineHandoffReason(String userMessage) {
        String lower = userMessage.toLowerCase();

        if (lower.contains("accessibility") || lower.contains("wheelchair") || lower.contains("disability")) {
            return "Accessibility requirements";
        } else if (lower.contains("cancel")) {
            return "Cancellation inquiry";
        } else if (lower.contains("complaint") || lower.contains("problem") || lower.contains("issue")) {
            return "Customer concern";
        } else if (lower.contains("special") || lower.contains("custom")) {
            return "Special request";
        } else if (lower.contains("manager") || lower.contains("supervisor")) {
            return "Management request";
        }

        return "Complex inquiry requiring staff assistance";
    }

    private String getRelevantContext(String query) {
        StringBuilder context = new StringBuilder();

        String lowerQuery = query.toLowerCase();

        if (lowerQuery.contains("room") ||
                lowerQuery.contains("book") ||
                lowerQuery.contains("suite") ||
                lowerQuery.contains("accommodation") ||
                lowerQuery.contains("available")) {

            try {
                List<RoomType> roomTypes = roomTypeRepository.findAll();
                context.append("AVAILABLE ROOM TYPES:\n\n");

                for (RoomType roomType : roomTypes) {
                    context.append("- ").append(roomType.getTypeName()).append("\n");
                    context.append("  ID: ").append(roomType.getRoomTypeID()).append("\n");

                    if (roomType.getArea() != null) {
                        context.append("  Size: ").append(roomType.getArea()).append("m²\n");
                    }

                    if (roomType.getMaxOccupancy() != null) {
                        context.append("  Capacity: ").append(roomType.getMaxOccupancy()).append(" guests\n");
                    }

                    if (roomType.getBasePrice() != null) {
                        context.append("  Price: ").append(String.format("%,.0f", roomType.getBasePrice())).append(" VND per night\n");
                    }

                    if (roomType.getDescription() != null && !roomType.getDescription().isEmpty()) {
                        context.append("  Description: ").append(roomType.getDescription()).append("\n");
                    }

                    if (roomType.getRooms() != null && !roomType.getRooms().isEmpty()) {
                        long availableRooms = roomType.getRooms().stream()
                                .filter(room -> room.getStatus() != null &&
                                        "AVAILABLE".equalsIgnoreCase(room.getStatus().toString()))
                                .count();
                        context.append("  Available rooms: ").append(availableRooms).append("\n");
                    }

                    context.append("\n");
                }

            } catch (Exception e) {
                log.error("Error fetching room types: {}", e.getMessage(), e);
            }
        }

        context.append("\nHOTEL AMENITIES:\n");
        context.append("- High-speed WiFi throughout the hotel\n");
        context.append("- 55-inch Smart TVs in all rooms\n");
        context.append("- Nespresso coffee machines\n");
        context.append("- Premium toiletries and bathrobes\n");
        context.append("- 24/7 room service\n");
        context.append("- Rooftop infinity pool\n");
        context.append("- Full-service spa and wellness center\n");
        context.append("- State-of-the-art fitness center\n");
        context.append("- Multiple dining options\n");
        context.append("- Business center and meeting rooms\n\n");

        context.append("SERVICES:\n");
        context.append("- Airport shuttle service (500,000 VND)\n");
        context.append("- Laundry and dry cleaning\n");
        context.append("- Babysitting services\n");
        context.append("- Tour and activity booking\n");
        context.append("- Restaurant reservations\n");
        context.append("- Concierge assistance\n\n");

        context.append("POLICIES:\n");
        context.append("- Check-in: 2:00 PM | Check-out: 12:00 PM\n");
        context.append("- Cancellation: Free up to 48 hours before arrival\n");
        context.append("- Late cancellation fee: One night's charge\n");
        context.append("- Pets: Not allowed\n");
        context.append("- Smoking: Designated areas only\n");

        return context.toString();
    }

    private String buildPrompt(String userId, String userMessage, String context, List<String> history) {
        StringBuilder prompt = new StringBuilder();

        prompt.append("You are Vista Hotel's AI Concierge - professional, friendly, and knowledgeable.\n\n");

        prompt.append("=== SYSTEM CONTEXT ===\n");
        prompt.append("Current User ID: ").append(userId).append("\n");
        prompt.append("Current Date: ").append(LocalDate.now()).append("\n");
        prompt.append("======================\n\n");

        prompt.append("=== CORE RULES ===\n");
        prompt.append("1. ALWAYS respond in a friendly, professional manner\n");
        prompt.append("2. NEVER use markdown formatting (**, *, #, etc.)\n");
        prompt.append("3. Use simple formatting: CAPS for emphasis, numbered lists, line breaks\n");
        prompt.append("4. Keep responses concise but informative (max 200 words)\n");
        prompt.append("5. Always mention prices in VND\n");
        prompt.append("6. Be proactive in offering assistance\n");
        prompt.append("7. If request is complex (accessibility, complaints, special needs), suggest connecting with staff\n\n");

        if (!history.isEmpty()) {
            prompt.append("=== CONVERSATION HISTORY ===\n");
            int startIndex = Math.max(0, history.size() - 6);
            for (int i = startIndex; i < history.size(); i++) {
                prompt.append(history.get(i)).append("\n");
            }
            prompt.append("\n");
        }

        prompt.append("=== HOTEL INFORMATION ===\n");
        prompt.append(context).append("\n");

        prompt.append("=== RESPONSE GUIDELINES ===\n");
        prompt.append("A. ROOM INQUIRY: List room types with features and prices\n");
        prompt.append("B. BOOKING REQUEST: Ask for check-in/out dates and guest count\n");
        prompt.append("C. AMENITIES: Detail specific amenities and services\n");
        prompt.append("D. POLICIES: Clearly state relevant policies\n");
        prompt.append("E. COMPLEX REQUESTS: Politely offer to connect with staff\n");
        prompt.append("F. GENERAL: Provide helpful information and offer booking assistance\n\n");

        prompt.append("=== USER'S QUESTION ===\n");
        prompt.append(userMessage).append("\n\n");

        prompt.append("YOUR RESPONSE (friendly, concise, helpful):\n");

        return prompt.toString();
    }

    public boolean shouldShowRoomCards(String message) {
        if (message == null) return false;

        String lowerMessage = message.toLowerCase();
        return lowerMessage.contains("room") ||
                lowerMessage.contains("book") ||
                lowerMessage.contains("available") ||
                lowerMessage.contains("suite") ||
                lowerMessage.contains("accommodation");
    }

    public void clearConversationHistory(String userId) {
        try {
            // Clear memory
            conversationMemory.clear(userId);

            // Delete all sessions for user
            List<AiConversationHistory> histories =
                    conversationHistoryRepository.findByUserIdOrderByLastUpdatedDesc(userId);

            histories.forEach(history ->
                    conversationHistoryRepository.deleteByUserIdAndSessionId(
                            userId,
                            history.getSessionId()
                    )
            );

            log.info("Cleared all conversation history for user: {}", userId);
        } catch (Exception e) {
            log.error("Error clearing conversation history: {}", e.getMessage(), e);
        }
    }
}