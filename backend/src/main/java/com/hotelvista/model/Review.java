package com.hotelvista.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "reviews")
@AllArgsConstructor
@NoArgsConstructor
@Data
@ToString
public class Review {
    @Id
    @Column(name = "review_id")
    private String reviewID;

    private double rating;

    @Column(name = "room_quantity")
    private int roomQuantity;

    @Column(name = "service_quantity")
    private int serviceQuality;

    private int location;

    @Column(name = "value_for_money")
    private int valueForMoney;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String comment;

    @Column(name = "review_date")
    private LocalDateTime reviewDate;

    @Column(name = "is_anonymous")
    private boolean isAnonymous;

    @ElementCollection
    @CollectionTable(name = "review_images", joinColumns = @JoinColumn(name = "review_id"))
    @Column(name = "images_url")
    private List<String> images;

    @OneToOne(mappedBy = "review")
    private BookingDetail bookingDetail;
}
