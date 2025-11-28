package com.hotelvista.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.util.*;

@Entity
@Table(name = "hourly_rate_policy")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HourlyRatePolicy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String policyName;

    private Double weekendSurcharge;

    @ElementCollection
    @CollectionTable(name = "policy_weekend_days", joinColumns = @JoinColumn(name = "policy_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week")
    private Set<DayOfWeek> weekendDays = new HashSet<>();

    @ElementCollection
    @CollectionTable(name = "policy_base_rates", joinColumns = @JoinColumn(name = "policy_id"))
    @MapKeyColumn(name = "hours_duration")
    @Column(name = "percentage")
    private Map<Integer, Double> baseRates = new HashMap<>();


}
