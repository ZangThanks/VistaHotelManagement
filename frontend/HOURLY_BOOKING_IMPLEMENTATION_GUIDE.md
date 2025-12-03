# Hướng dẫn Implement Chức năng Booking Theo Giờ

## 📋 Mục Lục

1. [Hiểu về Database và Logic](#1-hiểu-về-database-và-logic)
2. [Cấu trúc Backend đã có](#2-cấu-trúc-backend-đã-có)
3. [Công thức tính giá](#3-công-thức-tính-giá)
4. [Implement Frontend - BookingForm.tsx](#4-implement-frontend---bookingformtsx)
5. [Test Cases](#5-test-cases)

---

## 1. Hiểu về Database và Logic

### 1.1. Cấu trúc Database

#### Bảng `hourly_rate_policy`

```
| id | policy_name                      | weekend_surcharge |
|----|----------------------------------|-------------------|
| 1  | Chính sách tiêu chuẩn 2025-2026 | 15                |
```

**Ý nghĩa:**

- `weekend_surcharge`: Phụ phí cuối tuần (15%)
- Chỉ có 1 policy active tại một thời điểm

#### Bảng `policy_base_rates`

```
| policy_id | hours_duration | percentage |
|-----------|----------------|------------|
| 1         | 1              | 15         |
| 1         | 2              | 25         |
| 1         | 3              | 35         |
| 1         | 4              | 45         |
| 1         | 5              | 55         |
| 1         | 6              | 65         |
| 1         | 7              | 75         |
| 1         | 8              | 85         |
| 1         | 9              | 100        |
```

**Ý nghĩa:**

- `hours_duration`: Số giờ thuê
- `percentage`: Phần trăm giá so với giá phòng/đêm
- Ví dụ: Thuê 2 giờ = 25% giá phòng/đêm

#### Bảng `policy_weekend_days`

```
| policy_id | day_of_week |
|-----------|-------------|
| 1         | SATURDAY    |
| 1         | SUNDAY      |
```

**Ý nghĩa:**

- Định nghĩa ngày nào là cuối tuần
- Có thể config thêm ngày lễ trong tương lai

### 1.2. Đặc tả tính giá (từ tài liệu)

#### Bảng phần trăm theo số giờ:

| Số giờ | Phần trăm | Ghi chú                  |
| ------ | --------- | ------------------------ |
| 1 giờ  | 15%       |                          |
| 2 giờ  | 25%       |                          |
| 3 giờ  | 35%       |                          |
| 4 giờ  | 45%       |                          |
| 5 giờ  | 55%       |                          |
| 6 giờ  | 65%       |                          |
| 7 giờ  | 75%       |                          |
| 8 giờ  | 85%       |                          |
| 9+ giờ | 100%      | Tương đương nghỉ qua đêm |

#### Phụ phí:

| Khung giờ     | Thời gian       | Cách tính                   |
| ------------- | --------------- | --------------------------- |
| Mọi khung giờ | Tất cả các giờ  | Áp dụng giá theo bảng trên  |
| Cuối tuần     | Thứ 7, Chủ nhật | Cộng thêm 15% phí cuối tuần |

**Lưu ý:**

- MỌI khung giờ (cả sáng, chiều, tối, đêm) đều tính theo bảng phần trăm cơ bản
- Không có phụ phí theo giờ trong ngày
- CHỈ có phụ phí cuối tuần (+15%) cho Thứ 7 và Chủ nhật

---

## 2. Cấu trúc Backend đã có

### 2.1. Model `HourlyRatePolicy.java`

```java
@Entity
@Table(name = "hourly_rate_policy")
public class HourlyRatePolicy {
    @Id
    private Long id;

    private String policyName;

    // Phụ phí cuối tuần (%)
    private Double weekendSurcharge;

    // Danh sách ngày cuối tuần
    @ElementCollection
    private Set<DayOfWeek> weekendDays = new HashSet<>();

    // Bảng phần trăm theo số giờ
    @ElementCollection
    private Map<Integer, Double> baseRates = new HashMap<>();
    // Key: số giờ (1, 2, 3...)
    // Value: phần trăm (15, 25, 35...)
}
```

### 2.2. Model `Booking.java`

```java
@Entity
@Table(name = "bookings")
public class Booking {
    // ... các field khác

    // Giá mỗi giờ (đã tính các phụ phí)
    @Column(name = "hourly_rate")
    private Double hourlyRate;

    // Số giờ thuê
    private Integer duration;

    // Loại booking: DAILY hoặc HOURLY
    @Enumerated(EnumType.STRING)
    private BookingType type;
}
```

### 2.3. API Endpoint

```
GET /hourly-rate-policies/base-rates
```

**Response:**

```json
[
  {
    "id": 1,
    "policyName": "Chính sách tiêu chuẩn 2025-2026",
    "weekendSurcharge": 15,
    "weekendDays": ["SATURDAY", "SUNDAY"],
    "baseRates": {
      "1": 15,
      "2": 25,
      "3": 35,
      "4": 45,
      "5": 55,
      "6": 65,
      "7": 75,
      "8": 85,
      "9": 100
    }
  }
]
```

---

## 3. Công thức tính giá

### 3.1. Công thức tổng quát

```
Giá/giờ = (Giá phòng/đêm × Tổng phần trăm) ÷ 100 ÷ Số giờ
```

Trong đó:

```
Tổng phần trăm = Phần trăm cơ bản + Phụ phí cuối tuần (nếu có)
```

**LƯU Ý QUAN TRỌNG:**

- Phụ phí cuối tuần được **CỘNG** vào phần trăm cơ bản
- MỌI khung giờ trong ngày đều dùng bảng phần trăm cơ bản

### 3.2. Các bước tính

**Bước 1: Lấy phần trăm cơ bản từ database**

- Ví dụ: duration = 2 giờ → baseRate = 25%

**Bước 2: Kiểm tra cuối tuần**

- Nếu là Thứ 7 hoặc Chủ nhật → **CỘNG thêm weekendSurcharge%**
- Ví dụ: 25% + 15% = 40%

**Bước 3: Tính giá cuối cùng**

```
Tổng giá = (basePrice × totalPercentage) / 100
Giá/giờ = Tổng giá / duration
```

### 3.3. Ví dụ cụ thể

#### Ví dụ 1: Ngày thường, giờ thường

**Input:**

- Giá phòng: 1,000,000 VND/đêm
- Ngày: Thứ 3
- Giờ check-in: 10:00
- Duration: 4 giờ

**Tính toán:**

1. Base rate (4 giờ): **45%**
2. Khung giờ ban ngày (10:00): 45% + 0% = **45%**
3. Không phải cuối tuần: 45% + 0% = **45%**
4. Tổng giá = (1,000,000 × 45) / 100 = 450,000 VND
5. Giá/giờ = 450,000 / 4 = **112,500 VND/giờ**

**Output:**

- `hourlyRate`: 112,500
- `totalAmount`: 450,000

---

#### Ví dụ 2: Cuối tuần + Giờ cao điểm

**Input:**

- Giá phòng: 1,000,000 VND/đêm
- Ngày: Thứ 7 (Saturday)
- Giờ check-in: 19:00
- Duration: 2 giờ

**Tính toán:**

1. Base rate (2 giờ): 25%
2. Cuối tuần: 25% + 15% = **40%**
3. Tổng giá = (1,000,000 × 40) / 100 = 400,000 VND
4. Giá/giờ = 400,000 / 2 = **200,000 VND/giờ**

**Output:**

- `hourlyRate`: 200,000
- `totalAmount`: 400,000

**Output:**

- `hourlyRate`: 172,500
- `totalAmount`: 345,000

---

## 4. Implement Frontend - BookingForm.tsx

### 4.1. Import và State

#### Thêm import (đầu file):

```tsx
import { getAllPolicyBaseRates } from "../../services/HourlyRatePolicyService";
import type {
  HourlyRatePolicy,
  BaseRateItem,
} from "../../types/HourlyRatePolicy";
```

#### Thêm state (trong component):

```tsx
const [hourlyRatePolicies, setHourlyRatePolicies] = useState<
  HourlyRatePolicy[]
>([]);
```

**GIẢI THÍCH:**

- `hourlyRatePolicies`: Lưu danh sách policies từ database
- Dùng để lấy `baseRates`, `weekendSurcharge`, `weekendDays`

### 4.2. Fetch Policy từ Database

#### Thêm vào function `fetchedData()`:

```tsx
const fetchedData = async () => {
  try {
    setLoading(true);

    // ... code cũ (generateBookingID, fetch services, etc.)

    // Fetch hourly rate policies if booking type is hourly
    if (bookingType === "HOURLY") {
      try {
        const policies = await getAllPolicyBaseRates();
        setHourlyRatePolicies(policies);
        console.log("Hourly rate policies loaded:", policies);
      } catch (error) {
        console.error("Failed to fetch hourly rate policies:", error);
      }
    }

    // ... code cũ tiếp theo
  } catch (err) {
    console.error("Error fetching data:", err);
  }
};
```

**GIẢI THÍCH:**

- Chỉ fetch khi `bookingType === "HOURLY"`
- Lưu vào state để dùng cho tính toán
- Log ra console để debug

### 4.3. Function Tính Giá Theo Giờ

#### Thay thế hoàn toàn function `calculateHourlyRate`:

**VỊ TRÍ:** Tìm function cũ (khoảng line 248-301), xóa và thay bằng code mới:

```tsx
/**
 * Tính giá theo giờ dựa trên HourlyRatePolicy
 *
 * CÔNG THỨC:
 * 1. Lấy phần trăm cơ bản từ baseRates theo duration
 * 2. Áp dụng phụ phí cuối tuần: CỘNG X% (từ weekendSurcharge) nếu là Thứ 7/CN
 * 3. Tính giá cuối: (basePrice × totalPercentage / 100) / duration
 *
 * @param basePrice Giá gốc của phòng (giá/đêm)
 * @param duration Số giờ đặt
 * @param checkInDate Ngày và giờ check-in
 * @returns Giá mỗi giờ đã tính phụ phí (VND/giờ)
 */
const calculateHourlyRate = (
  basePrice: number,
  duration: number,
  checkInDate: Date | null
): number => {
  // Fallback nếu chưa có policy
  if (!checkInDate || hourlyRatePolicies.length === 0) {
    return basePrice;
  }

  const policy = hourlyRatePolicies[0]; // Lấy policy đầu tiên

  // ===== BƯỚC 1: Lấy phần trăm cơ bản từ baseRates =====
  let ratePercentage = 100; // Default 100% nếu không tìm thấy

  if (policy.baseRates && Array.isArray(policy.baseRates)) {
    const rates = policy.baseRates as BaseRateItem[];

    // Sắp xếp giảm dần theo baseHours để tìm rate phù hợp
    // Ví dụ: [9h→100%, 8h→85%, ..., 1h→15%]
    const sortedRates = [...rates].sort((a, b) => b.baseHours - a.baseHours);

    // Tìm rate có baseHours <= duration
    // Ví dụ: duration=2 → lấy rate của 2h (25%)
    const matchedRate = sortedRates.find((r) => duration >= r.baseHours);

    if (matchedRate) {
      ratePercentage = matchedRate.baseRate; // Đây là % (ví dụ: 25)
      console.log(`Base rate for ${duration}h: ${ratePercentage}%`);
    }
  }

  // ===== BƯỚC 2: Áp dụng phụ phí cuối tuần =====
  // Lưu ý: MỌI khung giờ trong ngày đều dùng bảng phần trăm cơ bản
  // CHỈ có phụ phí cuối tuần
  const dayOfWeek = checkInDate.getDay(); // 0=Sunday, 6=Saturday
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  if (isWeekend && policy.weekendSurcharge) {
    const beforeSurcharge = ratePercentage;
    ratePercentage = ratePercentage + policy.weekendSurcharge; // CỘNG weekendSurcharge%
    console.log(
      `Weekend surcharge: ${beforeSurcharge}% → ${ratePercentage}% (+${policy.weekendSurcharge}%)`
    );
  }

  // ===== BƯỚC 4: Tính giá cuối cùng =====
  // Công thức: Giá theo giờ = (Giá phòng/đêm × Tổng %) ÷ 100 ÷ Số giờ
  const totalPrice = (basePrice * ratePercentage) / 100;
  const hourlyRate = totalPrice / duration;

  console.log(
    `Final calculation: (${basePrice} × ${ratePercentage}%) / ${duration}h = ${hourlyRate.toFixed(
      0
    )} VND/hour`
  );
  console.log(`Total amount: ${totalPrice.toFixed(0)} VND`);

  return hourlyRate;
};
```

**GIẢI THÍCH CHI TIẾT:**

**Tại sao dùng `ratePercentage` thay vì `ratePerHour`?**

- Database lưu **phần trăm** (15, 25, 35...), không phải giá tiền
- Phần trăm này là % so với giá phòng/đêm
- Ví dụ: 2 giờ = 25% → 1,000,000 × 25% = 250,000 VND

**Tại sao KHÔNG có phụ phí theo giờ trong ngày?**

- Đặc tả chỉ định: "Mọi khung giờ" đều áp dụng giá theo bảng trên
- Không phân biệt sáng, trưa, chiều, tối, đêm
- Tất cả đều dùng phần trăm cơ bản từ database

**Tại sao CỘNG weekendSurcharge?**

- `weekendSurcharge` trong database là 15 (nghĩa là 15%)
- Đặc tả nói **cộng thêm** 15%, không phải nhân
- Ví dụ: 45% + 15% = 60% (KHÔNG phải 45% × 1.15 = 51.75%)

**Tại sao chia cho duration ở cuối?**

- Công thức đặc tả: **Giá theo giờ** = Tổng giá / Số giờ
- Frontend cần lưu giá _mỗi giờ_ vào `booking.hourlyRate`
- Backend sẽ nhân lại với `duration` để tính tổng

### 4.4. Update Function `calculateRoomCosts`

**VỊ TRÍ:** Tìm function `calculateRoomCosts()` (khoảng line 304-320)

**KHÔNG CẦN SỬA** - Function này đã đúng:

```tsx
const calculateRoomCosts = () => {
  if (bookingType === "HOURLY") {
    // Tính giá theo giờ với policy
    return rooms.reduce((sum, room) => {
      const basePrice = room.roomType?.basePrice || 0;
      const hourlyRate = calculateHourlyRate(
        basePrice,
        duration,
        hourlyCheckInDate
      );
      // Nhân với duration để có tổng tiền
      return sum + hourlyRate * duration;
    }, 0);
  } else {
    // Daily booking
    return rooms.reduce(
      (sum, room) => sum + (room.roomType?.basePrice || 0),
      0
    );
  }
};
```

**GIẢI THÍCH:**

- Gọi `calculateHourlyRate()` để lấy giá/giờ
- Nhân với `duration` để có tổng tiền
- Ví dụ: 172,500 VND/giờ × 2 giờ = 345,000 VND

### 4.5. Update Save Booking

**VỊ TRÍ:** Tìm phần tính `calculatedHourlyRate` trong `handleSaveBooking()` (khoảng line 404-410)

**KHÔNG CẦN SỬA** - Code này đã đúng:

```tsx
// Tính hourlyRate cho booking
let calculatedHourlyRate = 0;
if (bookingType === "HOURLY" && rooms.length > 0) {
  const basePrice = rooms[0]?.roomType?.basePrice || 0;
  calculatedHourlyRate = calculateHourlyRate(
    basePrice,
    duration,
    hourlyCheckInDate
  );
  console.log(
    `Calculated hourly rate: ${calculatedHourlyRate} VND/hour for ${duration} hours`
  );
}
```

**GIẢI THÍCH:**

- Tính lại `hourlyRate` trước khi save
- Lưu vào `payload.hourlyRate` để gửi lên backend
- Backend lưu vào database: `booking.hourlyRate`

### 4.6. Hiển thị Phụ Phí trong Step 4 (Summary)

**VỊ TRÍ:** Trong Step 4, sau phần hiển thị "Total room costs" (khoảng line 1055)

**THÊM CODE SAU:**

```tsx
{
  /* Total room costs */
}
<div className="flex justify-between items-center py-2 border-t border-gray-200 mt-4">
  <label className="text-sm font-semibold text-gray-600">
    Total room costs:
  </label>
  <span className="text-[#c9b8a8] font-semibold">
    {totalRoomCosts.toLocaleString()} VND
  </span>
</div>;

{
  /* THÊM ĐOẠN NÀY - Hiển thị phụ phí cho hourly booking */
}
{
  bookingType === "HOURLY" && hourlyRatePolicies.length > 0 && (
    <div className="bg-gray-50 rounded-lg p-4 mt-4">
      <p className="text-sm font-semibold text-gray-600 mb-2">
        Pricing Details:
      </p>
      <div className="space-y-1 text-sm text-gray-700">
        <div className="flex justify-between">
          <span>Duration:</span>
          <span className="font-medium">{duration} hours</span>
        </div>

        {(() => {
          if (!hourlyCheckInDate) return null;

          // Kiểm tra điều kiện phụ phí cuối tuần
          const dayOfWeek = hourlyCheckInDate.getDay();
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
          const policy = hourlyRatePolicies[0];

          return (
            <>
              {isWeekend && policy?.weekendSurcharge && (
                <div className="flex justify-between text-blue-600">
                  <span>• Weekend surcharge (Sat/Sun):</span>
                  <span className="font-medium">
                    +{policy.weekendSurcharge}%
                  </span>
                </div>
              )}
              {!isWeekend && (
                <div className="flex justify-between text-green-600">
                  <span>• Standard rate (weekday)</span>
                  <span className="font-medium">✓</span>
                </div>
              )}
            </>
          );
        })()}
      </div>
    </div>
  );
}
```

**GIẢI THÍCH:**

- Hiển thị duration (số giờ thuê)
- Hiển thị phụ phí evening peak (+20%) nếu có
- Hiển thị phụ phí weekend (+X%) nếu có
- Hiển thị "Standard rate" nếu không có phụ phí
- Dùng màu khác nhau để dễ phân biệt:
  - Orange: Evening peak
  - Blue: Weekend
  - Green: Standard

---

## 5. Test Cases

### Test Case 1: Ngày thường, giờ thường

**Input:**

```
Booking Type: HOURLY
Room: Phòng Standard (1,000,000 VND/đêm)
Date: Tuesday, 03/12/2025
Check-in Time: 10:00
Duration: 4 hours
```

**Expected Output:**

```
Base rate: 45% (4 giờ)
Evening peak: Không
Weekend: Không
Total percentage: 45%

Tổng giá = (1,000,000 × 45%) = 450,000 VND
Hourly rate = 450,000 / 4 = 112,500 VND/giờ

Payment summary:
- Room costs: 450,000 VND
- Services: 0 VND
- Voucher: 0 VND
- Total: 450,000 VND

Pricing Details:
✓ Duration: 4 hours
✓ Standard rate (no surcharges)
```

**Steps to test:**

1. Chọn "Hourly Booking" từ trang chủ
2. Chọn ngày Thứ 3
3. Chọn giờ 10:00
4. Chọn duration 4 giờ
5. Chọn phòng (1,000,000 VND)
6. Next → Next → Review
7. Kiểm tra "Total room costs" = 450,000 VND
8. Kiểm tra hiển thị "Standard rate (no surcharges)"

---

### Test Case 2: Cuối tuần + Giờ cao điểm

**Input:**

```
Booking Type: HOURLY
Room: Phòng Standard (1,000,000 VND/đêm)
Date: Saturday, 06/12/2025
Check-in Time: 19:00
Duration: 2 hours
```

**Expected Output:**

```
Base rate: 25% (2 giờ)
Weekend: 25% + 15% = 40%

Tổng giá = (1,000,000 × 40%) = 400,000 VND
Hourly rate = 400,000 / 2 = 200,000 VND/giờ

Payment summary:
- Room costs: 400,000 VND
- Services: 0 VND
- Voucher: 0 VND
- Total: 400,000 VND

Pricing Details:
• Duration: 2 hours
• Weekend surcharge: +15%
```

**Steps to test:**

1. Chọn "Hourly Booking"
2. Chọn ngày Thứ 7
3. Chọn giờ 19:00
4. Chọn duration 2 giờ
5. Chọn phòng (1,000,000 VND)
6. Next → Next → Review
7. Kiểm tra "Total room costs" = 400,000 VND
8. Kiểm tra hiển thị phụ phí Weekend (+15%)

---

### Test Case 3: Chủ nhật, giờ sáng

**Input:**

```
Booking Type: HOURLY
Room: Phòng Deluxe (1,500,000 VND/đêm)
Date: Sunday, 07/12/2025
Check-in Time: 08:00
Duration: 3 hours
```

**Expected Output:**

```
Base rate: 35% (3 giờ)
Weekend: 35% + 15% = 50%

Tổng giá = (1,500,000 × 50%) = 750,000 VND
Hourly rate = 750,000 / 3 = 250,000 VND/giờ

Payment summary:
- Room costs: 750,000 VND
- Services: 0 VND
- Voucher: 0 VND
- Total: 750,000 VND

Pricing Details:
• Duration: 3 hours
• Weekend surcharge: +15%
```

**Steps to test:**

1. Chọn "Hourly Booking"
2. Chọn ngày Chủ nhật
3. Chọn giờ 08:00
4. Chọn duration 3 giờ
5. Chọn phòng Deluxe (1,500,000 VND)
6. Next → Next → Review
7. Kiểm tra "Total room costs" = 750,000 VND
8. Kiểm tra hiển thị Weekend surcharge (+15%)

---

### Test Case 4: Ngày thường, giờ tối

**Input:**

```
Booking Type: HOURLY
Room: Phòng Standard (1,000,000 VND/đêm)
Date: Friday, 05/12/2025
Check-in Time: 18:30
Duration: 2 hours
```

**Expected Output:**

```
Base rate: 25% (2 giờ)
Weekend: Không (Thứ 6 không phải cuối tuần)

Tổng giá = (1,000,000 × 25%) = 250,000 VND
Hourly rate = 250,000 / 2 = 125,000 VND/giờ

Payment summary:
- Room costs: 250,000 VND
- Services: 0 VND
- Voucher: 0 VND
- Total: 250,000 VND

Pricing Details:
• Duration: 2 hours
• Standard rate (weekday)
```

**Steps to test:**

1. Chọn "Hourly Booking"
2. Chọn ngày Thứ 6
3. Chọn giờ 18:30
4. Chọn duration 2 giờ
5. Chọn phòng (1,000,000 VND)
6. Next → Next → Review
7. Kiểm tra "Total room costs" = 250,000 VND
8. Kiểm tra hiển thị "Standard rate (weekday)"

---

## 6. Debugging Tips

### 6.1. Check Console Logs

Sau khi implement, mở Console (F12) và kiểm tra các log:

```
Hourly rate policies loaded: [{...}]
Base rate for 2h: 25%
Weekend surcharge: 25% → 40% (+15%)
Final calculation: (1000000 × 40%) / 2h = 200000 VND/hour
Total amount: 400000 VND
```

**Nếu không thấy logs:**

- Kiểm tra `bookingType === "HOURLY"`
- Kiểm tra API `/hourly-rate-policies/base-rates` có trả về data không

### 6.2. Validate API Response

Test API trực tiếp trong browser/Postman:

```
GET http://localhost:8080/hourly-rate-policies/base-rates
```

Expected response:

```json
[
  {
    "id": 1,
    "policyName": "Chính sách tiêu chuẩn 2025-2026",
    "weekendSurcharge": 15,
    "weekendDays": ["SATURDAY", "SUNDAY"],
    "baseRates": {
      "1": 15,
      "2": 25,
      "3": 35,
      "4": 45,
      "5": 55,
      "6": 65,
      "7": 75,
      "8": 85,
      "9": 100
    }
  }
]
```

### 6.3. Common Issues

#### Issue 1: "hourlyRatePolicies is empty"

**Cause:** API chưa fetch hoặc fetch thất bại
**Fix:**

- Check network tab xem API có được call không
- Check backend có chạy không
- Check database có data không

#### Issue 2: "Giá tính ra không đúng"

**Cause:** Công thức tính sai hoặc thiếu phụ phí
**Fix:**

- Check console logs từng bước
- Verify `ratePercentage` sau mỗi bước (base, evening, weekend)
- Dùng calculator tính tay để so sánh

#### Issue 3: "Không hiển thị phụ phí"

**Cause:** Component không render hoặc điều kiện sai
**Fix:**

- Check `bookingType === "HOURLY"`
- Check `hourlyRatePolicies.length > 0`
- Check `hourlyCheckInDate !== null`

---

## 7. Summary - Những gì cần làm

### Checklist Implementation

- [ ] **1. Fetch Policy từ Database**

  - Thêm vào `fetchedData()`
  - Check `bookingType === "HOURLY"`
  - Call `getAllPolicyBaseRates()`
  - Save vào state `hourlyRatePolicies`

- [ ] **2. Implement `calculateHourlyRate()`**

  - Lấy `baseRate` từ policy theo duration
  - Check weekend (Thứ 7, Chủ nhật) → **CỘNG 15%**
  - Tính: `(basePrice × totalPercentage / 100) / duration`

- [ ] **3. Update UI hiển thị phụ phí**

  - Thêm section "Pricing Details" trong Step 4
  - Hiển thị duration
  - Hiển thị evening peak nếu có
  - Hiển thị weekend surcharge nếu có

- [ ] **4. Test đầy đủ 4 test cases**

  - Test Case 1: Ngày thường, giờ thường
  - Test Case 2: Cuối tuần (Thứ 7)
  - Test Case 3: Chủ nhật, giờ sáng
  - Test Case 4: Ngày thường, giờ tối

- [ ] **5. Verify database save**
  - Check `booking.hourlyRate` có đúng không
  - Check `booking.duration` có đúng không
  - Check `booking.totalAmount` = hourlyRate × duration

---

## 8. Lưu ý quan trọng

### 8.1. Không sửa HourlyRatePolicy.ts

Type definition đã đúng, KHÔNG CẦN SỬA:

```tsx
export interface BaseRateItem {
  baseHours: number;
  baseRate: number;
}

export interface HourlyRatePolicy {
  id: number;
  policyName: string;
  weekendSurcharge: number;
  weekendDays: string[];
  baseRates: BaseRateItem[] | Record<string, number>;
}
```

### 8.2. Backend đã hoàn chỉnh

- Model `HourlyRatePolicy` ✓
- Model `Booking` với `hourlyRate` và `duration` ✓
- Controller `/hourly-rate-policies/base-rates` ✓
- Database có đầy đủ data ✓

→ **CHỈ CẦN SỬA FRONTEND**

### 8.3. Công thức tính là KEY

**QUAN TRỌNG NHẤT:**

1. **MỌI khung giờ đều dùng bảng phần trăm cơ bản**

   - Không có phụ phí theo giờ trong ngày
   - Sáng, trưa, chiều, tối, đêm đều như nhau

2. **CHỈ có phụ phí cuối tuần**
   - Thứ 7 và Chủ nhật: CỘNG 15%

Đừng nhầm lẫn:

- ❌ SAI: `ratePercentage = ratePercentage * 1.15` (NHÂN 1.15)
- ✓ ĐÚNG: `ratePercentage = ratePercentage + 15` (CỘNG 15)

Công thức đúng:

```
Tổng % = Base % + Weekend % (nếu là Thứ 7/CN)
Giá/giờ = (Giá phòng/đêm × Tổng %) ÷ 100 ÷ Số giờ
```

**Ví dụ:**

- Ngày thường: Base 25% → Giá = (1,000,000 × 25%) / 2h = 125,000 VND/h
- Cuối tuần: Base 25% + 15% = 40% → Giá = (1,000,000 × 40%) / 2h = 200,000 VND/h

---

## 9. Kết luận

Sau khi làm theo hướng dẫn này, bạn sẽ có:

1. ✅ Hiểu rõ cấu trúc database và logic tính giá
2. ✅ Function `calculateHourlyRate()` hoạt động đúng với policy từ database
3. ✅ Hiển thị đầy đủ thông tin phụ phí cho user
4. ✅ Save đúng `hourlyRate` và `totalAmount` vào backend
5. ✅ Test thành công với các trường hợp khác nhau

**LƯU Ý CUỐI:**

- Đọc kỹ từng phần GIẢI THÍCH để hiểu TẠI SAO
- Follow đúng thứ tự từ Bước 1 → 5
- Test sau mỗi bước để đảm bảo đúng
- Check console logs để debug

Chúc bạn implement thành công! 🎉
