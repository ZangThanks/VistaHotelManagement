# 🧪 TEST NOTIFICATION SYSTEM

## Các bước test:

### 1. Kiểm tra Token

Mở browser console (F12) và chạy:

```javascript
localStorage.getItem('token');
```

-   Nếu `null` → Bạn chưa login, hãy login lại
-   Nếu có token → OK, tiếp tục

### 2. Test API trực tiếp

```javascript
const token = localStorage.getItem('token');
fetch('http://localhost:8080/api/notifications?page=0&size=10', {
    headers: { Authorization: `Bearer ${token}` },
})
    .then((r) => r.json())
    .then((d) => console.log('API Response:', d));
```

Kết quả mong đợi:

```json
{
    "success": true,
    "message": "...",
    "data": {
        "content": [
            /* array of notifications */
        ],
        "totalElements": 21,
        "totalPages": 3
    }
}
```

### 3. Kiểm tra logs tự động

Sau khi reload trang, trong console bạn sẽ thấy:

```
🔄 [Context] Refreshing notifications...
📡 [API] GET /api/notifications - Status: 200 OK
📦 [API] Response data: { success: true, hasData: true, hasContent: true, contentLength: 21 }
✅ [Context] Loaded 21 notifications
```

### 4. Kiểm tra UI

-   Nhìn vào notification bell icon (góc phải header)
-   Có badge hiển thị số thông báo chưa đọc không?
-   Click vào bell icon
-   Có danh sách thông báo hiện ra không?

---

## Nếu không thấy thông báo:

### Case 1: Console shows "No token"

→ **Fix:** Login lại

### Case 2: Console shows "Status: 401"

→ **Fix:** Token hết hạn, login lại

### Case 3: Console shows "Status: 0" hoặc "Failed to fetch"

→ **Fix:** Backend không chạy, start backend server

### Case 4: Console shows "Status: 200" nhưng "contentLength: 0"

→ **Nghĩa là:** Bạn chưa có thông báo nào
→ **Test:** Thử gửi early check-in request để tạo thông báo mới

---

## Test tạo thông báo mới:

### Customer Test:

1. Login as customer
2. Go to "My Bookings"
3. Click "Early Check-in" on a booking
4. Submit request
5. Wait 5 seconds
6. Check notification bell → Should see new notification

### Employee Test:

1. Login as employee
2. Wait for customer to send early check-in
3. After 5 seconds → Check notification bell
4. Should see "Yêu cầu check-in sớm mới" notification
