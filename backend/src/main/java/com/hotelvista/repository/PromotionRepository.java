package com.hotelvista.repository;

import com.hotelvista.model.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PromotionRepository extends JpaRepository<Promotion, String> {
}
