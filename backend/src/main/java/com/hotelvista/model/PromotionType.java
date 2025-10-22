package com.hotelvista.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "promotion_types")
public class PromotionType {
    @Id
    @Column(name = "promotion_type_id")
    private String promotionTypeID;

    @Column(name = "promotion_type_name", columnDefinition = "NVARCHAR(255)")
    private String promotionTYPEName;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String description;

    @ToString.Exclude
    @JsonIgnore
    @OneToMany(mappedBy = "promotionType")
    private Set<Promotion> promotions;


}
