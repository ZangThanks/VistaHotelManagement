package com.hotelvista.service;

import com.hotelvista.model.Customer;
import com.hotelvista.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Service quản lý các thao tác với Customer
 * Tách riêng logic database ra khỏi Controller và AuthService
 */
@Service  // Đánh dấu đây là Spring Service bean
@RequiredArgsConstructor  // Lombok tự tạo constructor với final fields (Dependency Injection)
public class CustomerService {

    // Repository để thao tác với database
    // final = bắt buộc phải inject qua constructor (best practice)
    private final CustomerRepository customerRepository;

    /**
     * Lưu customer mới hoặc update customer đã có
     * @param customer Customer object cần lưu
     * @return Customer đã được lưu (có ID nếu là mới)
     */
    public Customer save(Customer customer) {
        return customerRepository.save(customer);
    }

    /**
     * Tìm customer theo ID
     * @param id ID của customer
     * @return Optional<Customer> - có thể empty nếu không tìm thấy
     */
    public Optional<Customer> findById(String id) {
        return customerRepository.findById(id);
    }

    /**
     * Tìm customer theo email
     * Dùng stream để filter vì repository chưa có method findByEmail
     * 
     * @param email Email cần tìm
     * @return Optional<Customer>
     */
    public Optional<Customer> findByEmail(String email) {
        return customerRepository.findAll().stream()
                .filter(c -> email.equals(c.getEmail()))
                .findFirst();
    }

    /**
     * Tìm customer theo phone
     * @param phone Số điện thoại cần tìm
     * @return Optional<Customer>
     */
    public Optional<Customer> findByPhone(String phone) {
        return customerRepository.findAll().stream()
                .filter(c -> phone.equals(c.getPhone()))
                .findFirst();
    }

    /**
     * Kiểm tra email đã tồn tại chưa
     * @param email Email cần kiểm tra
     * @return true nếu đã tồn tại
     */
    public boolean existsByEmail(String email) {
        return findByEmail(email).isPresent();
    }

    /**
     * Kiểm tra phone đã tồn tại chưa
     * @param phone Phone cần kiểm tra
     * @return true nếu đã tồn tại
     */
    public boolean existsByPhone(String phone) {
        return findByPhone(phone).isPresent();
    }
}
