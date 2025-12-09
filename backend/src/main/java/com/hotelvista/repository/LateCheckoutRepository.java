package com.hotelvista.repository;

import com.hotelvista.model.LateCheckout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface LateCheckoutRepository extends JpaRepository<LateCheckout,String> {
    @Query("SELECT e.requestID FROM LateCheckout e WHERE e.requestID LIKE CONCAT(:prefix, '%') ORDER BY e.requestID DESC LIMIT 1")
    String findLastRequestId(String prefix);
}
