package com.hotelvista.util;

public class ValidatorsUtil {
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
