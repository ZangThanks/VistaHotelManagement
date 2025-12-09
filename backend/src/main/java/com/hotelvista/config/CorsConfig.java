package com.hotelvista.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Cấu hình CORS (Cross-Origin Resource Sharing) cho ứng dụng.
 * Cho phép frontend từ origin khác gọi API của backend.
 */
@Configuration
public class CorsConfig {
    
    /**
     * Tạo bean cấu hình CORS cho ứng dụng Spring MVC.
     * Cho phép frontend từ localhost:5173 truy cập các API endpoints.
     * 
     * @return WebMvcConfigurer đã được cấu hình CORS
     */
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            /**
             * Cấu hình các quy tắc CORS mapping.
             * - Cho phép tất cả các endpoint
             * - Cho phép origin từ http://localhost:5173
             * - Cho phép các phương thức HTTP: GET, POST, PUT, DELETE, OPTIONS
             * - Cho phép tất cả các headers
             * - Cho phép gửi credentials (cookies, authorization headers)
             * - Thời gian cache preflight request: 3600 giây
             * 
             * @param registry đối tượng CorsRegistry để đăng ký cấu hình CORS
             */
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // Cho phép tất cả endpoint
                        .allowedOrigins("http://localhost:5173", "http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true)
                        .maxAge(3600);
            }
        };
    }


}