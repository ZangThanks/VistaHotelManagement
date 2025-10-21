package com.hotelvista.repository;

import com.hotelvista.model.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface VoucherRepository extends JpaRepository<Voucher, String> {

    List<Voucher> findAllByStartDateAfterAndEndDateBefore(LocalDate startDateAfter, LocalDate endDateBefore);

}
