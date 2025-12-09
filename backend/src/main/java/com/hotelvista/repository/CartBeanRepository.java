package com.hotelvista.repository;

import com.hotelvista.model.CartBean;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartBeanRepository extends JpaRepository<CartBean, String> {

    /**
     * Tìm cartBean của customer theo customerId
     *
     * @param customerId
     * @return
     */
    CartBean getByCustomer_Id(String customerId);
}
