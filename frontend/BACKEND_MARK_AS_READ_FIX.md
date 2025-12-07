# 🐛 Backend Error: Mark Notification As Read - 500 Error

## 🔴 Error:

```
PUT http://localhost:8080/api/notifications/{id}/read → 500 Internal Server Error
```

## 🎯 Root Cause:

Backend `markAsRead()` method kiểm tra quyền sở hữu notification bằng cách:

```java
if (userId.equals(notification.getToUserId())) {
    // Mark as read
}
```

Nhưng **broadcast notifications** (gửi cho EMPLOYEE/CUSTOMER role) có:

-   `toUserId` = null
-   `toUserType` = "EMPLOYEE" hoặc "CUSTOMER"

→ Backend throw exception vì `userId.equals(null)` fail!

---

## ✅ FIX Backend - `NotificationService.java`:

### Sửa method `markAsRead()`:

```java
public Notification markAsRead(String notificationId, String userId) {
    Optional<Notification> notificationOpt = notificationRepository.findById(notificationId);

    if (notificationOpt.isPresent()) {
        Notification notification = notificationOpt.get();

        // ✅ FIX: Check cả toUserId VÀ toUserType
        boolean hasAccess = false;

        // Case 1: Personal notification (toUserId specified)
        if (userId.equals(notification.getToUserId())) {
            hasAccess = true;
        }

        // Case 2: Broadcast notification (toUserType specified)
        if (notification.getToUserType() != null && notification.getToUserId() == null) {
            // Get user's role from SecurityContext
            String userRole = SecurityContextHolder.getContext()
                .getAuthentication()
                .getAuthorities()
                .stream()
                .findFirst()
                .map(authority -> {
                    String authStr = authority.toString();
                    if (authStr.contains(".EMPLOYEE")) return "EMPLOYEE";
                    if (authStr.contains(".CUSTOMER")) return "CUSTOMER";
                    if (authStr.contains(".ADMIN")) return "ADMIN";
                    return "";
                })
                .orElse("");

            // Check if user's role matches notification's toUserType
            if (notification.getToUserType().toString().contains(userRole)) {
                hasAccess = true;
            }
        }

        // Case 3: Multiple recipients (toUserIds list)
        if (notification.getToUserIds() != null && notification.getToUserIds().contains(userId)) {
            hasAccess = true;
        }

        if (hasAccess) {
            notification.setIsRead(true);
            notification.setReadAt(LocalDateTime.now());
            return notificationRepository.save(notification);
        }
    }

    throw new RuntimeException("Notification not found or access denied");
}
```

---

## 🔄 Alternative Solution (Simpler):

Nếu broadcast notifications không cần track read status per user, đơn giản bỏ qua lỗi:

```java
public Notification markAsRead(String notificationId, String userId) {
    Optional<Notification> notificationOpt = notificationRepository.findById(notificationId);

    if (!notificationOpt.isPresent()) {
        throw new RuntimeException("Notification not found");
    }

    Notification notification = notificationOpt.get();

    // ✅ Bỏ qua broadcast notifications (không track read status)
    if (notification.getToUserId() == null && notification.getToUserType() != null) {
        System.out.println("⚠️ Skipping mark as read for broadcast notification: " + notificationId);
        return notification; // Return unchanged
    }

    // Only mark personal notifications as read
    if (userId.equals(notification.getToUserId())) {
        notification.setIsRead(true);
        notification.setReadAt(LocalDateTime.now());
        return notificationRepository.save(notification);
    }

    if (notification.getToUserIds() != null && notification.getToUserIds().contains(userId)) {
        notification.setIsRead(true);
        notification.setReadAt(LocalDateTime.now());
        return notificationRepository.save(notification);
    }

    throw new RuntimeException("Access denied");
}
```

---

## 📋 Testing After Fix:

1. Login as **EMPLOYEE**
2. Customer tạo early check-in request
3. Employee thấy notification
4. Click vào notification → **Should NOT throw 500 error**
5. Backend logs: `⚠️ Skipping mark as read for broadcast notification`

---

## 🎯 Recommended Solution:

**Use Alternative Solution (Simpler)** vì:

-   Broadcast notifications không cần track read status cho từng user
-   Chỉ cần user nhìn thấy là đủ
-   Giảm complexity trong database

**Personal notifications** vẫn track read status bình thường.

---

## Frontend Already Fixed ✅

Frontend đã được fix để handle error gracefully:

```typescript
const handleNotificationClick = async (id: string) => {
    try {
        await markAsRead(id);
    } catch (error) {
        console.warn('Could not mark notification as read:', error);
    }
};
```

UI sẽ không crash nữa, nhưng backend nên fix để tránh 500 errors!
