package com.hotelvista.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DistributionHistoryDTO {
    private Long id;
    private String voucherID;
    private String voucherName;
    private String criteria;
    private Integer recipientCount;
    private LocalDateTime distributedAt;
    private String status;
}
