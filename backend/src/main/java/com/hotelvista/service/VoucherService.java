package com.hotelvista.service;

import com.hotelvista.model.Customer;
import com.hotelvista.model.CustomerVoucher;
import com.hotelvista.model.Voucher;
import com.hotelvista.repository.CustomerRepository;
import com.hotelvista.repository.CustomerVoucherRepository;
import com.hotelvista.repository.VoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class VoucherService {
    @Autowired
    private VoucherRepository voucherRepo;

    @Autowired
    private CustomerRepository customerRepo;

    @Autowired
    private CustomerVoucherRepository customerVoucherRepo;

    /**
     * Tìm tất cả voucher
     * @return
     */
    public List<Voucher> findAll() {
        return voucherRepo.findAll();
    }

    /**
     * Tìm voucher theo id
     * @param id
     * @return
     */
    public Voucher findById(String id) {
        return voucherRepo.findById(id).orElse(null);
    }

    /**
     * Lưu voucher
     * @param voucher
     * @return
     */
    @Transactional(rollbackFor = Exception.class)
    public boolean save(Voucher voucher) {
        try {
            Voucher savedVoucher = voucherRepo.save(voucher);
            if (savedVoucher.getCustomerVouchers() != null) {
                for (CustomerVoucher cv : voucher.getCustomerVouchers()) {
                    cv.setVoucher(savedVoucher);
                }
            }

            voucherRepo.save(voucher);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    /**
     * Xóa voucher theo id
     * @param id
     * @return
     */
    public boolean deleteById(String id) {
        voucherRepo.deleteById(id);
        return voucherRepo.findById(id).orElse(null) == null;
    }

    /**
     * Tìm tất cả voucher theo khoảng thời gian
     * @param startDateAfter
     * @param endDateBefore
     * @return
     */
    public List<Voucher> findAllByStartDateAfterAndEndDateBefore(LocalDate startDateAfter, LocalDate endDateBefore) {
        return voucherRepo.findAllByStartDateAfterAndEndDateBefore(startDateAfter, endDateBefore);
    }

    /**
     * Tìm tất cả voucher còn hiệu lực
     * @return
     */
    public List<Voucher> findActiveVouchers() {
        return voucherRepo.findAll().stream()
                .filter(v -> v.isActive() && !v.getEndDate().isBefore(LocalDate.now()))
                .toList();
    }

    /**
     * Kích hoạt hoặc hủy kích hoạt voucher
     * @param id
     * @param status
     * @return
     */
    public boolean toggleActive(String id, boolean status) {
        Voucher voucher = findById(id);
        if (voucher != null) {
            voucher.setActive(status);
            voucherRepo.save(voucher);
            return true;
        }
        return false;
    }

}
