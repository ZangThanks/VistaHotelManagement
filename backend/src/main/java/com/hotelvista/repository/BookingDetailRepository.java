package com.hotelvista.repository;

import com.hotelvista.model.BookingDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingDetailRepository extends JpaRepository<BookingDetail, String> {
}
