package com.hotelvista.service;

import com.hotelvista.dto.chat.ChatMessageDTO;
import com.hotelvista.dto.chat.ChatSessionDTO;
import com.hotelvista.model.ChatMessage;
import com.hotelvista.model.ChatSession;
import com.hotelvista.repository.ChatMessageRepository;
import com.hotelvista.repository.ChatSessionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ChatSupportService {

    @Autowired
    private ChatSessionRepository chatSessionRepository;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    public List<ChatSessionDTO> getStaffChats(String staffId) {
        List<ChatSession> sessions = chatSessionRepository
                .findByAssignedStaff_IdAndStatus(staffId, ChatSession.ChatStatus.ACTIVE);

        return sessions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ChatSessionDTO> getAllPendingChats() {
        List<ChatSession> sessions = chatSessionRepository
                .findByStatusOrderByLastMessageTimeDesc(ChatSession.ChatStatus.WAITING);

        return sessions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<ChatMessageDTO> getChatMessages(String sessionId) {
        List<ChatMessage> messages = chatMessageRepository
                .findBySessionIdOrderByTimestampAsc(sessionId);

        return messages.stream()
                .map(this::convertMessageToDTO)
                .collect(Collectors.toList());
    }

    public ChatMessageDTO sendStaffMessage(String sessionId, String content, String staffId) {
        ChatMessage message = new ChatMessage();
        message.setSessionId(sessionId);
        message.setSenderId(staffId);
        message.setSenderType(ChatMessage.SenderType.STAFF);
        message.setContent(content);
        message.setTimestamp(LocalDateTime.now());
        message.setRead(false);

        ChatMessage saved = chatMessageRepository.save(message);

        // Update session
        ChatSession session = chatSessionRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        session.setLastMessage(content);
        session.setLastMessageTime(LocalDateTime.now());
        session.setUpdatedAt(LocalDateTime.now());
        chatSessionRepository.save(session);

        return convertMessageToDTO(saved);
    }

    public void assignChatToStaff(String sessionId, String staffId, String staffName) {
        ChatSession session = chatSessionRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        ChatSession.StaffInfo staffInfo = new ChatSession.StaffInfo();
        staffInfo.setId(staffId);
        staffInfo.setFullName(staffName);

        session.setAssignedStaff(staffInfo);
        session.setStatus(ChatSession.ChatStatus.ACTIVE);
        session.setUpdatedAt(LocalDateTime.now());

        chatSessionRepository.save(session);
    }

    public void markChatAsResolved(String sessionId) {
        ChatSession session = chatSessionRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        session.setStatus(ChatSession.ChatStatus.RESOLVED);
        session.setResolvedAt(LocalDateTime.now());
        session.setUpdatedAt(LocalDateTime.now());

        chatSessionRepository.save(session);
    }

    public List<ChatMessageDTO> getChatHistory(String customerId) {
        List<ChatSession> sessions = chatSessionRepository.findByCustomer_Id(customerId);

        return sessions.stream()
                .flatMap(session -> chatMessageRepository
                        .findBySessionIdOrderByTimestampAsc(session.getSessionId())
                        .stream())
                .map(this::convertMessageToDTO)
                .collect(Collectors.toList());
    }

    private ChatSessionDTO convertToDTO(ChatSession session) {
        ChatSessionDTO dto = new ChatSessionDTO();
        dto.setId(session.getId());
        dto.setSessionId(session.getSessionId());

        if (session.getCustomer() != null) {
            ChatSessionDTO.CustomerDTO customer = new ChatSessionDTO.CustomerDTO();
            customer.setId(session.getCustomer().getId());
            customer.setFullName(session.getCustomer().getFullName());
            customer.setEmail(session.getCustomer().getEmail());
            customer.setAvatar(session.getCustomer().getAvatar());
            dto.setCustomer(customer);
        }

        dto.setStatus(session.getStatus());

        if (session.getAssignedStaff() != null) {
            ChatSessionDTO.StaffDTO staff = new ChatSessionDTO.StaffDTO();
            staff.setId(session.getAssignedStaff().getId());
            staff.setFullName(session.getAssignedStaff().getFullName());
            dto.setAssignedStaff(staff);
        }

        dto.setLastMessage(session.getLastMessage());
        dto.setLastMessageTime(session.getLastMessageTime());
        dto.setUnreadCount(session.getUnreadCount());
        dto.setPriority(session.getPriority());
        dto.setAiHandoffReason(session.getAiHandoffReason());
        dto.setCreatedAt(session.getCreatedAt());

        return dto;
    }

    private ChatMessageDTO convertMessageToDTO(ChatMessage message) {
        ChatMessageDTO dto = new ChatMessageDTO();
        dto.setId(message.getId());
        dto.setSessionId(message.getSessionId());
        dto.setSenderId(message.getSenderId());
        dto.setSenderType(message.getSenderType());
        dto.setContent(message.getContent());
        dto.setTimestamp(message.getTimestamp());
        dto.setRead(message.isRead());
        dto.setShowRoomCards(message.isShowRoomCards());
        return dto;
    }
}
