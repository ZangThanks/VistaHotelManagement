# Hướng dẫn Phân phối Voucher theo Ngày Lễ với Google Calendar API

## Tổng quan

Hệ thống đã được tích hợp Google Calendar API để tự động phân phối voucher theo các ngày lễ và ngày đặc biệt trong năm. Bạn có thể cấu hình voucher nào sẽ được gửi cho khách hàng vào các dịp lễ cụ thể.

## Cấu hình API

File `.env` đã được cấu hình với:

```env
VITE_GOOGLE_API_KEY=AIzaSyA7vC8uPgvQasCGKW69KfIOOUYI13OILyE
VITE_GOOGLE_CALENDAR_ID="vi.vietnamese#holiday@group.v.calendar.google.com"
```

API này sử dụng Google Calendar công khai của Việt Nam, bao gồm tất cả các ngày lễ chính thức.

## Cách sử dụng

### 1. Truy cập trang Voucher Management

- Đăng nhập với tài khoản Admin
- Vào menu **Voucher Management**
- Chọn tab **Auto Events**

### 2. Kích hoạt Holiday Voucher

- Tìm thẻ **"Holiday Voucher"** (màu tím với icon 🎉)
- Bật công tắc để kích hoạt tính năng
- Click nút **"Configure"**

### 3. Chọn ngày lễ và voucher

Cửa sổ **"Phân phối Voucher theo Ngày Lễ"** sẽ hiển thị:

- **Danh sách ngày lễ**: Tất cả ngày lễ trong 12 tháng tới
- **Tìm kiếm**: Gõ tên ngày lễ để lọc nhanh
- **Chọn voucher**: Mỗi ngày lễ có dropdown để chọn voucher tương ứng

#### Ví dụ cấu hình:

- **Tết Nguyên Đán** → Voucher giảm 50%
- **30/4 - 1/5** → Voucher giảm 100.000đ
- **Quốc Khánh 2/9** → Voucher Free Breakfast
- **Giáng Sinh 25/12** → Voucher Room Upgrade

### 4. Lưu cấu hình

- Sau khi chọn xong, click **"Lưu (X ngày lễ)"**
- Hệ thống sẽ tự động gửi voucher cho khách hàng vào các ngày này

---

## 🚀 Hướng dẫn Implementation (Từng bước)

### PHẦN 1: BACKEND

#### Bước 1: Tạo Entity HolidayVoucher

**File**: `backend/src/main/java/com/hotelvista/model/HolidayVoucher.java`

```java
package com.hotelvista.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "holiday_vouchers")
public class HolidayVoucher {
    @Id
    @Column(name = "holiday_id")
    private String holidayId; // ID từ Google Calendar

    @Column(name = "holiday_name", columnDefinition = "NVARCHAR(255)")
    private String holidayName;

    @Column(name = "holiday_date")
    private LocalDate holidayDate;

    @ManyToOne
    @JoinColumn(name = "voucher_id")
    private Voucher voucher;

    @Column(name = "is_active")
    private boolean isActive;
}
```

**Giải thích**:

- `holidayId`: Primary key, dùng ID từ Google Calendar (unique)
- `holidayName`: Tên ngày lễ (VD: "Tết Nguyên Đán")
- `holidayDate`: Ngày lễ để scheduler check
- `voucher`: Relationship ManyToOne với Voucher entity
- `isActive`: Có phân phối voucher hay không

---

#### Bước 2: Tạo DTO

**File**: `backend/src/main/java/com/hotelvista/dto/HolidayVoucherDTO.java`

```java
package com.hotelvista.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HolidayVoucherDTO {
    private String holidayId;      // ID từ Google Calendar
    private String holidayName;    // Tên ngày lễ
    private LocalDate holidayDate; // Ngày lễ
    private String voucherId;      // ID voucher (String)
    private boolean isActive;      // Trạng thái
}
```

**Tại sao cần DTO?**

- Frontend gửi `voucherId` (String), không phải Voucher object
- Tách biệt API contract với Database structure
- Dễ validation và bảo mật

---

#### Bước 3: Tạo Repository

**File**: `backend/src/main/java/com/hotelvista/repository/HolidayVoucherRepository.java`

```java
package com.hotelvista.repository;

import com.hotelvista.model.HolidayVoucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface HolidayVoucherRepository extends JpaRepository<HolidayVoucher, String> {

    /**
     * Tìm tất cả holiday voucher theo ngày
     * Dùng cho scheduler kiểm tra hàng ngày
     */
    List<HolidayVoucher> findByHolidayDate(LocalDate holidayDate);

    /**
     * Tìm tất cả holiday voucher đang active
     */
    List<HolidayVoucher> findByIsActiveTrue();
}
```

---

#### Bước 4: Tạo Service

**File**: `backend/src/main/java/com/hotelvista/service/HolidayVoucherService.java`

```java
package com.hotelvista.service;

import com.hotelvista.model.HolidayVoucher;
import com.hotelvista.repository.HolidayVoucherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class HolidayVoucherService {

    @Autowired
    private HolidayVoucherRepository holidayVoucherRepository;

    public HolidayVoucher save(HolidayVoucher holidayVoucher) {
        return holidayVoucherRepository.save(holidayVoucher);
    }

    public List<HolidayVoucher> findByHolidayDate(LocalDate holidayDate) {
        return holidayVoucherRepository.findByHolidayDate(holidayDate);
    }

    public List<HolidayVoucher> findAll() {
        return holidayVoucherRepository.findAll();
    }

    public List<HolidayVoucher> findActiveHolidays() {
        return holidayVoucherRepository.findByIsActiveTrue();
    }
}
```

---

#### Bước 5: Tạo Controller

**File**: `backend/src/main/java/com/hotelvista/controller/HolidayVoucherController.java`

```java
package com.hotelvista.controller;

import com.hotelvista.dto.HolidayVoucherDTO;
import com.hotelvista.model.HolidayVoucher;
import com.hotelvista.model.Voucher;
import com.hotelvista.service.HolidayVoucherService;
import com.hotelvista.service.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/holiday-vouchers")
@CrossOrigin(origins = "http://localhost:5173")
public class HolidayVoucherController {

    @Autowired
    private HolidayVoucherService holidayVoucherService;

    @Autowired
    private VoucherService voucherService;

    /**
     * Lưu cấu hình holiday vouchers từ admin
     * POST /api/holiday-vouchers
     */
    @PostMapping
    public ResponseEntity<?> saveHolidayVouchers(@RequestBody List<HolidayVoucherDTO> holidayDTOs) {
        try {
            for (HolidayVoucherDTO dto : holidayDTOs) {
                // Convert DTO → Entity
                HolidayVoucher holidayVoucher = new HolidayVoucher();
                holidayVoucher.setHolidayId(dto.getHolidayId());
                holidayVoucher.setHolidayName(dto.getHolidayName());
                holidayVoucher.setHolidayDate(dto.getHolidayDate());

                // Lookup Voucher by ID
                Voucher voucher = voucherService.findById(dto.getVoucherId());
                if (voucher == null) {
                    return ResponseEntity.badRequest()
                        .body("Voucher not found: " + dto.getVoucherId());
                }
                holidayVoucher.setVoucher(voucher);
                holidayVoucher.setActive(dto.isActive());

                holidayVoucherService.save(holidayVoucher);
            }
            return ResponseEntity.ok("Holiday vouchers saved successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    /**
     * Lấy tất cả holiday vouchers đã cấu hình
     * GET /api/holiday-vouchers
     */
    @GetMapping
    public ResponseEntity<?> getAllHolidayVouchers() {
        try {
            List<HolidayVoucher> holidays = holidayVoucherService.findAll();
            return ResponseEntity.ok(holidays);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    /**
     * Lấy holiday vouchers của hôm nay (for testing)
     * GET /api/holiday-vouchers/today
     */
    @GetMapping("/today")
    public ResponseEntity<?> getTodayHolidays() {
        try {
            LocalDate today = LocalDate.now();
            List<HolidayVoucher> holidays = holidayVoucherService.findByHolidayDate(today);
            return ResponseEntity.ok(holidays);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
```

---

#### Bước 6: Thêm method assignVoucher vào CustomerVoucherService

**File**: `backend/src/main/java/com/hotelvista/service/CustomerVoucherService.java`

Thêm method này vào class `CustomerVoucherService` đã có:

```java
/**
 * Gán voucher cho khách hàng (dùng cho Holiday Voucher Scheduler)
 * @param customer - Khách hàng nhận voucher
 * @param voucher - Voucher được gán
 * @return CustomerVoucher đã tạo hoặc existing
 */
public CustomerVoucher assignVoucher(Customer customer, Voucher voucher) {
    // Tạo composite key
    CustomerVoucher.CustomerVoucherId id =
        new CustomerVoucher.CustomerVoucherId(customer, voucher);

    // Kiểm tra khách hàng đã có voucher này chưa
    Optional<CustomerVoucher> existing = repo.findById(id);

    if (existing.isPresent()) {
        // Nếu đã có, không tạo duplicate
        return existing.get();
    }

    // Tạo CustomerVoucher mới
    CustomerVoucher customerVoucher = new CustomerVoucher();
    customerVoucher.setCustomer(customer);
    customerVoucher.setVoucher(voucher);
    customerVoucher.setState(false); // false = chưa sử dụng

    return repo.save(customerVoucher);
}
```

---

#### Bước 7: Tạo Scheduler (Tự động phân phối)

**File**: `backend/src/main/java/com/hotelvista/scheduler/HolidayVoucherScheduler.java`

```java
package com.hotelvista.scheduler;

import com.hotelvista.model.Customer;
import com.hotelvista.model.HolidayVoucher;
import com.hotelvista.service.CustomerService;
import com.hotelvista.service.CustomerVoucherService;
import com.hotelvista.service.HolidayVoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class HolidayVoucherScheduler {

    @Autowired
    private HolidayVoucherService holidayVoucherService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private CustomerVoucherService customerVoucherService;

    /**
     * Chạy lúc 8h sáng mỗi ngày
     * Kiểm tra và phân phối holiday vouchers
     */
    @Scheduled(cron = "0 0 8 * * *")
    public void distributeHolidayVouchers() {
        LocalDate today = LocalDate.now();
        System.out.println("🎉 Holiday Voucher Scheduler running: " + today);

        // Lấy danh sách holiday vouchers của hôm nay
        List<HolidayVoucher> todayHolidays = holidayVoucherService.findByHolidayDate(today);

        if (todayHolidays.isEmpty()) {
            System.out.println("No holidays today");
            return;
        }

        for (HolidayVoucher holidayVoucher : todayHolidays) {
            // Chỉ phân phối nếu đang active
            if (!holidayVoucher.isActive()) {
                System.out.println("Skipping inactive holiday: " + holidayVoucher.getHolidayName());
                continue;
            }

            System.out.println("Distributing voucher for: " + holidayVoucher.getHolidayName());

            // Lấy tất cả khách hàng
            List<Customer> customers = customerService.findAll();
            int count = 0;

            for (Customer customer : customers) {
                try {
                    customerVoucherService.assignVoucher(customer, holidayVoucher.getVoucher());
                    count++;
                } catch (Exception e) {
                    System.err.println("Error assigning voucher to customer " +
                        customer.getId() + ": " + e.getMessage());
                }
            }

            System.out.println("✅ Distributed " + count + " vouchers for " +
                holidayVoucher.getHolidayName());
        }
    }
}
```

**Giải thích Scheduler**:

- `@Scheduled(cron = "0 0 8 * * *")`: Chạy lúc 8:00 AM mỗi ngày
- Kiểm tra xem hôm nay có ngày lễ đã cấu hình không
- Nếu có và `isActive = true` → Gửi voucher cho tất cả khách hàng
- Log ra console để dễ debug

---

#### Bước 8: Enable Scheduling trong Spring Boot

**File**: `backend/src/main/java/com/hotelvista/HotelVistaApplication.java`

Thêm annotation `@EnableScheduling`:

```java
package com.hotelvista;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling  // ← Thêm dòng này
public class HotelVistaApplication {
    public static void main(String[] args) {
        SpringApplication.run(HotelVistaApplication.class, args);
    }
}
```

---

### PHẦN 2: FRONTEND (Đã làm xong)

Frontend đã có sẵn các file:

- ✅ `googleCalendarService.ts` - Lấy ngày lễ từ Google Calendar API
- ✅ `HolidayVoucherModal.tsx` - Modal cho admin chọn voucher
- ✅ `AutoEventsTab.tsx` - Tab quản lý auto events
- ✅ Type `Holiday` trong types

---

### PHẦN 3: TESTING

#### Test 1: Kiểm tra API

```bash
# 1. Test lấy ngày lễ hôm nay
curl http://localhost:8080/api/holiday-vouchers/today

# 2. Test lưu cấu hình (dùng Postman)
POST http://localhost:8080/api/holiday-vouchers
Content-Type: application/json

[
  {
    "holidayId": "test123",
    "holidayName": "Test Holiday",
    "holidayDate": "2025-12-25",
    "voucherId": "VOUCHER001",
    "isActive": true
  }
]

# 3. Test lấy tất cả cấu hình
curl http://localhost:8080/api/holiday-vouchers
```

#### Test 2: Kiểm tra Scheduler

**Cách 1: Đợi đến 8h sáng**

- Chờ đến 8:00 AM
- Xem console log

**Cách 2: Test ngay (thay đổi cron)**
Sửa scheduler thành chạy mỗi phút:

```java
@Scheduled(cron = "0 * * * * *") // Chạy mỗi phút
```

#### Test 3: Test trên UI

1. Login admin
2. Vào Voucher Management → Auto Events
3. Bật Holiday Voucher
4. Click Configure
5. Chọn voucher cho ngày lễ
6. Lưu → Check database có record mới không

---

### PHẦN 4: DATABASE

Tạo bảng `holiday_vouchers`:

```sql
CREATE TABLE holiday_vouchers (
    holiday_id VARCHAR(255) PRIMARY KEY,
    holiday_name NVARCHAR(255),
    holiday_date DATE,
    voucher_id VARCHAR(255),
    is_active BIT,
    FOREIGN KEY (voucher_id) REFERENCES vouchers(voucher_id)
);
```

---

## ✅ Checklist Implementation

- [ ] Tạo Entity `HolidayVoucher`
- [ ] Tạo DTO `HolidayVoucherDTO`
- [ ] Tạo Repository `HolidayVoucherRepository`
- [ ] Tạo Service `HolidayVoucherService`
- [ ] Tạo Controller `HolidayVoucherController`
- [ ] Thêm method `assignVoucher` vào `CustomerVoucherService`
- [ ] Tạo Scheduler `HolidayVoucherScheduler`
- [ ] Enable `@EnableScheduling`
- [ ] Test API endpoints
- [ ] Test Scheduler
- [ ] Test UI flow

---

## Các service API đã tạo

### googleCalendarService.ts

#### Các hàm chính:

1. **`fetchHolidays(startDate, endDate)`**

   - Lấy danh sách ngày lễ trong khoảng thời gian
   - Trả về: `Holiday[]`

2. **`getUpcomingHolidays(months)`**

   - Lấy ngày lễ sắp tới trong N tháng
   - Mặc định: 12 tháng
   - Trả về: `Holiday[]`

3. **`getHolidaysForYear(year)`**

   - Lấy tất cả ngày lễ trong một năm
   - Trả về: `Holiday[]`

4. **`isHoliday(date)`**

   - Kiểm tra một ngày có phải là ngày lễ không
   - Trả về: `Holiday | null`

5. **`getHolidaysByMonth(year)`**
   - Nhóm ngày lễ theo tháng
   - Trả về: `Record<string, Holiday[]>`

### Cấu trúc Holiday:

```typescript
interface Holiday {
  id: string; // ID duy nhất từ Google Calendar
  summary: string; // Tên ngày lễ (VD: "Tết Nguyên Đán")
  description?: string; // Mô tả chi tiết
  start: string; // Ngày bắt đầu (ISO string)
  end: string; // Ngày kết thúc (ISO string)
  date: Date; // Date object để xử lý
}
```

## Components đã tạo

### HolidayVoucherModal.tsx

Modal cho phép admin:

- Xem danh sách ngày lễ sắp tới
- Tìm kiếm ngày lễ
- Chọn voucher cho mỗi ngày lễ
- Lưu cấu hình

### AutoEventsTab.tsx (đã cập nhật)

- Thêm event "Holiday Voucher" mới
- Tích hợp HolidayVoucherModal
- Xử lý logic lưu cấu hình

## Flow hoạt động

```
1. Admin vào Voucher Management → Auto Events
2. Kích hoạt "Holiday Voucher"
3. Click "Configure"
4. HolidayVoucherModal gọi getUpcomingHolidays(12)
5. Google Calendar API trả về danh sách ngày lễ
6. Admin chọn voucher cho các ngày lễ
7. Click "Lưu" → Cấu hình được lưu
8. Backend scheduler sẽ:
   - Kiểm tra hàng ngày
   - Nếu là ngày lễ đã cấu hình → Gửi voucher cho khách hàng
```

## Tích hợp Backend (TODO)

Để hoàn thiện tính năng, cần implement backend:

### 1. Tạo Entity HolidayVoucher

```java
@Entity
public class HolidayVoucher {
    @Id
    private String holidayId; // ID từ Google Calendar (unique)

    private String holidayName;
    private LocalDate holidayDate;

    @ManyToOne
    private Voucher voucher;

    private Boolean isActive;
}
```

### 2. Tạo DTO (Tùy chọn - Khuyến nghị)

**Cách 1: Dùng DTO (Khuyến nghị)**

```java
package com.hotelvista.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class HolidayVoucherDTO {
    private String holidayId;      // ID từ Google Calendar
    private String holidayName;    // Tên ngày lễ
    private LocalDate holidayDate; // Ngày lễ
    private String voucherId;      // ID của voucher được chọn (String từ FE)
    private boolean isActive;      // Trạng thái active
}
```

**Cách 2: Không dùng DTO**

Nếu không muốn tạo DTO, frontend phải gửi data đúng format Entity:

```typescript
// Frontend phải gửi như này:
{
  holidayId: "...",
  holidayName: "Tết Nguyên Đán",
  holidayDate: "2026-01-29",
  voucher: {
    voucherID: "VOUCHER001",  // Phải gửi cả object
    voucherName: "...",
    // ... các field khác
  },
  isActive: true
}
```

→ **Phức tạp hơn** vì frontend phải biết structure của Voucher entity

**Khuyến nghị: Dùng DTO** để tách biệt API contract với Database model

### 3. Tạo API endpoint

```java
@RestController
@RequestMapping("/api/holiday-vouchers")
public class HolidayVoucherController {

    @Autowired
    private HolidayVoucherService holidayVoucherService;

    @Autowired
    private VoucherService voucherService;

    @PostMapping
    public ResponseEntity<?> saveHolidayVouchers(@RequestBody List<HolidayVoucherDTO> holidayDTOs) {
        try {
            for (HolidayVoucherDTO dto : holidayDTOs) {
                HolidayVoucher holidayVoucher = new HolidayVoucher();
                holidayVoucher.setHolidayId(dto.getHolidayId());
                holidayVoucher.setHolidayName(dto.getHolidayName());
                holidayVoucher.setHolidayDate(dto.getHolidayDate());

                Voucher voucher = voucherService.findById(dto.getVoucherId());
                holidayVoucher.setVoucher(voucher);
                holidayVoucher.setActive(dto.isActive());

                holidayVoucherService.save(holidayVoucher);
            }
            return ResponseEntity.ok("Holiday vouchers saved successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getActiveHolidayVouchers() {
        try {
            List<HolidayVoucher> holidays = holidayVoucherService.findAll();
            return ResponseEntity.ok(holidays);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/today")
    public ResponseEntity<?> getTodayHolidays() {
        try {
            LocalDate today = LocalDate.now();
            List<HolidayVoucher> holidays = holidayVoucherService.findByHolidayDate(today);
            return ResponseEntity.ok(holidays);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
```

### 4. Tạo Scheduler

```java
@Component
public class HolidayVoucherScheduler {

    @Autowired
    private HolidayVoucherService holidayVoucherService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private CustomerVoucherService customerVoucherService;

    @Scheduled(cron = "0 0 8 * * *") // Chạy lúc 8h sáng mỗi ngày
    public void distributeHolidayVouchers() {
        LocalDate today = LocalDate.now();
        List<HolidayVoucher> todayHolidays = holidayVoucherService.findByHolidayDate(today);

        for (HolidayVoucher holidayVoucher : todayHolidays) {
            // Chỉ phân phối voucher nếu đang active
            if (!holidayVoucher.isActive()) {
                continue;
            }

            List<Customer> customers = customerService.findAll();
            for (Customer customer : customers) {
                customerVoucherService.assignVoucher(customer, holidayVoucher.getVoucher());
            }
        }
    }
}
```

### 4. Tạo Service assignVoucher

```java
@Service
public class CustomerVoucherService {

    @Autowired
    private CustomerVoucherRepository repo;

    /**
     * Gán voucher cho khách hàng
     * @param customer - Khách hàng nhận voucher
     * @param voucher - Voucher được gán
     * @return CustomerVoucher đã tạo
     */
    public CustomerVoucher assignVoucher(Customer customer, Voucher voucher) {
        // Tạo composite key
        CustomerVoucher.CustomerVoucherId id =
            new CustomerVoucher.CustomerVoucherId(customer, voucher);

        // Kiểm tra khách hàng đã có voucher này chưa
        Optional<CustomerVoucher> existing = repo.findById(id);

        if (existing.isPresent()) {
            // Nếu đã có, không tạo duplicate
            return existing.get();
        }

        // Tạo CustomerVoucher mới
        CustomerVoucher customerVoucher = new CustomerVoucher();
        customerVoucher.setCustomer(customer);
        customerVoucher.setVoucher(voucher);
        customerVoucher.setState(false); // false = chưa sử dụng

        return repo.save(customerVoucher);
    }
}
```

### 5. Repository (không cần thêm method mới)

```java
@Repository
public interface CustomerVoucherRepository extends JpaRepository<CustomerVoucher, CustomerVoucher.CustomerVoucherId> {

    // Các method đã có sẵn:
    List<CustomerVoucher> findAllByCustomer_Id(String customerId);

    List<CustomerVoucher> findActiveVouchersByCustomer(String customerId);

    List<CustomerVoucher> findByCustomerAndState(String customerId, boolean state);

    List<CustomerVoucher> findAllByCustomer_IdAndStateIsTrue(String customerId);

    // Không cần thêm findByCustomerIdAndVoucherId vì đã dùng composite key
    // Dùng findById(CustomerVoucherId) thay thế
}
```

**Lưu ý về thiết kế:**

- `CustomerVoucher` sử dụng **composite key** (customer + voucher)
- Method `findById()` của JPA đã đủ để check duplicate
- Field `state`: `false` = chưa dùng, `true` = đã dùng

## Lưu ý

1. **API Key**: Đảm bảo Google API Key luôn hoạt động
2. **Rate Limit**: Google Calendar API có giới hạn requests/day
3. **Caching**: Nên cache danh sách ngày lễ để giảm số lần gọi API
4. **Timezone**: Calendar ID hiện dùng múi giờ Việt Nam
5. **Testing**: Test kỹ trước khi deploy để đảm bảo voucher được gửi đúng ngày

## Mở rộng

Có thể thêm các tính năng:

- Gửi voucher trước X ngày
- Gửi voucher cho nhóm khách hàng cụ thể
- Thông báo email/SMS khi gửi voucher
- Báo cáo thống kê voucher đã gửi theo ngày lễ
- Tích hợp với Google Calendar riêng của khách sạn

## Demo sử dụng

1. **Tạo voucher cho Tết**:

   - Tạo voucher "Happy Lunar New Year" giảm 50%
   - Vào Auto Events → Holiday Voucher → Configure
   - Tìm "Tết Nguyên Đán"
   - Chọn voucher vừa tạo
   - Lưu

2. **Kết quả**:
   - Ngày 29 Tháng Giêng, tất cả khách hàng sẽ nhận được voucher này
   - Voucher tự động thêm vào "My Vouchers" của họ
