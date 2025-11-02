package com.hotelvista.controller;

import com.hotelvista.model.Customer;
import com.hotelvista.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customers")
public class CustomerController {
    @Autowired
    private CustomerService service;

    /**
     * Lấy danh sách tất cả khách hàng.
     * @return List<Customer>
     */
    @GetMapping
    public List<Customer> getAllCustomers() {
        return service.findAll();
    }

    //TODO: HAI HÀM FIND BY ID
    @GetMapping("/{id}")
    public Customer findById(@PathVariable("id") String id) {
        return service.findById(id);
    }

    /**
     * Lấy thông tin khách hàng theo ID.
     *
     * @param id mã khách hàng
     * @return đối tượng Customer hoặc null nếu không tìm thấy
     */
    @GetMapping("/{id}")
    public Customer getCustomerById(@PathVariable String id) {
        return service.findById(id);
    }

    /**
     * Thêm hoặc cập nhật thông tin khách hàng.
     *
     * @param customer đối tượng Customer cần lưu
     * @return Customer đã lưu
     */
    @PostMapping
    public Customer createOrUpdateCustomer(@RequestBody Customer customer) {
        service.save(customer);
        return customer;
    }

}
