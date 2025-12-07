package com.hotelvista.dto;

import lombok.Data;

/**
 * DTO (Data Transfer Object) cho request đăng nhập.
 * Chứa thông tin cần thiết để xác thực người dùng.
 */
@Data
public class LoginRequest {
    /** Tên đăng nhập (có thể null nếu dùng email/phone) */
    private String userName;

    /** Email của người dùng (có thể null nếu dùng phone/userName) */
    private String email;

    /** Số điện thoại của người dùng (có thể null nếu dùng email/userName) */
    private String phone;

    /** Mật khẩu của người dùng (bắt buộc) */
    private String password;
}