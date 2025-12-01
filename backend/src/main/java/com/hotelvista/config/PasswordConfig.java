package com.hotelvista.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class PasswordConfig {

    /**
     * Tạo bean PasswordEncoder để mã hóa mật khẩu.
     * Sử dụng thuật toán BCrypt để mã hóa an toàn.
     *
     * @return BCryptPasswordEncoder để mã hóa và xác thực mật khẩu
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
