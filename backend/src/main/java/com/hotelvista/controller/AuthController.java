package com.hotelvista.controller;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hotelvista.dto.ChangePasswordRequest;
import com.hotelvista.dto.LoginRequest;
import com.hotelvista.dto.RegisterRequest;
import com.hotelvista.dto.ResetPasswordRequest;
import com.hotelvista.model.CartBean;
import com.hotelvista.model.Customer;
import com.hotelvista.model.User;
import com.hotelvista.model.enums.Gender;
import com.hotelvista.model.enums.MemberShipLevel;
import com.hotelvista.model.enums.UserRole;
import com.hotelvista.security.JwtTokenProvider;
import com.hotelvista.service.CartBeanService;
import com.hotelvista.service.CustomerService;
import com.hotelvista.service.OtpService;
import com.hotelvista.service.UserService;
import com.hotelvista.util.ValidatorsUtil;

import lombok.RequiredArgsConstructor;

/**
 * Controller xử lý các API liên quan đến xác thực và ủy quyền.
 * Bao gồm đăng ký, đăng nhập, làm mới token và xác thực token.
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final CustomerService service;
    private final OtpService otpService;
    private final CartBeanService cartBeanService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * Helper method để tạo user data response đầy đủ (không bao gồm password)
     */
    private Map<String, Object> buildUserDataResponse(User user) {
        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("userName", user.getUserName());
        userData.put("fullName", user.getFullName());
        userData.put("email", user.getEmail());
        userData.put("phone", user.getPhone());
        userData.put("address", user.getAddress());
        userData.put("userRole", user.getUserRole());
        userData.put("avatarUrl", user.getAvatarUrl());

        // Thêm thông tin Customer nếu là CUSTOMER
        if (user instanceof Customer) {
            Customer customer = (Customer) user;
            userData.put("birthDate", customer.getBirthDate());
            userData.put("gender", customer.getGender());
            userData.put("joinedDate", customer.getJoinedDate());
            userData.put("loyaltyPoints", customer.getLoyaltyPoints());
            userData.put("reputationPoint", customer.getReputationPoint());
            userData.put("memberShipLevel", customer.getMemberShipLevel());
        }

        return userData;
    }

    /**
     * API đăng ký tài khoản khách hàng mới.
     * Thực hiện validate thông tin, kiểm tra trùng lặp và tạo tài khoản mới.
     *
     * @param req đối tượng RegisterRequest chứa thông tin đăng ký
     * @return Map chứa trạng thái, thông báo và dữ liệu người dùng mới (nếu thành công)
     */
    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody RegisterRequest req) {
        // Validate
        boolean hasEmail = req.getEmail() != null && !req.getEmail().trim().isEmpty();
        boolean hasPhone = req.getPhone() != null && !req.getPhone().trim().isEmpty();

        if (!hasEmail) {
            return Map.of("success", false, "message", "Please provide Email");
        }

        if (!hasPhone) {
            return Map.of("success", false, "message", "Please provide Phone number");
        }

        if (req.getUserName() == null || req.getUserName().trim().isEmpty()) {
            return Map.of("success", false, "message", "Username cannot be empty");
        }

        if (req.getFullName() == null || req.getFullName().trim().isEmpty()) {
            return Map.of("success", false, "message", "Full name cannot be empty");
        }

        // Check for duplicates
        if (req.getEmail() != null && service.findByEmail(req.getEmail()) != null) {
            return Map.of("success", false, "message", "Email is already in use");
        }

        if (req.getPhone() != null && service.findByPhone(req.getPhone()) != null) {
            return Map.of("success", false, "message", "Phone number is already in use");
        }

        if (service.findByUserName(req.getUserName()) != null) {
            return Map.of("success", false, "message", "Username is already in use");
        }

        String passwordError = ValidatorsUtil.validatePassword(req.getPassword());
        if (passwordError != null) {
            return Map.of("success", false, "message", passwordError);
        }

        // Tạo customer
        Customer c = new Customer();
        c.setId(service.generateCustomerId());
        c.setUserName(req.getUserName());
        c.setFullName(req.getFullName());
        c.setEmail(hasEmail ? req.getEmail() : null);
        c.setPhone(hasPhone ? req.getPhone() : null);
        c.setAddress(req.getAddress());
        c.setGender(Gender.MALE);
        c.setUserRole(UserRole.CUSTOMER);
        c.setJoinedDate(LocalDate.now());
        c.setLoyaltyPoints(0);
        c.setReputationPoint(100);
        c.setMemberShipLevel(MemberShipLevel.BRONZE);
        c.setAvatarUrl(null); // Mặc định chưa có avatar

        String encodedPassword = passwordEncoder.encode(req.getPassword());
        c.setPassword(encodedPassword);

        // Lưu vào Database
        service.save(c);

        CartBean cartBean = new CartBean();
        cartBean.setCustomer(c);
        cartBeanService.save(cartBean);

        c.setCartBean(cartBean);
        service.save(c);

        // Return Response with full information
        return Map.of(
                "success", true,
                "message", "Registration successful!",
                "data", buildUserDataResponse(c)
        );
    }

    /**
     * API đăng nhập vào hệ thống.
     * Xác thực thông tin đăng nhập và tạo JWT tokens (access token và refresh token).
     *
     * @param req đối tượng LoginRequest chứa email/phone/userName và mật khẩu
     * @return Map chứa trạng thái, thông báo, dữ liệu người dùng và tokens (nếu thành công)
     */
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest req) {
        // Validate: Phải có ít nhất một trong ba (email, phone, userName)
        boolean hasEmail = req.getEmail() != null && !req.getEmail().trim().isEmpty();
        boolean hasPhone = req.getPhone() != null && !req.getPhone().trim().isEmpty();
        boolean hasUserName = req.getUserName() != null && !req.getUserName().trim().isEmpty();

        if (!hasEmail && !hasPhone && !hasUserName) {
            return Map.of(
                    "success", false,
                    "message", "Please provide Email, Phone number or Username"
            );
        }

        if (req.getPassword() == null || req.getPassword().trim().isEmpty()) {
            return Map.of(
                    "success", false,
                    "message", "Password cannot be empty"
            );
        }

        // Tìm user bằng email, phone hoặc userName
        User user = userService.findByEmailOrPhoneOrUsername(
                req.getEmail(),
                req.getPhone(),
                req.getUserName()
        );

        if (user == null) {
            return Map.of(
                    "success", false,
                    "message", "Account does not exist"
            );
        }

        // Validate password format
        String passwordError = ValidatorsUtil.validatePassword(req.getPassword());
        if (passwordError != null) {
            return Map.of("success", false, "message", passwordError);
        }

        // Check password
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            return Map.of("success", false, "message", "Incorrect password");
        }

        // Tạo JWT token
        String accessToken = jwtTokenProvider.generateToken(
                user.getId(),
                user.getUserName(),
                user.getUserRole().toString()
        );

        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        // Return full user information
        return Map.of(
                "success", true,
                "message", "Login successful",
                "data", buildUserDataResponse(user),
                "token", accessToken,
                "refreshToken", refreshToken
        );
    }

    /**
     * API làm mới access token bằng refresh token.
     * Sử dụng khi access token hết hạn để lấy access token mới mà không cần đăng nhập lại.
     *
     * @param authHeader header Authorization chứa refresh token (Bearer token)
     * @return Map chứa trạng thái, thông báo và access token mới (nếu thành công)
     */
    @PostMapping("/refresh-token")
    public Map<String, Object> refreshToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return Map.of("success", false, "message", "Invalid token");
            }

            String refreshToken = authHeader.substring(7);

            if (!jwtTokenProvider.validateToken(refreshToken)) {
                return Map.of("success", false, "message", "Invalid refresh token");
            }

            String userId = jwtTokenProvider.getUserIdFromToken(refreshToken);
            Customer user = service.findById(userId);

            if (user == null) {
                return Map.of("success", false, "message", "User does not exist");
            }

            // Tạo access token mới
            String newAccessToken = jwtTokenProvider.generateToken(
                    user.getId(),
                    user.getUserName(),
                    user.getUserRole().toString()
            );

            return Map.of(
                    "success", true,
                    "message", "Token has been refreshed",
                    "token", newAccessToken
            );

        } catch (Exception e) {
            return Map.of("success", false, "message", "Unable to refresh token");
        }
    }

    /**
     * API xác thực tính hợp lệ của token.
     * Kiểm tra token có còn hiệu lực hay không và trả về thông tin người dùng.
     *
     * @param authHeader header Authorization chứa access token (Bearer token)
     * @return Map chứa trạng thái, thông báo và thông tin người dùng (nếu token hợp lệ)
     */
    @GetMapping("/validate")
    public Map<String, Object> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return Map.of("success", false, "message", "Invalid token");
            }

            String token = authHeader.substring(7);

            if (jwtTokenProvider.validateToken(token)) {
                String userId = jwtTokenProvider.getUserIdFromToken(token);
                Customer user = service.findById(userId);

                if (user == null) {
                    return Map.of("success", false, "message", "User does not exist");
                }

                // Return full user information
                return Map.of("success", true, "message", buildUserDataResponse(user));
            } else {
                return Map.of("success", false, "message", "Token has expired");
            }
        } catch (Exception e) {
            return Map.of("success", false, "message", "Invalid token");
        }
    }

    /**
     * API đổi mật khẩu người dùng.
     * Xác thực mật khẩu hiện tại trước khi cập nhật mật khẩu mới.
     * Áp dụng chung cho tất cả user roles (ADMIN, EMPLOYEE, CUSTOMER).
     *
     * @param request đối tượng ChangePasswordRequest chứa userId, mật khẩu cũ và mới
     * @return Map chứa trạng thái và thông báo
     */
    @PostMapping("/change-password")
    public Map<String, Object> changePassword(@RequestBody ChangePasswordRequest request) {
        Map<String, Object> response = new HashMap<>();

        try {
            // Validate input
            if (request.getUserId() == null || request.getUserId().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "User ID is required");
                return response;
            }

            if (request.getCurrentPassword() == null || request.getCurrentPassword().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Current Password is required");
                return response;
            }

            if (request.getNewPassword() == null || request.getNewPassword().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "New Password is required");
                return response;
            }

            // Validate password
            String passwordError = ValidatorsUtil.validatePassword(request.getNewPassword());
            if (passwordError != null) {
                response.put("success", false);
                response.put("message", passwordError);
                return response;
            }

            // Find user (Customer - có thể mở rộng cho Employee, Admin sau)
            Customer user = service.findById(request.getUserId());
            if (user == null) {
                response.put("success", false);
                response.put("message", "User not found");
                return response;
            }

            // Verify current password
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                response.put("success", false);
                response.put("message", "Current password is incorrect");
                return response;
            }

            // Kiểm tra mật khẩu mới khác mật khẩu hiện tại
            if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
                response.put("success", false);
                response.put("message", "New password must be different from current password");
                return response;
            }

            // Encode password
            String encodedNewPassword = passwordEncoder.encode(request.getNewPassword());
            user.setPassword(encodedNewPassword);
            service.save(user);

            response.put("success", true);
            response.put("message", "Password changed successfully!");
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error changing password: " + e.getMessage());
        }

        return response;
    }

    @PostMapping("/send-otp")
    public Map<String, Object> sendOtp(@RequestBody Map<String, String> req) {
        String email = req.get("email");
        if (email == null || email.isEmpty()) {
            return Map.of("success", false, "message", "Email is required");
        }

        String otp = otpService.generateOtp(email);

        return Map.of(
                "success", true,
                "message", "OTP generated",
                "otp", otp
        );
    }

    @PostMapping("/verify-otp")
    public Map<String, Object> verifyOtp(@RequestBody Map<String, String> req) {
        String email = req.get("email");
        String otp = req.get("otp");

        if (email == null || otp == null) {
            return Map.of("success", false, "message", "Email and OTP are required");
        }

        boolean valid = otpService.verifyOtp(email, otp);

        return Map.of(
                "success", valid,
                "message", valid ? "OTP is valid" : "OTP is invalid"
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest req) {

        if (req.getEmail() == null || req.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Email is required"
            ));
        }

        if (req.getNewPassword() == null || req.getNewPassword().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "New password is required"
            ));
        }

        // Validate password mạnh
        String error = ValidatorsUtil.validatePassword(req.getNewPassword());
        if (error != null) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", error));
        }

        boolean ok = userService.resetPasswordByEmail(req.getEmail(), req.getNewPassword());

        if (!ok) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Email not found"
            ));
        }

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Password reset successful"
        ));
    }

}