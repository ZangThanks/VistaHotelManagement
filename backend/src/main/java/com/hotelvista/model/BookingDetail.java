package com.hotelvista.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@IdClass(BookingDetail.BookingDetailId.class)
@Table(name = "booking_details")
public class BookingDetail {
    @Id
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "room_id")
    private Room room;

    @Id
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @Column(name = "room_price")
    private Double roomPrice;

    @ToString.Exclude
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "review_id")
    @JsonIgnore
    private Review review;

    @EqualsAndHashCode
    @AllArgsConstructor
    @NoArgsConstructor
    public static class BookingDetailId implements Serializable {
        private Room room;
        private Booking booking;
    }
}
