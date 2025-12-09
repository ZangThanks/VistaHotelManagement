package com.hotelvista.repository;

import com.hotelvista.model.CustomerVoucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface CustomerVoucherRepository extends JpaRepository<CustomerVoucher, CustomerVoucher.CustomerVoucherId> {

    /**
     * Tìm những voucher, customer và state tương ứng theo customerId với startDate - endDate
     *
     * @param startDate
     * @param endDate
     * @param customerId
     * @return
     */
    @Query("SELECT cv FROM CustomerVoucher cv " +
            "WHERE cv.voucher.startDate >= :startDate " +
            "AND cv.voucher.endDate <= :endDate AND cv.customer.id = :customerId")
    List<CustomerVoucher> findAllByVoucher_StartDateAfterAndEndDateBefore(@Param("startDate") LocalDate startDate,
                                                                          @Param("endDate") LocalDate endDate,
                                                                          @Param("customerId") String customerId);


    /**
     * Tìm tất cả voucher đang hoạt động của khách hàng
     * @param customerId
     * @return
     */
    @Query("SELECT cv FROM CustomerVoucher cv " +
            "WHERE cv.voucher.isActive = true " +
            "AND cv.voucher.endDate >= CURRENT_DATE " +
            "AND cv.customer.id = :customerId")
    List<CustomerVoucher> findActiveVouchersByCustomer(@Param("customerId") String customerId);


    /**
     * Tìm tất cả voucher của khách hàng theo trạng thái đã sử dụng hay chưa
     * @param customerId
     * @param state
     * @return
     */
    @Query("SELECT cv FROM CustomerVoucher cv " +
            "WHERE cv.customer.id = :customerId AND cv.state = :state")
    List<CustomerVoucher> findByCustomerAndState(@Param("customerId") String customerId,
                                                 @Param("state") boolean state);

    /**
     * Tìm những voucher thuộc khách hàng theo customerId
     *
     * @param customerId
     * @return
     */
    List<CustomerVoucher> findAllByCustomer_Id(String customerId);

    /**
     * Tìm những voucher thuộc khách hàng theo customerId, chưa sử dụng
     *
     * @param customerId
     * @return
     */
    @Query("SELECT cv FROM CustomerVoucher cv WHERE cv.customer.id = :customerId AND cv.state = true")
    List<CustomerVoucher> findAllByCustomer_IdAndStateIsTrue(String customerId);

}
