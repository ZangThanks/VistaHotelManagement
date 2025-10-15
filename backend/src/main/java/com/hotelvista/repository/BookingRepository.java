package com.hotelvista.repository;

import com.hotelvista.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, String> {


}
