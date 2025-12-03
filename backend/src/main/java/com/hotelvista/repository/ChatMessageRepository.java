package com.hotelvista.repository;

import com.hotelvista.model.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {

    List<ChatMessage> findBySessionIdOrderByTimestampAsc(String sessionId);

    List<ChatMessage> findBySessionIdAndSenderType(String sessionId, ChatMessage.SenderType senderType);

    long countBySessionIdAndIsReadFalse(String sessionId);

    List<ChatMessage> findTop50BySessionIdOrderByTimestampDesc(String sessionId);
}