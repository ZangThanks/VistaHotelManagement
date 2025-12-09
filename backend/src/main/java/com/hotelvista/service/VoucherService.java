package com.hotelvista.service;

import com.hotelvista.dto.DistributionCriteriaDTO;
import com.hotelvista.dto.DistributionHistoryDTO;
import com.hotelvista.dto.DistributionResultDTO;
import com.hotelvista.model.Customer;
import com.hotelvista.model.CustomerVoucher;
import com.hotelvista.model.DistributionHistory;
import com.hotelvista.model.Voucher;
import com.hotelvista.model.enums.Gender;
import com.hotelvista.model.enums.MemberShipLevel;
import com.hotelvista.repository.CustomerRepository;
import com.hotelvista.repository.CustomerVoucherRepository;
import com.hotelvista.repository.DistributionHistoryRepository;
import com.hotelvista.repository.VoucherRepository;
import com.hotelvista.util.CriteriaUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VoucherService {
    @Autowired
    private VoucherRepository voucherRepo;

    @Autowired
    private CustomerRepository customerRepo;

    @Autowired
    private CustomerVoucherRepository customerVoucherRepo;

    @Autowired
    private DistributionHistoryRepository distributionHistoryRepo;

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


    public List<Voucher> findVouchersBy_CustomerID(String customerID) {
        return voucherRepo.findVouchersBy_CustomerID(customerID);
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean update(String id, Voucher voucher) {
        try {
            Voucher existingVoucher = findById(id);
            if (existingVoucher == null) {
                return false;
            }

            existingVoucher.setVoucherName(voucher.getVoucherName());
            existingVoucher.setDiscountType(voucher.getDiscountType());
            existingVoucher.setDiscountPercentage(voucher.getDiscountPercentage());
            existingVoucher.setDiscountValue(voucher.getDiscountValue());
            existingVoucher.setStartDate(voucher.getStartDate());
            existingVoucher.setEndDate(voucher.getEndDate());
            existingVoucher.setActive(voucher.isActive());

            voucherRepo.save(existingVoucher);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Xem trước phân phối - đếm số lượng khách hàng phù hợp với tiêu chí
     * @param criteria - Tiêu chí phân phối
     * @return DistributionResult với số lượng
     */
    public DistributionResultDTO previewDistribution(DistributionCriteriaDTO criteria) {
        try {
            List<MemberShipLevel> memberShipLevels = CriteriaUtil.normalizeMembership(criteria.getMembershipLevel());
            List<Gender> genders = CriteriaUtil.normalizeGender(criteria.getGender());
            List<Integer> birthMonths = CriteriaUtil.normalizeBirthMonths(criteria.getBirthMonth());
            Integer minLoyaltyPoints = CriteriaUtil.normalizeLoyalty(criteria.getMinLoyaltyPoints());

            List<Customer> customers = customerRepo.findCustomersByCriteria(
                    memberShipLevels,
                    genders,
                    birthMonths,
                    minLoyaltyPoints
            );

            return new DistributionResultDTO(true, "Preview successful", customers.size());
        } catch (Exception e) {
            e.printStackTrace();
            return new DistributionResultDTO(false, "Error preview: "+ e.getMessage(), 0);
        }
    }

    /**
     * Phân phối voucher cho khách hàng phù hợp với tiêu chí
     * @param voucherId - Mã voucher cần phân phối
     * @param criteria - Tiêu chí phân phối
     * @return DistributionResult với trạng thái thành công và số lượng
     */
    @Transactional(rollbackFor = Exception.class)
    public DistributionResultDTO distributeVoucher(String voucherId, DistributionCriteriaDTO criteria) {
        try {
            Voucher voucher = findById(voucherId);
            if (voucher == null) {
                return new DistributionResultDTO(false, "Voucher not found", 0);
            }

            if (!voucher.isActive()) {
                return new DistributionResultDTO(false, "Voucher not active", 0);
            }

            List<MemberShipLevel> memberShipLevels = CriteriaUtil.normalizeMembership(criteria.getMembershipLevel());
            List<Gender> genders = CriteriaUtil.normalizeGender(criteria.getGender());
            List<Integer> birthMonths = CriteriaUtil.normalizeBirthMonths(criteria.getBirthMonth());
            Integer minLoyaltyPoints = CriteriaUtil.normalizeLoyalty(criteria.getMinLoyaltyPoints());

            List<Customer> customers = customerRepo.findCustomersByCriteria(
                    memberShipLevels,
                    genders,
                    birthMonths,
                    minLoyaltyPoints
            );

            if (customers.isEmpty()) {
                // Save failed distribution history
                saveDistributionHistory(voucher, criteria, 0, "failed");
                return new DistributionResultDTO(false, "No suitable customers found", 0);
            }

            int count = 0;
            for (Customer customer : customers) {
                CustomerVoucher.CustomerVoucherId id =
                        new CustomerVoucher.CustomerVoucherId(customer, voucher);

                if (!customerVoucherRepo.findById(id).isPresent()) {
                    CustomerVoucher cv = new CustomerVoucher();
                    cv.setCustomer(customer);
                    cv.setVoucher(voucher);
                    cv.setState(true);
                    customerVoucherRepo.save(cv);
                    count++;
                }
            }

            // Save successful distribution history
            saveDistributionHistory(voucher, criteria, count, "success");

            String message = String.format("Vouchers distributed to %d customers", count);
            return new DistributionResultDTO(true, message, count);
        } catch (Exception e) {
            e.printStackTrace();
            return new DistributionResultDTO(false, "Error distribute: "+ e.getMessage(), 0);
        }
    }

    /**
     * Tìm kiếm khách hàng phù hợp với tiêu chí phân phối
     * @param criteria - Tiêu chí phân phối
     * @return Danh sách khách hàng phù hợp
     */
    public List<Customer> findCustomerByCriteria(DistributionCriteriaDTO criteria) {
        List<MemberShipLevel> memberShipLevels = CriteriaUtil.normalizeMembership(criteria.getMembershipLevel());
        List<Gender> genders = CriteriaUtil.normalizeGender(criteria.getGender());
        List<Integer> birthMonths = CriteriaUtil.normalizeBirthMonths(criteria.getBirthMonth());
        Integer minLoyaltyPoints = CriteriaUtil.normalizeLoyalty(criteria.getMinLoyaltyPoints());

        return customerRepo.findCustomersByCriteria(
                memberShipLevels,
                genders,
                birthMonths,
                minLoyaltyPoints
        );
    }

    /**
     * Lưu lịch sử phân phối
     */
    private void saveDistributionHistory(Voucher voucher, DistributionCriteriaDTO criteria, int count, String status) {
        DistributionHistory history = new DistributionHistory();
        history.setVoucher(voucher);
        history.setCriteria(formatCriteria(criteria));
        history.setRecipientCount(count);
        history.setStatus(status);
        distributionHistoryRepo.save(history);
    }

    /**
     * Format criteria thành string để hiển thị
     */
    private String formatCriteria(DistributionCriteriaDTO criteria) {
        StringBuilder sb = new StringBuilder();
        
        if (criteria.getMembershipLevel() != null && !criteria.getMembershipLevel().isEmpty()) {
            sb.append("Membership: ").append(String.join(", ", criteria.getMembershipLevel()));
        }
        
        if (criteria.getGender() != null && !criteria.getGender().isEmpty()) {
            if (sb.length() > 0) sb.append(", ");
            sb.append("Gender: ").append(String.join(", ", criteria.getGender()));
        }
        
        if (criteria.getBirthMonth() != null && !criteria.getBirthMonth().isEmpty()) {
            if (sb.length() > 0) sb.append(", ");
            sb.append("Birth Month: ").append(criteria.getBirthMonth().stream()
                    .map(String::valueOf)
                    .collect(Collectors.joining(", ")));
        }
        
        if (criteria.getMinLoyaltyPoints() != null && criteria.getMinLoyaltyPoints() > 0) {
            if (sb.length() > 0) sb.append(", ");
            sb.append("Min Points: ").append(criteria.getMinLoyaltyPoints());
        }
        
        return sb.length() > 0 ? sb.toString() : "All customers";
    }

    /**
     * Lấy lịch sử phân phối
     */
    public List<DistributionHistoryDTO> getDistributionHistory() {
        return distributionHistoryRepo.findAllByOrderByDistributedAtDesc()
                .stream()
                .map(h -> new DistributionHistoryDTO(
                        h.getId(),
                        h.getVoucher().getVoucherID(),
                        h.getVoucher().getVoucherName(),
                        h.getCriteria(),
                        h.getRecipientCount(),
                        h.getDistributedAt(),
                        h.getStatus()
                ))
                .collect(Collectors.toList());
    }
}
