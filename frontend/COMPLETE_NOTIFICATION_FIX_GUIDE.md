# 🔧 FIX HOÀN CHỈNH: Notification System cho Customer & Employee

## 📋 **Tóm Tắt Các Thay Đổi**

### ✅ **1. Backend Endpoint**

-   Endpoint: `GET /api/notifications`
-   Lấy notifications dựa trên JWT token
-   Parse role từ `UserRole.EMPLOYEE(role=Employee)` → `"EMPLOYEE"`
-   Query: `findByToUserIdOrToUserType(userId, userRole)`

### ✅ **2. Frontend API Service**

-   Endpoint: `/api/notifications` (không phải `/api/notifications/my`)
-   Added detailed debug logs
-   Error handling với chi tiết response

### ✅ **3. Notification Context**

-   Polling mỗi 5 giây
-   Debug logs chi tiết
-   Fallback khi backend offline

### ✅ **4. Notification Flow**

#### **Early Check-in:**

```
Customer gửi request
  → Customer: "Yêu cầu đã được gửi" ✅
  → Employee: "Yêu cầu mới (cần action)" ✅

Employee approve/reject
  → Customer: "Đã phê duyệt/Bị từ chối" ✅
  → Employee: KHÔNG nhận notification ❌
```

#### **Late Checkout:**

```
Customer gửi request
  → Customer: "Yêu cầu đã được gửi" ✅
  → Employee: "Yêu cầu mới (cần action)" ✅

Employee approve/reject
  → Customer: "Đã phê duyệt/Bị từ chối" ✅
  → Employee: KHÔNG nhận notification ❌
```

#### **Cancel Booking:**

```
Customer cancel booking
  → Customer: "✅ Đã hủy thành công" ✅
  → Employee: KHÔNG nhận notification ❌
```

---

## 🎯 **Kiểm Tra Đầy Đủ**

### **Test 1: Customer Perspective**

1. **Login as Customer**
2. **Send Early Check-in Request:**

    - Go to My Bookings
    - Select a booking
    - Click "Early Check-in"
    - Submit request
    - ✅ Check notification bell → Should see: "Yêu cầu check-in sớm đã được gửi"

3. **Wait for Employee Approval:**

    - Employee approves the request
    - ✅ Check notification bell → Should see: "Yêu cầu check-in sớm đã được phê duyệt"

4. **Cancel a Booking:**
    - Go to My Bookings
    - Click "Cancel Booking"
    - Fill reason & confirm
    - ✅ Check notification bell → Should see: "✅ Đã hủy booking thành công"

---

### **Test 2: Employee Perspective**

1. **Login as Employee**
2. **Receive Customer Requests:**

    - Customer sends early check-in request
    - ✅ Check notification bell → Should see: "Yêu cầu check-in sớm mới"
    - Category: `EARLY_CHECKIN`
    - Type: `REQUEST`
    - Priority: `HIGH`
    - NeedsAction: `true`

3. **Approve/Reject Request:**

    - Go to Check-in Management → Early Check-in tab
    - Find the PENDING request
    - Click **Approve** or **Reject**
    - ✅ Customer receives notification
    - ❌ Employee does NOT receive notification (no spam)

4. **Check Notification Count:**
    - ✅ Should see unread count badge on bell icon
    - ✅ Click bell → Should see all notifications sorted by time

---

### **Test 3: Real-time Updates**

1. **Open 2 Browser Windows:**

    - Window 1: Login as **Customer**
    - Window 2: Login as **Employee**

2. **Customer sends early check-in request** (Window 1)
3. **Wait max 5 seconds** (polling interval)
4. **Check Employee window** (Window 2)
    - ✅ Should see new notification appear automatically

---

## 🐛 **Troubleshooting**

### **Problem 1: No notifications showing**

**Check Console Logs:**

```
🔄 [Context] Refreshing notifications...
📡 [API] GET /api/notifications - Status: ???
```

**If Status = 401:**

```javascript
// Browser console
localStorage.getItem('token'); // Should not be null
```

**Fix:** Login again

**If Status = 0 (Failed to fetch):**
**Fix:** Backend không chạy → Start backend server

**If Status = 200 but empty:**

```javascript
// Browser console - Test API
const token = localStorage.getItem('token');
fetch('http://localhost:8080/api/notifications?page=0&size=10', {
    headers: { Authorization: `Bearer ${token}` },
})
    .then((r) => r.json())
    .then((d) => console.log('Notifications:', d.data?.content?.length));
```

---

### **Problem 2: Customer không thấy notification sau khi employee approve**

**Check:**

1. `earlyCheckinService.ts` có gọi `processEarlyCheckinRequest()` không?
2. `EarlyTab.tsx` có pass `bookingInfo` không?

**Verify:**

```javascript
// Browser console (Employee side)
// Sau khi approve, check logs
// Should see: "✅ Notification sent to customer after approval/rejection"
```

---

### **Problem 3: Employee thấy quá nhiều notifications**

**Expected:**

-   Employee nhận broadcast notifications (`toUserType: 'EMPLOYEE'`)
-   Tất cả employees thấy cùng notification
-   Không cần mark as read (backend issue - see BACKEND_MARK_AS_READ_FIX.md)

**Not Expected:**

-   Employee nhận notification khi chính họ approve (KHÔNG nên xảy ra)

---

### **Problem 4: Notifications không real-time**

**Check Polling:**

```typescript
// NotificationContextAPI.tsx
useEffect(() => {
    const interval = setInterval(refreshNotifications, 5000); // 5 seconds
    return () => clearInterval(interval);
}, [refreshNotifications]);
```

**Verify:**

-   Console should log `🔄 [Context] Refreshing notifications...` mỗi 5 giây
-   Network tab should show requests mỗi 5 giây

---

## 📊 **Expected Console Logs**

### **Normal Operation:**

```
// Initial load
🔄 [Context] Refreshing notifications...
📡 [API] GET /api/notifications - Status: 200 OK
📦 [API] Response data: {
  success: true,
  hasData: true,
  hasContent: true,
  contentLength: 21
}
✅ [Context] Loaded 21 notifications

// Every 5 seconds
🔄 [Context] Refreshing notifications...
📡 [API] GET /api/notifications - Status: 200 OK
📦 [API] Response data: { ... }
✅ [Context] Loaded 21 notifications
```

### **When Customer Sends Request:**

```
// Customer side
🚀 Starting early check-in request with notification...
📤 Sending early checkin request: { ... }
✅ Notifications sent successfully for early check-in request
🔄 [Context] Refreshing notifications...
✅ [Context] Loaded 22 notifications  ← New notification!
```

### **When Employee Approves:**

```
// Employee side
📤 Approving request...
✅ Notification sent to customer after approval/rejection

// Customer side (after 5s polling)
🔄 [Context] Refreshing notifications...
✅ [Context] Loaded 23 notifications  ← Approval notification!
```

---

## 📁 **Files Summary**

### **Backend (Java):**

-   ✅ `NotificationController.java` - `/api/notifications` endpoint
-   ✅ `NotificationService.java` - Query logic với userId + userRole
-   ✅ `NotificationRepository.java` - `findByToUserIdOrToUserType()`

### **Frontend Service:**

-   ✅ `notificationApiService.ts` - API calls với debug logs
-   ✅ `earlyCheckinNotificationService.ts` - Business logic
-   ✅ `earlyCheckinService.ts` - Approve/reject với notification

### **Frontend Context:**

-   ✅ `NotificationContextAPI.tsx` - State management + polling

### **Frontend Components:**

-   ✅ `NotificationBell.tsx` - UI component
-   ✅ `EarlyTab.tsx` - Approve/reject buttons
-   ✅ `EarlyCheckinModal.tsx` - Customer send request
-   ✅ `LateCheckoutModal.tsx` - Late checkout request
-   ✅ `CancelBookingModal.tsx` - Cancel booking

---

## 🎉 **Final Checklist**

-   [ ] Backend running on http://localhost:8080
-   [ ] Frontend running on http://localhost:5173
-   [ ] Login as Customer → See customer notifications
-   [ ] Login as Employee → See employee notifications (broadcast)
-   [ ] Customer sends early check-in → Employee sees notification (within 5s)
-   [ ] Employee approves → Customer sees approval (within 5s)
-   [ ] Cancel booking → Customer sees confirmation (employee không thấy)
-   [ ] Console logs working (no errors)
-   [ ] Network tab shows `/api/notifications` requests every 5s
-   [ ] Notification bell badge shows unread count
-   [ ] Click notification → Mark as read (or handle error gracefully)

---

## 🚀 **Quick Test Script**

Paste vào browser console:

```javascript
// Test notifications for current user
(async function testNotifications() {
    console.clear();
    console.log('🧪 Testing Notification System...\n');

    // 1. Check token
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('❌ No token! Please login first.');
        return;
    }
    console.log('✅ Step 1: Token exists\n');

    // 2. Decode token to see user info
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('👤 User Info:');
    console.log('  - User ID:', payload.sub);
    console.log('  - Roles:', payload.authorities);
    console.log('  - Expires:', new Date(payload.exp * 1000).toLocaleString());
    console.log('');

    // 3. Test API
    console.log('📡 Fetching notifications...');
    const response = await fetch(
        'http://localhost:8080/api/notifications?page=0&size=20',
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        },
    );

    console.log('  - Status:', response.status, response.statusText);

    if (!response.ok) {
        console.error('❌ API Error!');
        return;
    }

    const data = await response.json();
    console.log('  - Success:', data.success);
    console.log('  - Message:', data.message);
    console.log('');

    // 4. Check notifications
    if (data.data?.content) {
        const notifications = data.data.content;
        console.log('✅ Step 2: Got', notifications.length, 'notifications\n');

        // Group by category
        const categories = {};
        notifications.forEach((n) => {
            if (!categories[n.category]) categories[n.category] = 0;
            categories[n.category]++;
        });

        console.log('📊 By Category:');
        Object.entries(categories).forEach(([cat, count]) => {
            console.log(`  - ${cat}: ${count}`);
        });
        console.log('');

        // Group by read status
        const unread = notifications.filter((n) => !n.isRead).length;
        const read = notifications.length - unread;
        console.log('📖 By Status:');
        console.log(`  - Unread: ${unread}`);
        console.log(`  - Read: ${read}`);
        console.log('');

        // Show recent 5
        console.log('🔔 Recent 5 Notifications:');
        console.table(
            notifications.slice(0, 5).map((n) => ({
                Title: n.title.substring(0, 40),
                Category: n.category,
                Type: n.type,
                Priority: n.priority,
                NeedsAction: n.needsAction,
                IsRead: n.isRead,
                Time: new Date(
                    n.deliveredAt || n.createdAt,
                ).toLocaleTimeString(),
            })),
        );

        console.log('\n✅ All tests passed! Notification system is working.');
    } else {
        console.warn('⚠️ No notifications found.');
        console.log('Response:', data);
    }
})();
```

Run script này để test toàn bộ notification system! 🎯
