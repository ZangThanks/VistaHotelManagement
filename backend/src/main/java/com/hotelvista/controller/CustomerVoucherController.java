package com.hotelvista.controller;

import com.hotelvista.model.CustomerVoucher;
import com.hotelvista.service.CustomerVoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/customer-vouchers")
public class CustomerVoucherController {
    @Autowired
    private CustomerVoucherService service;

    @GetMapping("")
    public List<CustomerVoucher> findAll() {
        return service.findAll();
    }

    @GetMapping("/customer/{id}")
    public List<CustomerVoucher> findAllByCustomer_Id(@PathVariable("id") String customerId) {
        return service.findAllByCustomer_Id(customerId);
    }
}
