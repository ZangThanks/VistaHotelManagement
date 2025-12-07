package com.hotelvista.service;

import com.hotelvista.model.*;
import com.hotelvista.model.enums.Gender;
import com.hotelvista.model.enums.MemberShipLevel;
import com.hotelvista.model.enums.UserRole;
import com.hotelvista.repository.AdminRepository;
import com.hotelvista.repository.CustomerRepository;
import com.hotelvista.repository.EmployeeRepository;
import com.hotelvista.util.GenerateIDUtil;
import com.hotelvista.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.UUID;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final CustomerRepository customerRepo;
    private final AdminRepository adminRepo;
    private final EmployeeRepository employeeRepo;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final CartBeanService cartBeanService;

   @Autowired
    private CustomerService customerService;

    /**
     * Tìm user bằng email hoặc phone, áp dụng cho Customer + Admin + Employee
     */
    public User findByEmailOrPhone(String email, String phone) {
        if (email != null && !email.isBlank()) {
            // Ưu tiên email
            User u = customerRepo.findByEmail(email).orElse(null);
            if (u != null) return u;

            u = adminRepo.findByEmail(email).orElse(null);
            if (u != null) return u;

            u = employeeRepo.findByEmail(email).orElse(null);
            if (u != null) return u;
        }

        if (phone != null && !phone.isBlank()) {
            // Thử phone
            User u = customerRepo.findByPhone(phone).orElse(null);
            if (u != null) return u;

            u = adminRepo.findByPhone(phone).orElse(null);
            if (u != null) return u;

            u = employeeRepo.findByPhone(phone).orElse(null);
            if (u != null) return u;
        }

        return null;
    }

    public boolean resetPasswordByEmail(String email, String newPassword) {
        User user = null;

        if (email != null && !email.isBlank()) {
            user = customerRepo.findByEmail(email).orElse(null);
            if (user == null) user = adminRepo.findByEmail(email).orElse(null);
            if (user == null) user = employeeRepo.findByEmail(email).orElse(null);
        }

        if (user == null) return false;

        user.setPassword(passwordEncoder.encode(newPassword));

        // Lưu vào repo tương ứng
        if (user instanceof Customer) customerRepo.save((Customer) user);
        else if (user instanceof Admin) adminRepo.save((Admin) user);
        else if (user instanceof Employee) employeeRepo.save((Employee) user);

        return true;
    }

    public User createUserIfNotExists(String email, String fullName, String provider) {
        User existing = customerRepo.findByEmail(email).orElse(null);
        if (existing != null) return existing;

        // create user mới
        Customer c = new Customer();
        c.setId(customerService.generateCustomerId());

        // username tự phát sinh
        c.setUserName(email.split("@")[0] + "_" + provider);

        c.setFullName(fullName);
        c.setEmail(email);
        c.setPhone(null);
        c.setUserRole(UserRole.CUSTOMER);
        c.setJoinedDate(LocalDate.now());
        c.setGender(Gender.MALE);
        c.setLoyaltyPoints(0);
        c.setReputationPoint(100);
        c.setMemberShipLevel(MemberShipLevel.BRONZE);

        // mật khẩu random
        c.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));

        customerRepo.save(c);

        CartBean cartBean = new CartBean();
        cartBean.setCustomer(c);
        cartBeanService.save(cartBean);

        c.setCartBean(cartBean);

        customerRepo.save(c);
        return c;
    }

    public Optional<User> findById(String userId) {
        return userRepository.findById(userId);
    }
}
