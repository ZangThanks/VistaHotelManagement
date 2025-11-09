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

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final CustomerService service;

    private final PasswordEncoder passwordEncoder;

    /**
     * Đăng ký tài khoản mới.
     *
     * @param req đối tượng RegisterRequest chứa thông tin đăng ký
     * @return kết quả đăng ký
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
            return Map.of("success", false, "message", "Số điện thoại đã đư" +
                    "ợc sử dụng");
        }

        if (service.findByUserName(req.getUserName()) != null) {
            return Map.of("success", false, "message", "Tên đăng nhập đã được sử dụng");
        }

        // Sinh mã khách hàng: CUSTddMMyyyyXXXX
        String newCustomerId = generateCustomerId();

        // Tạo customer
        Customer c = new Customer();
        c.setId(newCustomerId);
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

        // mã hóa password
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

    /**
     * Sinh mã khách hàng mới theo định dạng CUSTddMMyyyyXXXX
     *
     * @return mã khách hàng mới
     */
    private String generateCustomerId() {
        String datePart = new SimpleDateFormat("ddMMyy").format(new Date());
        String prefix = "CUS" + datePart;

        // Lấy khách hàng cuối cùng trong ngày từ DB
        Customer lastCustomer = service.findLastCustomerOfDay(prefix);
        int nextNumber = 1;

        if (lastCustomer != null && lastCustomer.getId() != null) {
            String lastId = lastCustomer.getId();
            String numberPart = lastId.substring(lastId.length() - 4); // 4 số cuối
            nextNumber = Integer.parseInt(numberPart) + 1;
        }

        return prefix + String.format("%04d", nextNumber);
    }

    /**
     * Đăng nhập tài khoản.
     *
     * @param req đối tượng LoginRequest chứa thông tin đăng nhập
     * @return kết quả đăng nhập
     */
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