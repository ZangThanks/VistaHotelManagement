import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';

import { getBookingById } from '../../services/bookingService';
import { getAllEarlyCheckins } from '../../services/earlyCheckinService';
import { getAllLateCheckouts } from '../../services/lateCheckoutService';

import EarlyCheckinModal from '../../components/checkin/EarlyCheckinModal';
import IncidentReportModal from '../../components/customer/IncidentReportModal';
import CancelBookingModal from '../../components/customer/CancelBookingModal';

import type { Booking } from '../../types/Booking';
import type { BookingDetail } from '../../types/BookingDetail';
import type { EarlyCheckinResponse } from '../../types/EarlyCheckin';
import type { LateCheckout } from '../../types/LateCheckout';
import LateCheckoutModal from '../../components/checkout/LateCheckoutModal';

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

    const [lateCheckoutRequest, setLateCheckoutRequest] =
        useState<LateCheckout | null>(null);

    const [showEarlyModal, setShowEarlyModal] = useState(false);
    const [showLateModal, setShowLateModal] = useState(false);
    const [showIncidentModal, setShowIncidentModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const handleIncidentReport = () => {
        setShowIncidentModal(true);
    };

    const handleCancelBooking = () => {
        // Cho phép hủy nếu booking đang ở trạng thái PENDING (chưa check-in)
        if (booking?.status === 'PENDING') {
            setShowCancelModal(true);
        }
    };

    // Kiểm tra xem có thể hủy booking không
    const canCancelBooking = () => {
        if (!booking) return false;
        return booking.status === 'PENDING'; // Chỉ cho phép hủy khi chưa check-in
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    // FETCH BOOKING + CHECKINS + LATE CHECKOUT

    useEffect(() => {
        if (!id) return;

        (async () => {
            try {
                const bookingRes = await getBookingById(id);
                setBooking(bookingRes);
                setDetails(bookingRes.bookingDetails || []);

                let earlyRequest = null;

                if (bookingRes.earlyCheckin) {
                    earlyRequest = {
                        requestID:
                            bookingRes.earlyCheckin.id ||
                            'booking-' + id,
                        requestTime: bookingRes.earlyCheckin.requestTime,
                        approvalStatus: bookingRes.earlyCheckin.approvalStatus,
                        additionalFee: bookingRes.earlyCheckin.additionalFee,
                        requestDate: bookingRes.earlyCheckin.requestTime,
                        booking: bookingRes,
                    };
                }

                if (!earlyRequest) {
                    const earlyList = await getAllEarlyCheckins();

                    if (Array.isArray(earlyList)) {
                        earlyRequest =
                            earlyList.find(
                                (req: EarlyCheckinResponse) =>
                                    req.booking?.bookingID === id,
                            ) || null;
                    }
                }

                setEarlyCheckinRequest(earlyRequest);

                const lateList = await getAllLateCheckouts();

                if (Array.isArray(lateList)) {
                    const match: LateCheckout | null =
                        lateList.find((req) => req.bookingId === id) || null;

                    setLateCheckoutRequest(match);
                }
            } catch (err) {
                console.error('Error fetching booking detail:', err);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    const renderEarlyCheckinButton = () => {
        if (!booking || booking.status !== 'PENDING') return null;

        if (!earlyCheckinRequest) {
            return (
                <button
                    onClick={() => setShowEarlyModal(true)}
                    className="w-full cursor-pointer bg-[#d8d0c1] border border-[#ddd6c3] text-black hover:bg-[#b9ad96] hover:text-white transition-all duration-200 py-3 rounded-xl"
                >
                    Early Check-in
                </button>
            );
        }

        switch (earlyCheckinRequest.approvalStatus) {
            case 'PENDING':
                return (
                    <button className="w-full bg-yellow-500 text-white py-3 rounded-xl opacity-75">
                        Đang chờ duyệt Early Check-in
                    </button>
                );
            case 'APPROVED':
                return (
                    <button className="w-full bg-green-600 text-white py-3 rounded-xl opacity-75">
                        Early Check-in đã được chấp nhận
                    </button>
                );
            case 'REJECTED':
                return (
                    <button
                        onClick={() => setShowEarlyModal(true)}
                        className="cursor-pointer w-full bg-black text-white py-3 rounded-xl"
                    >
                        Gửi lại Early Check-in
                    </button>
                );
        }
    };

    // LATE CHECKOUT

    const renderLateCheckoutButton = () => {
        if (!booking || booking.status !== 'CHECKED_IN') return null;

        if (!lateCheckoutRequest) {
            return (
                <button
                    onClick={() => setShowLateModal(true)}
                    className="w-full cursor-pointer bg-[#d8d0c1] border border-[#ddd6c3] text-black hover:bg-[#b9ad96] hover:text-white transition-all duration-200 py-3 rounded-xl"
                >
                    Late Check-out
                </button>
            );
        }

        switch (lateCheckoutRequest.approvalStatus) {
            case 'PENDING':
                return (
                    <button className="w-full bg-yellow-500 text-white py-3 rounded-xl opacity-75">
                        Đang chờ duyệt Late Check-out
                    </button>
                );

            case 'APPROVED':
                return (
                    <button className="w-full bg-green-600 text-white py-3 rounded-xl opacity-75">
                        Late Check-out đã được chấp nhận
                    </button>
                );

            case 'REJECTED':
                return (
                    <button
                        onClick={() => setShowLateModal(true)}
                        className="cursor-pointer w-full bg-white border-2 border-black py-3 rounded-xl"
                    >
                        Gửi lại Late Check-out
                    </button>
                );
        }
    };

    // NOTIFICATION BANNER
    const renderNotification = () => {
        if (!booking) return null;

        // Early Check-in
        if (booking.status === 'PENDING' && earlyCheckinRequest) {
            const req = earlyCheckinRequest;

            if (req.approvalStatus === 'APPROVED') {
                return (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                        <h4 className="font-semibold text-green-800">
                            Early Check-in đã được duyệt
                        </h4>
                        <p className="text-green-600 text-sm">
                            Phí bổ sung: {req.additionalFee.toLocaleString()}{' '}
                            VNĐ
                        </p>
                    </div>
                );
            }

            if (req.approvalStatus === 'REJECTED') {
                return (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <h4 className="font-semibold text-red-800">
                            Early Check-in bị từ chối
                        </h4>
                    </div>
                );
            }

            if (req.approvalStatus === 'PENDING') {
                return (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                        <h4 className="font-semibold text-yellow-800">
                            Early Check-in đang chờ xử lý
                        </h4>
                    </div>
                );
            }
        }

        // Late Check-out
        if (booking.status === 'CHECKED_IN' && lateCheckoutRequest) {
            const req = lateCheckoutRequest;

            if (req.approvalStatus === 'APPROVED') {
                return (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                        <h4 className="font-semibold text-green-800">
                            Late Check-out đã được duyệt
                        </h4>
                        {req.additionalFee > 0 && (
                            <p className="text-green-600 text-sm">
                                Phí bổ sung:{' '}
                                {req.additionalFee.toLocaleString()} VNĐ
                            </p>
                        )}
                    </div>
                );
            }

            if (req.approvalStatus === 'REJECTED') {
                return (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <h4 className="font-semibold text-red-800">
                            Late Check-out bị từ chối
                        </h4>
                    </div>
                );
            }

            if (req.approvalStatus === 'PENDING') {
                return (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                        <h4 className="font-semibold text-yellow-800">
                            Late Check-out đang chờ xử lý
                        </h4>
                    </div>
                );
            }
        }

        return null;
    };

    // LOADING

    if (loading)
        return (
            <div className="min-h-screen flex justify-center items-center text-black">
                Loading...
            </div>
        );

    if (!booking)
        return (
            <div className="min-h-screen flex justify-center items-center text-black">
                Booking Not Found
            </div>
        );

    // MAIN UI

    return (
        <div className="bg-white min-h-screen">
            <div className="bg-white sticky top-0 z-50">
                <Header />
            </div>

            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* BACK */}
                <div className="mb-6">
                    <button
                        onClick={() => window.history.back()}
                        className="text-black flex items-center gap-2 font-medium"
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
                            <span className="font-mono">
                                {booking.bookingID}
                            </span>
                        </p>
                    </div>

                    <span
                        className={`px-5 py-2 rounded-full border-2 text-sm font-semibold ${
                            statusColor[
                                booking.status as keyof typeof statusColor
                            ]
                        }`}
                    >
                        {booking.status.replace('_', ' ')}
                    </span>
                </div>

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* CUSTOMER INFO */}
                        <div className="bg-white border p-6 rounded-2xl">
                            <h3 className="text-xl font-bold mb-4">
                                Customer Information
                            </h3>

                            <div className="space-y-3">
                                <div className="p-3 bg-[#F5F0EB] rounded-lg flex gap-3">
                                    <strong className="min-w-[70px] text-black/70">
                                        Name
                                    </strong>
                                    <span>{booking.customer?.fullName}</span>
                                </div>
                                <div className="p-3 bg-[#F5F0EB] rounded-lg flex gap-3">
                                    <strong className="min-w-[70px] text-black/70">
                                        Phone
                                    </strong>
                                    <span>{booking.customer?.phone}</span>
                                </div>
                                <div className="p-3 bg-[#F5F0EB] rounded-lg flex gap-3">
                                    <strong className="min-w-[70px] text-black/70">
                                        Email
                                    </strong>
                                    <span>{booking.customer?.email}</span>
                                </div>
                            </div>
                        </div>

                        {/* SCHEDULE */}
                        <div className="bg-white border p-6 rounded-2xl">
                            <h3 className="text-xl font-bold mb-4">Schedule</h3>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-[#F5F0EB] p-4 rounded-xl">
                                    <p className="text-black/60 text-sm">
                                        Check-in
                                    </p>
                                    <p className="text-lg font-bold">
                                        {booking.checkInDate.split('T')[0]}
                                    </p>
                                    <p className="text-sm font-semibold">
                                        {booking.checkInDate.split('T')[1]}
                                    </p>
                                </div>

                                <div className="bg-[#F5F0EB] p-4 rounded-xl">
                                    <p className="text-black/60 text-sm">
                                        Check-out
                                    </p>
                                    <p className="text-lg font-bold">
                                        {booking.checkOutDate.split('T')[0]}
                                    </p>
                                    <p className="text-sm font-semibold">
                                        {booking.checkOutDate.split('T')[1]}
                                    </p>
                                </div>
                            </div>

                            <div className="p-3 bg-[#F5F0EB] rounded-lg">
                                <span className="font-semibold">
                                    {booking.numberOfGuests} Guests
                                </span>
                            </div>
                        </div>

                        {/* ROOMS */}
                        <div className="bg-white border p-6 rounded-2xl">
                            <h3 className="text-xl font-bold mb-5">
                                Rooms Booked
                            </h3>

                            <div className="space-y-4">
                                {details.map((detail, i) => (
                                    <div
                                        key={i}
                                        className="bg-[#F5F0EB] p-5 rounded-xl border"
                                    >
                                        <div className="flex justify-between">
                                            <div>
                                                <h4 className="text-lg font-bold">
                                                    Room{' '}
                                                    {detail.room.roomNumber}
                                                </h4>
                                                <p className="text-black/60">
                                                    {
                                                        detail.room.roomType
                                                            ?.typeName
                                                    }
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-sm text-black/60">
                                                    Price
                                                </p>
                                                <p className="text-lg font-bold">
                                                    {detail.roomPrice.toLocaleString()}{' '}
                                                    VNĐ
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 mt-3 overflow-x-auto">
                                            {detail.room.images
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

                    {/* RIGHT — PAYMENT + ACTIONS */}
                    <div className="space-y-6">
                        {/* PAYMENT CARD */}
                        <div className="shadow-2xl bg-[#d8d0c1] text-black p-6 rounded-2xl">
                            <h3 className="text-lg font-semibold mb-6 border-b border-white/20 pb-3">
                                Payment Summary
                            </h3>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-black/70  ">
                                        Subtotal
                                    </span>
                                    <span>
                                        {booking.totalAmount.toLocaleString()}{' '}
                                        VNĐ
                                    </span>
                                </div>

                                {/* Early Check-in Fee */}
                                {earlyCheckinRequest?.approvalStatus ===
                                    'APPROVED' && (
                                    <div className="flex justify-between">
                                        <span className="text-black/70">
                                            Early Check-in Fee
                                        </span>

                                        <span>
                                            {earlyCheckinRequest.additionalFee.toLocaleString()}{' '}
                                            VNĐ
                                        </span>
                                    </div>
                                )}

                                {/* Late Checkout Fee — THÊM MỚI */}
                                {lateCheckoutRequest?.approvalStatus ===
                                    'APPROVED' && (
                                    <div className="flex justify-between">
                                        <span className="text-black/70">
                                            Late Check-out Fee
                                        </span>
                                        <span>
                                            {lateCheckoutRequest.additionalFee.toLocaleString()}{' '}
                                            VNĐ
                                        </span>
                                    </div>
                                )}

                                {/* Refund Information - Hiển thị khi booking bị hủy */}
                                {booking.status === 'CANCELLED' && (
                                    <div className="flex justify-between text-red-600">
                                        <span className="font-medium">
                                            Refund (
                                            {(() => {
                                                const checkInDate = new Date(
                                                    booking.checkInDate,
                                                );
                                                const now = new Date();
                                                const daysUntilCheckin =
                                                    Math.ceil(
                                                        (checkInDate.getTime() -
                                                            now.getTime()) /
                                                            (1000 *
                                                                60 *
                                                                60 *
                                                                24),
                                                    );

                                                if (
                                                    booking.status ===
                                                    'CANCELLED'
                                                ) {
                                                    if (daysUntilCheckin >= 7)
                                                        return '100%';
                                                    else if (
                                                        daysUntilCheckin >= 3
                                                    )
                                                        return '50%';
                                                    else return '0%';
                                                }
                                                return '0%';
                                            })()}
                                            )
                                        </span>
                                        <span className="font-medium">
                                            -
                                            {(() => {
                                                const checkInDate = new Date(
                                                    booking.checkInDate,
                                                );
                                                const now = new Date();
                                                const daysUntilCheckin =
                                                    Math.ceil(
                                                        (checkInDate.getTime() -
                                                            now.getTime()) /
                                                            (1000 *
                                                                60 *
                                                                60 *
                                                                24),
                                                    );

                                                const earlyFee =
                                                    earlyCheckinRequest?.approvalStatus ===
                                                    'APPROVED'
                                                        ? earlyCheckinRequest.additionalFee
                                                        : 0;

                                                const lateFee =
                                                    lateCheckoutRequest?.approvalStatus ===
                                                    'APPROVED'
                                                        ? lateCheckoutRequest.additionalFee
                                                        : 0;

                                                const totalAmount =
                                                    booking.totalAmount +
                                                    earlyFee +
                                                    lateFee;

                                                if (
                                                    booking.status ===
                                                    'CANCELLED'
                                                ) {
                                                    if (daysUntilCheckin >= 7)
                                                        return totalAmount.toLocaleString();
                                                    else if (
                                                        daysUntilCheckin >= 3
                                                    )
                                                        return (
                                                            totalAmount * 0.5
                                                        ).toLocaleString();
                                                    else return '0';
                                                }
                                                return '0';
                                            })()}{' '}
                                            VNĐ
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* TOTAL */}
                            <div className="border-t border-white/20 pt-4 flex justify-between items-center">
                                <span className="text-lg font-semibold">
                                    Total
                                </span>
                                <span className="text-2xl font-bold">
                                    {(() => {
                                        const earlyFee =
                                            earlyCheckinRequest?.approvalStatus ===
                                            'APPROVED'
                                                ? earlyCheckinRequest.additionalFee
                                                : 0;

                                        const lateFee =
                                            lateCheckoutRequest?.approvalStatus ===
                                            'APPROVED'
                                                ? lateCheckoutRequest.additionalFee
                                                : 0;

                                        const originalTotal =
                                            booking.totalAmount +
                                            earlyFee +
                                            lateFee;

                                        // Nếu booking bị hủy, trừ đi phần refund
                                        if (booking.status === 'CANCELLED') {
                                            const checkInDate = new Date(
                                                booking.checkInDate,
                                            );
                                            const now = new Date();
                                            const daysUntilCheckin = Math.ceil(
                                                (checkInDate.getTime() -
                                                    now.getTime()) /
                                                    (1000 * 60 * 60 * 24),
                                            );

                                            if (daysUntilCheckin >= 7)
                                                return '0'; // Hoàn 100% = còn lại 0
                                            else if (daysUntilCheckin >= 3)
                                                return (
                                                    originalTotal * 0.5
                                                ).toLocaleString();
                                            // Hoàn 50% = còn lại 50%
                                            else
                                                return originalTotal.toLocaleString(); // Không hoàn = còn lại 100%
                                        }

                                        // Nếu booking bình thường
                                        return originalTotal.toLocaleString();
                                    })()}{' '}
                                    VNĐ
                                </span>
                            </div>
                        </div>

                        {/* QUICK ACTIONS */}
                        <div className="bg-white border p-6 rounded-2xl">
                            <h3 className="text-lg font-bold mb-4">
                                Quick Actions
                            </h3>

                            <div className="space-y-3">
                                {renderEarlyCheckinButton()}
                                {renderLateCheckoutButton()}

                                {/* Báo cáo sự cố - Available for CHECKED_IN bookings */}
                                {booking?.status === 'CHECKED_IN' && (
                                    <button
                                        onClick={handleIncidentReport}
                                        className="cursor-pointer w-full hover:text-amber-500 text-black border py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <i className="fas fa-exclamation-triangle"></i>
                                        Report Incident
                                    </button>
                                )}

                                {/* Hủy booking - Available only for PENDING bookings */}
                                {canCancelBooking() && (
                                    <button
                                        onClick={handleCancelBooking}
                                        className="cursor-pointer border border-black w-full text-black hover:bg-white hover:text-red-600 hover:border-red-600 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
                                    >
                                        Cancel Booking
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Early Check-in Modal */}
            {showEarlyModal && (
                <EarlyCheckinModal
                    booking={booking}
                    onClose={async () => {
                        setShowEarlyModal(false);
                        const updated = await getBookingById(id!);
                        setBooking(updated);
                    }}
                />
            )}

            {/* Late Checkout Modal */}
            {showLateModal && (
                <LateCheckoutModal
                    booking={booking}
                    onClose={async () => {
                        setShowLateModal(false);
                        const updated = await getBookingById(id!);
                        setBooking(updated);
                    }}
                />
            )}

            {/* Incident Report Modal */}
            {showIncidentModal && (
                <IncidentReportModal
                    booking={booking}
                    onClose={() => setShowIncidentModal(false)}
                />
            )}

            {/* Cancel Booking Modal */}
            {showCancelModal && (
                <CancelBookingModal
                    booking={booking}
                    onClose={() => setShowCancelModal(false)}
                    onSuccess={async () => {
                        setShowCancelModal(false);
                        const updated = await getBookingById(id!);
                        setBooking(updated);
                    }}
                />
            )}
        </div>
    );
}
