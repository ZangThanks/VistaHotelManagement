package com.hotelvista.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hotelvista.model.DistributionHistory;

@Repository
public interface DistributionHistoryRepository extends JpaRepository<DistributionHistory, Long> {
    List<DistributionHistory> findAllByOrderByDistributedAtDesc();
}
