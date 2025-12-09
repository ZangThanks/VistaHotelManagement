package com.hotelvista.service;

import com.hotelvista.dto.hourlyrate.HourlyRateCalculationDTO;
import com.hotelvista.model.RoomType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class HourlyRateService {

    @Autowired
    private RoomTypeService roomTypeService;

    /**
     * Bảng phần trăm theo số giờ
     */
    private static final Map<Integer, Integer> HOURLY_RATE_TABLE = new HashMap<>() {{
        put(1, 15);
        put(2, 25);
        put(3, 35);
        put(4, 45);
        put(5, 55);
        put(6, 65);
        put(7, 75);
        put(8, 85);
    }};

    /**
     * Phụ phí cuối tuần (%)
     */
    private static final int WEEKEND_SURCHARGE = 15;

    /**
     * Kiểm tra có phải cuối tuần không
     * @param dateTime - Ngày giờ cần kiểm tra
     * @return true nếu là Thứ 7 hoặc Chủ Nhật
     */
    public boolean isWeekend(LocalDateTime dateTime) {
        DayOfWeek dayOfWeek = dateTime.getDayOfWeek();
        return dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY;
    }

    /**
     * Lấy phần trăm giá theo số giờ
     * @param hours - Số giờ thuê
     * @return Phần trăm giá theo bảng quy định
     */
    public int getHourlyPercentage(int hours) {
        if (hours < 1) {
            return 0;
        }
        if (hours >= 9) {
            return 100; // 9+ giờ = 100%
        }
        return HOURLY_RATE_TABLE.getOrDefault(hours, 100);
    }

    /**
     * Tính toán giá theo giờ
     * @param roomTypeId - ID loại phòng
     * @param hours - Số giờ thuê
     * @param checkInDateTime - Ngày giờ check-in
     * @return Object chứa thông tin chi tiết về giá
     */
    public HourlyRateCalculationDTO calculateHourlyRate(
            String roomTypeId,
            int hours,
            LocalDateTime checkInDateTime
    ) {
        // 1. Lấy giá phòng cơ bản
        RoomType roomType = roomTypeService.selectById(roomTypeId)
                .orElseThrow(() -> new RuntimeException("Room type not found: " + roomTypeId));

        double basePrice = roomType.getBasePrice();
        List<String> breakdown = new ArrayList<>();

        // 2. Lấy phần trăm cơ bản theo số giờ
        int basePercentage = getHourlyPercentage(hours);
        breakdown.add(String.format("Số giờ: %d giờ → %d%% giá cơ bản", hours, basePercentage));

        // 3. Kiểm tra cuối tuần
        boolean weekend = isWeekend(checkInDateTime);
        int weekendSurcharge = weekend ? WEEKEND_SURCHARGE : 0;

        if (weekend) {
            breakdown.add(String.format("Phụ thu cuối tuần: +%d%%", WEEKEND_SURCHARGE));
        }

        // 4. Tính tổng phần trăm
        int totalPercentage = basePercentage + weekendSurcharge;
        breakdown.add(String.format("Tổng phần trăm: %d%%", totalPercentage));

        // 5. Tính tổng tiền
        double totalAmount = (basePrice * totalPercentage) / 100.0;
        breakdown.add(String.format("Giá phòng/đêm: %.0f VNĐ", basePrice));
        breakdown.add(String.format("Tổng tiền: %.0f VNĐ", totalAmount));

        // 6. Tạo DTO response
        HourlyRateCalculationDTO result = new HourlyRateCalculationDTO();
        result.setBasePrice(basePrice);
        result.setHours(hours);
        result.setBasePercentage(basePercentage);
        result.setIsWeekend(weekend);
        result.setWeekendSurcharge(weekendSurcharge);
        result.setTotalPercentage(totalPercentage);
        result.setTotalAmount(totalAmount);
        result.setBreakdown(breakdown);

        return result;
    }

    /**
     * Tính giá theo giờ với giá phòng tùy chỉnh
     * @param basePrice - Giá phòng/đêm
     * @param hours - Số giờ thuê
     * @param checkInDateTime - Ngày giờ check-in
     * @return Object chứa thông tin chi tiết về giá
     */
    public HourlyRateCalculationDTO calculateHourlyRateWithCustomPrice(
            double basePrice,
            int hours,
            LocalDateTime checkInDateTime
    ) {
        List<String> breakdown = new ArrayList<>();

        // 1. Lấy phần trăm cơ bản theo số giờ
        int basePercentage = getHourlyPercentage(hours);
        breakdown.add(String.format("Số giờ: %d giờ → %d%% giá cơ bản", hours, basePercentage));

        // 2. Kiểm tra cuối tuần
        boolean weekend = isWeekend(checkInDateTime);
        int weekendSurcharge = weekend ? WEEKEND_SURCHARGE : 0;

        if (weekend) {
            breakdown.add(String.format("Phụ thu cuối tuần: +%d%%", WEEKEND_SURCHARGE));
        }

        // 3. Tính tổng phần trăm
        int totalPercentage = basePercentage + weekendSurcharge;
        breakdown.add(String.format("Tổng phần trăm: %d%%", totalPercentage));

        // 4. Tính tổng tiền
        double totalAmount = (basePrice * totalPercentage) / 100.0;
        breakdown.add(String.format("Giá phòng/đêm: %.0f VNĐ", basePrice));
        breakdown.add(String.format("Tổng tiền: %.0f VNĐ", totalAmount));

        // 5. Tạo DTO response
        HourlyRateCalculationDTO result = new HourlyRateCalculationDTO();
        result.setBasePrice(basePrice);
        result.setHours(hours);
        result.setBasePercentage(basePercentage);
        result.setIsWeekend(weekend);
        result.setWeekendSurcharge(weekendSurcharge);
        result.setTotalPercentage(totalPercentage);
        result.setTotalAmount(totalAmount);
        result.setBreakdown(breakdown);

        return result;
    }

    /**
     * Lấy bảng giá theo giờ
     * @return Map của số giờ và phần trăm giá
     */
    public Map<Integer, Integer> getHourlyRateTable() {
        return new HashMap<>(HOURLY_RATE_TABLE);
    }

    /**
     * Lấy phụ phí cuối tuần
     * @return Phần trăm phụ phí cuối tuần
     */
    public int getWeekendSurcharge() {
        return WEEKEND_SURCHARGE;
    }
}
