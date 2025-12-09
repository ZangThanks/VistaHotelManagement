package com.hotelvista.repository;

import com.hotelvista.model.BookingCancellation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingCancellationRepository extends JpaRepository<BookingCancellation, String> {
}
