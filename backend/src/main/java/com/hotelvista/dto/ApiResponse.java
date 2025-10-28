package com.hotelvista.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Generic wrapper cho tất cả API responses
 * Chuẩn hóa format response: {success, message, data}
 * 
 * @param <T> Kiểu dữ liệu của data (có thể là bất kỳ object nào)
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
}

