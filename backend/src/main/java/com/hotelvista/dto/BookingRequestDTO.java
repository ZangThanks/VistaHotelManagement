package com.hotelvista.dto;

import com.hotelvista.model.Booking;
import com.hotelvista.model.BookingDetail;
import com.hotelvista.model.BookingService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingRequestDTO {
    private Booking booking;
    private List<BookingDetail> bookingDetails;
    private List<BookingService> bookingServices;
}
