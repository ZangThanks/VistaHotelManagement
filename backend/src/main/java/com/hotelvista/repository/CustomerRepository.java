package com.hotelvista.repository;

import com.hotelvista.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * Repository interface để thao tác với dữ liệu khách hàng trong database.
 * Kế thừa JpaRepository để có các phương thức CRUD cơ bản.
 */
public interface CustomerRepository extends JpaRepository<Customer, String> {

    /**
     * Tìm tất cả khách hàng có tên chứa chuỗi tìm kiếm (không phân biệt hoa thường).
     * 
     * @param fullName chuỗi tìm kiếm trong tên khách hàng
     * @return danh sách khách hàng tìm được
     */
    List<Customer> findAllByFullNameContainingIgnoreCase(String fullName);

    /**
     * Tìm khách hàng theo địa chỉ email.
     * 
     * @param email địa chỉ email cần tìm
     * @return Optional chứa khách hàng nếu tìm thấy, ngược lại trả về Optional.empty()
     */
    Optional<Customer> findByEmail(String email);

    /**
     * Tìm khách hàng theo số điện thoại.
     * 
     * @param phone số điện thoại cần tìm
     * @return Optional chứa khách hàng nếu tìm thấy, ngược lại trả về Optional.empty()
     */
    Optional<Customer> findByPhone(String phone);

    /**
     * Tìm khách hàng theo tên đăng nhập.
     * 
     * @param userName tên đăng nhập cần tìm
     * @return Optional chứa khách hàng nếu tìm thấy, ngược lại trả về Optional.empty()
     */
    Optional<Customer> findByUserName(String userName);
}
