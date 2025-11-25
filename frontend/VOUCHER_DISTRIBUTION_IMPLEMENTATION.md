# Voucher Distribution Implementation Guide

## Overview

Chức năng phân phối voucher cho phép admin phân phối voucher tới khách hàng dựa trên các tiêu chí:

- Membership Level (BRONZE, SILVER, GOLD, PLATINUM)
- Gender (MALE, FEMALE, OTHER)
- Birth Month (1-12)
- Minimum Loyalty Points

## Backend Implementation Required

### 1. Create DTO Classes

#### DistributionCriteria.java

```java
package com.hotelvista.dto;

import lombok.Data;
import java.util.List;

@Data
public class DistributionCriteria {
    private List<String> membershipLevel;
    private List<String> gender;
    private List<Integer> birthMonth;
    private Integer minLoyaltyPoints;
}
```

#### DistributionResult.java

```java
package com.hotelvista.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DistributionResult {
    private boolean success;
    private String message;
    private int count;
}
```

### 2. Update CustomerRepository

Add this query method to `CustomerRepository.java`:

```java
package com.hotelvista.repository;

import com.hotelvista.model.Customer;
import com.hotelvista.model.enums.Gender;
import com.hotelvista.model.enums.MemberShipLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, String> {
    // ... existing methods ...

    /**
     * Find customers by distribution criteria
     * All parameters are optional (can be null)
     */
    @Query("SELECT c FROM Customer c WHERE " +
           "(:membershipLevels IS NULL OR SIZE(:membershipLevels) = 0 OR c.memberShipLevel IN :membershipLevels) AND " +
           "(:genders IS NULL OR SIZE(:genders) = 0 OR c.gender IN :genders) AND " +
           "(:birthMonths IS NULL OR SIZE(:birthMonths) = 0 OR MONTH(c.birthDate) IN :birthMonths) AND " +
           "(:minLoyaltyPoints IS NULL OR c.loyaltyPoints >= :minLoyaltyPoints)")
    List<Customer> findCustomersByCriteria(
        @Param("membershipLevels") List<MemberShipLevel> membershipLevels,
        @Param("genders") List<Gender> genders,
        @Param("birthMonths") List<Integer> birthMonths,
        @Param("minLoyaltyPoints") Integer minLoyaltyPoints
    );

    // Existing methods
    Optional<Customer> findByEmail(String email);
    Optional<Customer> findByPhone(String phone);
    Optional<Customer> findByUserName(String userName);
    List<Customer> findAllByFullNameContainingIgnoreCase(String name);

    @Query("SELECT c FROM Customer c WHERE c.id LIKE :prefix% ORDER BY c.id DESC")
    Customer findLastCustomerIdOfDay(@Param("prefix") String prefix);
}
```

### 3. Update VoucherService

Add these imports and methods to `VoucherService.java`:

```java
package com.hotelvista.service;

import com.hotelvista.dto.DistributionCriteria;
import com.hotelvista.dto.DistributionResult;
import com.hotelvista.model.Customer;
import com.hotelvista.model.CustomerVoucher;
import com.hotelvista.model.Voucher;
import com.hotelvista.model.enums.Gender;
import com.hotelvista.model.enums.MemberShipLevel;
import com.hotelvista.repository.CustomerRepository;
import com.hotelvista.repository.CustomerVoucherRepository;
import com.hotelvista.repository.VoucherRepository;
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

    // ... existing methods ...

    /**
     * Preview distribution - count customers matching criteria
     * @param criteria - Distribution criteria
     * @return DistributionResult with count
     */
    public DistributionResult previewDistribution(DistributionCriteria criteria) {
        try {
            List<Customer> customers = findCustomersByCriteria(criteria);
            return new DistributionResult(true, "Preview successful", customers.size());
        } catch (Exception e) {
            e.printStackTrace();
            return new DistributionResult(false, "Lỗi khi preview: " + e.getMessage(), 0);
        }
    }

    /**
     * Distribute voucher to customers matching criteria
     * @param voucherId - Voucher ID to distribute
     * @param criteria - Distribution criteria
     * @return DistributionResult with success status and count
     */
    @Transactional(rollbackFor = Exception.class)
    public DistributionResult distributeVoucher(String voucherId, DistributionCriteria criteria) {
        try {
            Voucher voucher = findById(voucherId);
            if (voucher == null) {
                return new DistributionResult(false, "Voucher không tồn tại", 0);
            }

            if (!voucher.isActive()) {
                return new DistributionResult(false, "Voucher không còn hoạt động", 0);
            }

            List<Customer> customers = findCustomersByCriteria(criteria);

            if (customers.isEmpty()) {
                return new DistributionResult(false, "Không tìm thấy khách hàng phù hợp", 0);
            }

            int count = 0;
            for (Customer customer : customers) {
                // Check if this customer already has this voucher
                CustomerVoucher.CustomerVoucherId id =
                    new CustomerVoucher.CustomerVoucherId(customer, voucher);

                if (!customerVoucherRepo.findById(id).isPresent()) {
                    CustomerVoucher cv = new CustomerVoucher();
                    cv.setCustomer(customer);
                    cv.setVoucher(voucher);
                    cv.setState(false); // false = chưa sử dụng
                    customerVoucherRepo.save(cv);
                    count++;
                }
            }

            String message = String.format("Đã phân phối voucher cho %d khách hàng", count);
            return new DistributionResult(true, message, count);

        } catch (Exception e) {
            e.printStackTrace();
            return new DistributionResult(false,
                "Lỗi khi phân phối voucher: " + e.getMessage(), 0);
        }
    }

    /**
     * Find customers matching distribution criteria
     * @param criteria - Distribution criteria
     * @return List of matching customers
     */
    private List<Customer> findCustomersByCriteria(DistributionCriteria criteria) {
        // Convert String to Enum for membershipLevel
        List<MemberShipLevel> membershipLevels = null;
        if (criteria.getMembershipLevel() != null && !criteria.getMembershipLevel().isEmpty()) {
            membershipLevels = criteria.getMembershipLevel().stream()
                .map(level -> MemberShipLevel.valueOf(level))
                .collect(Collectors.toList());
        }

        // Convert String to Enum for gender
        List<Gender> genders = null;
        if (criteria.getGender() != null && !criteria.getGender().isEmpty()) {
            genders = criteria.getGender().stream()
                .map(gender -> Gender.valueOf(gender))
                .collect(Collectors.toList());
        }

        return customerRepo.findCustomersByCriteria(
            membershipLevels,
            genders,
            criteria.getBirthMonth(),
            criteria.getMinLoyaltyPoints()
        );
    }
}
```

### 4. Update VoucherController

Add these endpoints to `VoucherController.java`:

```java
package com.hotelvista.controller;

import com.hotelvista.dto.DistributionCriteria;
import com.hotelvista.dto.DistributionResult;
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

    // ... existing endpoints ...

    /**
     * Preview distribution - count customers matching criteria
     * @param criteria - Distribution criteria (membershipLevel, gender, birthMonth, minLoyaltyPoints)
     * @return DistributionResult with count of matching customers
     */
    @PostMapping("/preview-distribution")
    public ResponseEntity<DistributionResult> previewDistribution(
        @RequestBody DistributionCriteria criteria
    ) {
        DistributionResult result = service.previewDistribution(criteria);
        return ResponseEntity.ok(result);
    }

    /**
     * Distribute voucher to customers matching criteria
     * @param id - Voucher ID
     * @param criteria - Distribution criteria
     * @return DistributionResult with success status and count
     */
    @PostMapping("/{id}/distribute")
    public ResponseEntity<DistributionResult> distributeVoucher(
        @PathVariable String id,
        @RequestBody DistributionCriteria criteria
    ) {
        DistributionResult result = service.distributeVoucher(id, criteria);
        return result.isSuccess()
            ? ResponseEntity.ok(result)
            : ResponseEntity.badRequest().body(result);
    }
}
```

## Frontend Implementation

Frontend đã được implement sẵn với các components:

- **DistributeVoucherModal**: Modal để chọn criteria và phân phối voucher
- **DistributionTab**: Tab hiển thị form phân phối và lịch sử
- **voucherService**: Service để gọi API

### Workflow

1. Admin chọn voucher cần phân phối
2. Chọn criteria: membership level, gender, birth month, minimum loyalty points
3. Click "Preview" để xem số lượng khách hàng phù hợp
4. Click "Distribute Voucher" để thực hiện phân phối

### API Endpoints Used

```
POST /vouchers/preview-distribution
Body: {
  membershipLevel?: string[],
  gender?: string[],
  birthMonth?: number[],
  minLoyaltyPoints?: number
}
Response: {
  success: boolean,
  message: string,
  count: number
}

POST /vouchers/{voucherId}/distribute
Body: {
  membershipLevel?: string[],
  gender?: string[],
  birthMonth?: number[],
  minLoyaltyPoints?: number
}
Response: {
  success: boolean,
  message: string,
  count: number
}
```

## Testing

### Test Cases

1. **Preview with no criteria** - Should return all customers
2. **Preview with membership level only** - Should return customers with specified levels
3. **Preview with gender only** - Should return customers with specified genders
4. **Preview with birth month** - Should return customers born in specified months
5. **Preview with minimum loyalty points** - Should return customers with points >= specified
6. **Preview with combined criteria** - Should return customers matching ALL criteria

### Example Test Data

```json
{
  "membershipLevel": ["GOLD", "PLATINUM"],
  "gender": ["FEMALE"],
  "birthMonth": [3],
  "minLoyaltyPoints": 1000
}
```

This should return female customers with GOLD or PLATINUM membership, born in March, with at least 1000 loyalty points.

## Notes

- All criteria fields are optional
- Empty arrays are treated as "no filter" for that criterion
- Multiple values in an array use OR logic (e.g., GOLD OR PLATINUM)
- Different criteria use AND logic (e.g., GOLD OR PLATINUM AND FEMALE AND March)
- Voucher is only assigned to customers who don't already have it
- Distribution is transactional - all or nothing

## Deployment Steps

1. Add DTO classes to backend
2. Update CustomerRepository with new query method
3. Update VoucherService with new methods
4. Update VoucherController with new endpoints
5. Test endpoints with Postman/Thunder Client
6. Frontend is already implemented and ready to use
