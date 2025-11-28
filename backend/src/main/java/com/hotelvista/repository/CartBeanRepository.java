package com.hotelvista.repository;

import com.hotelvista.model.CartBean;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartBeanRepository extends JpaRepository<CartBean, String> {

    CartBean getByCustomer_Id(String customerId);
}
