import { notificationApiService } from './notificationApiService';

// ============================================
// EARLY CHECK-IN INTERFACES
// ============================================

// Interface cho early check-in request
export interface EarlyCheckinRequest {
    customerId: string;
    customerName: string;
    roomNumber: string;
    bookingId: string;
    requestedTime: string;
    standardCheckInTime: string;
    reason?: string;
    userRole: 'CUSTOMER' | 'EMPLOYEE' | 'ADMIN';
}

// Interface cho approval/rejection
export interface CheckinApproval {
    requestId: string;
    customerId: string;
    customerName: string;
    roomNumber: string;
    approvedBy: string;
    approvedTime?: string;
    isApproved: boolean;
    reason?: string;
}

// Interface cho pending request
export interface PendingEarlyCheckinRequest {
    notificationId: string;
    customerId: string;
    customerName: string;
    roomNumber: string;
    requestedTime: string;
    standardCheckInTime: string;
    reason?: string;
    requestTime: string;
    title: string;
    message: string;
}

// ============================================
// LATE CHECKOUT INTERFACES
// ============================================

export interface LateCheckoutRequest {
    customerId: string;
    customerName: string;
    roomNumber: string;
    bookingId: string;
    requestedTime: string;
    standardCheckoutTime: string;
    reason?: string;
    userRole: 'CUSTOMER' | 'EMPLOYEE' | 'ADMIN';
}

export interface CheckoutApproval {
    requestId: string;
    customerId: string;
    customerName: string;
    roomNumber: string;
    approvedBy: string;
    approvedTime?: string;
    isApproved: boolean;
    reason?: string;
}

// ============================================
// CANCEL BOOKING INTERFACES
// ============================================

export interface CancelBookingRequest {
    customerId: string;
    customerName: string;
    bookingId: string;
    roomNumber: string;
    checkInDate: string;
    checkOutDate: string;
    totalAmount: number;
    reason?: string;
    userRole: 'CUSTOMER' | 'EMPLOYEE' | 'ADMIN';
}

class EarlyCheckinNotificationService {
    /**
     * Khách hàng gửi yêu cầu check-in sớm
     * - Tạo thông báo xác nhận cho khách hàng
     * - Tạo thông báo yêu cầu cho nhân viên
     */
    async sendEarlyCheckinRequest(request: EarlyCheckinRequest): Promise<void> {
        console.log('Sending early checkin request:', request);
        try {
            // 1. Thông báo xác nhận cho khách hàng
            console.log('Creating customer notification...');
            const customerResponse =
                await notificationApiService.createNotification({
                    type: 'INFO',
                    category: 'EARLY_CHECKIN',
                    title: 'Yêu cầu check-in sớm đã được gửi',
                    message: `Bạn đã gửi yêu cầu check-in sớm cho phòng ${request.roomNumber} vào lúc ${request.requestedTime}. Chúng tôi sẽ xử lý và phản hồi sớm nhất có thể.`,
                    toUserId: request.customerId,
                    toUserType: 'CUSTOMER',
                    priority: 'NORMAL',
                    needsAction: false,
                    status: 'SENT',
                    isRealtime: true,
                    isRead: false,
                    dataJson: JSON.stringify({
                        requestType: 'EARLY_CHECKIN_CUSTOMER_CONFIRMATION',
                        bookingId: request.bookingId,
                        roomNumber: request.roomNumber,
                        requestedTime: request.requestedTime,
                        standardCheckInTime: request.standardCheckInTime,
                        reason: request.reason,
                    }),
                });
            console.log('Customer notification created:', customerResponse);

            // 2. Thông báo yêu cầu cho tất cả nhân viên (role EMPLOYEE)
            console.log('👥 Creating employee notification...');

            // IMPORTANT: Backend cần toUserId cụ thể, không chỉ toUserType
            // Tạm thời gửi broadcast notification (toUserType) và hi vọng backend xử lý
            // Hoặc cần API để lấy danh sách employee IDs

            const employeeResponse =
                await notificationApiService.createNotification({
                    type: 'REQUEST',
                    category: 'EARLY_CHECKIN',
                    title: 'Yêu cầu check-in sớm mới',
                    message: `Khách hàng ${
                        request.customerName
                    } yêu cầu check-in sớm cho phòng ${
                        request.roomNumber
                    }. Thời gian yêu cầu: ${
                        request.requestedTime
                    } (Tiêu chuẩn: ${request.standardCheckInTime}). Lý do: ${
                        request.reason || 'Không có'
                    }`,
                    // Gửi cho tất cả nhân viên - backend PHẢI hỗ trợ toUserType
                    toUserType: 'EMPLOYEE',
                    // Nếu backend chưa hỗ trợ toUserType, cần thêm toUserId hoặc toUserIds
                    // toUserIds: ['employee1', 'employee2', ...] // Lấy từ API
                    priority: 'HIGH',
                    needsAction: true,
                    status: 'PENDING',
                    isRealtime: true,
                    isRead: false,
                    dataJson: JSON.stringify({
                        requestType: 'EARLY_CHECKIN_EMPLOYEE_ACTION_REQUIRED',
                        customerId: request.customerId,
                        customerName: request.customerName,
                        bookingId: request.bookingId,
                        roomNumber: request.roomNumber,
                        requestedTime: request.requestedTime,
                        standardCheckInTime: request.standardCheckInTime,
                        reason: request.reason,
                        requestTime: new Date().toISOString(),
                    }),
                });
            console.log('Employee notification response:', employeeResponse);

            // Check if notification was created successfully
            if (!employeeResponse.success) {
                console.error(
                    'Failed to create employee notification:',
                    employeeResponse.message,
                );
            }

            console.log(
                '🎉 Early checkin request notifications sent successfully',
            );
        } catch (error) {
            console.error(
                'Error sending early checkin request notifications:',
                error,
            );
            throw new Error(
                'Không thể gửi yêu cầu check-in sớm. Vui lòng thử lại.',
            );
        }
    }

    /**
     * Nhân viên phê duyệt/từ chối yêu cầu check-in sớm
     * - Đánh dấu thông báo nhân viên là đã đọc
     * - Gửi thông báo kết quả cho khách hàng
     */
    async processEarlyCheckinRequest(approval: CheckinApproval): Promise<void> {
        try {
            // 1. Đánh dấu các thông báo liên quan cho nhân viên là đã đọc
            await this.markRelatedNotificationsAsRead(
                approval.customerId,
                approval.roomNumber,
                'EARLY_CHECKIN_EMPLOYEE_ACTION_REQUIRED',
            );

            // 2. Gửi thông báo kết quả cho khách hàng
            if (approval.isApproved) {
                // Phê duyệt
                await notificationApiService.createNotification({
                    type: 'INFO',
                    category: 'EARLY_CHECKIN',
                    title: 'Yêu cầu check-in sớm đã được phê duyệt',
                    message: `Yêu cầu check-in sớm cho phòng ${approval.roomNumber} đã được phê duyệt bởi ${approval.approvedBy}. Bạn có thể check-in từ ${approval.approvedTime}. Chúc bạn có kỳ nghỉ vui vẻ!`,
                    toUserId: approval.customerId,
                    toUserType: 'CUSTOMER',
                    priority: 'HIGH',
                    needsAction: false,
                    status: 'APPROVED',
                    isRealtime: true,
                    isRead: false,
                    dataJson: JSON.stringify({
                        requestType: 'EARLY_CHECKIN_APPROVED',
                        roomNumber: approval.roomNumber,
                        approvedBy: approval.approvedBy,
                        approvedTime: approval.approvedTime,
                        originalRequestId: approval.requestId,
                    }),
                });
            } else {
                // Từ chối
                await notificationApiService.createNotification({
                    type: 'ALERT',
                    category: 'EARLY_CHECKIN',
                    title: 'Yêu cầu check-in sớm bị từ chối',
                    message: `Rất tiếc, yêu cầu check-in sớm cho phòng ${approval.roomNumber} đã bị từ chối. Lý do: ${approval.reason}. Vui lòng liên hệ lễ tân để biết thêm thông tin.`,
                    toUserId: approval.customerId,
                    toUserType: 'CUSTOMER',
                    priority: 'HIGH',
                    needsAction: false,
                    status: 'REJECTED',
                    isRealtime: true,
                    isRead: false,
                    dataJson: JSON.stringify({
                        requestType: 'EARLY_CHECKIN_REJECTED',
                        roomNumber: approval.roomNumber,
                        rejectedBy: approval.approvedBy,
                        reason: approval.reason,
                        originalRequestId: approval.requestId,
                    }),
                });
            }

            console.log(
                `Early checkin request ${
                    approval.isApproved ? 'approved' : 'rejected'
                } successfully`,
            );
        } catch (error) {
            console.error('Error processing early checkin request:', error);
            throw new Error('Không thể xử lý yêu cầu. Vui lòng thử lại.');
        }
    }

    /**
     * Đánh dấu các thông báo liên quan là đã đọc
     * (Sử dụng khi nhân viên đã xử lý yêu cầu)
     */
    private async markRelatedNotificationsAsRead(
        customerId: string,
        roomNumber: string,
        requestType: string,
    ): Promise<void> {
        try {
            // Lấy danh sách thông báo chưa đọc của nhân viên liên quan đến yêu cầu này
            const notifications =
                await notificationApiService.getUnreadNotifications();

            if (notifications.success && notifications.data) {
                const relatedNotifications = notifications.data.filter(
                    (notification) => {
                        if (!notification.dataJson) return false;

                        try {
                            const data = JSON.parse(notification.dataJson);
                            return (
                                data.customerId === customerId &&
                                data.roomNumber === roomNumber &&
                                data.requestType === requestType
                            );
                        } catch {
                            return false;
                        }
                    },
                );

                // Đánh dấu tất cả thông báo liên quan là đã đọc
                for (const notification of relatedNotifications) {
                    await notificationApiService.markAsRead(notification.id);
                }
            }
        } catch (error) {
            console.error(
                'Error marking related notifications as read:',
                error,
            );
            // Không throw error để không block việc gửi thông báo chính
        }
    }

    /**
     * Thông báo khi khách hàng check-in thành công (tự động)
     */
    async notifySuccessfulCheckin(
        customerId: string,
        customerName: string,
        roomNumber: string,
        actualCheckinTime: string,
    ): Promise<void> {
        try {
            // Thông báo cho khách hàng
            await notificationApiService.createNotification({
                type: 'INFO',
                category: 'OTHER',
                title: 'Check-in thành công',
                message: `Chào mừng bạn đến với Vista Hotel! Bạn đã check-in thành công vào phòng ${roomNumber} lúc ${actualCheckinTime}. Chúc bạn có kỳ nghỉ tuyệt vời!`,
                toUserId: customerId,
                toUserType: 'CUSTOMER',
                priority: 'NORMAL',
                needsAction: false,
                status: 'SENT',
                isRealtime: true,
                isRead: false,
                dataJson: JSON.stringify({
                    eventType: 'SUCCESSFUL_CHECKIN',
                    roomNumber,
                    actualCheckinTime,
                    customerId,
                }),
            });

            // Thông báo cho nhân viên (thông tin)
            await notificationApiService.createNotification({
                type: 'INFO',
                category: 'OTHER',
                title: 'Khách hàng đã check-in',
                message: `Khách hàng ${customerName} đã check-in thành công vào phòng ${roomNumber} lúc ${actualCheckinTime}.`,
                toUserType: 'EMPLOYEE',
                priority: 'LOW',
                needsAction: false,
                status: 'SENT',
                isRealtime: true,
                isRead: false,
                dataJson: JSON.stringify({
                    eventType: 'STAFF_NOTIFICATION_CHECKIN_COMPLETED',
                    customerId,
                    customerName,
                    roomNumber,
                    actualCheckinTime,
                }),
            });
        } catch (error) {
            console.error(
                'Error sending successful checkin notifications:',
                error,
            );
            // Không throw error vì đây là thông báo phụ
        }
    }

    /**
     * Lấy danh sách yêu cầu check-in sớm đang pending (cho nhân viên)
     */
    async getPendingEarlyCheckinRequests(): Promise<
        PendingEarlyCheckinRequest[]
    > {
        try {
            const notifications =
                await notificationApiService.getUnreadNotifications();

            if (!notifications.success || !notifications.data) {
                return [];
            }

            return notifications.data
                .filter((notification) => {
                    return (
                        notification.category === 'EARLY_CHECKIN' &&
                        notification.status === 'PENDING' &&
                        notification.needsAction === true
                    );
                })
                .map((notification) => {
                    try {
                        const data = notification.dataJson
                            ? JSON.parse(notification.dataJson)
                            : {};
                        return {
                            notificationId: notification.id,
                            customerId: data.customerId,
                            customerName: data.customerName,
                            roomNumber: data.roomNumber,
                            requestedTime: data.requestedTime,
                            standardCheckInTime: data.standardCheckInTime,
                            reason: data.reason,
                            requestTime: data.requestTime,
                            title: notification.title,
                            message: notification.message,
                        };
                    } catch {
                        return null;
                    }
                })
                .filter((item) => item !== null);
        } catch (error) {
            console.error(
                'Error getting pending early checkin requests:',
                error,
            );
            return [];
        }
    }

    // ============================================
    // LATE CHECKOUT METHODS
    // ============================================

    /**
     * Khách hàng gửi yêu cầu checkout muộn
     * - Tạo thông báo xác nhận cho khách hàng
     * - Tạo thông báo yêu cầu cho nhân viên
     */
    async sendLateCheckoutRequest(request: LateCheckoutRequest): Promise<void> {
        console.log('📤 Sending late checkout request:', request);
        try {
            // 1. Thông báo xác nhận cho khách hàng
            await notificationApiService.createNotification({
                type: 'INFO',
                category: 'LATE_CHECKOUT',
                title: 'Yêu cầu checkout muộn đã được gửi',
                message: `Bạn đã gửi yêu cầu checkout muộn cho phòng ${request.roomNumber} vào lúc ${request.requestedTime}. Chúng tôi sẽ xử lý và phản hồi sớm nhất có thể.`,
                toUserId: request.customerId,
                toUserType: 'CUSTOMER',
                priority: 'NORMAL',
                needsAction: false,
                status: 'SENT',
                isRealtime: true,
                isRead: false,
                dataJson: JSON.stringify({
                    requestType: 'LATE_CHECKOUT_CUSTOMER_CONFIRMATION',
                    bookingId: request.bookingId,
                    roomNumber: request.roomNumber,
                    requestedTime: request.requestedTime,
                    standardCheckoutTime: request.standardCheckoutTime,
                    reason: request.reason,
                }),
            });

            // 2. Thông báo yêu cầu cho nhân viên
            await notificationApiService.createNotification({
                type: 'REQUEST',
                category: 'LATE_CHECKOUT',
                title: 'Yêu cầu checkout muộn mới',
                message: `Khách hàng ${
                    request.customerName
                } yêu cầu checkout muộn cho phòng ${
                    request.roomNumber
                }. Thời gian yêu cầu: ${request.requestedTime} (Tiêu chuẩn: ${
                    request.standardCheckoutTime
                }). Lý do: ${request.reason || 'Không có'}`,
                toUserType: 'EMPLOYEE',
                priority: 'HIGH',
                needsAction: true,
                status: 'PENDING',
                isRealtime: true,
                isRead: false,
                dataJson: JSON.stringify({
                    requestType: 'LATE_CHECKOUT_EMPLOYEE_ACTION_REQUIRED',
                    customerId: request.customerId,
                    customerName: request.customerName,
                    bookingId: request.bookingId,
                    roomNumber: request.roomNumber,
                    requestedTime: request.requestedTime,
                    standardCheckoutTime: request.standardCheckoutTime,
                    reason: request.reason,
                    requestTime: new Date().toISOString(),
                }),
            });

            console.log(
                '✅ Late checkout request notifications sent successfully',
            );
        } catch (error) {
            console.error(
                '❌ Error sending late checkout request notifications:',
                error,
            );
            throw new Error(
                'Không thể gửi yêu cầu checkout muộn. Vui lòng thử lại.',
            );
        }
    }

    /**
     * Nhân viên phê duyệt/từ chối yêu cầu checkout muộn
     */
    async processLateCheckoutRequest(
        approval: CheckoutApproval,
    ): Promise<void> {
        try {
            // 1. Đánh dấu thông báo nhân viên là đã đọc
            await this.markRelatedNotificationsAsRead(
                approval.customerId,
                approval.roomNumber,
                'LATE_CHECKOUT_EMPLOYEE_ACTION_REQUIRED',
            );

            // 2. Gửi thông báo kết quả cho khách hàng
            if (approval.isApproved) {
                await notificationApiService.createNotification({
                    type: 'INFO',
                    category: 'LATE_CHECKOUT',
                    title: 'Yêu cầu checkout muộn đã được phê duyệt',
                    message: `Yêu cầu checkout muộn cho phòng ${approval.roomNumber} đã được phê duyệt bởi ${approval.approvedBy}. Bạn có thể checkout vào lúc ${approval.approvedTime}. Chúc bạn có thêm thời gian nghỉ ngơi!`,
                    toUserId: approval.customerId,
                    toUserType: 'CUSTOMER',
                    priority: 'HIGH',
                    needsAction: false,
                    status: 'APPROVED',
                    isRealtime: true,
                    isRead: false,
                    dataJson: JSON.stringify({
                        requestType: 'LATE_CHECKOUT_APPROVED',
                        roomNumber: approval.roomNumber,
                        approvedBy: approval.approvedBy,
                        approvedTime: approval.approvedTime,
                        originalRequestId: approval.requestId,
                    }),
                });
            } else {
                await notificationApiService.createNotification({
                    type: 'ALERT',
                    category: 'LATE_CHECKOUT',
                    title: 'Yêu cầu checkout muộn bị từ chối',
                    message: `Rất tiếc, yêu cầu checkout muộn cho phòng ${approval.roomNumber} đã bị từ chối. Lý do: ${approval.reason}. Vui lòng checkout đúng giờ quy định.`,
                    toUserId: approval.customerId,
                    toUserType: 'CUSTOMER',
                    priority: 'HIGH',
                    needsAction: false,
                    status: 'REJECTED',
                    isRealtime: true,
                    isRead: false,
                    dataJson: JSON.stringify({
                        requestType: 'LATE_CHECKOUT_REJECTED',
                        roomNumber: approval.roomNumber,
                        rejectedBy: approval.approvedBy,
                        reason: approval.reason,
                        originalRequestId: approval.requestId,
                    }),
                });
            }
        } catch (error) {
            console.error('Error processing late checkout request:', error);
            throw error;
        }
    }

    // ============================================
    // CANCEL BOOKING METHODS
    // ============================================

    /**
     * Khách hàng hủy booking
     * - CHỈ tạo thông báo xác nhận cho khách hàng
     * - KHÔNG gửi cho nhân viên
     */
    async sendCancelBookingRequest(
        request: CancelBookingRequest,
    ): Promise<void> {
        console.log(
            '📤 Sending cancel booking notification to customer:',
            request,
        );
        try {
            // Thông báo xác nhận cho khách hàng
            const checkInDate = new Date(
                request.checkInDate,
            ).toLocaleDateString('vi-VN');
            const checkOutDate = new Date(
                request.checkOutDate,
            ).toLocaleDateString('vi-VN');

            await notificationApiService.createNotification({
                type: 'INFO',
                category: 'CANCELLATION',
                title: '✅ Đã hủy booking thành công',
                message: `Bạn đã hủy booking ${request.bookingId} (Phòng ${
                    request.roomNumber
                }) thành công. Thời gian: ${checkInDate} - ${checkOutDate}. Số tiền: ${request.totalAmount.toLocaleString(
                    'vi-VN',
                )}đ. Lý do: ${
                    request.reason || 'Không rõ'
                }. Vui lòng liên hệ lễ tân để được hỗ trợ thêm về chính sách hoàn tiền.`,
                toUserId: request.customerId,
                toUserType: 'CUSTOMER',
                priority: 'NORMAL',
                needsAction: false,
                status: 'SENT',
                isRealtime: true,
                isRead: false,
                dataJson: JSON.stringify({
                    requestType: 'CANCEL_BOOKING_CONFIRMATION',
                    bookingId: request.bookingId,
                    roomNumber: request.roomNumber,
                    checkInDate: request.checkInDate,
                    checkOutDate: request.checkOutDate,
                    totalAmount: request.totalAmount,
                    reason: request.reason,
                    cancelledAt: new Date().toISOString(),
                }),
            });

            console.log(
                '✅ Cancel booking notification sent to customer successfully',
            );
        } catch (error) {
            console.error(
                '❌ Error sending cancel booking notification:',
                error,
            );
            throw new Error(
                'Không thể gửi thông báo hủy booking. Vui lòng thử lại.',
            );
        }
    }
}

export const earlyCheckinNotificationService =
    new EarlyCheckinNotificationService();
