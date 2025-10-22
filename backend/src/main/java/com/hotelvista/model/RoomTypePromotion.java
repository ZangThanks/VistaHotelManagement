package com.hotelvista.model;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDate;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@IdClass(RoomTypePromotion.RoomTypePromotionId.class)
@Table(name = "room_type_promotions")
public class RoomTypePromotion {
    @Id
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "room_type_id")
    private RoomType roomType;

    @Id
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "promotion_id")
    private Promotion promotion;

    @Column(name = "discount_value")
    private Double discountValue;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @EqualsAndHashCode
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RoomTypePromotionId implements Serializable {
        private Promotion promotion;
        private RoomType roomType;

    }
}
