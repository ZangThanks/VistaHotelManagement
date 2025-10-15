package com.hotelvista.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@IdClass(BookingDetail.BookingDetailId.class)
@Table(name = "booking_details")
public class BookingDetail {
    @Id
    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    @Id
    @ManyToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @Column(name = "room_price")
    private double roomPrice;

    @ToString.Exclude
    @OneToOne
    @JoinColumn(name = "review_id")
    private Review review;

    @EqualsAndHashCode
    @AllArgsConstructor
    @NoArgsConstructor
    public class BookingDetailId {
        private Room room;
        private Booking booking;
    }
}
