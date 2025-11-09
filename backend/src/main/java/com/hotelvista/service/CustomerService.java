package com.hotelvista.service;

import com.hotelvista.model.Customer;
import com.hotelvista.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository repo;

    /**
     * Find all customers
     * @return
     */
    public List<Customer> findAll() {
        return repo.findAll();
    }

    /**
     * Find customer by ID
     * @param id
     * @return
     */
    public Customer findById(String id) {
        return repo.findById(id).orElse(null);
    }

    /**
     * Save customer
     * @param customer
     */
    public void save(Customer customer) {
        repo.save(customer);
    }

    /**
     * Tìm tất cả khách hàng có tên chứa chuỗi name (không phân biệt hoa thường)
     * @param name
     * @return
     */
    public List<Customer> findAllByFullNameContainingIgnoreCase(String name) {
        return repo.findAllByFullNameContainingIgnoreCase(name);
    }

    /**
     * Tìm khách hàng theo email
     * @param email
     * @return
     */
    public Customer findByEmail(String email) {
        return repo.findByEmail(email).orElse(null);
    }

    /**
     * Tìm khách hàng theo số điện thoại
     * @param phone
     * @return
     */
    public Customer findByPhone(String phone) {
        return repo.findByPhone(phone).orElse(null);
    }

    /**
     * Tìm khách hàng theo userName
     * @param userName
     * @return
     */
    public Customer findByUserName(String userName) {
        return repo.findByUserName(userName).orElse(null);
    }

    /**
     * Kiểm tra tồn tại khách hàng theo id
     * @param id
     * @return
     */
    public boolean exists(String id) {
        return repo.existsById(id);
    }

    /**
     * Tìm mã khách hàng lớn nhất trong ngày theo tiền tố
     * @param prefix
     * @return
     */
    public Customer findLastCustomerOfDay(String prefix) {
        return repo.findLastCustomerIdOfDay(prefix);
    }


}