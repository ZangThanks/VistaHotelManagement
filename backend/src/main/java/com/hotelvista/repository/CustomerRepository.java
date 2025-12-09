package com.hotelvista.repository;

import com.hotelvista.model.Customer;
import com.hotelvista.model.enums.Gender;
import com.hotelvista.model.enums.MemberShipLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, String> {

    /**
     * Tìm tất cả khách hàng có tên chứa fullName (không phân biệt hoa thường)
     * @param fullName
     * @return
     */
    List<Customer> findAllByFullNameContainingIgnoreCase(String fullName);

    /**
     * Tìm khách hàng theo email
     * @param email
     * @return
     */
    Optional<Customer> findByEmail(String email);

    /**
     * Tìm khách hàng theo số điện thoại
     * @param phone
     * @return
     */
    Optional<Customer> findByPhone(String phone);

    /**
     * Tìm khách hàng theo userName
     * @param userName
     * @return
     */
    Optional<Customer> findByUserName(String userName);

    /**
     * Kiểm tra tồn tại khách hàng theo id
     * @param id
     * @return
     */
    boolean existsById(String id);

    /**
     * Tìm mã khách hàng lớn nhất trong ngày theo tiền tố
     * @param prefix
     * @return
     */
    @Query("SELECT c FROM Customer c WHERE c.id LIKE ?1% ORDER BY c.id DESC LIMIT 1")
    Customer findLastCustomerIdOfDay(String prefix);

    /**
     * Tìm kiếm khách hàng theo tiêu chí phân phối
     * Tất cả các tham số đều tùy chọn (có thể để giá trị null)
     */
    @Query("""
    SELECT c FROM Customer c 
    WHERE (:memberShipLevels IS NULL OR c.memberShipLevel IN :memberShipLevels)
      AND (:genders IS NULL OR c.gender IN :genders)
      AND (:birthMonths IS NULL OR MONTH(c.birthDate) IN :birthMonths)
      AND (:minLoyaltyPoints IS NULL OR c.loyaltyPoints >= :minLoyaltyPoints)
    """)
    List<Customer> findCustomersByCriteria(
            @Param("memberShipLevels") List<MemberShipLevel> memberShipLevels,
            @Param("genders") List<Gender> genders,
            @Param("birthMonths") List<Integer> birthMonths,
            @Param("minLoyaltyPoints") Integer minLoyaltyPoints
    );


    /**
     * Đếm số lượng khách hàng theo membership level tại thời điểm cuối tháng
     * @param level
     * @param endDate
     * @return
     */
    @Query("SELECT COUNT(c) " +
            "FROM Customer c " +
            "WHERE c.memberShipLevel = :level " +
            "AND c.joinedDate <= :endDate")
    Integer countByMembershipLevelAndDate(
            @Param("level") MemberShipLevel level,
            @Param("endDate") LocalDate endDate
    );

    /**
     * Tổng loyalty points của tất cả khách hàng trong khoảng thời gian
     * Tính dựa trên joined_date (hoặc có thể dùng trường khác nếu có)
     * @param startDate
     * @param endDate
     * @return
     */
    @Query("SELECT COALESCE(SUM(c.loyaltyPoints), 0) " +
            "FROM Customer c " +
            "WHERE c.joinedDate BETWEEN :startDate AND :endDate")
    Long getTotalLoyaltyPointsByDateRange(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    /**
     * Tổng loyalty points hiện có của tất cả customers
     * @return
     */
    @Query("SELECT COALESCE(SUM(c.loyaltyPoints), 0) " +
            "FROM Customer c")
    Long getTotalLoyaltyPoints();
}
