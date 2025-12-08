# ❌ 404 ERROR - Backend Endpoint Not Found

## Vấn đề:

```
GET http://localhost:8080/api/notifications?page=0&size=50 404 (Not Found)
GET http://localhost:8080/api/notifications/unread 404 (Not Found)
```

Backend không có endpoint này!

---

## Kiểm tra Backend:

### 1. Backend có đang chạy không?

Test ping:

```bash
curl http://localhost:8080/api/health
# hoặc
curl http://localhost:8080/actuator/health
```

### 2. Endpoint thực tế là gì?

Có thể backend có endpoint khác:

-   `/api/notification` (không có 's')
-   `/api/user/notifications`
-   `/api/v1/notifications`
-   `/notifications` (không có /api)

Test các endpoint:

```bash
# Test 1
curl http://localhost:8080/notifications

# Test 2
curl http://localhost:8080/api/notification

# Test 3
curl http://localhost:8080/api/user/notifications

# Test 4
curl http://localhost:8080/api/v1/notifications
```

### 3. Kiểm tra Backend Controller

Mở file backend `NotificationController.java` và tìm:

```java
@RestController
@RequestMapping("???")  // ← Check cái này
public class NotificationController {

    @GetMapping("???")  // ← và cái này
    public ResponseEntity<?> getNotifications(...) {
        ...
    }
}
```

**Endpoint thực tế = RequestMapping + GetMapping**

Ví dụ:

-   `@RequestMapping("/api/notifications")` + `@GetMapping("")` = `/api/notifications`
-   `@RequestMapping("/api")` + `@GetMapping("/notifications")` = `/api/notifications`
-   `@RequestMapping("/notifications")` + `@GetMapping("")` = `/notifications`

---

## Giải pháp:

### Option 1: Backend chưa có NotificationController

→ Tạo backend controller với endpoint đúng

### Option 2: Backend có endpoint khác

→ Sửa frontend để match endpoint backend

### Option 3: Backend chưa chạy

→ Start backend server

---

## Test Backend nhanh:

```bash
# Check backend có chạy không
curl -I http://localhost:8080

# Nếu có swagger/openapi
curl http://localhost:8080/swagger-ui.html
curl http://localhost:8080/v3/api-docs

# List tất cả endpoints (nếu có actuator)
curl http://localhost:8080/actuator/mappings
```

---

## Cần làm gì tiếp theo?

1. **Share code backend `NotificationController.java`**

    - Hoặc toàn bộ file
    - Hoặc chỉ @RequestMapping và @GetMapping

2. **Hoặc test và cho tôi biết endpoint nào work:**

    ```bash
    curl http://localhost:8080/notifications
    curl http://localhost:8080/api/notification
    ```

3. **Hoặc check backend logs** khi start server:
    - Tìm dòng: `Mapped "{[/api/notifications]}"`
    - Hoặc: `RequestMappingHandlerMapping`
