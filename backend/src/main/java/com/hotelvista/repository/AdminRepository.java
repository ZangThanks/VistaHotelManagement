package com.hotelvista.repository;

import com.hotelvista.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, String> {
    Optional<Admin> findByEmail(String email);
    Optional<Admin> findByPhone(String phone);
    Optional<Admin> findByUserName(String userName);
}
