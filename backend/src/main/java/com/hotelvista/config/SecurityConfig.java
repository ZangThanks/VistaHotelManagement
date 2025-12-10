package com.hotelvista.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.hotelvista.security.JwtAuthenticationFilter;
import com.hotelvista.security.oauth.CustomAuthorizationRequestResolver;
import com.hotelvista.security.oauth.CustomOAuth2UserService;
import com.hotelvista.security.oauth.OAuth2SuccessHandler;

import lombok.RequiredArgsConstructor;

/**
 * Cấu hình bảo mật cho ứng dụng sử dụng Spring Security.
 * Xử lý authentication, authorization và các quy tắc bảo mật.
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;

    /**
     * Cấu hình chuỗi filter bảo mật cho HTTP requests.
     * Định nghĩa các quy tắc authorization cho từng endpoint.
     * 
     * Quy tắc phân quyền:
     * - Public endpoints: /auth/**, /oauth2/**, /error, /public/**
     * - Public READ: /rooms/**, /room-types/**, /promotions/**, /news/**, /services/** (GET only)
     * - Method-level security: Sử dụng @PreAuthorize trong các controller
     * 
     * @param http đối tượng HttpSecurity để cấu hình bảo mật
     * @return SecurityFilterChain đã được cấu hình
     * @throws Exception nếu có lỗi trong quá trình cấu hình
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, ClientRegistrationRepository clientRegistrationRepository) throws Exception {
        OAuth2AuthorizationRequestResolver resolver = new CustomAuthorizationRequestResolver(
                clientRegistrationRepository,
                "/oauth2/authorization"
        );

        http
                // CORS & CSRF
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())

                // JWT Stateless session
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)

                // Authorization rules - Simplified for method-level security
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints - không cần authentication
                        .requestMatchers(
                                "/auth/**",
                                "/oauth2/**",
                                "/login/oauth2/**",
                                "/error",
                                "/public/**"
                        ).permitAll()
                        
                        // Public READ endpoints - cho phép xem thông tin
                        .requestMatchers(
                                "/rooms/**",
                                "/room-types/**",
                                "/promotions/**",
                                "/promotion-types/**",
                                "/vouchers/**",
                                "/reviews/**",
                                "/news/**",
                                "/services/**",
                                "/seasonal-prices/**",
                                "/room-type-promotions/**",
                                "/ai/**"
                        ).permitAll()
                        
                        // Tất cả các endpoint khác sử dụng method-level security (@PreAuthorize)
                        // Yêu cầu authentication, quyền cụ thể được kiểm tra ở controller
                        .anyRequest().authenticated()
                )
                // OAuth2 Login
                .oauth2Login(oauth -> oauth
                        .authorizationEndpoint(ep -> ep
                                .baseUri("/oauth2/authorization")
                                .authorizationRequestResolver(resolver)
                        )
                        .redirectionEndpoint(ep -> ep
                                .baseUri("/login/oauth2/code/*")
                        )
                        .userInfoEndpoint(ep ->
                                ep.userService(customOAuth2UserService)
                        )
                        .successHandler(oAuth2SuccessHandler)
                );

        // Add JWT filter
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Tạo bean cấu hình CORS cho Spring Security.
     * Định nghĩa các quy tắc CORS cho tất cả các endpoints.
     * 
     * Cấu hình:
     * - Cho phép origin: http://localhost:5173
     * - Cho phép methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
     * - Cho phép tất cả headers
     * - Cho phép gửi credentials
     * - Cache preflight: 3600 giây
     * 
     * @return CorsConfigurationSource đã được cấu hình
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}