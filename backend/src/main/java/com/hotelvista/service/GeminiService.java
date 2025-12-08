package com.hotelvista.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-exp:generateContent}")
    private String apiUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public GeminiService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public String generateResponse(String prompt) {
        try {
            String url = apiUrl + "?key=" + apiKey;

            Map<String, Object> requestBody = new HashMap<>();

            Map<String, Object> content = new HashMap<>();
            Map<String, String> part = new HashMap<>();
            part.put("text", prompt);
            content.put("parts", List.of(part));

            requestBody.put("contents", List.of(content));

            Map<String, Object> generationConfig = new HashMap<>();
            generationConfig.put("temperature", 0.7);
            generationConfig.put("topK", 40);
            generationConfig.put("topP", 0.95);
            generationConfig.put("maxOutputTokens", 1024);
            requestBody.put("generationConfig", generationConfig);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            if (response.getStatusCode() == HttpStatus.OK) {
                return parseGeminiResponse(response.getBody());
            } else {
                log.error("Gemini API error: {}", response.getStatusCode());
                return "Sorry, I'm having trouble processing your request. Please try again.";
            }

        } catch (Exception e) {
            log.error("Error calling Gemini API: {}", e.getMessage(), e);
            return "Sorry, I'm having trouble connecting to the AI service. Please try again later.";
        }
    }

    private String parseGeminiResponse(String responseBody) {
        try {
            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode candidates = root.path("candidates");

            if (candidates.isArray() && candidates.size() > 0) {
                JsonNode firstCandidate = candidates.get(0);
                JsonNode content = firstCandidate.path("content");
                JsonNode parts = content.path("parts");

                if (parts.isArray() && parts.size() > 0) {
                    return parts.get(0).path("text").asText();
                }
            }

            log.error("Unexpected response format from Gemini API");
            return "Sorry, I received an unexpected response. Please try again.";

        } catch (Exception e) {
            log.error("Error parsing Gemini response: {}", e.getMessage(), e);
            return "Sorry, I couldn't process the response. Please try again.";
        }
    }
}
