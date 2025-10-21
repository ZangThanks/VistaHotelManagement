package com.hotelvista.service;

import com.hotelvista.model.CustomerVoucher;
import com.hotelvista.repository.CustomerVoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class CustomerVoucherService {
    @Autowired
    private CustomerVoucherRepository repo;

    public List<CustomerVoucher> findAll() {
        return repo.findAll();
    }

    public boolean add(CustomerVoucher customerVoucher) {
        return repo.save(customerVoucher) != null;
    }

    public List<CustomerVoucher> findAllByVoucherStartDateAfterAndEndDateBefore(LocalDate startDate, LocalDate endDate, String customerId) {
        return repo.findAllByVoucher_StartDateAfterAndEndDateBefore(startDate, endDate, customerId);
    }
}
