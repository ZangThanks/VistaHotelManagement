package com.hotelvista.repository;

import com.hotelvista.model.BookingCancellation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingCancellationRepository extends JpaRepository<BookingCancellation,String> {

}
