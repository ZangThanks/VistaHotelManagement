package com.hotelvista.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "check_in_out_policy")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class CheckInCheckOutPolicy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private LocalTime standardCheckInTime = LocalTime.of(14, 0);

    private LocalTime standardCheckOutTime = LocalTime.of(12, 0);

    @OneToMany(mappedBy = "policy", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<CheckInCheckOutPolicyRule> rules;
}