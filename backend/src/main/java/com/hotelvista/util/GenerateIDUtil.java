package com.hotelvista.util;

import java.util.UUID;

/**
 * Lớp tiện ích để tạo ID duy nhất cho các entity trong hệ thống.
 * Sử dụng UUID để đảm bảo tính duy nhất.
 */
public class GenerateIDUtil {
    /**
     * Tạo ID duy nhất với prefix và độ dài xác định.
     * ID được tạo từ UUID ngẫu nhiên, bỏ dấu gạch ngang và chuyển thành chữ hoa.
     * 
     * Ví dụ: generateID("CU", 8) có thể trả về "CU7A9B2F"
     * 
     * @param prefix tiền tố của ID (ví dụ: "CU" cho Customer, "BK" cho Booking)
     * @param length độ dài tổng của ID (bao gồm cả prefix)
     * @return chuỗi ID duy nhất với format: prefix + random UUID substring
     */
    public static String generateID(String prefix, int length) {
        String uuid = UUID.randomUUID().toString().replace("-", "").toUpperCase();
        return prefix + uuid.substring(0, length - prefix.length());
    }
}