import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../../components/Header';
import { getBookingById } from '../../../services/bookingService';
import { getAllEarlyCheckins } from '../../../services/earlyCheckinService';
import type { Booking } from '../../../types/Booking';
import type { BookingDetail } from '../../../types/BookingDetail';
import type { EarlyCheckinResponse } from '../../../types/EarlyCheckin';

import EarlyCheckinModal from '../../../components/checkin/EarlyCheckinModal';

const statusColor = {
    PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
    CHECKED_IN: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    CHECKED_OUT: 'bg-sky-50 text-sky-700 border-sky-200',
    CANCELLED: 'bg-rose-50 text-rose-700 border-rose-200',
};

export default function BookingDetailPage() {
    const { id } = useParams();

    const [booking, setBooking] = useState<Booking | null>(null);
    const [details, setDetails] = useState<BookingDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [earlyCheckinRequest, setEarlyCheckinRequest] =
        useState<EarlyCheckinResponse | null>(null);

    const [showEarlyModal, setShowEarlyModal] = useState(false);

    // FETCH DATA
    useEffect(() => {
        if (!id) return;

        (async () => {
            try {
                const bookingRes = await getBookingById(id);
                setBooking(bookingRes);

                // LẤY ĐÚNG bookingDetails TỪ booking
                setDetails(bookingRes.bookingDetails || []);

                // Tìm yêu cầu early checkin cho booking này - kiểm tra cả 2 nguồn
                let earlyRequest = null;

                console.log('Checking early checkin for booking:', id);
                

                // 1. Kiểm tra trong booking object trước
                if (bookingRes.earlyCheckin) {
                    console.log('Found early checkin in booking object');
                    earlyRequest = {
                        requestID:
                            bookingRes.earlyCheckin.requestID ||
                            'booking-' + id,
                        requestTime: bookingRes.earlyCheckin.requestTime,
                        approvalStatus: bookingRes.earlyCheckin.approvalStatus,
                        additionalFee: bookingRes.earlyCheckin.additionalFee,
                        requestDate: bookingRes.earlyCheckin.requestTime,
                        booking: bookingRes,
                    };
                }

                // 2. Nếu không có trong booking, tìm trong collection riêng
                if (!earlyRequest) {
                    console.log('Searching in early checkins collection...');
                    try {
                        const earlyCheckins = await getAllEarlyCheckins();
                       

                        // Đảm bảo earlyCheckins là array
                        if (Array.isArray(earlyCheckins)) {
                            const matchingRequest = earlyCheckins.find(
                                (req: EarlyCheckinResponse) =>
                                    req.booking?.bookingID === id,
                            );
                            earlyRequest = matchingRequest || null;
                            console.log(
                                'Matching request:',
                                matchingRequest,
                            );
                        } else {
                            console.warn(
                                'Early checkins is not an array:',
                                earlyCheckins,
                            );
                        }
                    } catch (earlyError) {
                        console.error(
                            'Error fetching early checkin data:',
                            earlyError,
                        );
                    }
                }

                console.log('Final early request:', earlyRequest);
                setEarlyCheckinRequest(earlyRequest);
            } catch (error) {
                console.error('Error fetching booking detail:', error);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    // Helper function to render early checkin button based on status
    const renderEarlyCheckinButton = () => {
        if (!earlyCheckinRequest) {
            // No request yet - show normal button
            return (
                <button
                    onClick={() => setShowEarlyModal(true)}
                    className="w-full bg-black hover:bg-black/90 text-white py-3 rounded-xl"
                >
                    Early Check-in
                </button>
            );
        }

        const { approvalStatus } = earlyCheckinRequest;

        switch (approvalStatus) {
            case 'PENDING':
                return (
                    <button
                        disabled
                        className="w-full bg-yellow-500 text-white py-3 rounded-xl cursor-not-allowed"
                    >
                        Đang chờ duyệt
                    </button>
                );
            case 'APPROVED':
                return (
                    <button
                        disabled
                        className="w-full bg-green-600 text-white py-3 rounded-xl cursor-not-allowed"
                    >
                        Early Check-in đã được chấp nhận
                    </button>
                );
            case 'REJECTED':
                return (
                    <button
                        disabled
                        className="w-full bg-red-600 text-white py-3 rounded-xl cursor-not-allowed"
                    >
                        Early Check-in đã được từ chối
                    </button>
                );
            default:
                return (
                    <button
                        onClick={() => setShowEarlyModal(true)}
                        className="w-full bg-black hover:bg-black/90 text-white py-3 rounded-xl"
                    >
                        Early Check-in
                    </button>
                );
        }
    };

    // Helper function to render notification
    const renderNotification = () => {
        if (!earlyCheckinRequest) return null;

        const { approvalStatus, additionalFee } = earlyCheckinRequest;

        if (approvalStatus === 'APPROVED') {
            return (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                            <svg
                                className="w-4 h-4 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-green-800">
                                Yêu cầu check-in sớm đã được chấp nhận
                            </h4>
                            <p className="text-green-600 text-sm">
                                Phí bổ sung: {additionalFee.toLocaleString()}{' '}
                                VNĐ đã được cộng vào hóa đơn
                            </p>
                        </div>
                        <div className="bg-green-100 px-3 py-1 rounded-full">
                            <span className="text-green-700 text-xs font-medium">
                                Đã cộng phí
                            </span>
                        </div>
                    </div>
                </div>
            );
        }

        if (approvalStatus === 'REJECTED') {
            return (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                            <svg
                                className="w-4 h-4 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-semibold text-red-800">
                                Yêu cầu check-in sớm đã bị từ chối
                            </h4>
                            <p className="text-red-600 text-sm">
                                Vui lòng liên hệ khách sạn để biết thêm thông
                                tin
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        if (approvalStatus === 'PENDING') {
            return (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                            <svg
                                className="w-4 h-4 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-semibold text-yellow-800">
                                Yêu cầu check-in sớm đang được xử lý
                            </h4>
                            <p className="text-yellow-600 text-sm">
                                Chúng tôi sẽ thông báo kết quả trong thời gian
                                sớm nhất
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        return null;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center text-black">
                Loading...
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen flex justify-center items-center text-black">
                Booking Not Found
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            {/* HEADER */}
            <div className="bg-white border-b border-[#F5F0EB] sticky top-0 z-50">
                <Header />
            </div>

            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* BACK */}
                <div className="mb-6">
                    <button
                        onClick={() => window.history.back()}
                        className="text-black hover:text-black/70 flex items-center gap-2 font-medium"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        Back to Bookings
                    </button>
                </div>

                {/* NOTIFICATION */}
                {renderNotification()}

                {/* TITLE */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-black">
                            Booking Details
                        </h1>
                        <p className="text-black/60">
                            ID:{' '}
                            <span className="font-mono font-semibold">
                                {booking.bookingID || 'Unknown ID'}
                            </span>
                        </p>
                    </div>

                    <span
                        className={`px-5 py-2 rounded-full text-sm font-semibold border-2 ${
                            statusColor[
                                (booking.status ||
                                    'PENDING') as keyof typeof statusColor
                            ]
                        }`}
                    >
                        {booking.status?.replace('_', ' ') || 'Unknown Status'}
                    </span>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* CUSTOMER */}
                        <div className="bg-white rounded-2xl border p-6 border-[#F5F0EB]">
                            <h3 className="text-xl font-bold mb-4">
                                Customer Information
                            </h3>

                            <div className="space-y-3">
                                <div className="p-3 bg-[#F5F0EB] rounded-lg flex gap-3">
                                    <strong className="min-w-[70px] text-black/70">
                                        Name
                                    </strong>
                                    <span>
                                        {booking.customer?.fullName || 'N/A'}
                                    </span>
                                </div>
                                <div className="p-3 bg-[#F5F0EB] rounded-lg flex gap-3">
                                    <strong className="min-w-[70px] text-black/70">
                                        Phone
                                    </strong>
                                    <span>
                                        {booking.customer?.phone || 'N/A'}
                                    </span>
                                </div>
                                <div className="p-3 bg-[#F5F0EB] rounded-lg flex gap-3">
                                    <strong className="min-w-[70px] text-black/70">
                                        Email
                                    </strong>
                                    <span>
                                        {booking.customer?.email || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* SCHEDULE */}
                        <div className="bg-white rounded-2xl border p-6 border-[#F5F0EB]">
                            <h3 className="text-xl font-bold mb-4">Schedule</h3>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-[#F5F0EB] p-4 rounded-xl">
                                    <p className="text-black/60 text-sm">
                                        Check-in
                                    </p>
                                    <p className="text-lg font-bold text-black">
                                        {booking.checkInDate?.split('T')[0] ||
                                            'N/A'}
                                    </p>
                                    <p className="text-sm font-semibold text-black">
                                        {booking.checkInDate?.split('T')[1] ||
                                            'N/A'}
                                    </p>
                                </div>
                                <div className="bg-[#F5F0EB] p-4 rounded-xl">
                                    <p className="text-black/60 text-sm">
                                        Check-out
                                    </p>
                                    <p className="text-lg font-bold text-black">
                                        {booking.checkOutDate?.split('T')[0] ||
                                            'N/A'}
                                    </p>
                                    <p className="text-sm font-semibold text-black">
                                        {booking.checkOutDate?.split('T')[1] ||
                                            'N/A'}
                                    </p>
                                </div>
                            </div>

                            <div className="p-3 bg-[#F5F0EB] rounded-lg flex gap-2">
                                <span className="font-semibold">
                                    {booking.numberOfGuests || 0} Guests
                                </span>
                            </div>
                        </div>

                        {/* ROOMS */}
                        <div className="bg-white rounded-2xl border p-6 border-[#F5F0EB]">
                            <h3 className="text-xl font-bold mb-5">
                                Rooms Booked
                            </h3>

                            <div className="space-y-4">
                                {details.map((d, index) => (
                                    <div
                                        key={index}
                                        className="bg-[#F5F0EB] p-5 rounded-xl border"
                                    >
                                        <div className="flex justify-between">
                                            <div>
                                                <h4 className="text-lg font-bold">
                                                    Room {d.room.roomNumber}
                                                </h4>
                                                <p className="text-black/60">
                                                    {d.room.roomType?.typeName}
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-sm text-black/60">
                                                    Price
                                                </p>
                                                <p className="text-lg font-bold">
                                                    {d.roomPrice.toLocaleString()}{' '}
                                                    VNĐ
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex mt-3 gap-2 overflow-x-auto">
                                            {d.room.images
                                                ?.slice(0, 3)
                                                .map((img, idx) => (
                                                    <img
                                                        key={idx}
                                                        src={img}
                                                        className="w-24 h-20 rounded-lg object-cover border"
                                                    />
                                                ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT - PAYMENT */}
                    <div className="space-y-6">
                        <div className="bg-black text-white rounded-2xl p-6">
                            <h3 className="text-lg font-semibold mb-6 border-b border-white/20 pb-3">
                                Payment Summary
                            </h3>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-white/70">
                                        Subtotal
                                    </span>
                                    <span>
                                        {booking.totalAmount?.toLocaleString() ||
                                            '0'}{' '}
                                        VNĐ
                                    </span>
                                </div>

                                {/* Early Check-in Fee - Only show if approved */}
                                {earlyCheckinRequest &&
                                    earlyCheckinRequest.approvalStatus ===
                                        'APPROVED' && (
                                        <div className="flex justify-between">
                                            <span className="text-white/70">
                                                Early Check-in Fee
                                            </span>
                                            <span>
                                                {earlyCheckinRequest.additionalFee.toLocaleString()}{' '}
                                                VNĐ
                                            </span>
                                        </div>
                                    )}

                                <div className="flex justify-between">
                                    <span className="text-white/70">
                                        Tax (10%)
                                    </span>
                                    <span>
                                        {(
                                            ((booking.totalAmount || 0) +
                                                (earlyCheckinRequest?.approvalStatus ===
                                                'APPROVED'
                                                    ? earlyCheckinRequest.additionalFee
                                                    : 0)) *
                                            0.1
                                        ).toLocaleString()}{' '}
                                        VNĐ
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-white/20 pt-4 flex justify-between items-center">
                                <span className="text-lg font-semibold">
                                    Total
                                </span>
                                <span className="text-2xl font-bold">
                                    {(() => {
                                        const subtotal =
                                            booking.totalAmount || 0;
                                        const earlyFee =
                                            earlyCheckinRequest?.approvalStatus ===
                                            'APPROVED'
                                                ? earlyCheckinRequest.additionalFee
                                                : 0;
                                        const totalBeforeTax =
                                            subtotal + earlyFee;
                                        const totalWithTax =
                                            totalBeforeTax * 1.1;
                                        return totalWithTax.toLocaleString();
                                    })()}{' '}
                                    VNĐ
                                </span>
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="bg-white rounded-2xl border p-6">
                            <h3 className="text-lg font-bold mb-4">
                                Quick Actions
                            </h3>

                            <div className="space-y-3">
                                {/* ⭐ DYNAMIC EARLY CHECK-IN BUTTON */}
                                {renderEarlyCheckinButton()}

                                <button className="w-full bg-white border-2 border-black py-3 rounded-xl hover:bg-[#F5F0EB]">
                                    Late Check-out
                                </button>
                                <button className="w-full border-2 border-black/30 py-3 rounded-xl hover:bg-[#F5F0EB]">
                                    Report Issue
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL CHECK-IN SỚM */}
            {showEarlyModal && (
                <EarlyCheckinModal
                    booking={booking}
                    onClose={async () => {
                        setShowEarlyModal(false);
                        // Refresh early checkin status when modal closes (in case request was made)
                        try {
                            // Refresh booking data to get updated earlyCheckin field
                            const updatedBooking = await getBookingById(id!);
                            setBooking(updatedBooking);

                            let earlyRequest = null;

                            // 1. Kiểm tra trong booking object trước
                            if (updatedBooking.earlyCheckin) {
                                earlyRequest = {
                                    requestID:
                                        updatedBooking.earlyCheckin.requestID ||
                                        'booking-' + id,
                                    requestTime:
                                        updatedBooking.earlyCheckin.requestTime,
                                    approvalStatus:
                                        updatedBooking.earlyCheckin
                                            .approvalStatus,
                                    additionalFee:
                                        updatedBooking.earlyCheckin
                                            .additionalFee,
                                    requestDate:
                                        updatedBooking.earlyCheckin.requestTime,
                                    booking: updatedBooking,
                                };
                            }

                            // 2. Nếu không có trong booking, tìm trong collection riêng
                            if (!earlyRequest) {
                                const earlyCheckins =
                                    await getAllEarlyCheckins();

                                // Đảm bảo earlyCheckins là array
                                if (Array.isArray(earlyCheckins)) {
                                    const matchingRequest = earlyCheckins.find(
                                        (req: EarlyCheckinResponse) =>
                                            req.booking?.bookingID === id,
                                    );
                                    earlyRequest = matchingRequest || null;
                                } else {
                                    console.warn(
                                        'Early checkins is not an array:',
                                        earlyCheckins,
                                    );
                                }
                            }

                            setEarlyCheckinRequest(earlyRequest);
                        } catch (error) {
                            console.error(
                                'Error refreshing early checkin data:',
                                error,
                            );
                        }
                    }}
                />
            )}
        </div>
    );
}
