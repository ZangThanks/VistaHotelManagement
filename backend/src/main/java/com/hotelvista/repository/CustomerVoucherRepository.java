package com.hotelvista.repository;

import com.hotelvista.model.CustomerVoucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface CustomerVoucherRepository extends JpaRepository<CustomerVoucher, CustomerVoucher.CustomerVoucherId> {

    @Query("SELECT cv FROM CustomerVoucher cv " +
            "WHERE cv.voucher.startDate >= :startDate " +
            "AND cv.voucher.endDate <= :endDate AND cv.customer.id = :customerId")
    List<CustomerVoucher> findAllByVoucher_StartDateAfterAndEndDateBefore(@Param("startDate") LocalDate startDate,
                                                                          @Param("endDate") LocalDate endDate,
                                                                          @Param("customerId") String customerId);

}
