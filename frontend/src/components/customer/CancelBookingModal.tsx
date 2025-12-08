import { useState, useEffect } from 'react';
import type { Booking } from '../../types/Booking';
import { cancelBooking } from '../../services/bookingService';
import { useToastContext } from '../../hooks/useToastContext';

interface Props {
    booking: Booking | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CancelBookingModal({
    booking,
    onClose,
    onSuccess,
}: Props) {
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const [paymentInfo, setPaymentInfo] = useState({
        method: 'BANK_TRANSFER',
        accountNumber: '',
        accountName: '',
        bankName: '',
        mobileNumber: '',
    });

    const toast = useToastContext();

    // Chặn scroll body khi modal mở và thêm ESC key
    useEffect(() => {
        document.body.style.overflow = 'hidden';

        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscKey);

        return () => {
            document.body.style.overflow = 'unset';
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!confirmed) {
            alert('Vui lòng xác nhận hủy booking');
            return;
        }

        if (!reason.trim()) {
            alert('Vui lòng nhập lý do hủy');
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare refund method data với validation tốt hơn
            let refundMethodData = null;

            if (refundAmount > 0) {
                // Validate dữ liệu trước khi gửi
                if (paymentInfo.method === 'BANK_TRANSFER') {
                    if (
                        !paymentInfo.bankName ||
                        !paymentInfo.accountNumber ||
                        !paymentInfo.accountName
                    ) {
                        alert('Vui lòng điền đầy đủ thông tin ngân hàng');
                        setIsSubmitting(false);
                        return;
                    }
                    refundMethodData = {
                        method: paymentInfo.method,
                        bankName: paymentInfo.bankName.trim(),
                        accountNumber: paymentInfo.accountNumber.trim(),
                        accountName: paymentInfo.accountName.trim(),
                        refundAmount: refundAmount,
                    };
                } else {
                    // MOMO, ZALOPAY, VNPAY
                    if (!paymentInfo.mobileNumber) {
                        alert(
                            `Vui lòng điền số điện thoại ${paymentInfo.method}`,
                        );
                        setIsSubmitting(false);
                        return;
                    }
                    refundMethodData = {
                        method: paymentInfo.method,
                        mobileNumber: paymentInfo.mobileNumber.trim(),
                        refundAmount: refundAmount,
                    };
                }
            }

            console.log('=== DEBUG PAYMENT INFO (ENHANCED) ===');
            console.log(
                'Original Payment Info State:',
                JSON.stringify(paymentInfo, null, 2),
            );
            console.log('Refund Amount Calculated:', refundAmount);
            console.log(
                'Final Refund Method Data:',
                JSON.stringify(refundMethodData, null, 2),
            );
            console.log('Booking Payment Status:', booking?.paymentStatus);
            console.log('Booking Status:', booking?.status);

            console.log('=== API CALL PARAMETERS ===');
            console.log('Booking ID:', booking?.bookingID);
            console.log(
                'Reason length:',
                reason.trim().length,
                '- Content:',
                reason.trim(),
            );
            console.log('Customer ID:', booking?.customer?.id);

            // Validate trước khi call API
            if (!refundMethodData && refundAmount > 0) {
                console.error(
                    'ERROR: Refund data is null but refund amount > 0',
                );
                alert('Lỗi: Không thể tạo thông tin hoàn tiền');
                setIsSubmitting(false);
                return;
            }

            // Call real API
            const result = await cancelBooking(
                booking?.bookingID || '',
                reason.trim(),
                booking?.customer?.id || '',
                refundMethodData,
            );

            console.log('=== API RESPONSE (ENHANCED) ===');
            console.log(
                'Full Cancel Booking Result:',
                JSON.stringify(result, null, 2),
            );
            console.log(
                'Response Refund Account Info:',
                result?.refundAccountInfo,
            );
            console.log('Response Refund Method:', result?.refundMethod);
            console.log('Response Refund Amount:', result?.refundAmount);

            // Kiểm tra xem dữ liệu có được lưu không
            if (refundAmount > 0) {
                if (!result?.refundAccountInfo && !result?.refundMethod) {
                    console.warn(
                        '⚠️  WARNING: Refund data not saved to backend!',
                    );
                    console.warn(
                        'This might be due to PaymentStatus condition in backend',
                    );
                    console.warn(
                        'Backend might be checking for PAID status only',
                    );
                    console.warn(
                        'But actual status might be PERCENTAGE_50 or PERCENTAGE_100',
                    );
                } else {
                    console.log('✅ SUCCESS: Refund data saved successfully');
                }
            }

            toast.success('Booking is cancelled successfully!!!');
            onSuccess();
        } catch (error) {
            console.error('Error cancelling booking:', error);
            toast.error('Có lỗi xảy ra khi hủy booking');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!booking) return null;

    // Kiểm tra xem có thể hủy booking không
    const canCancelBooking = () => {
        if (booking.status === 'CHECKED_IN')
            return {
                canCancel: false,
                reason: 'Không thể hủy sau khi đã check-in',
            };
        if (booking.status === 'CHECKED_OUT')
            return {
                canCancel: false,
                reason: 'Không thể hủy sau khi đã check-out',
            };
        if (booking.status === 'CANCELLED')
            return { canCancel: false, reason: 'Booking đã được hủy trước đó' };
        return { canCancel: true, reason: '' };
    };

    const calculateRefund = () => {
        const checkInDate = new Date(booking.checkInDate);
        const now = new Date();
        // Làm tròn số ngày để tránh sai số thập phân
        const daysUntilCheckin = Math.ceil(
            (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
        );

        console.log('=== DEBUG REFUND CALCULATION ===');
        console.log('Check-in date:', checkInDate);
        console.log('Current date:', now);
        console.log('Days until check-in:', daysUntilCheckin);
        console.log('Payment status:', booking.paymentStatus);
        console.log('Booking status:', booking.status);

        // Kiểm tra điều kiện hoàn tiền - phải match với backend enum
        const paidStatuses = [
            'COMPLETED',
            'PERCENTAGE_30',
            'PERCENTAGE_50',
            'PAID',
        ];
        const isPaid = paidStatuses.includes(booking.paymentStatus);
        const isPending = booking.status === 'PENDING';

        console.log('Payment Status:', booking.paymentStatus);
        console.log('Is Paid Status (in paid list):', isPaid);
        console.log('Is Pending Booking:', isPending);
        console.log('Paid statuses include:', paidStatuses);

        // Chỉ hoàn tiền nếu đã thanh toán (COMPLETED, PERCENTAGE_30, PERCENTAGE_50, PAID) và booking đang PENDING
        if (isPaid && isPending) {
            if (daysUntilCheckin >= 7) {
                console.log(
                    '-> 100% refund: >=7 days, Paid status, Pending booking',
                );
                return booking.totalAmount; // Hoàn 100%
            } else if (daysUntilCheckin >= 3) {
                console.log(
                    '-> 50% refund: 3-6 days, Paid status, Pending booking',
                );
                return booking.totalAmount * 0.5; // Hoàn 50%
            } else {
                console.log('-> No refund: <3 days, even though paid');
                return 0; // Không hoàn tiền
            }
        }

        console.log('-> No refund: Not paid or not pending booking');
        console.log(
            '  Payment Status Check:',
            booking.paymentStatus,
            '- In paid list?',
            isPaid,
        );
        console.log(
            '  Booking Status Check:',
            booking.status,
            '- Is pending?',
            isPending,
        );
        return 0;
    };

    const refundAmount = calculateRefund();
    const refundPercentage =
        booking.totalAmount > 0
            ? (refundAmount / booking.totalAmount) * 100
            : 0;
    const cancelCheck = canCancelBooking();

    // Nếu không thể hủy, hiển thị thông báo
    if (!cancelCheck.canCancel) {
        return (
            <div
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                onClick={onClose}
            >
                <div
                    className="bg-white rounded-2xl max-w-lg w-full"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="p-6 text-center">
                        <div className="mb-4">
                            <i className="fas fa-times-circle text-black text-5xl mb-3"></i>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">
                                Không thể hủy booking
                            </h2>
                            <p className="text-gray-600">
                                {cancelCheck.reason}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-[#b9ad96] text-white rounded-lg hover:bg-[#a89981] transition-colors"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-3xl max-w-2xl w-full max-h-[95vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-[#b9ad96] to-[#a89981] text-white p-6 rounded-t-3xl">
                    <h2 className="text-2xl text-center font-bold text-white">
                        Cancel Booking
                    </h2>
                </div>

                <div className="p-6">
                    {/* Chính sách hoàn tiền */}
                    <div className="mb-6 p-5 bg-gradient-to-br from-gray-50 to-[#b9ad96]/10 border-l-4 border-[#b9ad96] rounded-xl">
                        <div className="flex items-center gap-2 mb-3">
                            <i className="fas fa-info-circle text-[#b9ad96] text-lg"></i>
                            <h3 className="font-bold text-gray-800 text-lg">
                                Refund Policy
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="bg-white p-4 rounded-lg border border-[#b9ad96]/30 shadow-sm">
                                <div className="text-[#b9ad96] font-semibold mb-2">
                                    <i className="fas fa-calendar-check mr-2"></i>
                                    Cancel 7 days in advance
                                </div>
                                <div className="text-gray-800 font-bold text-xl">
                                    100%
                                </div>
                                <div className="text-gray-600 text-xs">
                                    Refund full amount
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
                                <div className="text-gray-600 font-semibold mb-2">
                                    <i className="fas fa-calendar-alt mr-2"></i>
                                    Cancel 3-7 days in advance
                                </div>
                                <div className="text-gray-800 font-bold text-xl">
                                    50%
                                </div>
                                <div className="text-gray-600 text-xs">
                                    Refund half of the amount
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-black/20 shadow-sm">
                                <div className="text-black font-semibold mb-2">
                                    <i className="fas fa-calendar-times mr-2"></i>
                                    Cancel less than 3 days in advance
                                </div>
                                <div className="text-black font-bold text-xl">
                                    0%
                                </div>
                                <div className="text-gray-600 text-xs">
                                    Refund not available
                                </div>
                            </div>
                        </div>
                        <div className="mt-3 p-3 bg-[#b9ad96]/10 rounded-lg border border-[#b9ad96]/20">
                            <p className="text-xs text-gray-700">
                                <i className="fas fa-clock mr-1 text-[#b9ad96]"></i>
                                <strong>Note:</strong> Refunds are only
                                available for bookings that have been PAID and
                                not CHECKED IN.
                            </p>
                        </div>
                    </div>

                    {/* Thông tin booking hiện tại */}
                    <div className="mb-6">
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 rounded-xl border">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-[#b9ad96]/20 rounded-full">
                                    <i className="fas fa-receipt text-[#b9ad96]"></i>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800">
                                        Booking information
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        Your booking details
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-white p-4 rounded-lg">
                                    <div className="text-gray-500 text-xs font-medium mb-1">
                                        BOOKING ID
                                    </div>
                                    <div className="font-bold text-gray-800">
                                        {booking.bookingID}
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-lg">
                                    <div className="text-gray-500 text-xs font-medium mb-1">
                                        CHECK-IN
                                    </div>
                                    <div className="font-bold text-gray-800">
                                        {new Date(
                                            booking.checkInDate,
                                        ).toLocaleDateString('vi-VN')}
                                    </div>
                                    <div className="text-gray-500 text-xs">
                                        {new Date(
                                            booking.checkInDate,
                                        ).toLocaleTimeString('vi-VN')}
                                    </div>
                                </div>
                            </div>

                            {/* Trạng thái và số tiền hoàn */}
                            <div className="bg-white p-4 rounded-lg border-l-4 border-[#b9ad96]">
                                <div className="flex justify-between items-center mb-3">
                                    <div>
                                        <div className="text-gray-500 text-xs font-medium">
                                            PAYMENT STATUS
                                        </div>
                                        <div className="font-bold text-gray-800">
                                            {booking.paymentStatus ===
                                                'PENDING' && (
                                                <span className="text-gray-600">
                                                    <i className="fas fa-clock mr-1"></i>
                                                    PENDING
                                                </span>
                                            )}
                                            {booking.paymentStatus ===
                                                'COMPLETED' && (
                                                <span className="text-[#b9ad96]">
                                                    <i className="fas fa-check-circle mr-1"></i>
                                                    COMPLETED
                                                </span>
                                            )}
                                            {booking.paymentStatus ===
                                                'PERCENTAGE_30' && (
                                                <span className="text-[#b9ad96]">
                                                    Paid 30%
                                                </span>
                                            )}
                                            {booking.paymentStatus ===
                                                'PERCENTAGE_50' && (
                                                <span className="text-[#b9ad96]">
                                                    Paid 50%
                                                </span>
                                            )}
                                            {booking.paymentStatus ===
                                                'PAID' && (
                                                <span className="text-[#b9ad96]">
                                                    Paid in full
                                                </span>
                                            )}
                                            {booking.paymentStatus ===
                                                'FAILED' && (
                                                <span className="text-black">
                                                    Payment failed
                                                </span>
                                            )}
                                            {booking.paymentStatus ===
                                                'REFUNDED' && (
                                                <span className="text-[#b9ad96]">
                                                    Refunded
                                                </span>
                                            )}
                                            {booking.paymentStatus ===
                                                'CANCELLED' && (
                                                <span className="text-gray-600">
                                                    CANCELLED
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="text-gray-500 text-xs font-medium">
                                            REFUND AMOUNT
                                        </div>
                                        <div className="font-bold text-2xl text-[#b9ad96]">
                                            {refundAmount.toLocaleString()} VNĐ
                                        </div>
                                        <div className="text-gray-500 text-sm">
                                            ({refundPercentage.toFixed(0)}%
                                            total amount)
                                        </div>
                                    </div>
                                </div>

                                {/* Thông báo áp dụng chính sách */}
                                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="text-sm font-medium text-gray-700">
                                        {booking.paymentStatus ===
                                            'PENDING' && (
                                            <span className="text-gray-600">
                                                <i className="fas fa-info-circle mr-1"></i>
                                                Booking is not paid - No refund
                                            </span>
                                        )}
                                        {[
                                            'COMPLETED',
                                            'PERCENTAGE_30',
                                            'PERCENTAGE_50',
                                            'PAID',
                                        ].includes(booking.paymentStatus) && (
                                            <>
                                                {refundPercentage === 100 && (
                                                    <span className="text-[#b9ad96]">
                                                        <i className="fas fa-check-circle mr-1"></i>
                                                        Cancel 7 days before -
                                                        Apply 100% refund
                                                    </span>
                                                )}
                                                {refundPercentage === 50 && (
                                                    <span className="text-gray-600">
                                                        <i className="fas fa-exclamation-triangle mr-1"></i>
                                                        Cancel 3-7 days before -
                                                        Apply 50% refund
                                                    </span>
                                                )}
                                                {refundPercentage === 0 && (
                                                    <span className="text-black">
                                                        <i className="fas fa-times-circle mr-1"></i>
                                                        Cancel less than 3 days
                                                        - No refund
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Cancellation Reason */}
                        <div className="bg-gradient-to-br from-gray-50 to-[#b9ad96]/10 p-5 rounded-xl border-l-4 border-[#b9ad96] mb-4">
                            <div className="flex items-center gap-2 mb-3">
                                <i className="fas fa-edit text-[#b9ad96] text-lg"></i>
                                <h4 className="font-bold text-gray-800 text-lg">
                                    Cancellation Reason
                                </h4>
                            </div>
                            <p className="text-gray-700 text-sm mb-3">
                                Please let us know the reason you want to cancel
                                your booking so we can improve our services.
                            </p>
                            <div>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="E.g: Change of travel plans, unexpected events, unable to arrange time..."
                                    rows={4}
                                    className="w-full p-4 border-2 text-sm border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b9ad96] focus:border-[#b9ad96] resize-none transition-colors"
                                    required
                                />
                                {reason && (
                                    <div className="mt-2 p-2 bg-[#b9ad96]/10 rounded text-sm text-gray-700 border border-[#b9ad96]/20">
                                        <i className="fas fa-check mr-1 text-[#b9ad96]"></i>
                                        Thank you for sharing! ({reason.length}{' '}
                                        characters)
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Payment Information for Refund */}
                        {refundAmount > 0 && (
                            <div className="bg-gradient-to-br from-gray-50 to-[#b9ad96]/10 p-5 rounded-xl border-l-4 border-[#b9ad96] mb-4">
                                <div className="flex items-center gap-2 mb-4">
                                    <i className="fas fa-money-bill-wave text-[#b9ad96] text-lg"></i>
                                    <h4 className="font-bold text-gray-800 text-lg">
                                        Payment Information for Refund
                                    </h4>
                                </div>
                                <p className="text-gray-700 text-sm mb-4">
                                    Please provide your account information so
                                    we can process your refund.
                                </p>

                                {/* Payment Method Selection */}
                                <div className="mb-4">
                                    <label className="block text-sm font-bold text-gray-700 mb-3">
                                        <i className="fas fa-credit-card mr-2 text-[#b9ad96]"></i>
                                        Select Refund Method *
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        {[
                                            {
                                                value: 'BANK_TRANSFER',
                                                label: 'Ngân hàng',
                                                icon: 'fas fa-university',
                                            },
                                            {
                                                value: 'MOMO',
                                                label: 'MoMo',
                                                icon: 'fas fa-mobile-alt',
                                            },
                                            {
                                                value: 'ZALOPAY',
                                                label: 'ZaloPay',
                                                icon: 'fas fa-wallet',
                                            },
                                            {
                                                value: 'VNPAY',
                                                label: 'VNPay',
                                                icon: 'fas fa-credit-card',
                                            },
                                        ].map((method) => (
                                            <button
                                                key={method.value}
                                                type="button"
                                                onClick={() => {
                                                    setPaymentInfo({
                                                        method: method.value,
                                                        accountNumber: '',
                                                        accountName: '',
                                                        bankName: '',
                                                        mobileNumber: '',
                                                    });
                                                }}
                                                className={`p-3 rounded-lg border-2 transition-all ${
                                                    paymentInfo.method ===
                                                    method.value
                                                        ? 'border-[#b9ad96] bg-[#b9ad96]/10 text-[#b9ad96]'
                                                        : 'border-gray-200 bg-white hover:border-[#b9ad96]/50 hover:bg-[#b9ad96]/5'
                                                }`}
                                            >
                                                <i
                                                    className={`${method.icon} text-lg mb-1 block`}
                                                ></i>
                                                <div className="text-xs font-medium">
                                                    {method.label}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Bank Transfer Fields */}
                                {paymentInfo.method === 'BANK_TRANSFER' && (
                                    <div className="bg-white p-4 rounded-lg border space-y-4">
                                        <div className="flex items-center gap-2 mb-3">
                                            <i className="fas fa-university text-[#b9ad96]"></i>
                                            <h5 className="font-semibold text-gray-800">
                                                Bank Information
                                            </h5>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                <i className="fas fa-building mr-2 text-[#b9ad96]"></i>
                                                Bank Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={paymentInfo.bankName}
                                                onChange={(e) =>
                                                    setPaymentInfo({
                                                        ...paymentInfo,
                                                        bankName:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="VD: Vietcombank, Techcombank, BIDV..."
                                                className="w-full text-sm p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b9ad96] focus:border-[#b9ad96] transition-colors"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                <i className="fas fa-credit-card mr-2 text-[#b9ad96]"></i>
                                                Account Number *
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    paymentInfo.accountNumber
                                                }
                                                onChange={(e) =>
                                                    setPaymentInfo({
                                                        ...paymentInfo,
                                                        accountNumber:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Account number for refund"
                                                className="text-sm w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b9ad96] focus:border-[#b9ad96] transition-colors"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                <i className="fas fa-user mr-2 text-[#b9ad96]"></i>
                                                Account Holder Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={paymentInfo.accountName}
                                                onChange={(e) =>
                                                    setPaymentInfo({
                                                        ...paymentInfo,
                                                        accountName:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Name as per bank records"
                                                className="text-sm w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b9ad96] focus:border-[#b9ad96] transition-colors"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* E-wallet Fields */}
                                {(paymentInfo.method === 'MOMO' ||
                                    paymentInfo.method === 'ZALOPAY' ||
                                    paymentInfo.method === 'VNPAY') && (
                                    <div className="bg-white p-4 rounded-lg border">
                                        <div className="flex items-center gap-2 mb-3">
                                            <i
                                                className={`fas ${
                                                    paymentInfo.method ===
                                                    'MOMO'
                                                        ? 'fa-mobile-alt'
                                                        : paymentInfo.method ===
                                                          'ZALOPAY'
                                                        ? 'fa-wallet'
                                                        : 'fa-credit-card'
                                                } text-[#b9ad96]`}
                                            ></i>
                                            <h5 className="font-semibold text-gray-800">
                                                {paymentInfo.method}
                                            </h5>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                <i className="fas fa-phone mr-2 text-[#b9ad96]"></i>
                                                Registered Phone Number for{' '}
                                                {paymentInfo.method} *
                                            </label>
                                            <input
                                                type="tel"
                                                value={paymentInfo.mobileNumber}
                                                onChange={(e) => {
                                                    const value =
                                                        e.target.value.replace(
                                                            /\D/g,
                                                            '',
                                                        ); // Chỉ cho phép số
                                                    setPaymentInfo({
                                                        ...paymentInfo,
                                                        mobileNumber: value,
                                                    });
                                                }}
                                                placeholder={`Phone number for ${paymentInfo.method} (VD: 0987654321)`}
                                                className="text-sm w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b9ad96] focus:border-[#b9ad96] transition-colors"
                                                maxLength={11}
                                                pattern="[0-9]{10,11}"
                                                required
                                            />
                                            {paymentInfo.mobileNumber &&
                                            paymentInfo.mobileNumber.length >=
                                                10 ? (
                                                <div className="mt-2 p-3 bg-[#b9ad96]/10 rounded-lg border border-[#b9ad96]/30">
                                                    <div className="text-sm text-gray-700 flex items-center gap-2">
                                                        <i className="fas fa-check-circle text-[#b9ad96]"></i>
                                                        <span>
                                                            <strong>
                                                                Xác nhận:
                                                            </strong>{' '}
                                                            {paymentInfo.method}{' '}
                                                            -{' '}
                                                            {
                                                                paymentInfo.mobileNumber
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-[#b9ad96] mt-1">
                                                        ✓ Thông tin này sẽ được
                                                        gửi đến server để xử lý
                                                        hoàn tiền
                                                    </div>
                                                </div>
                                            ) : paymentInfo.mobileNumber
                                                  .length > 0 ? (
                                                <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                    <div className="text-sm text-gray-700 flex items-center gap-2">
                                                        <i className="fas fa-exclamation-triangle text-gray-600"></i>
                                                        <span>
                                                            Phone number is too
                                                            short (min 10
                                                            digits)
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Confirmation Checkbox */}
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border">
                            <div className="flex items-center gap-3 mb-3">
                                <i className="fas fa-shield-check text-[#b9ad96] text-lg"></i>
                                <h4 className="font-bold text-gray-800">
                                    Confirm Cancellation
                                </h4>
                            </div>

                            <div className="bg-white p-4 rounded-lg border-l-4 border-[#b9ad96] mb-4">
                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        id="confirmCancel"
                                        checked={confirmed}
                                        onChange={(e) =>
                                            setConfirmed(e.target.checked)
                                        }
                                        className="mt-1 h-5 w-5 text-[#b9ad96] border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#b9ad96]"
                                    />
                                    <label
                                        htmlFor="confirmCancel"
                                        className="text-sm text-gray-700 cursor-pointer select-none"
                                    >
                                        <div className="font-semibold text-gray-800 mb-2">
                                            I confirm that I want to cancel this
                                            booking
                                        </div>
                                        <ul className="space-y-1 text-xs text-gray-600">
                                            <li>
                                                ✓ This booking cancellation is
                                                irreversible
                                            </li>
                                            <li>
                                                ✓ I will{' '}
                                                {refundAmount > 0 ? (
                                                    <span className="text-[#b9ad96] font-semibold">
                                                        receive a refund of{' '}
                                                        {refundAmount.toLocaleString()}{' '}
                                                        VNĐ (
                                                        {refundPercentage.toFixed(
                                                            0,
                                                        )}
                                                        %)
                                                    </span>
                                                ) : (
                                                    <span className="text-black font-semibold">
                                                        not receive any refund
                                                    </span>
                                                )}{' '}
                                                according to the policy.
                                            </li>
                                            <li>
                                                ✓ Processing time for refunds:
                                                2-3 hours (e-wallet) or 1-3 days
                                                (bank)
                                            </li>
                                        </ul>
                                    </label>
                                </div>
                            </div>

                            {!confirmed && (
                                <div className="p-3 bg-[#b9ad96]/10 border border-[#b9ad96]/30 rounded-lg">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <i className="fas fa-hand-point-up text-[#b9ad96]"></i>
                                        <span className="text-sm font-medium">
                                            Please tick the confirmation box to
                                            continue
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="bg-gray-50 -mx-6 -mb-6 p-6 rounded-b-3xl">
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-[#b9ad96] hover:text-[#b9ad96] transition-all duration-200 font-semibold shadow-sm"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !confirmed}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#b9ad96] to-[#a89981] text-white rounded-xl hover:from-[#a89981] hover:to-[#97876e] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg"
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Processing...
                                        </div>
                                    ) : (
                                        <>Confirm</>
                                    )}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 text-center mt-3">
                                <i className="fas fa-shield-alt mr-1 text-[#b9ad96]"></i>
                                Your information is secure and processed safely
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
