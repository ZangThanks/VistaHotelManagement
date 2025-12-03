package com.hotelvista.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hotelvista.model.enums.RuleType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Entity
@Table(name = "policy_rule")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class CheckInCheckOutPolicyRule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private RuleType type; // EARLY_CHECKIN hoặc LATE_CHECKOUT

    private LocalTime startTime;
    private LocalTime endTime;

    private Double surchargePercentage;

    private Boolean isDayCharge; // True nếu tính bằng 100% (coi như 1 ngày)

    //level 2 == gold và cao hơn được miễn phí khi check out muộn trong khung giowf 12-13h
    private Integer freeForMinRankLevel;

    @ManyToOne
    @JoinColumn(name = "policy_id")
    @JsonIgnore
    private CheckInCheckOutPolicy policy;
}