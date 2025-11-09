package com.hotelvista.repository;

import com.hotelvista.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

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

}
