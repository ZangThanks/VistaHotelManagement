package com.hotelvista.model;


import com.hotelvista.model.enums.OrderStatus;
import com.hotelvista.model.enums.PaymentMethod;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@IdClass(BookingService.BookingServiceId.class)
@Table(name = "booking_services")
public class BookingService {
    @Id
    @ManyToOne
    @JoinColumn(name = "service_id")
    private Service service;

    @Id
    @ManyToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @Column(name = "service_price")
    private double servicePrice;

    private int quantity;

    @Column(name = "total_amount")
    private double totalAmount;

    @Enumerated(EnumType.STRING)
    private OrderStatus orderStatus;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @EqualsAndHashCode
    @AllArgsConstructor
    @NoArgsConstructor
    public static class BookingServiceId implements Serializable {
        private Service service;
        private Booking booking;
    }
}
