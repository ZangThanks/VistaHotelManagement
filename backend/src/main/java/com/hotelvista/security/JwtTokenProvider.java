package com.hotelvista.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Component cung cấp các chức năng tạo và xác thực JWT token.
 * Xử lý việc generate, validate và extract thông tin từ JWT tokens.
 */
@Component
public class JwtTokenProvider {

    private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpirationMs;

    @Value("${jwt.refresh-expiration}")
    private long jwtRefreshExpirationMs;

    /**
     * Tạo SecretKey từ secret string để ký và verify JWT token.
     * Sử dụng thuật toán HMAC-SHA.
     * 
     * @return SecretKey để ký JWT token
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Tạo Access Token cho người dùng.
     * Token chứa thông tin userId, userName, userRole và có thời gian hết hạn ngắn.
     * 
     * @param userId ID của người dùng
     * @param userName tên đăng nhập của người dùng
     * @param userRole vai trò của người dùng (ADMIN, EMPLOYEE, CUSTOMER)
     * @return chuỗi JWT access token
     */
    public String generateToken(String userId, String userName, String userRole) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("userName", userName);
        claims.put("userRole", userRole);
        claims.put("type", "ACCESS");

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .claims(claims)
                .subject(userId)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Tạo Refresh Token để làm mới access token.
     * Token có thời gian hết hạn dài hơn access token, chỉ chứa userId.
     * 
     * @param userId ID của người dùng
     * @return chuỗi JWT refresh token
     */
    public String generateRefreshToken(String userId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", "REFRESH");

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtRefreshExpirationMs);

        return Jwts.builder()
                .claims(claims) // Payload: thông tin user
                .subject(userId) // Subject: userId
                .issuedAt(now) // Issued At: thời gian tạo
                .expiration(expiryDate) // Expiration: 24h sau
                .signWith(getSigningKey()) // Ký với secret key
                .compact(); // Tạo string JWT
    }

    /**
     * Lấy userId từ JWT token.
     * 
     * @param token JWT token cần extract thông tin
     * @return userId của người dùng
     */
    public String getUserIdFromToken(String token) {
        Claims claims = getAllClaimsFromToken(token);
        return claims.getSubject();
    }

    /**
     * Lấy userName từ JWT token.
     * 
     * @param token JWT token cần extract thông tin
     * @return tên đăng nhập của người dùng
     */
    public String getUserNameFromToken(String token) {
        Claims claims = getAllClaimsFromToken(token);
        return claims.get("userName", String.class);
    }

    /**
     * Lấy userRole từ JWT token.
     * 
     * @param token JWT token cần extract thông tin
     * @return vai trò của người dùng (ADMIN, EMPLOYEE, CUSTOMER)
     */
    public String getUserRoleFromToken(String token) {
        Claims claims = getAllClaimsFromToken(token);
        return claims.get("userRole", String.class);
    }

    /**
     * Lấy tất cả claims (dữ liệu payload) từ JWT token.
     * 
     * @param token JWT token cần parse
     * @return đối tượng Claims chứa tất cả thông tin trong token
     */
    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Kiểm tra token có hết hạn hay không.
     * 
     * @param token JWT token cần kiểm tra
     * @return true nếu token đã hết hạn, false nếu còn hiệu lực
     */
    public boolean isTokenExpired(String token) {
        try {
            Claims claims = getAllClaimsFromToken(token);
            return claims.getExpiration().before(new Date());
        } catch (ExpiredJwtException e) {
            return true;
        }
    }

    /**
     * Xác thực tính hợp lệ của JWT token.
     * Kiểm tra signature, format, thời gian hết hạn và các thuộc tính khác.
     * 
     * @param token JWT token cần validate
     * @return true nếu token hợp lệ, false nếu token không hợp lệ hoặc đã hết hạn
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey()) // Verify signature với secret key
                    .build()
                    .parseSignedClaims(token); // Parse và verify
            return true;
        } catch (SignatureException e) {
            // Signature không khớp → Token bị giả mạo
            logger.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            // Token format sai
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            // Token đã hết hạn
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }
}