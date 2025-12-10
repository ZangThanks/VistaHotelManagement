package com.hotelvista.repository;

import com.hotelvista.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, String> {
    Optional<Admin> findByEmail(String email);

    Optional<Admin> findByPhone(String phone);

    Optional<Admin> findByUserName(String userName);

    List<Admin> findAllByFullNameContainingIgnoreCase(String fullName);

    @Query("SELECT a FROM Admin a WHERE a.id LIKE ?1% ORDER BY a.id DESC LIMIT 1")
    Admin findLastAdminIdOfDay(String prefix);
}
