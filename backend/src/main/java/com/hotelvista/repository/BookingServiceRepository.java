package com.hotelvista.repository;

import com.hotelvista.model.BookingService;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingServiceRepository extends JpaRepository<BookingService, String> {
}
