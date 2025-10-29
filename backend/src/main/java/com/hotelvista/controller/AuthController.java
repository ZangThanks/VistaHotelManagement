package com.hotelvista.controller;

import com.hotelvista.dto.LoginRequest;
import com.hotelvista.dto.RegisterRequest;
import com.hotelvista.model.Customer;
import com.hotelvista.model.enums.Gender;
import com.hotelvista.model.enums.MemberShipLevel;
import com.hotelvista.model.enums.UserRole;
import com.hotelvista.service.CustomerService;
import com.hotelvista.util.GenerateIDUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final CustomerService service;

    private final PasswordEncoder passwordEncoder;

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
        if (req.getEmail() != null && service.exists(service.findByEmail(req.getEmail()).getId())) {
            return Map.of("success", false, "message", "Email đã được sử dụng");
        }

        if (req.getPhone() != null && service.exists(service.findByPhone(req.getPhone()).getId())) {
            return Map.of("success", false, "message", "Số điện thoại đã được sử dụng");
        }

        if (service.exists(service.findByUserName(req.getUserName()).getId())) {
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
        return Map.of(
                "success", true,
                "message", "Đăng ký thành công!",
                "data", c
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

        // TODO: Tạo JWT token
        String fakeToken = "FAKE_TOKEN_" + user.getId();

        return Map.of(
                "success", true,
                "message", "Đăng nhập thành công",
                "data", user,
                "token", fakeToken
        );
    }
}