package com.hotelvista.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "seasonal_prices")
public class SeasonalPrice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String seasonName;

    @Column(name = "price_multiplier")
    private double priceMultiplier;

    private LocalDate startDate;
    private LocalDate endDate;
    private String description;

    @ToString.Exclude
    @ManyToMany(mappedBy = "seasonalPrices")
    @JsonIgnore
    private List<RoomType> roomTypes;
}

