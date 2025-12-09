package com.hotelvista.repository;

import com.hotelvista.model.EarlyCheckin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface EarlyCheckinRepository extends JpaRepository<EarlyCheckin, String> {

    /**
     * Lấy mã yêu cầu gần nhất trong ngày (theo prefix)
     */
    @Query(value = "SELECT e.request_id FROM early_checkins e WHERE e.request_id LIKE ?1% ORDER BY e.request_id DESC LIMIT 1", nativeQuery = true)
    String findLastRequestId(String prefix);
}
