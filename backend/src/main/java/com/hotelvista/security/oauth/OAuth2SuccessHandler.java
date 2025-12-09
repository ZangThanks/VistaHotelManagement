package com.hotelvista.security.oauth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hotelvista.dto.OAuthUserDTO;
import com.hotelvista.model.Customer;
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
import java.util.HashMap;
import java.util.Map;

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
                user.getUserRole().name()
        );

        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        // Tạo full user data để gửi về FE
        Map<String, Object> userDataMap = new HashMap<>();
        userDataMap.put("id", user.getId());
        userDataMap.put("userName", user.getUserName());
        userDataMap.put("fullName", user.getFullName());
        userDataMap.put("email", user.getEmail());
        userDataMap.put("phone", user.getPhone());
        userDataMap.put("address", user.getAddress());
        userDataMap.put("userRole", user.getUserRole().name());
        userDataMap.put("avatarUrl", user.getAvatarUrl());

        // Thêm thông tin Customer nếu là CUSTOMER
        if (user instanceof Customer) {
            Customer customer = (Customer) user;
            userDataMap.put("birthDate", customer.getBirthDate());
            userDataMap.put("gender", customer.getGender());
            userDataMap.put("joinedDate", customer.getJoinedDate());
            userDataMap.put("loyaltyPoints", customer.getLoyaltyPoints());
            userDataMap.put("reputationPoint", customer.getReputationPoint());
            userDataMap.put("memberShipLevel", customer.getMemberShipLevel());
        }

        // Convert Map → JSON rồi encode để đưa vào URL
        String userJson = URLEncoder.encode(
                objectMapper.writeValueAsString(userDataMap),
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