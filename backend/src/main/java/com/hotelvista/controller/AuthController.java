package com.hotelvista.controller;

import com.hotelvista.dto.ChangePasswordRequest;
import com.hotelvista.dto.LoginRequest;
import com.hotelvista.dto.RegisterRequest;
import com.hotelvista.model.Customer;
import com.hotelvista.model.User;
import com.hotelvista.model.enums.Gender;
import com.hotelvista.model.enums.MemberShipLevel;
import com.hotelvista.model.enums.UserRole;
import com.hotelvista.security.JwtTokenProvider;
import com.hotelvista.service.CustomerService;
import com.hotelvista.service.UserService;
import com.hotelvista.util.GenerateIDUtil;
import com.hotelvista.util.ValidatorsUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

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
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

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
            return Map.of("success", false, "message", "Số điện thoại đã được sử dụng");
        }

        if (service.findByUserName(req.getUserName()) != null) {
            return Map.of("success", false, "message", "Tên đăng nhập đã được sử dụng");
        }

        String passwordError = ValidatorsUtil.validatePassword(req.getPassword());
        if (passwordError != null) {
            return Map.of("success", false, "message", passwordError);
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
        c.setReputationPoint(100);
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

    /**
     * API đăng nhập vào hệ thống.
     * Xác thực thông tin đăng nhập và tạo JWT tokens (access token và refresh token).
     *
     * @param req đối tượng LoginRequest chứa email/phone và mật khẩu
     * @return Map chứa trạng thái, thông báo, dữ liệu người dùng và tokens (nếu thành công)
     */
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest req) {
        // Tìm user bằng email hoặc phone
        User user = userService.findByEmailOrPhone(req.getEmail(), req.getPhone());

        if (user == null) {
            return Map.of(
                    "success", false,
                    "message", "Tài khoản không tồn tại"
            );
        }

        String passwordError = ValidatorsUtil.validatePassword(req.getPassword());
        if (passwordError != null) {
            return Map.of("success", false, "message", passwordError);
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
        userData.put("userRole", user.getUserRole());

        return Map.of(
                "success", true,
                "message", "Đăng nhập thành công",
                "data", userData,
                "accessToken", accessToken,
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
}