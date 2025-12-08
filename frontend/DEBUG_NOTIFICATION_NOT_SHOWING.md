# 🐛 Debug Guide: Thông Báo Không Hiển Thị

## 🔍 Kiểm Tra Nhanh

### 1. **Mở Browser Console (F12)**

Sau khi reload trang, bạn sẽ thấy logs:

#### ✅ **Nếu thành công:**

```
🔄 [Context] Refreshing notifications...
📡 [API] GET /api/notifications - Status: 200 OK
📦 [API] Response data: {
  success: true,
  message: "Notifications retrieved successfully",
  hasData: true,
  dataType: "object",
  dataKeys: ["content", "totalElements", "totalPages", ...],
  hasContent: true,
  contentLength: 21
}
✅ [Context] Loaded 21 notifications
```

#### ❌ **Nếu lỗi:**

**Lỗi 1: Backend chưa chạy**

```
❌ [API] Error response: {
  status: 0,
  statusText: "",
  body: "Failed to fetch"
}
[Context] Error loading notifications from API: TypeError: Failed to fetch
```

**Fix:** Chạy backend server

---

**Lỗi 2: 401 Unauthorized**

```
📡 [API] GET /api/notifications - Status: 401 Unauthorized
❌ [API] Error response: {
  status: 401,
  statusText: "Unauthorized",
  body: "..."
}
```

**Fix:**

-   Login lại
-   Check token: `localStorage.getItem('token')`

---

**Lỗi 3: Backend trả empty**

```
📦 [API] Response data: {
  success: true,
  hasData: true,
  hasContent: true,
  contentLength: 0  ← Empty!
}
```

**Check:**

-   Database có notification không?
-   User role có đúng không?
-   Backend query có chạy không?

---

**Lỗi 4: Response structure sai**

```
📦 [API] Response data: {
  success: true,
  hasData: true,
  dataKeys: ["notifications"],  ← Sai! Phải là "content"
  hasContent: false
}
```

**Fix:** Backend phải trả về Spring Data `Page<Notification>`

---

### 2. **Kiểm Tra Network Tab**

1. Mở **DevTools** → **Network** tab
2. Filter: `notifications`
3. Reload trang
4. Click vào request `notifications?page=0&size=50`

#### ✅ **Response đúng:**

```json
{
    "success": true,
    "message": "Notifications retrieved successfully",
    "data": {
        "content": [
            {
                "id": "notif_123",
                "title": "Yêu cầu check-in sớm mới",
                "message": "Khách hàng ... yêu cầu ...",
                "type": "REQUEST",
                "category": "EARLY_CHECKIN",
                "toUserType": "EMPLOYEE",
                "isRead": false,
                "priority": "HIGH",
                "needsAction": true,
                "deliveredAt": "2025-12-07T10:30:00",
                "createdAt": "2025-12-07T10:30:00"
            }
        ],
        "totalElements": 21,
        "totalPages": 3,
        "size": 50,
        "number": 0
    }
}
```

---

### 3. **Test Backend Trực Tiếp**

#### **Method 1: Browser Console**

```javascript
// Get token
const token = localStorage.getItem('token');

// Test API
fetch('http://localhost:8080/api/notifications?page=0&size=10', {
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    },
})
    .then((r) => r.json())
    .then((data) => {
        console.log('Success:', data.success);
        console.log('Content length:', data.data?.content?.length);
        console.table(data.data?.content);
    });
```

#### **Method 2: curl**

```bash
# Get token from browser localStorage
TOKEN="your_jwt_token_here"

# Test API
curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:8080/api/notifications?page=0&size=10 \
     | jq '.'
```

---

## 🔧 Common Fixes

### **Fix 1: Clear Cache & Reload**

```javascript
// Browser console
localStorage.clear();
location.reload();
```

Then login again.

---

### **Fix 2: Check Token**

```javascript
// Browser console
const token = localStorage.getItem('token');
console.log('Has token:', !!token);
console.log('Token length:', token?.length);

// Decode JWT (base64)
if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('User:', payload.sub);
    console.log('Roles:', payload.authorities);
    console.log('Expired:', new Date(payload.exp * 1000) < new Date());
}
```

---

### **Fix 3: Force Refresh Notifications**

```javascript
// Browser console
// Call refresh manually
window.dispatchEvent(new Event('refreshNotifications'));

// Or if you have access to the context
const { refreshNotifications } = useNotificationContext();
await refreshNotifications();
```

---

### **Fix 4: Check Backend Logs**

Backend should log:

```
🔍 Raw authority: UserRole.EMPLOYEE(role=Employee)
NotificationService: getNotificationsForUser(userId=user_123, userRole=EMPLOYEE)
Query: findByToUserIdOrToUserType(user_123, EMPLOYEE)
Found 21 notifications
```

If not logging, backend query có vấn đề.

---

## 📊 Debug Checklist

-   [ ] Backend đang chạy (http://localhost:8080)
-   [ ] Frontend đang chạy (http://localhost:5173)
-   [ ] User đã login (có token)
-   [ ] Token chưa expire
-   [ ] Console có log "🔄 Refreshing notifications"
-   [ ] Network tab có request đến `/api/notifications`
-   [ ] Response status = 200 OK
-   [ ] Response có `data.content` array
-   [ ] Content array không empty
-   [ ] NotificationBell component render

---

## 🎯 Expected Behavior

### **Customer:**

-   Login → See customer notifications
-   Early checkin request sent → See confirmation
-   Request approved → See approval notification

### **Employee:**

-   Login → See 21 notifications (example)
-   Customer sends early checkin → See new notification
-   Approve request → Customer sees result (employee doesn't get notified back)

---

## 📝 Files to Check

1. **Backend:**

    - `NotificationController.java` - Endpoint `/notifications`
    - `NotificationService.java` - Query logic
    - `NotificationRepository.java` - Database query

2. **Frontend:**
    - `notificationApiService.ts` - API calls
    - `NotificationContextAPI.tsx` - State management
    - `NotificationBell.tsx` - UI component

---

## 🚀 Quick Test Script

```javascript
// Browser console - Complete test
(async function testNotifications() {
    console.clear();

    // 1. Check token
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('❌ No token! Please login first.');
        return;
    }
    console.log('✅ Token exists');

    // 2. Test API
    try {
        const response = await fetch(
            'http://localhost:8080/api/notifications?page=0&size=10',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            },
        );

        console.log('📡 Status:', response.status, response.statusText);

        const data = await response.json();
        console.log('📦 Response:', data);

        if (data.success && data.data?.content) {
            console.log(
                '✅ SUCCESS! Got',
                data.data.content.length,
                'notifications',
            );
            console.table(
                data.data.content.map((n) => ({
                    title: n.title,
                    type: n.type,
                    category: n.category,
                    isRead: n.isRead,
                })),
            );
        } else {
            console.error('❌ No notifications in response');
        }
    } catch (error) {
        console.error('❌ Error:', error);
    }
})();
```

Run this in browser console để test toàn bộ! 🎉
