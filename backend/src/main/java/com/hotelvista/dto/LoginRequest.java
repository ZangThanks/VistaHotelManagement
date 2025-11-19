package com.hotelvista.dto;

import lombok.Data;

/**
 * DTO (Data Transfer Object) cho request đăng nhập.
 * Chứa thông tin cần thiết để xác thực người dùng.
 */
@Data
public class LoginRequest {
    /** Email của người dùng (có thể null nếu dùng phone) */
    private String email;
    
    /** Số điện thoại của người dùng (có thể null nếu dùng email) */
    private String phone;
    
    /** Mật khẩu của người dùng (bắt buộc) */
    private String password;
}