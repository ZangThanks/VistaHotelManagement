# 🐛 FIX: Không Lấy Được Thông Báo

## ❌ Vấn Đề

Thông báo không hiển thị cho cả khách hàng và nhân viên.

## 🔍 Root Cause

**API Endpoint sai!**

File: `notificationApiService.ts`

**Trước (SAI):**

```typescript
async getMyNotifications(page = 0, size = 20) {
    const response = await fetch(
        `${API_BASE_URL}/api/notifications?page=${page}&size=${size}`,
        //                    ❌ Thiếu /my
    );
}
```

**Backend endpoint đúng:** `/api/notifications/my`

Từ backend fix trước đó:

```java
@GetMapping("/my")
public ResponseEntity<Page<Notification>> getNotificationsForUser(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int size
) {
    // Extract userId and userRole from JWT
    // Query: findByToUserIdOrToUserType(userId, userRole)
}
```

---

## ✅ Fix

File: `src/services/notificationApiService.ts`

```typescript
async getMyNotifications(page = 0, size = 20) {
    const response = await fetch(
        `${API_BASE_URL}/api/notifications/my?page=${page}&size=${size}`,
        //                    ✅ Thêm /my
        {
            method: 'GET',
            headers: this.getAuthHeaders(),
        },
    );
}
```

---

## 🔧 Debug Logs Added

File: `NotificationContextAPI.tsx`

Thêm debug logs để dễ troubleshoot:

```typescript
const refreshNotifications = useCallback(async () => {
    try {
        console.log('🔄 [Context] Refreshing notifications...');

        const response = await notificationApiService.getMyNotifications(0, 50);

        console.log('📥 [Context] API Response:', {
            success: response.success,
            hasData: !!response.data,
            hasContent: !!response.data?.content,
            contentLength: response.data?.content?.length,
            fullResponse: response,
        });

        if (response.success && response.data?.content) {
            console.log(
                '✅ [Context] Loaded',
                frontendNotifications.length,
                'notifications',
            );
            setNotifications(frontendNotifications);
        }
    } catch (error) {
        console.error('[Context] Error:', error);
    }
}, []);
```

---

## 🧪 Testing

### 1. **Kiểm tra Console:**

Mở browser console, should see:

```
🔄 [Context] Refreshing notifications...
📡 [API] GET /api/notifications/my - Status: 200 OK
📥 [Context] API Response: {
    success: true,
    hasData: true,
    hasContent: true,
    contentLength: 21
}
✅ [Context] Loaded 21 notifications
```

### 2. **Kiểm tra Notification Bell:**

-   Login as **CUSTOMER** → Should see customer notifications
-   Login as **EMPLOYEE** → Should see employee notifications (21 notifications)

### 3. **Test với curl:**

```bash
# Get token from localStorage
TOKEN="your_jwt_token"

# Test API
curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:8080/api/notifications/my?page=0&size=10
```

Expected response:

```json
{
  "success": true,
  "message": "Notifications retrieved successfully",
  "data": {
    "content": [
      {
        "id": "notif_123",
        "title": "Yêu cầu check-in sớm mới",
        "message": "Khách hàng ... yêu cầu check-in sớm...",
        "toUserType": "EMPLOYEE",
        "isRead": false,
        ...
      }
    ],
    "totalElements": 21,
    "totalPages": 3
  }
}
```

---

## 📊 Flow Diagram

```
Frontend Request:
    ↓
GET /api/notifications/my?page=0&size=50
    ↓
Backend NotificationController:
    ↓
Extract userId & userRole from JWT
    ↓
Repository Query:
findByToUserIdOrToUserType(userId, "EMPLOYEE")
    ↓
WHERE toUserId = userId OR toUserType = "EMPLOYEE"
    ↓
Return Page<Notification>
    ↓
Frontend receives & displays
```

---

## ⚠️ Common Issues

### **Issue 1: 401 Unauthorized**

```
❌ Error: Failed to fetch notifications
Status: 401 Unauthorized
```

**Fix:** Check token in localStorage

```javascript
localStorage.getItem('token'); // Should not be null
```

### **Issue 2: Backend returns empty**

```json
{
    "success": true,
    "data": {
        "content": [],
        "totalElements": 0
    }
}
```

**Check:**

-   Backend có notification trong database không?
-   `toUserType` có match với user's role không?
-   Query có chạy đúng không?

### **Issue 3: CORS Error**

```
Access to fetch at 'http://localhost:8080/api/notifications/my'
has been blocked by CORS policy
```

**Fix:** Backend enable CORS for `/api/notifications/**`

---

## ✅ Files Changed

1. ✅ `src/services/notificationApiService.ts`

    - Changed endpoint from `/api/notifications` to `/api/notifications/my`

2. ✅ `src/context/NotificationContextAPI.tsx`
    - Added detailed debug logs

---

## 🎉 Result

Sau khi fix:

-   ✅ Customer thấy notifications của họ
-   ✅ Employee thấy 21 notifications (broadcast + personal)
-   ✅ Polling works (refresh mỗi 5s)
-   ✅ Real-time updates work

---

## 📝 Related Files

-   Backend: `NotificationController.java` - `/my` endpoint
-   Backend: `NotificationRepository.java` - Query method
-   Frontend: `notificationApiService.ts` - API calls
-   Frontend: `NotificationContextAPI.tsx` - State management
-   Frontend: `NotificationBell.tsx` - UI component
