package com.hotelvista.util;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

/**
 * Comprehensive validation utilities for backend
 * Matches frontend validation rules
 */
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

    /**
     * Validate voucher code
     */
    public static String validateVoucherCode(String code) {
        if (code == null || code.trim().isEmpty()) {
            return "Voucher code is required";
        }

        String trimmed = code.trim();
        if (trimmed.length() < 3) {
            return "Voucher code must be at least 3 characters";
        }

        if (trimmed.length() > 20) {
            return "Voucher code must not exceed 20 characters";
        }

        if (!trimmed.matches("^[A-Z0-9_]+$")) {
            return "Voucher code can only contain uppercase letters, numbers, and underscores";
        }

        return null;
    }

    /**
     * Validate voucher name
     */
    public static String validateVoucherName(String name) {
        if (name == null || name.trim().isEmpty()) {
            return "Voucher name is required";
        }

        String trimmed = name.trim();
        if (trimmed.length() < 5) {
            return "Voucher name must be at least 5 characters";
        }

        if (trimmed.length() > 100) {
            return "Voucher name must not exceed 100 characters";
        }

        return null;
    }

    /**
     * Validate discount percentage (0-100)
     */
    public static String validateDiscountPercentage(Double percentage) {
        if (percentage == null) {
            return "Discount percentage is required";
        }

        if (percentage <= 0) {
            return "Discount percentage must be greater than 0";
        }

        if (percentage > 100) {
            return "Discount percentage must not exceed 100";
        }

        return null;
    }

    /**
     * Validate discount amount (VND)
     */
    public static String validateDiscountAmount(Double amount) {
        if (amount == null) {
            return "Discount amount is required";
        }

        if (amount < 1000) {
            return "Discount amount must be at least 1,000 VND";
        }

        if (amount > 10000000) {
            return "Discount amount must not exceed 10,000,000 VND";
        }

        return null;
    }

    /**
     * Validate promotion ID
     */
    public static String validatePromotionId(String id) {
        if (id == null || id.trim().isEmpty()) {
            return "Promotion ID is required";
        }

        String trimmed = id.trim();
        if (trimmed.length() < 3) {
            return "Promotion ID must be at least 3 characters";
        }

        if (trimmed.length() > 20) {
            return "Promotion ID must not exceed 20 characters";
        }

        if (!trimmed.matches("^[A-Za-z0-9_]+$")) {
            return "Promotion ID can only contain letters, numbers, and underscores";
        }

        return null;
    }

    /**
     * Validate promotion name
     */
    public static String validatePromotionName(String name) {
        if (name == null || name.trim().isEmpty()) {
            return "Promotion name is required";
        }

        String trimmed = name.trim();
        if (trimmed.length() < 5) {
            return "Promotion name must be at least 5 characters";
        }

        if (trimmed.length() > 150) {
            return "Promotion name must not exceed 150 characters";
        }

        return null;
    }

    /**
     * Validate promotion description
     */
    public static String validateDescription(String description) {
        if (description == null || description.trim().isEmpty()) {
            return "Description is required";
        }

        String trimmed = description.trim();
        if (trimmed.length() < 10) {
            return "Description must be at least 10 characters";
        }

        if (trimmed.length() > 1000) {
            return "Description must not exceed 1000 characters";
        }

        return null;
    }

    /**
     * Validate promotion type name
     */
    public static String validatePromotionTypeName(String name) {
        if (name == null || name.trim().isEmpty()) {
            return "Promotion type name is required";
        }

        String trimmed = name.trim();
        if (trimmed.length() < 3) {
            return "Promotion type name must be at least 3 characters";
        }

        if (trimmed.length() > 50) {
            return "Promotion type name must not exceed 50 characters";
        }

        return null;
    }

    /**
     * Validate room type ID
     */
    public static String validateRoomTypeId(String id) {
        if (id == null || id.trim().isEmpty()) {
            return "Room type ID is required";
        }

        String trimmed = id.trim();
        if (trimmed.length() < 2) {
            return "Room type ID must be at least 2 characters";
        }

        if (trimmed.length() > 20) {
            return "Room type ID must not exceed 20 characters";
        }

        if (!trimmed.matches("^[A-Za-z0-9_]+$")) {
            return "Room type ID can only contain letters, numbers, and underscores";
        }

        return null;
    }

    /**
     * Validate room type name
     */
    public static String validateRoomTypeName(String name) {
        if (name == null || name.trim().isEmpty()) {
            return "Room type name is required";
        }

        String trimmed = name.trim();
        if (trimmed.length() < 3) {
            return "Room type name must be at least 3 characters";
        }

        if (trimmed.length() > 100) {
            return "Room type name must not exceed 100 characters";
        }

        return null;
    }

    /**
     * Validate room capacity
     */
    public static String validateCapacity(Integer capacity) {
        if (capacity == null) {
            return "Capacity is required";
        }

        if (capacity < 1) {
            return "Capacity must be at least 1";
        }

        if (capacity > 20) {
            return "Capacity must not exceed 20 people";
        }

        return null;
    }

    /**
     * Validate room price (VND)
     */
    public static String validateRoomPrice(Double price) {
        if (price == null) {
            return "Price is required";
        }

        if (price < 100000) {
            return "Price must be at least 100,000 VND";
        }

        if (price > 100000000) {
            return "Price must not exceed 100,000,000 VND";
        }

        if (price % 1000 != 0) {
            return "Price must be a multiple of 1,000 VND";
        }

        return null;
    }

    /**
     * Validate room size (m²)
     */
    public static String validateRoomSize(Double size) {
        if (size == null) {
            return "Room size is required";
        }

        if (size < 10) {
            return "Room size must be at least 10 m²";
        }

        if (size > 500) {
            return "Room size must not exceed 500 m²";
        }

        return null;
    }

    /**
     * Validate room number
     */
    public static String validateRoomNumber(String roomNumber) {
        if (roomNumber == null || roomNumber.trim().isEmpty()) {
            return "Room number is required";
        }

        String trimmed = roomNumber.trim();
        if (trimmed.length() < 1) {
            return "Room number must be at least 1 character";
        }

        if (trimmed.length() > 10) {
            return "Room number must not exceed 10 characters";
        }

        if (!trimmed.matches("^[A-Za-z0-9-]+$")) {
            return "Room number can only contain letters, numbers, and dashes";
        }

        return null;
    }

    /**
     * Validate floor number
     */
    public static String validateFloor(Integer floor) {
        if (floor == null) {
            return "Floor is required";
        }

        if (floor < 1) {
            return "Floor must be greater than 0";
        }

        if (floor > 100) {
            return "Floor must not exceed 100";
        }

        return null;
    }

    /**
     * Validate required string field
     */
    public static String validateRequired(String value, String fieldName) {
        if (value == null || value.trim().isEmpty()) {
            return fieldName + " is required";
        }
        return null;
    }

    /**
     * Validate positive number
     */
    public static String validatePositiveNumber(Double value, String fieldName) {
        if (value == null) {
            return fieldName + " is required";
        }

        if (value <= 0) {
            return fieldName + " must be greater than 0";
        }

        return null;
    }


    // Date Validations

    /**
     * Validate ngày bắt đầu không phải là null và không phải là ngày trong quá khứ
     *
     * @param startDate - Ngày bắt đầu cần xác thực
     * @return Thông báo lỗi nếu không hợp lệ, null nếu hợp lệ
     */
    public static String validateStartDate(LocalDate startDate) {
        if (startDate == null) {
            return "Start date is required";
        }

        // Optional: Check if start date is not too far in the past
        LocalDate now = LocalDate.now();
        if (startDate.isBefore(now.minusDays(1))) {
            return "Start date cannot be in the past";
        }

        return null;
    }

    /**
     * Validate ngày kết thúc không phải là null
     *
     * @param endDate - Ngày kết thúc cần xác thực
     * @return Thông báo lỗi nếu không hợp lệ, null nếu hợp lệ
     */
    public static String validateEndDate(LocalDate endDate) {
        if (endDate == null) {
            return "End date is required";
        }

        return null;
    }

    /**
     * Validate phạm vi ngày cho phiếu mua hàng (tối đa 2 năm)
     * Validate:
     * - Cả hai ngày đều không null
     * - Ngày kết thúc sau ngày bắt đầu
     * - Thời hạn không quá 2 năm
     *
     * @param startDate - Ngày bắt đầu
     * @param endDate - Ngày kết thúc
     * @return Thông báo lỗi nếu không hợp lệ, null nếu hợp lệ
     */
    public static String validateDateRange(LocalDate startDate, LocalDate endDate) {
        if (startDate == null) {
            return "Start date is required";
        }

        if (endDate == null) {
            return "End date is required";
        }

        if (!endDate.isAfter(startDate)) {
            return "End date must be after start date";
        }

        // Check if date range is too long (more than 2 years for vouchers)
        long daysBetween = ChronoUnit.DAYS.between(startDate, endDate);
        long twoYearsInDays = 2 * 365;

        if (daysBetween > twoYearsInDays) {
            return "Voucher validity period cannot exceed 2 years";
        }

        return null;
    }

    /**
     * Validate phạm vi ngày cho các chương trình khuyến mãi (tối đa 1 năm)
     * Validate:
     * - Cả hai ngày đều không null
     * - Ngày kết thúc sau ngày bắt đầu
     * - Thời hạn không quá 1 năm
     *
     * @param startDate - Ngày bắt đầu
     * @param endDate - Ngày kết thúc
     * @return Thông báo lỗi nếu không hợp lệ, null nếu hợp lệ
     */
    public static String validatePromotionDateRange(LocalDate startDate, LocalDate endDate) {
        if (startDate == null) {
            return "Start date is required";
        }

        if (endDate == null) {
            return "End date is required";
        }

        if (!endDate.isAfter(startDate)) {
            return "End date must be after start date";
        }

        // Check if date range is too long (more than 1 year for promotions)
        long daysBetween = ChronoUnit.DAYS.between(startDate, endDate);
        long oneYearInDays = 365;

        if (daysBetween > oneYearInDays) {
            return "Promotion duration cannot exceed 1 year";
        }

        return null;
    }

    /**
     * Validate ngày nằm trong phạm vi tương lai hợp lý (ví dụ: tối đa 5 năm tới)
     *
     * @param date - Ngày cần xác thực
     * @param maxYearsAhead - Số năm tối đa được phép trong tương lai
     * @return Thông báo lỗi nếu không hợp lệ, null nếu hợp lệ
     */
    public static String validateFutureDate(LocalDate date, int maxYearsAhead) {
        if (date == null) {
            return "Date is required";
        }

        LocalDate maxDate = LocalDate.now().plusYears(maxYearsAhead);

        if (date.isAfter(maxDate)) {
            return "Date cannot be more than " + maxYearsAhead + " years in the future";
        }

        return null;
    }
}
