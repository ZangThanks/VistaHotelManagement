package com.hotelvista.service;

import com.hotelvista.model.CartBean;
import com.hotelvista.model.Customer;
import com.hotelvista.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository repo;

    @Autowired
    private PasswordEncoder passwordEncoder;

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
    public Customer save(Customer customer) {

        // UPDATE
        Customer existing = repo.findById(customer.getId()).orElse(null);

        if (existing != null) {
            customer.setUserName(existing.getUserName());

            if (customer.getCartBean() == null) {
                customer.setCartBean(existing.getCartBean());
            }
        }
        if (customer.getId() == null || customer.getId().isEmpty()) {
            customer.setId(generateCustomerId());
            customer.setUserName(generateUserName(customer.getFullName()));
            customer.setPassword(passwordEncoder.encode(customer.getPassword()));
            return repo.save(customer);
        }

        return repo.save(customer);
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

    /**
     * Sinh mã khách hàng mới theo định dạng CUSTddMMyyyyXXXX
     *
     * @return mã khách hàng mới
     */
    public String generateCustomerId() {
        String datePart = new SimpleDateFormat("ddMMyy").format(new Date());
        String prefix = "CUS" + datePart;

        // Lấy khách hàng cuối cùng trong ngày từ DB
        Customer lastCustomer = findLastCustomerOfDay(prefix);
        int nextNumber = 1;

        if (lastCustomer != null && lastCustomer.getId() != null) {
            String lastId = lastCustomer.getId();
            String numberPart = lastId.substring(lastId.length() - 4); // 4 số cuối
            nextNumber = Integer.parseInt(numberPart) + 1;
        }

        return prefix + String.format("%04d", nextNumber);
    }

    /**
     * Tạo username từ họ tên: bỏ dấu, viết thường, nối liền
     */
    public String generateUserName(String fullName) {
        if (fullName == null) return null;
        String normalized = removeVietnameseAccents(fullName);
        return normalized.toLowerCase().replaceAll("\\s+", "");
    }

    /**
     * Hàm bỏ dấu tiếng Việt
     */
    public String removeVietnameseAccents(String input) {
        if (input == null) return null;
        String normalized = java.text.Normalizer.normalize(input, java.text.Normalizer.Form.NFD);
        return normalized.replaceAll("\\p{InCombiningDiacriticalMarks}+", "")
                .replaceAll("đ", "d")
                .replaceAll("Đ", "D");
    }


}