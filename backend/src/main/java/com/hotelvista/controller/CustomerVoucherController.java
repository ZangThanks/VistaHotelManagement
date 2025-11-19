package com.hotelvista.controller;

import com.hotelvista.model.CustomerVoucher;
import com.hotelvista.service.CustomerVoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customer-vouchers")
public class CustomerVoucherController {
    @Autowired
    private CustomerVoucherService service;

    @PostMapping("/save")
    public boolean save(@RequestBody CustomerVoucher customerVoucher) {
        return service.save(customerVoucher);
    }

    @GetMapping("")
    public List<CustomerVoucher> findAll() {
        return service.findAll();
    }

    @GetMapping("/customer/{id}")
    public List<CustomerVoucher> findAllByCustomer_Id(@PathVariable("id") String customerId) {
        return service.findAllByCustomer_Id(customerId);
    }

    @GetMapping("/customer-and-state")
    public List<CustomerVoucher> findByCustomerAndState(@RequestParam("customerId") String customerId, @RequestParam("state") boolean state) {
        return service.findByCustomerAndState(customerId, state);
    }

    @GetMapping("/customer-available/{id}")
    public List<CustomerVoucher> findAllByCustomer_IdAndStateIsTrue(@PathVariable("id") String customerId) {
        return service.findAllByCustomer_IdAndStateIsTrue(customerId);
    }
}
