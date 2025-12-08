package com.hotelvista.dto.hourlyrate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HourlyRateRequestDTO {
    private String roomTypeId;
    private Integer hours;
    private LocalDateTime checkInDateTime;
}
