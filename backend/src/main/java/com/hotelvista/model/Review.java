package com.hotelvista.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Review {
    @Id
    @Column(name = "review_id")
    private String reviewID;

    private double rating;

    @Column(name = "room_quality")
    private int roomQuality;

    @Column(name = "service_quantity")
    private int serviceQuality;

    private int location;

    @Column(name = "value_for_money")
    private int valueForMoney;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String comment;

    @Column(name = "review_date")
    private LocalDateTime reviewDate;

    //ẩn danh
    @Column(name = "is_anonymous")
    private boolean isAnonymous;

    //phân biệt đánh giá chính và phản hồi
    private boolean flag;

    @ElementCollection
    @CollectionTable(name = "review_images", joinColumns = @JoinColumn(name = "review_id"))
    @Column(name = "images_url")
    private List<String> images;

    @ToString.Exclude
    @JsonIgnore
    @OneToOne(mappedBy = "review", fetch = FetchType.LAZY)
    private BookingDetail bookingDetail;

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_review_id")
    private Review parentReview;

    @OneToMany(mappedBy = "parentReview", cascade = {CascadeType.PERSIST, CascadeType.MERGE}, orphanRemoval = true)
    @JsonManagedReference
    private List<Review> replies;
}
