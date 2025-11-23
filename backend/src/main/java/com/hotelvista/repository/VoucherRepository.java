package com.hotelvista.repository;

import com.hotelvista.model.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface VoucherRepository extends JpaRepository<Voucher, String> {

    /**
     * Tìm tất cả voucher từ startDate đến endDate
     *
     * @param startDateAfter
     * @param endDateBefore
     * @return
     */
    List<Voucher> findAllByStartDateAfterAndEndDateBefore(LocalDate startDateAfter, LocalDate endDateBefore);

    @Query("""
        SELECT v FROM Voucher v 
        JOIN CustomerVoucher cv ON v.voucherID = cv.voucher.voucherID 
        WHERE cv.customer.id = :customerID      
        """)
    List<Voucher> findVouchersBy_CustomerID(@Param("customerID") String customerID);
}
