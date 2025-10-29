package com.hotelvista.controller;

import com.hotelvista.dto.LoginRequest;
import com.hotelvista.dto.RegisterRequest;
import com.hotelvista.model.Customer;
import com.hotelvista.model.enums.Gender;
import com.hotelvista.model.enums.MemberShipLevel;
import com.hotelvista.model.enums.UserRole;
import com.hotelvista.security.JwtTokenProvider;
import com.hotelvista.service.CustomerService;
import com.hotelvista.util.GenerateIDUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final CustomerService service;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody RegisterRequest req) {
        // Validate
        if ((req.getEmail() == null && req.getPhone() == null) || req.getPassword() == null) {
            return Map.of("success", false, "message", "Thiếu thông tin bắt buộc");
        }

        if (req.getUserName() == null || req.getUserName().trim().isEmpty()) {
            return Map.of("success", false, "message", "Tên đăng nhập không được để trống");
        }

        if (req.getFullName() == null || req.getFullName().trim().isEmpty()) {
            return Map.of("success", false, "message", "Họ và tên không được để trống");
        }

        // Kiểm tra trùng lặp
        if (req.getEmail() != null && service.findByEmail(req.getEmail()) != null) {
            return Map.of("success", false, "message", "Email đã được sử dụng");
        }

        if (req.getPhone() != null && service.findByPhone(req.getPhone()) != null) {
            return Map.of("success", false, "message", "Số điện thoại đã đư" +
                    "ợc sử dụng");
        }

        if (service.findByUserName(req.getUserName()) != null) {
            return Map.of("success", false, "message", "Tên đăng nhập đã được sử dụng");
        }

        // Tạo customer
        Customer c = new Customer();
        c.setId(GenerateIDUtil.generateID("CU", 8));
        c.setUserName(req.getUserName());
        c.setFullName(req.getFullName());
        c.setEmail(req.getEmail());
        c.setPhone(req.getPhone());
        c.setAddress(req.getAddress());
        c.setGender(Gender.MALE);
        c.setUserRole(UserRole.CUSTOMER);
        c.setJoinedDate(LocalDate.now());
        c.setLoyaltyPoints(0);
        c.setMemberShipLevel(MemberShipLevel.BRONZE);

        String encodedPassword = passwordEncoder.encode(req.getPassword());
        c.setPassword(encodedPassword);

        // Lưu vào Database
        service.save(c);

        // Trả về Response
        Map<String, Object> userData = new HashMap<>();
        userData.put("id", c.getId());
        userData.put("userName", c.getUserName());
        userData.put("fullName", c.getFullName());
        userData.put("email", c.getEmail());
        userData.put("phone", c.getPhone());

        return Map.of(
                "success", true,
                "message", "Đăng ký thành công!",
                "data", userData
        );
    }


    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest req) {
        Customer user = null;

        // Tìm user bằng email hoặc phone
        if (req.getEmail() != null && !req.getEmail().trim().isEmpty()) {
            user = service.findByEmail(req.getEmail());
        }

        if (user == null && req.getPhone() != null && !req.getPhone().trim().isEmpty()) {
            user = service.findByPhone(req.getPhone());
        }

        if (user == null) {
            return Map.of("success", false, "message", "Tài khoản không tồn tại");
        }

        // Kiểm tra mật khẩu
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            return Map.of("success", false, "message", "Mật khẩu không đúng");
        }

        // Tạo JWT token
        String accessToken = jwtTokenProvider.generateToken(
                user.getId(),
                user.getUserName(),
                user.getUserRole().toString()
        );

        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        // Tạo user data response (không bao gồm password)
        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("userName", user.getUserName());
        userData.put("fullName", user.getFullName());
        userData.put("email", user.getEmail());
        userData.put("phone", user.getPhone());
        userData.put("address", user.getAddress());
        userData.put("gender", user.getGender());
        userData.put("userRole", user.getUserRole());
        userData.put("joinedDate", user.getJoinedDate());
        userData.put("loyaltyPoints", user.getLoyaltyPoints());
        userData.put("memberShipLevel", user.getMemberShipLevel());

        // Response
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Đăng nhập thành công");
        response.put("data", userData);
        response.put("accessToken", accessToken);
        response.put("refreshToken", refreshToken);

        return response;
    }

    @PostMapping("/refresh-token")
    public Map<String, Object> refreshToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return Map.of("success", false, "message", "Token không hợp lệ");
            }

            String refreshToken = authHeader.substring(7);

            if (!jwtTokenProvider.validateToken(refreshToken)) {
                return Map.of("success", false, "message", "Refresh token không hợp lệ");
            }

            String userId = jwtTokenProvider.getUserIdFromToken(refreshToken);
            Customer user = service.findById(userId);

            if (user == null) {
                return Map.of("success", false, "message", "Người dùng không tồn tại");
            }

            // Tạo access token mới
            String newAccessToken = jwtTokenProvider.generateToken(
                    user.getId(),
                    user.getUserName(),
                    user.getUserRole().toString()
            );

            return Map.of(
                    "success", true,
                    "message", "Token đã được làm mới",
                    "token", newAccessToken
            );

        } catch (Exception e) {
            return Map.of("success", false, "message", "Không thể làm mới token");
        }
    }

    @GetMapping("/validate")
    public Map<String, Object> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return Map.of("success", false, "message", "Token không hợp lệ");
            }

            String token = authHeader.substring(7);

            if (jwtTokenProvider.validateToken(token)) {
                String userId = jwtTokenProvider.getUserIdFromToken(token);
                Customer user = service.findById(userId);

                if (user == null) {
                    return Map.of("success", false, "message", "Người dùng không tồn tại");
                }

                Map<String, Object> userData = new HashMap<>();
                userData.put("id", user.getId());
                userData.put("userName", user.getUserName());
                userData.put("fullName", user.getFullName());
                userData.put("email", user.getEmail());
                userData.put("phone", user.getPhone());
                userData.put("userRole", user.getUserRole());

                return Map.of("success", false, "message", userData);
            } else {
                return Map.of("success", false, "message", "Token đã hết hạn");
            }
        } catch (Exception e) {
            return Map.of("success", false, "message", "Token không hợp lệ");
        }
    }

}