package com.hotelvista.controller;

import com.hotelvista.dto.HolidayVoucherDTO;
import com.hotelvista.model.HolidayVoucher;
import com.hotelvista.model.Voucher;
import com.hotelvista.service.HolidayVoucherService;
import com.hotelvista.service.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/holiday-vouchers")
public class HolidayVoucherController {

    @Autowired
    private HolidayVoucherService holidayVoucherService;

    @Autowired
    private VoucherService voucherService;

    @PostMapping
    public ResponseEntity<?> saveHolidayVouchers(@RequestBody List<HolidayVoucherDTO> holidayDTOs) {
        try {
            for (HolidayVoucherDTO dto : holidayDTOs) {
                HolidayVoucher holidayVoucher = new HolidayVoucher();
                holidayVoucher.setHolidayId(dto.getHolidayId());
                holidayVoucher.setHolidayName(dto.getHolidayName());
                holidayVoucher.setHolidayDate(dto.getHolidayDate());

                Voucher voucher = voucherService.findById(dto.getVoucherId());
                holidayVoucher.setVoucher(voucher);
                holidayVoucher.setActive(dto.isActive());

                holidayVoucherService.save(holidayVoucher);
            }
            return ResponseEntity.ok("Holiday vouchers saved successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getActiveHolidayVouchers() {
        try {
            List<HolidayVoucher> holidays = holidayVoucherService.findAll();
            return ResponseEntity.ok(holidays);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/today")
    public ResponseEntity<?> getTodayHolidays() {
        try {
            LocalDate today = LocalDate.now();
            List<HolidayVoucher> holidays = holidayVoucherService.findByHolidayDate(today);
            return ResponseEntity.ok(holidays);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
