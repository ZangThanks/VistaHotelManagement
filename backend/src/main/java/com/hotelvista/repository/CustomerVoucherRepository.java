package com.hotelvista.repository;

import com.hotelvista.model.CustomerVoucher;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerVoucherRepository extends JpaRepository<CustomerVoucher, CustomerVoucher.CustomerVoucherId> {



}
