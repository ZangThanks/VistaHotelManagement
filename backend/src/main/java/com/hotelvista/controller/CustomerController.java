package com.hotelvista.controller;

import com.hotelvista.model.CartBean;
import com.hotelvista.model.Customer;
import com.hotelvista.service.CartBeanService;
import com.hotelvista.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/customers")
public class CustomerController {
    @Autowired
    private CustomerService service;

    @Autowired
    private CartBeanService cartBeanService;

    /**
     * Lấy danh sách tất cả khách hàng.
     * @return List<Customer>
     */
    @GetMapping
    public List<Customer> getAllCustomers() {
        return service.findAll();
    }

    @GetMapping("/search")
    public List<Customer> searchCustomers(@RequestParam String name) {
        return service.findAllByFullNameContainingIgnoreCase(name);
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
    @PostMapping("/save")
    public Customer createOrUpdateCustomer(@RequestBody Customer customer) {
        if (customer.getReputationPoint() == null) {
            customer.setReputationPoint(100);
        }
        service.save(customer);
        return customer;
    }

    @PutMapping("/{customerId}")
    public Customer updateCustomerProfile(@PathVariable String customerId, @RequestBody Customer customer) {
        Customer cust = service.findById(customerId);
        if (cust != null) {
            cust.setFullName(customer.getFullName());
            cust.setPhone(customer.getPhone());
            cust.setEmail(customer.getEmail());
            cust.setAddress(customer.getAddress());
            cust.setBirthDate(customer.getBirthDate());
            cust.setGender(customer.getGender());

            service.save(cust);
        }
        return cust;
    }

    /**
     * Tìm khách hàng theo số điện thoại
     */
    @GetMapping("/by-phone/{phone}")
    public ResponseEntity<Customer> getCustomerByPhone(@PathVariable String phone) {
        Customer customer = service.findByPhone(phone);
        if (customer != null) {
            return ResponseEntity.ok(customer);
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Tìm khách hàng theo email
     */
    @GetMapping("/by-email/{email}")
    public ResponseEntity<Customer> getCustomerByEmail(@PathVariable String email) {
        Customer customer = service.findByEmail(email);
        if (customer != null) {
            return ResponseEntity.ok(customer);
        }
        return ResponseEntity.notFound().build();
    }
    /**
     * Cập nhật avatar Customer
     */
    @PutMapping("/{customerId}/avatar")
    public Customer updateCustomerAvatar(@PathVariable String customerId, @RequestBody Map<String, String> body) {
        String avatarUrl = body.get("avatarUrl");
        Customer cust = service.findById(customerId);
        if (cust != null && avatarUrl != null) {
            cust.setAvatarUrl(avatarUrl);
            service.save(cust);
        }
        return cust;
    }
}
