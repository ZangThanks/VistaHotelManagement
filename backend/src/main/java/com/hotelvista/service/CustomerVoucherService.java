package com.hotelvista.service;

import com.hotelvista.model.Customer;
import com.hotelvista.model.CustomerVoucher;
import com.hotelvista.model.Voucher;
import com.hotelvista.repository.CustomerVoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class CustomerVoucherService {
    @Autowired
    private CustomerVoucherRepository repo;

    public List<CustomerVoucher> findAll() {
        return repo.findAll();
    }

    /**
     * Lưu thông tin voucher của khách hàng
     * @param customerVoucher
     * @return
     */
    public boolean save(CustomerVoucher customerVoucher) {
        return repo.save(customerVoucher) != null;
    }

    /**
     * Tìm tất cả voucher của khách hàng theo id khách hàng
     * @param customerId
     * @return
     */
    public List<CustomerVoucher> findAllByCustomer_Id(String customerId) {
        return repo.findAllByCustomer_Id(customerId);
    }

    /**
     * Tìm tất cả voucher của khách hàng theo khoảng thời gian
     * @param startDate
     * @param endDate
     * @param customerId
     * @return
     */
    public List<CustomerVoucher> findAllByVoucherStartDateAfterAndEndDateBefore(LocalDate startDate, LocalDate endDate, String customerId) {
        return repo.findAllByVoucher_StartDateAfterAndEndDateBefore(startDate, endDate, customerId);
    }

    /**
     * Tìm tất cả voucher còn hiệu lực của khách hàng
     * @param customerId
     * @return
     */
    public List<CustomerVoucher> findActiveVouchersByCustomer(String customerId) {
        return repo.findActiveVouchersByCustomer(customerId);
    }

    public List<CustomerVoucher> findByCustomerAndState(String customerId, boolean state) {
        return repo.findByCustomerAndState(customerId, state);
    }

    /**
     * Đánh dấu voucher của khách hàng đã được sử dụng
     * @param id
     * @return
     */
    public boolean markAsUsed(CustomerVoucher.CustomerVoucherId id) {
        Optional<CustomerVoucher> opt = repo.findById(id);
        if (opt.isPresent()) {
            CustomerVoucher cv = opt.get();
            cv.setState(true);
            repo.save(cv);
            return true;
        }
        return false;
    }

    public List<CustomerVoucher> findAllByCustomer_IdAndStateIsTrue(String customerId) {
        return repo.findAllByCustomer_IdAndStateIsTrue(customerId);
    }

    /**
     * Gán voucher cho khách hàng
     * @param customer - Khách hàng nhận voucher
     * @param voucher - Voucher được gán
     * @return CustomerVoucher đã tạo
     */
    public CustomerVoucher assignVoucher(Customer customer, Voucher voucher) {
        // Tạo composite key
        CustomerVoucher.CustomerVoucherId id = new CustomerVoucher.CustomerVoucherId(customer, voucher);

        Optional<CustomerVoucher> existing = repo.findById(id);
        if (existing.isPresent()) {
            return existing.get();
        }

        CustomerVoucher customerVoucher = new CustomerVoucher();
        customerVoucher.setCustomer(customer);
        customerVoucher.setVoucher(voucher);
        customerVoucher.setState(false);

        return repo.save(customerVoucher);
    }
}
