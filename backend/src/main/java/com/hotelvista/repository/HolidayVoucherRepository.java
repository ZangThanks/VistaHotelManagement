package com.hotelvista.repository;

import com.hotelvista.model.HolidayVoucher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface HolidayVoucherRepository extends JpaRepository<HolidayVoucher, String> {
    List<HolidayVoucher> findByHolidayDate(LocalDate holidayDate);

}
