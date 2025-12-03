package com.hotelvista.util;

import com.hotelvista.model.Booking;
import com.hotelvista.model.Customer;
import com.hotelvista.model.enums.PaymentStatus;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class PaymentUtil {
    /**
     * Trích booking ID từ payment content or description
     * "Qafmgq4306  SEPAY7974 1  108449638088-B2411250005-CHUYEN TIEN..."
     */
    public static String extractBookingId(String content, String description) {
        // Try content first
        String text = (content != null && !content.trim().isEmpty()) ? content : description;
        if (text == null || text.trim().isEmpty()) {
            return null;
        }

        System.out.println("Extracting booking ID from: " + text);

        // Bank format: Look for booking ID pattern B + 10 digits
        // Example: "Qafmgq4306  SEPAY7974 1  108449638088-B2411250005-CHUYEN TIEN..."
        // Booking ID format: B[ddMMyy][sequence] e.g., B2411250005

        // Use regex to find booking ID pattern in the entire text
        Pattern pattern = java.util.regex.Pattern.compile("B\\d{10}");
        Matcher matcher = pattern.matcher(text);

        if (matcher.find()) {
            String bookingId = matcher.group();
            System.out.println("Extracted booking ID using regex pattern: " + bookingId);
            return bookingId;
        }

        System.out.println("No booking ID found in text");
        return null;
    }

    /**
     * Tính toán số tiền thanh toán dự kiến dự trên điểm uy tín (reputationScore) của khách hàng
     */
    public static double calculateExpectedPaymentAmount(Booking booking, Customer customer) {
        double totalAmount = booking.getTotalAmount();
        int reputation = customer.getReputationPoint();

        if (reputation >= 0 && reputation <= 40) {
            return totalAmount; // 100% prepayment
        } else if (reputation > 40 && reputation <= 80) {
            return totalAmount * 0.3; // 30% prepayment
        } else {
            // For high reputation (81-100), they can choose 0%, 50%, or 100%
            // We can't know their choice here, so return 0 to skip validation
            return 0;
        }
    }

    /**
     * Xác định payment status dựa trên số tiền đã thanh toán và tổng số tiền
     */
    public static PaymentStatus determinePaymentStatus(double paidAmount, double totalAmount, Customer customer) {
        if (paidAmount <= 0) {
            return PaymentStatus.PENDING;
        }

        double percentage = (paidAmount / totalAmount) * 100;

        if (percentage >= 99) { // Allow small tolerance
            return PaymentStatus.PAID;
        } else if (percentage >= 45 && percentage < 55) {
            return PaymentStatus.PERCENTAGE_50;
        } else if (percentage >= 25 && percentage < 35) {
            return PaymentStatus.PERCENTAGE_30;
        } else {
            return PaymentStatus.PAID; // Any payment received marks as paid
        }
    }
}
