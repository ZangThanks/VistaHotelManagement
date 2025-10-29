package com.hotelvista.repository;

import com.hotelvista.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, String> {

    List<Customer> findAllByFullNameContainingIgnoreCase(String fullName);

    Optional<Customer> findByEmail(String email);

    Optional<Customer> findByPhone(String phone);

    Optional<Customer> findByUserName(String userName);
}
