package com.hotelvista.controller;

import com.hotelvista.service.CustomerVoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/customer-vouchers")
public class CustomerVoucherController {
    @Autowired
    private CustomerVoucherService service;


}
