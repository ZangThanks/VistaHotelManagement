package com.hotelvista.scheduler;

import com.hotelvista.model.Customer;
import com.hotelvista.model.HolidayVoucher;
import com.hotelvista.service.CustomerService;
import com.hotelvista.service.CustomerVoucherService;
import com.hotelvista.service.HolidayVoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class HolidayVoucherScheduler {

    @Autowired
    private HolidayVoucherService holidayVoucherService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private CustomerVoucherService customerVoucherService;

    @Scheduled(cron = "0 0 8 * * *")
    public void distributeHolidayVouchers() {
        LocalDate today = LocalDate.now();
        List<HolidayVoucher> todayHolidays = holidayVoucherService.findByHolidayDate(today);

        for (HolidayVoucher holidayVoucher : todayHolidays) {
            if (!holidayVoucher.isActive()) {
                continue;
            }

            List<Customer> customers = customerService.findAll();
            for (Customer customer : customers) {
                customerVoucherService.assignVoucher(customer, holidayVoucher.getVoucher());
            }
        }
    }
}
