package com.hotelvista.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HolidayVoucherDTO {
    private String holidayId;
    private String holidayName;
    private LocalDate holidayDate;
    private String voucherId;
    private boolean isActive;
}
