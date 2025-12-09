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
    @JoinColumn(name = "room_number")
    private Room room;

    @Id
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "booking_id")
    @JsonIgnore
    private Booking booking;

    @Column(name = "room_price")
    private Double roomPrice;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "review_id")
    private Review review;

    @EqualsAndHashCode
    @AllArgsConstructor
    @NoArgsConstructor
    public static class BookingDetailId implements Serializable {
        private Room room;
        private Booking booking;
    }
}
