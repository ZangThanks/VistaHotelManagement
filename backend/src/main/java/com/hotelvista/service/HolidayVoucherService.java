package com.hotelvista.service;

import com.hotelvista.model.HolidayVoucher;
import com.hotelvista.repository.HolidayVoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class HolidayVoucherService {
    @Autowired
    private HolidayVoucherRepository holidayVoucherRepository;

    public List<HolidayVoucher> findAll() {
        return holidayVoucherRepository.findAll();
    }

    public void save(HolidayVoucher holidayVoucher) {
        holidayVoucherRepository.save(holidayVoucher);
    }

    public List<HolidayVoucher> findByHolidayDate(LocalDate holidayDate) {
        return holidayVoucherRepository.findByHolidayDate(holidayDate);
    }
}
