package com.hotelvista.controller;

import com.hotelvista.model.Voucher;
import com.hotelvista.service.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vouchers")
public class VoucherController {

    @Autowired
    private VoucherService service;

    /**
     * Lấy tất cả voucher
     * @return
     */
    @GetMapping
    public List<Voucher> getAllVouchers() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Voucher getVoucherById(@PathVariable String id) {
        return service.findById(id);
    }

    /**
     * Lấy tất cả voucher còn hiệu lực
     * @return
     */
    @GetMapping("/active")
    public List<Voucher> getActiveVouchers() {
        return service.findActiveVouchers();
    }

    /**
     * Lưu voucher mới hoặc cập nhật voucher
     * @param voucher
     * @return
     */
    @PostMapping
    public ResponseEntity<?> saveVoucher(@RequestBody Voucher voucher) {
        boolean saved = service.save(voucher);
        return saved
                ? ResponseEntity.ok("Lưu voucher thành công")
                : ResponseEntity.badRequest().body("Không thể lưu voucher");
    }

    /**
     * Xóa voucher theo id
     * @param id
     * @return
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVoucher(@PathVariable String id) {
        return service.deleteById(id)
                ? ResponseEntity.ok("Đã xóa voucher")
                : ResponseEntity.badRequest().body("Không tìm thấy voucher");
    }

    /**
     * Cập nhật trạng thái kích hoạt của voucher
     * @param id
     * @param status
     * @return
     */
    @PutMapping("/{id}/status/{status}")
    public ResponseEntity<?> toggleVoucherStatus(@PathVariable String id, @PathVariable boolean status) {
        return service.toggleActive(id, status)
                ? ResponseEntity.ok("Cập nhật trạng thái voucher thành công")
                : ResponseEntity.badRequest().body("Không thể cập nhật voucher");
    }
}
