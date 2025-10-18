package com.hotelvista.repository;

import com.hotelvista.model.EarlyCheckin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EarlyCheckinRepository extends JpaRepository<EarlyCheckin, String> {
}
