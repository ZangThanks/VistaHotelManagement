package com.hotelvista.repository;

import com.hotelvista.model.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PromotionRepository extends JpaRepository<Promotion, String> {

    @Query("SELECT p FROM Promotion p WHERE p.isActive = :active")
    List<Promotion> findAllByActive(@Param("active") boolean active);

    List<Promotion> findAllByPromotionNameContainingIgnoreCase(String promotionName);

}
