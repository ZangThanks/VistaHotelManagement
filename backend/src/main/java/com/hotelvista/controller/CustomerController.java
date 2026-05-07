package com.hotelvista.controller;

import com.hotelvista.model.CartBean;
import com.hotelvista.model.Customer;
import com.hotelvista.model.enums.Gender;
import com.hotelvista.model.enums.MemberShipLevel;
import com.hotelvista.model.enums.UserRole;
import com.hotelvista.service.CartBeanService;
import com.hotelvista.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/customers")
public class CustomerController {
    @Autowired
    private CustomerService service;

    @Autowired
    private CartBeanService cartBeanService;

    @Autowired
    private PasswordEncoder passwordEncoder;

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
    // java
    public ResponseEntity<?> createOrUpdateCustomer(@RequestBody Customer customer) {
        // If updating existing customer -> update (but prevent collisions with other records)
        if (customer.getId() != null) {
            Customer existing = service.findById(customer.getId());
            if (existing != null) {
                Customer byEmail = customer.getEmail() != null ? service.findByEmail(customer.getEmail()) : null;
                if (byEmail != null && !byEmail.getId().equals(existing.getId())) {
                    return ResponseEntity.status(409).body("Email already exists");
                }
                Customer byPhone = customer.getPhone() != null ? service.findByPhone(customer.getPhone()) : null;
                if (byPhone != null && !byPhone.getId().equals(existing.getId())) {
                    return ResponseEntity.status(409).body("Phone already exists");
                }
                Customer byUser = customer.getUserName() != null ? service.findByUserName(customer.getUserName()) : null;
                if (byUser != null && !byUser.getId().equals(existing.getId())) {
                    return ResponseEntity.status(409).body("Username already exists");
                }

                existing.setFullName(customer.getFullName());
                existing.setEmail(customer.getEmail());
                existing.setPhone(customer.getPhone());
                existing.setAddress(customer.getAddress());
                existing.setBirthDate(customer.getBirthDate());
                existing.setGender(customer.getGender() != null ? customer.getGender() : existing.getGender());
                if (customer.getPassword() != null && !customer.getPassword().isBlank()) {
                    existing.setPassword(passwordEncoder.encode(customer.getPassword()));
                }
                service.save(existing);
                return ResponseEntity.ok(existing);
            }
        }

        // Creating new customer -> reject if any unique field already exists
        if (customer.getEmail() != null && service.findByEmail(customer.getEmail()) != null) {
            return ResponseEntity.status(409).body("Email already exists");
        }
        if (customer.getPhone() != null && service.findByPhone(customer.getPhone()) != null) {
            return ResponseEntity.status(409).body("Phone already exists");
        }
        if (customer.getUserName() != null && service.findByUserName(customer.getUserName()) != null) {
            return ResponseEntity.status(409).body("Username already exists");
        }

        Customer c = new Customer();
        c.setId(service.generateCustomerId());
        c.setUserName(customer.getUserName());
        c.setFullName(customer.getFullName());
        c.setEmail(customer.getEmail());
        c.setPhone(customer.getPhone());
        c.setAddress(customer.getAddress());
        c.setGender(customer.getGender() != null ? customer.getGender() : Gender.MALE);
        c.setUserRole(UserRole.CUSTOMER);
        c.setJoinedDate(LocalDate.now());
        c.setLoyaltyPoints(0);
        c.setReputationPoint(100);
        c.setMemberShipLevel(MemberShipLevel.BRONZE);

        if (customer.getPassword() != null) {
            c.setPassword(passwordEncoder.encode(customer.getPassword()));
        }

        service.save(c);

        CartBean cartBean = new CartBean();
        cartBean.setCustomer(c);
        cartBeanService.save(cartBean);

        c.setCartBean(cartBean);
        service.save(c);

        return ResponseEntity.status(201).body(c);
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
