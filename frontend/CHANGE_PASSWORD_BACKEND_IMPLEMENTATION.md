# Backend Implementation: Change Password Feature

## 📋 Tổng quan

Thêm chức năng đổi mật khẩu vào hệ thống với các bước validation và security.

## 🔧 Implementation Steps

### 1. Tạo Password Validator Utility

Tạo file: `src/main/java/com/hotelvista/util/PasswordValidator.java`

```java
package com.hotelvista.util;

/**
 * Utility class để validate mật khẩu theo quy tắc frontend.
 * Rules:
 * - Độ dài: 8-50 ký tự
 * - Ít nhất 1 chữ in hoa (A-Z)
 * - Ít nhất 1 chữ thường (a-z)
 * - Ít nhất 1 số (0-9)
 * - Ít nhất 1 ký tự đặc biệt (!@#$%^&*(),.?":{}|<>)
 */
public class PasswordValidator {

    /**
     * Validate password theo quy tắc bảo mật.
     *
     * @param password mật khẩu cần kiểm tra
     * @return thông báo lỗi nếu không hợp lệ, null nếu hợp lệ
     */
    public static String validatePassword(String password) {
        if (password == null || password.isEmpty()) {
            return "Mật khẩu không được để trống";
        }

        if (password.length() < 8) {
            return "Mật khẩu phải có ít nhất 8 ký tự";
        }

        if (password.length() > 50) {
            return "Mật khẩu không được quá 50 ký tự";
        }

        // Check uppercase letter
        if (!password.matches(".*[A-Z].*")) {
            return "Mật khẩu phải có ít nhất một ký tự in hoa";
        }

        // Check lowercase letter
        if (!password.matches(".*[a-z].*")) {
            return "Mật khẩu phải có ít nhất một ký tự thường";
        }

        // Check digit
        if (!password.matches(".*[0-9].*")) {
            return "Mật khẩu phải có ít nhất một số";
        }

        // Check special character
        if (!password.matches(".*[!@#$%^&*(),.?\"':{}|<>].*")) {
            return "Mật khẩu phải có ít nhất một ký tự đặc biệt";
        }

        return null; // Valid password
    }
}
```

### 2. Tạo DTO cho Change Password Request

Tạo file: `src/main/java/com/hotelvista/dto/ChangePasswordRequest.java`

```java
package com.hotelvista.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO cho yêu cầu đổi mật khẩu.
 * Chứa userId, mật khẩu hiện tại và mật khẩu mới.
 * Áp dụng chung cho ADMIN, EMPLOYEE, CUSTOMER.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChangePasswordRequest {
    private String userId;
    private String currentPassword;
    private String newPassword;
}
```

### 3. Cập nhật AuthController

Cập nhật class `AuthController.java` với các imports và methods:

```java
package com.hotelvista.controller;

import com.hotelvista.dto.ChangePasswordRequest;
import com.hotelvista.dto.RegisterRequest;
import com.hotelvista.dto.LoginRequest;
import com.hotelvista.model.Customer;
import com.hotelvista.service.CustomerService;
import com.hotelvista.util.PasswordValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final CustomerService service;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * API đăng ký tài khoản - CẬP NHẬT VỚI PASSWORD VALIDATION
     */
    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody RegisterRequest req) {
        // Validate required fields
        if ((req.getEmail() == null && req.getPhone() == null) || req.getPassword() == null) {
            return Map.of("success", false, "message", "Thiếu thông tin bắt buộc");
        }

        if (req.getUserName() == null || req.getUserName().trim().isEmpty()) {
            return Map.of("success", false, "message", "Tên đăng nhập không được để trống");
        }

        if (req.getFullName() == null || req.getFullName().trim().isEmpty()) {
            return Map.of("success", false, "message", "Họ và tên không được để trống");
        }

        // ✅ VALIDATE PASSWORD THEO QUY TẮC FRONTEND
        String passwordError = PasswordValidator.validatePassword(req.getPassword());
        if (passwordError != null) {
            return Map.of("success", false, "message", passwordError);
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

        // Tạo customer và lưu vào DB
        // ... (code tạo customer như cũ)
        String encodedPassword = passwordEncoder.encode(req.getPassword());
        // ... lưu customer

        return Map.of("success", true, "message", "Đăng ký thành công!", "data", userData);
    }

    // ... existing methods (login, refresh-token, validate) ...

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
                response.put("message", "Current password is required");
                return response;
            }

            if (request.getNewPassword() == null || request.getNewPassword().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "New password is required");
                return response;
            }

            // ✅ VALIDATE NEW PASSWORD THEO QUY TẮC FRONTEND
            String passwordError = PasswordValidator.validatePassword(request.getNewPassword());
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

            // Check if new password is same as current
            if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
                response.put("success", false);
                response.put("message", "New password must be different from current password");
                return response;
            }

            // Encode and save new password
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
```

### 3. Cập nhật SecurityConfig (nếu cần)

Đảm bảo endpoint change password yêu cầu authentication trong `SecurityConfig.java`:

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/auth/register", "/auth/login", "/auth/refresh-token", "/auth/validate").permitAll()
            .requestMatchers("/auth/change-password").authenticated() // Require authentication
            .requestMatchers("/customers/**").hasAnyRole("ADMIN", "EMPLOYEE")
            // ... other matchers
            .anyRequest().authenticated()
        )
        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
}
```

## 🔒 Security Features

1. **Xác thực mật khẩu hiện tại**: Kiểm tra mật khẩu cũ trước khi cho phép đổi
2. **Validation độ dài**: Mật khẩu mới phải ít nhất 6 ký tự
3. **Check trùng lặp**: Mật khẩu mới phải khác mật khẩu cũ
4. **JWT Authentication**: Chỉ user đã đăng nhập mới được đổi mật khẩu
5. **Password Encoding**: Sử dụng BCrypt để hash mật khẩu
6. **Universal Access**: Endpoint trong AuthController, dùng chung cho ADMIN, EMPLOYEE, CUSTOMER

## 📝 API Documentation

### Endpoint

```
POST /auth/change-password
```

### Headers

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Request Body

```json
{
  "userId": "CU12345678",
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
```

### Response Success

```json
{
  "success": true,
  "message": "Password changed successfully!"
}
```

### Response Error Examples

**Current password incorrect:**

```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

**New password too short:**

```json
{
  "success": false,
  "message": "New password must be at least 6 characters"
}
```

**Same password:**

```json
{
  "success": false,
  "message": "New password must be different from current password"
}
```

## 🧪 Testing

### Test Cases

1. **Happy Path**: Đổi mật khẩu thành công với mật khẩu cũ đúng và mật khẩu mới hợp lệ (VD: `NewPass123!`)
2. **Wrong Current Password**: Mật khẩu cũ sai
3. **Short Password**: Mật khẩu mới quá ngắn (< 8 ký tự)
4. **Long Password**: Mật khẩu mới quá dài (> 50 ký tự)
5. **No Uppercase**: Mật khẩu thiếu chữ in hoa (VD: `newpass123!`)
6. **No Lowercase**: Mật khẩu thiếu chữ thường (VD: `NEWPASS123!`)
7. **No Digit**: Mật khẩu thiếu số (VD: `NewPassword!`)
8. **No Special Char**: Mật khẩu thiếu ký tự đặc biệt (VD: `NewPass123`)
9. **Same Password**: Mật khẩu mới giống mật khẩu cũ
10. **Missing Fields**: Thiếu userId, currentPassword hoặc newPassword
11. **Invalid User**: userId không tồn tại
12. **No Authentication**: Gọi API không có JWT token
13. **Cross-Role Test**: Test với CUSTOMER, EMPLOYEE, ADMIN accounts

### Postman Test Example

```javascript
// Test với Postman
POST http://localhost:8080/auth/change-password
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "userId": "CU12345678",
  "currentPassword": "password123",
  "newPassword": "newSecurePass456"
}
```

## ✅ Implementation Checklist

- [ ] Tạo file `PasswordValidator.java` trong package util
- [ ] Tạo file `ChangePasswordRequest.java` với field userId
- [ ] Cập nhật method `register` trong `AuthController.java` để dùng PasswordValidator
- [ ] Thêm method `changePassword` vào `AuthController.java` với PasswordValidator
- [ ] Verify `PasswordEncoder` đã được inject (via @RequiredArgsConstructor)
- [ ] Cập nhật `SecurityConfig.java` để permit /auth/change-password với authentication
- [ ] Test endpoint với Postman cho cả 3 roles (CUSTOMER, EMPLOYEE, ADMIN)
- [ ] Verify password được hash đúng trong database
- [ ] Test các error cases
- [ ] Deploy và test trên production

## 🔗 Frontend Integration

Frontend đã được cập nhật với:

- Service method trong `userProfileService.ts`
- UI component trong `PasswordChangeSection.tsx`
- Form validation và error handling
- Toast notifications cho success/error

Endpoint call từ frontend:

```typescript
POST /auth/change-password
Body: {
  userId: string,
  currentPassword: string,
  newPassword: string
}
```

## 🎯 Notes

- PasswordEncoder đã được inject vào AuthController qua @RequiredArgsConstructor
- Sử dụng BCrypt để hash passwords
- JWT token trong Authorization header sẽ được validate bởi JwtAuthenticationFilter
- Endpoint `/auth/change-password` cho phép tất cả user roles (ADMIN, EMPLOYEE, CUSTOMER)
- userId trong request body phải match với userId trong JWT token (nên thêm validation này)
- Không log mật khẩu vào console/logs
- Response không bao gồm mật khẩu mới đã hash
- Có thể mở rộng để hỗ trợ Employee và Admin services trong tương lai
