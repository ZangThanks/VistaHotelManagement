package com.hotelvista.controller;

import com.hotelvista.dto.DistributionCriteriaDTO;
import com.hotelvista.dto.DistributionHistoryDTO;
import com.hotelvista.dto.DistributionResultDTO;
import com.hotelvista.model.Voucher;
import com.hotelvista.service.VoucherService;
import com.hotelvista.util.ValidatorsUtil;
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
    @PostMapping("/create")
    public ResponseEntity<?> saveVoucher(@RequestBody Voucher voucher) {
        // Validate voucher code
        String codeError = ValidatorsUtil.validateVoucherCode(voucher.getVoucherID());
        if (codeError != null) {
            return ResponseEntity.badRequest().body(codeError);
        }

        // Validate voucher name
        String nameError = ValidatorsUtil.validateVoucherName(voucher.getVoucherName());
        if (nameError != null) {
            return ResponseEntity.badRequest().body(nameError);
        }

        // Validate discount (nếu là PERCENT type)
        if ("PERCENT".equals(voucher.getDiscountType())) {
            String percentError = ValidatorsUtil.validateDiscountPercentage(voucher.getDiscountPercentage());
            if (percentError != null) {
                return ResponseEntity.badRequest().body(percentError);
            }
        }

        // Validate discount amount (nếu là FIXED type)
        if ("FIXED".equals(voucher.getDiscountType())) {
            String amountError = ValidatorsUtil.validateDiscountAmount(voucher.getDiscountValue());
            if (amountError != null) {
                return ResponseEntity.badRequest().body(amountError);
            }
        }

        // Validate start date
        String startDateError = ValidatorsUtil.validateStartDate(voucher.getStartDate());
        if (startDateError != null) {
            return ResponseEntity.badRequest().body(startDateError);
        }

        // Validate end date
        String endDateError = ValidatorsUtil.validateEndDate(voucher.getEndDate());
        if (endDateError != null) {
            return ResponseEntity.badRequest().body(endDateError);
        }

        // Validate date range
        String dateRangeError = ValidatorsUtil.validateDateRange(voucher.getStartDate(), voucher.getEndDate());
        if (dateRangeError != null) {
            return ResponseEntity.badRequest().body(dateRangeError);
        }

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
    @PatchMapping("/{id}/status/{status}")
    public ResponseEntity<String> toggleVoucherStatus(@PathVariable String id, @PathVariable boolean status) {
        return service.toggleActive(id, status)
                ? ResponseEntity.ok("Cập nhật trạng thái voucher thành công")
                : ResponseEntity.badRequest().body("Không thể cập nhật voucher");
    }

    @GetMapping("/customerID={id}")
    public List<Voucher> findVouchersBy_CustomerID(@PathVariable String id) {
        return service.findVouchersBy_CustomerID(id);
    }

    /**
     * Cập nhật thông tin voucher
     * @param id - ID của voucher cần cập nhật
     * @param voucher - Thông tin voucher mới
     * @return
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateVoucher(@PathVariable String id, @RequestBody Voucher voucher) {
        // Validate voucher code
        String codeError = ValidatorsUtil.validateVoucherCode(voucher.getVoucherID());
        if (codeError != null) {
            return ResponseEntity.badRequest().body(codeError);
        }

        // Validate voucher name
        String nameError = ValidatorsUtil.validateVoucherName(voucher.getVoucherName());
        if (nameError != null) {
            return ResponseEntity.badRequest().body(nameError);
        }

        // Validate discount (nếu là PERCENT type)
        if ("PERCENT".equals(voucher.getDiscountType())) {
            String percentError = ValidatorsUtil.validateDiscountPercentage(voucher.getDiscountPercentage());
            if (percentError != null) {
                return ResponseEntity.badRequest().body(percentError);
            }
        }

        // Validate discount amount (nếu là FIXED type)
        if ("FIXED".equals(voucher.getDiscountType())) {
            String amountError = ValidatorsUtil.validateDiscountAmount(voucher.getDiscountValue());
            if (amountError != null) {
                return ResponseEntity.badRequest().body(amountError);
            }
        }

        // Validate start date
        String startDateError = ValidatorsUtil.validateStartDate(voucher.getStartDate());
        if (startDateError != null) {
            return ResponseEntity.badRequest().body(startDateError);
        }

        // Validate end date
        String endDateError = ValidatorsUtil.validateEndDate(voucher.getEndDate());
        if (endDateError != null) {
            return ResponseEntity.badRequest().body(endDateError);
        }

        // Validate date range
        String dateRangeError = ValidatorsUtil.validateDateRange(voucher.getStartDate(), voucher.getEndDate());
        if (dateRangeError != null) {
            return ResponseEntity.badRequest().body(dateRangeError);
        }

        boolean updated = service.update(id, voucher);
        return updated
                ? ResponseEntity.ok("Cập nhật voucher thành công")
                : ResponseEntity.badRequest().body("Không thể cập nhật voucher");
    }

    /**
     * Xem trước phân phối - đếm số lượng khách hàng khớp với tiêu chí
     * @param criteria - Tiêu chí phân phối (membershipLevel, giới tính, tháng sinh, điểm trung thành tối thiểu)
     * @return DistributionResult với số lượng khách hàng khớp
     */
    @PostMapping("/preview-distribution")
    public ResponseEntity<DistributionResultDTO> previewDistribution(
            @RequestBody DistributionCriteriaDTO criteria
            ) {
        DistributionResultDTO result = service.previewDistribution(criteria);
        return ResponseEntity.ok(result);
    }

    /**
     * Phân phối phiếu giảm giá cho khách hàng phù hợp với tiêu chí
     * @param id - Mã phiếu giảm giá
     * @param criteria - Tiêu chí phân phối
     * @return DistributionResult với trạng thái thành công và số lượng
     */
    @PostMapping("/{id}/distribute")
    public ResponseEntity<DistributionResultDTO> distributeVoucher(
            @PathVariable String id,
            @RequestBody DistributionCriteriaDTO criteria
    ) {
        DistributionResultDTO result = service.distributeVoucher(id, criteria);
        return result.isSuccess()
                ? ResponseEntity.ok(result)
                : ResponseEntity.badRequest().body(result);
    }

    /**
     * Lấy lịch sử phân phối voucher
     * @return Danh sách lịch sử phân phối
     */
    @GetMapping("/distribution-history")
    public ResponseEntity<List<DistributionHistoryDTO>> getDistributionHistory() {
        List<DistributionHistoryDTO> history = service.getDistributionHistory();
        return ResponseEntity.ok(history);
    }
}
