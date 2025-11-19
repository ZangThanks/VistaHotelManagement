package com.hotelvista.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hotelvista.model.enums.DiscountType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "promotions")
public class Promotion {
    @Id
    @Column(name = "promotion_id")
    private String promotionID;

    @Column(name = "promotion_name", columnDefinition = "NVARCHAR(255)")
    private String promotionName;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type")
    private DiscountType discountType;

    @Column(name = "is_active")
    private boolean isActive;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "admin_id")
    private Admin admin;

    @ToString.Exclude
    @JsonIgnore
    @OneToMany(mappedBy = "promotion")
    private List<RoomTypePromotion> roomTypePromotions;

    @ManyToOne(fetch =  FetchType.EAGER)
    @JoinColumn(name = "promotion_type_id")
    private PromotionType promotionType;
}
