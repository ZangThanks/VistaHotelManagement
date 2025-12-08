package com.hotelvista.dto;

import lombok.Data;

/**
 * DTO (Data Transfer Object) cho request đăng ký tài khoản.
 * Chứa thông tin cần thiết để tạo tài khoản khách hàng mới.
 */
@Data
public class RegisterRequest {
    /** Tên đăng nhập (bắt buộc, duy nhất) */
    private String userName;
    
    /** Họ và tên đầy đủ (bắt buộc) */
    private String fullName;
    
    /** Địa chỉ email (tùy chọn, duy nhất nếu có) */
    private String email;
    
    /** Số điện thoại (tùy chọn, duy nhất nếu có) */
    private String phone;
    
    /** Mật khẩu (bắt buộc) */
    private String password;
    
    /** Địa chỉ (tùy chọn) */
    private String address;
    
    /** Giới tính (tùy chọn) */
    private String gender;
    
    /** Ngày sinh (tùy chọn) */
    private String birthDate;
}