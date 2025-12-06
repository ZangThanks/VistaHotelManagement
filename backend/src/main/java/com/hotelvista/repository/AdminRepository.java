package com.hotelvista.repository;

import com.hotelvista.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, String> {

    Optional<Admin> findByEmail(String email);

    Optional<Admin> findByPhone(String phone);

    Optional<Admin> findByUserName(String userName);

    List<Admin> findAllByFullNameContainingIgnoreCase(String name);

    @Query(value = "SELECT TOP 1 * FROM admins WHERE id LIKE :prefix% ORDER BY id DESC", nativeQuery = true)
    Admin findLastAdminIdOfDay(@Param("prefix") String prefix);
}