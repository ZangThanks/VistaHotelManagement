package com.hotelvista.service;

import com.hotelvista.model.CustomerVoucher;
import com.hotelvista.model.Voucher;
import com.hotelvista.repository.VoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class VoucherService {
    @Autowired
    private VoucherRepository repo;

    public List<Voucher> findAll() {
        return repo.findAll();
    }

    public Voucher findById(String id) {
        return repo.findById(id).orElse(null);
    }

    public boolean add(Voucher voucher) {
        try {
            Voucher savedVoucher = repo.save(voucher);
            for (CustomerVoucher cv : voucher.getCustomerVouchers()) {
                cv.setVoucher(savedVoucher);
            }

            repo.save(voucher);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean deleteById(String id) {
        repo.deleteById(id);
        return repo.findById(id).orElse(null) == null;
    }

    public List<Voucher> findAllByStartDateAfterAndEndDateBefore(LocalDate startDateAfter, LocalDate endDateBefore) {
        return repo.findAllByStartDateAfterAndEndDateBefore(startDateAfter, endDateBefore);
    }
}
