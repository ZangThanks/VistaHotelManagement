# ✅ Update: Approve/Reject Early Check-in với Notification

## 🔧 Thay Đổi

### 1️⃣ **Service Layer**

File: `earlyCheckinService.ts`

**Trước:**

```typescript
export const approveEarlyCheckin = async (
    requestId: string,
    status: 'APPROVED' | 'REJECTED',
    staffName: string,
) => {
    // Chỉ gọi backend API
    const res = await api.put(
        `${ENDPOINT}/approve/${requestId}?status=${status}&staff=${staffName}`,
    );
    return res.data;
};
```

**Sau:**

```typescript
export const approveEarlyCheckin = async (
    requestId: string,
    status: 'APPROVED' | 'REJECTED',
    staffName: string,
    bookingInfo?: {
        customerId: string;
        customerName: string;
        roomNumber: string;
        requestedTime?: string;
    },
) => {
    // 1. Call backend API
    const res = await api.put(
        `${ENDPOINT}/approve/${requestId}?status=${status}&staff=${staffName}`,
    );

    // 2. Send notification to customer (CHỈ customer)
    if (bookingInfo) {
        const approvalData: CheckinApproval = {
            requestId,
            customerId: bookingInfo.customerId,
            customerName: bookingInfo.customerName,
            roomNumber: bookingInfo.roomNumber,
            approvedBy: staffName,
            approvedTime: bookingInfo.requestedTime,
            isApproved: status === 'APPROVED',
            reason: status === 'REJECTED' ? 'Yêu cầu bị từ chối' : undefined,
        };

        await earlyCheckinNotificationService.processEarlyCheckinRequest(
            approvalData,
        );
    }

    return res.data;
};
```

**✅ Thay đổi:**

-   Thêm parameter `bookingInfo` (optional)
-   Gọi `processEarlyCheckinRequest()` để gửi notification cho customer
-   Không gửi notification cho employee

---

### 2️⃣ **Component Layer**

File: `EarlyTab.tsx`

**Trước:**

```typescript
const handleApprove = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    await approveEarlyCheckin(id, status, 'Staff');
    // Update UI
};
```

**Sau:**

```typescript
const handleApprove = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    // 1. Tìm request để lấy booking info
    const request = requests.find((req) => req.requestID === id);

    // 2. Prepare booking info
    const bookingInfo = {
        customerId: request.booking?.customer?.id || '',
        customerName: request.booking?.customer?.fullName || 'Khách hàng',
        roomNumber:
            request.booking?.bookingDetails?.[0]?.room?.roomNumber || 'N/A',
        requestedTime: request.requestTime,
    };

    // 3. Approve với booking info
    await approveEarlyCheckin(id, status, 'Staff', bookingInfo);

    // 4. Update UI
};
```

**✅ Thay đổi:**

-   Lấy thông tin booking từ request
-   Truyền `bookingInfo` vào `approveEarlyCheckin()`

---

## 🎯 Flow Hoàn Chỉnh

### **Khi Employee Click Approve/Reject:**

```
Employee clicks Approve/Reject button
    ↓
EarlyTab.handleApprove()
    ↓
1. Find request → Extract booking info
    ↓
2. Call approveEarlyCheckin(id, status, 'Staff', bookingInfo)
    ↓
3. Backend API: PUT /early-checkin/approve/{id}
    ↓
4. Send notification: processEarlyCheckinRequest()
    ↓
5. Customer receives notification:
       - APPROVED: "✅ Yêu cầu check-in sớm đã được phê duyệt"
       - REJECTED: "❌ Yêu cầu check-in sớm bị từ chối"
    ↓
6. ❌ Employee does NOT receive notification
    ↓
7. Update UI state
```

---

## 📋 Notification Content

### **APPROVED:**

```
Title: "Yêu cầu check-in sớm đã được phê duyệt"
Message: "Yêu cầu check-in sớm cho phòng {roomNumber} đã được phê duyệt bởi {staff}.
          Bạn có thể check-in từ {approvedTime}. Chúc bạn có kỳ nghỉ vui vẻ!"

To: Customer (toUserId: customerId)
Priority: HIGH
Type: INFO
```

### **REJECTED:**

```
Title: "Yêu cầu check-in sớm bị từ chối"
Message: "Rất tiếc, yêu cầu check-in sớm cho phòng {roomNumber} đã bị từ chối.
          Lý do: {reason}. Vui lòng liên hệ lễ tân để biết thêm thông tin."

To: Customer (toUserId: customerId)
Priority: HIGH
Type: ALERT
```

---

## 🧪 Testing

### **Test Approve:**

1. Login as **EMPLOYEE**
2. Go to Check-in Management → Early Check-in tab
3. Find a PENDING request
4. Click **Approve** button ✅
5. Check console: Should see "✅ Notification sent to customer after approval/rejection"
6. Login as **CUSTOMER** (the one who requested)
7. Check notification bell
8. Should see: "✅ Yêu cầu check-in sớm đã được phê duyệt"

### **Test Reject:**

1. Login as **EMPLOYEE**
2. Find a PENDING request
3. Click **Reject** button ❌
4. Check console: Should see notification sent
5. Login as **CUSTOMER**
6. Check notification bell
7. Should see: "❌ Yêu cầu check-in sớm bị từ chối"

### **Verify Employee NOT Notified:**

1. Login as **EMPLOYEE 1** → Approve a request
2. Login as **EMPLOYEE 2** → Check notification bell
3. ❌ Should NOT see any notification about the approval

---

## 🎨 UI Buttons

File: `EarlyTab.tsx`

### **Approve Button:**

```tsx
<button
    onClick={() => handleApprove(req.requestID, 'APPROVED')}
    className="bg-green-500 hover:bg-green-600 text-white"
>
    <FaCheck /> Approve
</button>
```

### **Reject Button:**

```tsx
<button
    onClick={() => handleApprove(req.requestID, 'REJECTED')}
    className="bg-red-500 hover:bg-red-600 text-white"
>
    <FaTimes /> Reject
</button>
```

---

## ✅ Summary

| Action               | Backend API       | Notification Sent To | Employee Notified? |
| -------------------- | ----------------- | -------------------- | ------------------ |
| **Employee Approve** | PUT /approve/{id} | ✅ Customer          | ❌ No              |
| **Employee Reject**  | PUT /approve/{id} | ✅ Customer          | ❌ No              |

**Lý do:**

-   Employee đã biết kết quả (vì chính họ approve/reject)
-   Chỉ customer cần biết kết quả
-   Tránh notification spam cho employee

---

## 📝 Files Changed

1. ✅ `src/services/earlyCheckinService.ts`

    - Added `bookingInfo` parameter
    - Added notification logic

2. ✅ `src/components/checkin/EarlyTab.tsx`

    - Extract booking info from request
    - Pass to `approveEarlyCheckin()`

3. ✅ `src/services/earlyCheckinNotificationService.ts`
    - Already correct (only sends to customer)

---

## 🎉 Done!

Khi employee click **Approve/Reject**, hệ thống sẽ:

1. ✅ Update database
2. ✅ Gửi notification CHỈ cho customer
3. ❌ KHÔNG gửi cho employee
4. ✅ Update UI
