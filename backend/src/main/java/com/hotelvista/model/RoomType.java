package com.hotelvista.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "room_types")
public class RoomType {
    @Id
    @Column(name = "room_type_id")
    private String roomTypeID;

    @Column(name = "type_name")
    private String typeName;

    private String description;

    private Double area;

    @Column(name = "max_occupancy")
    private Integer maxOccupancy;

    @ElementCollection
    @CollectionTable(name = "room_type_amenties", joinColumns = @JoinColumn(name = "room_type_id"))
    @Column(columnDefinition = "NVARCHAR(255)")
    private List<String> amenties;

    @Column(name = "base_price")
    private Double basePrice;

    @ToString.Exclude
    @OneToMany(mappedBy = "roomType")
    @JsonIgnore
    private List<Room> rooms;

    @ToString.Exclude
    @OneToMany(mappedBy = "roomType")
    @JsonIgnore
    private List<RoomTypePromotion> roomTypePromotions;

    @ManyToMany
    @JoinTable(
            name = "room_type_seasonal_price",
            joinColumns = @JoinColumn(name = "room_type_id"),
            inverseJoinColumns = @JoinColumn(name = "seasonal_price_id")
    )
    private List<SeasonalPrice> seasonalPrices;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hourly_rate_policy_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private HourlyRatePolicy hourlyRatePolicy;

    @ManyToOne
    @JoinColumn(name = "check_in_out_policy_id", nullable = true)
    private CheckInCheckOutPolicy checkInPolicy;

}

