package com.hotelvista.controller;

import com.hotelvista.dto.EmailRequest;
import com.hotelvista.service.EmailService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.UnsupportedEncodingException;
import java.util.Map;

@RestController
@RequestMapping("/email")
@RequiredArgsConstructor
public class EmailController {
    private final EmailService emailService;

    @PostMapping("/send")
    public ResponseEntity<Map<String, Object>> sendEmail(@RequestBody EmailRequest request) {
        if (request.getTo() == null || request.getTo().isBlank()
            || request.getSubject() == null || request.getSubject().isBlank()
            || request.getHtmlContent() == null || request.getHtmlContent().isBlank()) {
            return ResponseEntity.badRequest().body(
                    Map.of("success", false, "message", "Invalid email request")
            );
        }

        try {
            emailService.sendEmail(request.getTo(), request.getSubject(), request.getHtmlContent());
            return ResponseEntity.ok(
                    Map.of("success", true, "message", "Email sent successfully")
            );
        } catch (MessagingException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(
                    Map.of("success", false, "message", "Failed to send email: " + e.getMessage())
            );
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }
}
