package com.hotelvista.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DistributionCriteriaDTO {
    private List<String> membershipLevel;
    private List<String> gender;
    private List<Integer> birthMonth;
    private Integer minLoyaltyPoints;
}
