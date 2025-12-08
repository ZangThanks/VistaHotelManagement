package com.hotelvista.security.oauth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hotelvista.dto.OAuthUserDTO;
import com.hotelvista.model.User;
import com.hotelvista.security.JwtTokenProvider;
import com.hotelvista.service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {
    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;
    private final ObjectMapper objectMapper;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();

        // Create user nếu chưa tồn tại
        User user = userService.createUserIfNotExists(
                oAuth2User.getEmail(),
                oAuth2User.getFullName(),
                oAuth2User.getProvider()
        );

        // Tạo JWT
        String accessToken = jwtTokenProvider.generateToken(
                user.getId(),
                user.getUserName(),
                user.getUserRole().toString()
        );

        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        // Tạo DTO để gửi về FE
        OAuthUserDTO dto = new OAuthUserDTO(
                user.getId(),
                user.getUserName(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getUserRole().name()
        );

        // Convert DTO → JSON rồi encode để đưa vào URL
        String userJson = URLEncoder.encode(
                objectMapper.writeValueAsString(dto),
                StandardCharsets.UTF_8
        );

        // Gửi token về frontend
        String redirectUrl = UriComponentsBuilder
                .fromUriString("http://localhost:5173/oauth-success")
                .queryParam("token", accessToken)
                .queryParam("refreshToken", refreshToken)
                .queryParam("user", userJson)
                .build().toUriString();

        response.sendRedirect(redirectUrl);
    }
}
