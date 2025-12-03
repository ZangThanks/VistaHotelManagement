/* eslint-disable */
import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';

import { getBookingById } from '../../services/bookingService';
import { getAllEarlyCheckins } from '../../services/earlyCheckinService';
import { getAllLateCheckouts } from '../../services/lateCheckoutService';

import EarlyCheckinModal from '../../components/checkin/EarlyCheckinModal';
import LateCheckoutModal from '../../components/checkout/LateCheckoutModal';
import { MdRoomService } from 'react-icons/md';
import { FiCheck, FiClock, FiX, FiPackage } from 'react-icons/fi';

import type { Booking } from '../../types/Booking';
import type { BookingDetail } from '../../types/BookingDetail';
import type { BookingService } from '../../types/BookingService';
import type { EarlyCheckinResponse } from '../../types/EarlyCheckin';
import type { LateCheckout } from '../../types/LateCheckout';

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
    const [services, setServices] = useState<BookingService[]>([]);
    // mapping serviceKey -> roomNumber (frontend only, editable)
    const [serviceRoomAssignments, setServiceRoomAssignments] = useState<
        Record<string, string>
    >({});
    // track dropdown open state per service
    const [openRoomDropdowns, setOpenRoomDropdowns] = useState<
        Record<string, boolean>
    >({});
    const [loading, setLoading] = useState(true);

    const [earlyCheckinRequest, setEarlyCheckinRequest] =
        useState<EarlyCheckinResponse | null>(null);

    const [lateCheckoutRequest, setLateCheckoutRequest] =
        useState<LateCheckout | null>(null);

    const [showEarlyModal, setShowEarlyModal] = useState(false);
    const [showLateModal, setShowLateModal] = useState(false);

    const handleLateCheckoutClick = () => {
        console.log('Late checkout modal chưa làm');
    };

    // Helper to get service status badge
    const getServiceStatusBadge = (status: string) => {
        const statusMap = {
            PLACE: {
                icon: FiClock,
                label: 'Ordered',
                color: 'bg-blue-50 text-blue-700 border-blue-200',
            },
            PREPARING: {
                icon: FiPackage,
                label: 'Preparing',
                color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
            },
            READY: {
                icon: FiCheck,
                label: 'Ready',
                color: 'bg-green-50 text-green-700 border-green-200',
            },
            DELIVERED: {
                icon: FiCheck,
                label: 'Delivered',
                color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            },
            CANCELLED: {
                icon: FiX,
                label: 'Cancelled',
                color: 'bg-rose-50 text-rose-700 border-rose-200',
            },
        };

        const config =
            statusMap[status as keyof typeof statusMap] || statusMap.PLACE;
        const Icon = config.icon;

        return (
            <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${config.color}`}
            >
                <Icon className="w-3.5 h-3.5" />
                {config.label}
            </span>
        );
    };

    // Helper: toggle assignment to ALL or a specific room (frontend-only)
    const toggleServiceApplyAll = (serviceKey: string, applyAll: boolean) => {
        setServiceRoomAssignments((prev) => {
            const bookingRoomNums = (details || []).map((d) =>
                String(d.room?.roomNumber ?? ''),
            );
            const fallback = bookingRoomNums[0] ?? '';
            return {
                ...prev,
                [serviceKey]: applyAll ? 'ALL' : prev[serviceKey] ?? fallback,
            };
        });
        // close dropdown after selection
        setOpenRoomDropdowns((prev) => ({ ...prev, [serviceKey]: false }));
    };

    // Helper: get display label for room assignment
    const getRoomAssignmentLabel = (
        serviceKey: string,
        service: BookingService,
    ) => {
        const assignment =
            serviceRoomAssignments[serviceKey] ??
            service.room?.roomNumber ??
            '';
        if (assignment === 'ALL') {
            const count = (details || []).length;
            return `All Rooms (${count})`;
        }
        const room = details.find(
            (d) => String(d.room.roomNumber) === assignment,
        );
        if (room) {
            return `${assignment} - ${room.room.roomType?.typeName ?? ''}`;
        }
        return assignment || 'Select room';
    };

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('.room-dropdown-container')) {
                setOpenRoomDropdowns({});
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Group services by room — support assignment 'ALL' to duplicate service under every booked room
    const servicesByRoom = services.reduce((acc, service, idx) => {
        const key = (service as any).id ?? String(idx);
        const assignedRoom =
            serviceRoomAssignments[key] ?? service.room?.roomNumber ?? 'N/A';

        // list of booked room numbers
        const bookingRoomNums = (details || []).map((d) =>
            String(d.room?.roomNumber ?? ''),
        );

        if (assignedRoom === 'ALL') {
            // put service under every room in booking
            if (bookingRoomNums.length === 0) {
                if (!acc['N/A']) acc['N/A'] = [];
                acc['N/A'].push(service);
            } else {
                bookingRoomNums.forEach((rn) => {
                    if (!acc[rn]) acc[rn] = [];
                    acc[rn].push(service);
                });
            }
        } else {
            const roomKey = String(assignedRoom ?? 'N/A');
            if (!acc[roomKey]) acc[roomKey] = [];
            acc[roomKey].push(service);
        }
        return acc;
    }, {} as Record<string, BookingService[]>);

    // -------------------------------
    // FETCH BOOKING + CHECKINS + LATE CHECKOUT
    // -------------------------------
    useEffect(() => {
        if (!id) return;

        (async () => {
            try {
                const bookingRes = await getBookingById(id);
                console.log('Fetched booking:', bookingRes);
                setBooking(bookingRes);
                setDetails(bookingRes.bookingDetails || []);
                setServices(bookingRes.bookingServices || []);
                const svc = bookingRes.bookingServices || [];
                setServices(svc);

                // initialize service -> room mapping from backend (use service.id if available, else index)
                const initialAssignments: Record<string, string> = {};
                svc.forEach((s: any, idx: number) => {
                    const k = s.id ?? String(idx);
                    // ensure only rooms from bookingDetails are used; fallback to service.room if present
                    const bookingRoomNums = (
                        bookingRes.bookingDetails || []
                    ).map((d: any) => String(d.room?.roomNumber ?? ''));
                    const defaultRoom =
                        (s.room && String(s.room.roomNumber)) ||
                        bookingRoomNums[0] ||
                        'N/A';
                    // only assign if defaultRoom is in booking rooms
                    initialAssignments[k] = bookingRoomNums.includes(
                        defaultRoom,
                    )
                        ? defaultRoom
                        : bookingRoomNums[0] ?? defaultRoom;
                });
                setServiceRoomAssignments(initialAssignments);

                // -----------------------
                // 🔹 FETCH EARLY CHECKIN
                // -----------------------
                let earlyRequest = null;

                if (bookingRes.earlyCheckin) {
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

                // -----------------------
                // 🔹 FETCH LATE CHECKOUT — real API
                // -----------------------
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

    // -------------------------------
    // BUTTON RENDER LOGIC — EARLY CHECKIN
    // -------------------------------
    const renderEarlyCheckinButton = () => {
        if (!booking || booking.status !== 'PENDING') return null;

        if (!earlyCheckinRequest) {
            return (
                <button
                    onClick={() => setShowEarlyModal(true)}
                    className="w-full bg-black hover:bg-black/90 text-white py-3 rounded-xl"
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
                        className="w-full bg-black text-white py-3 rounded-xl"
                    >
                        Gửi lại Early Check-in
                    </button>
                );
        }
    };

    // -------------------------------
    // BUTTON RENDER LOGIC — LATE CHECKOUT
    // -------------------------------
    const renderLateCheckoutButton = () => {
        if (!booking || booking.status !== 'CHECKED_IN') return null;

        if (!lateCheckoutRequest) {
            return (
                <button
                    onClick={() => setShowLateModal(true)}
                    className="w-full bg-white border-2 border-black py-3 rounded-xl hover:bg-[#F5F0EB]"
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
                        className="w-full bg-white border-2 border-black py-3 rounded-xl"
                    >
                        Gửi lại Late Check-out
                    </button>
                );
        }
    };

    // -------------------------------
    // NOTIFICATION BANNER
    // -------------------------------
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

    // -------------------------------
    // LOADING
    // -------------------------------
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

    // -------------------------------
    // MAIN UI
    // -------------------------------
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

                        {/* SERVICES SECTION */}
                        {services.length > 0 && (
                            <div className="bg-white border p-6 rounded-2xl">
                                <div className="flex items-center gap-3 mb-5">
                                    <div>
                                        <h3 className="text-xl font-bold">
                                            Booking Services
                                        </h3>
                                        <p className="text-sm text-black/60">
                                            {services.length}{' '}
                                            {services.length === 1
                                                ? 'service'
                                                : 'services'}{' '}
                                            ordered
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {Object.entries(servicesByRoom).map(
                                        ([roomNumber, roomServices]) => (
                                            <div
                                                key={roomNumber}
                                                className="bg-[#F5F0EB] p-5 rounded-xl border"
                                            >
                                                {/* Room Header */}
                                                <div className="flex items-center justify-between mb-4 pb-3 border-b border-black/10">
                                                    <h4 className="font-bold text-gray-900">
                                                        Room {roomNumber}
                                                    </h4>
                                                    <span className="text-xs text-black/60 bg-white px-2.5 py-1 rounded-full">
                                                        {roomServices.length}{' '}
                                                        {roomServices.length ===
                                                        1
                                                            ? 'service'
                                                            : 'services'}
                                                    </span>
                                                </div>

                                                {/* Services List */}
                                                <div className="space-y-3">
                                                    {roomServices.map(
                                                        (service, idx) => {
                                                            const key =
                                                                (service as any)
                                                                    .id ??
                                                                String(idx);
                                                            const isDropdownOpen =
                                                                openRoomDropdowns[
                                                                    key
                                                                ] ?? false;
                                                            const currentAssignment =
                                                                serviceRoomAssignments[
                                                                    key
                                                                ] ??
                                                                service.room
                                                                    ?.roomNumber ??
                                                                '';

                                                            return (
                                                                <div
                                                                    key={idx}
                                                                    className="bg-white p-4 rounded-lg border border-gray-200"
                                                                >
                                                                    <div className="flex justify-between items-start mb-2">
                                                                        <div className="flex-1">
                                                                            <h5 className="font-semibold text-gray-900">
                                                                                {service
                                                                                    .service
                                                                                    ?.serviceName ||
                                                                                    'Unknown Service'}
                                                                            </h5>
                                                                            {service
                                                                                .service
                                                                                ?.description && (
                                                                                <p className="text-xs text-black/60 mt-1">
                                                                                    {
                                                                                        service
                                                                                            .service
                                                                                            .description
                                                                                    }
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                        {getServiceStatusBadge(
                                                                            service.orderStatus,
                                                                        )}
                                                                    </div>

                                                                    {/* NEW: Room Assignment Dropdown */}
                                                                    <div className="mt-3 room-dropdown-container">
                                                                        <label className="text-xs font-medium text-gray-700 block mb-1.5">
                                                                            Applied
                                                                            to
                                                                        </label>
                                                                        <div className="relative">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    setOpenRoomDropdowns(
                                                                                        (
                                                                                            prev,
                                                                                        ) => ({
                                                                                            ...prev,
                                                                                            [key]: !prev[
                                                                                                key
                                                                                            ],
                                                                                        }),
                                                                                    )
                                                                                }
                                                                                className="w-full h-10 px-3 border-2 border-gray-300 rounded-lg bg-white hover:border-[#ffe3c6] focus:border-black focus:ring-2 focus:ring-purple-200 flex items-center justify-between transition-all text-sm font-medium text-gray-800"
                                                                            >
                                                                                <span className="truncate">
                                                                                    {getRoomAssignmentLabel(
                                                                                        key,
                                                                                        service,
                                                                                    )}
                                                                                </span>
                                                                                <svg
                                                                                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
                                                                                        isDropdownOpen
                                                                                            ? 'rotate-180'
                                                                                            : ''
                                                                                    }`}
                                                                                    fill="none"
                                                                                    stroke="currentColor"
                                                                                    viewBox="0 0 24 24"
                                                                                >
                                                                                    <path
                                                                                        strokeLinecap="round"
                                                                                        strokeLinejoin="round"
                                                                                        strokeWidth={
                                                                                            2
                                                                                        }
                                                                                        d="M19 9l-7 7-7-7"
                                                                                    />
                                                                                </svg>
                                                                            </button>

                                                                            {isDropdownOpen && (
                                                                                <div className="absolute z-50 mt-2 w-full bg-white border-2 border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                                                                    {/* All Rooms Option */}
                                                                                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2 border-purple-100">
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() =>
                                                                                                toggleServiceApplyAll(
                                                                                                    key,
                                                                                                    true,
                                                                                                )
                                                                                            }
                                                                                            className={`w-full px-4 py-3 text-left transition-colors ${
                                                                                                currentAssignment ===
                                                                                                'ALL'
                                                                                                    ? 'bg-black text-white'
                                                                                                    : 'hover:bg-purple-100'
                                                                                            }`}
                                                                                        >
                                                                                            <div className="flex items-center justify-between">
                                                                                                <div>
                                                                                                    <span className="text-sm font-bold">
                                                                                                        All
                                                                                                        Booked
                                                                                                        Rooms
                                                                                                    </span>
                                                                                                    <p className="text-xs mt-0.5 opacity-90">
                                                                                                        Apply
                                                                                                        to
                                                                                                        all{' '}
                                                                                                        {
                                                                                                            details.length
                                                                                                        }{' '}
                                                                                                        rooms
                                                                                                    </p>
                                                                                                </div>
                                                                                                {currentAssignment ===
                                                                                                    'ALL' && (
                                                                                                    <svg
                                                                                                        className="w-5 h-5"
                                                                                                        fill="currentColor"
                                                                                                        viewBox="0 0 20 20"
                                                                                                    >
                                                                                                        <path
                                                                                                            fillRule="evenodd"
                                                                                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                                                            clipRule="evenodd"
                                                                                                        />
                                                                                                    </svg>
                                                                                                )}
                                                                                            </div>
                                                                                        </button>
                                                                                    </div>

                                                                                    {/* Individual Room Options */}
                                                                                    <div className="max-h-48 overflow-y-auto">
                                                                                        {(
                                                                                            details ||
                                                                                            []
                                                                                        ).map(
                                                                                            (
                                                                                                d,
                                                                                            ) => {
                                                                                                const rn =
                                                                                                    String(
                                                                                                        d
                                                                                                            .room
                                                                                                            .roomNumber,
                                                                                                    );
                                                                                                const isSelected =
                                                                                                    currentAssignment ===
                                                                                                    rn;
                                                                                                return (
                                                                                                    <button
                                                                                                        key={
                                                                                                            rn
                                                                                                        }
                                                                                                        type="button"
                                                                                                        onClick={() => {
                                                                                                            setServiceRoomAssignments(
                                                                                                                (
                                                                                                                    prev,
                                                                                                                ) => ({
                                                                                                                    ...prev,
                                                                                                                    [key]: rn,
                                                                                                                }),
                                                                                                            );
                                                                                                            setOpenRoomDropdowns(
                                                                                                                (
                                                                                                                    prev,
                                                                                                                ) => ({
                                                                                                                    ...prev,
                                                                                                                    [key]: false,
                                                                                                                }),
                                                                                                            );
                                                                                                        }}
                                                                                                        className={`w-full px-4 py-3 text-left transition-colors ${
                                                                                                            isSelected
                                                                                                                ? 'bg-purple-50 text-black'
                                                                                                                : 'hover:bg-gray-50'
                                                                                                        }`}
                                                                                                    >
                                                                                                        <div className="flex items-center justify-between">
                                                                                                            <div>
                                                                                                                <span className="text-sm font-semibold">
                                                                                                                    Room{' '}
                                                                                                                    {
                                                                                                                        rn
                                                                                                                    }
                                                                                                                </span>
                                                                                                                <p className="text-xs text-gray-500 mt-0.5">
                                                                                                                    {d
                                                                                                                        .room
                                                                                                                        .roomType
                                                                                                                        ?.typeName ??
                                                                                                                        ''}
                                                                                                                </p>
                                                                                                            </div>
                                                                                                            {isSelected && (
                                                                                                                <svg
                                                                                                                    className="w-5 h-5 text-black"
                                                                                                                    fill="currentColor"
                                                                                                                    viewBox="0 0 20 20"
                                                                                                                >
                                                                                                                    <path
                                                                                                                        fillRule="evenodd"
                                                                                                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                                                                                        clipRule="evenodd"
                                                                                                                    />
                                                                                                                </svg>
                                                                                                            )}
                                                                                                        </div>
                                                                                                    </button>
                                                                                                );
                                                                                            },
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <p className="text-xs text-gray-500 mt-1.5">
                                                                            Select
                                                                            which
                                                                            room(s)
                                                                            this
                                                                            service
                                                                            applies
                                                                            to
                                                                        </p>
                                                                    </div>

                                                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                                                                        <div className="flex items-center gap-4 text-xs text-black/60">
                                                                            <span>
                                                                                Qty:{' '}
                                                                                {
                                                                                    service.quantity
                                                                                }
                                                                            </span>

                                                                            {service.paymentMethod && (
                                                                                <>
                                                                                    <span className="w-px h-4 bg-gray-300"></span>
                                                                                    <span className="uppercase">
                                                                                        {service.paymentMethod.replace(
                                                                                            '_',
                                                                                            ' ',
                                                                                        )}
                                                                                    </span>
                                                                                </>
                                                                            )}
                                                                        </div>

                                                                        <div className="text-right">
                                                                            {service.servicePrice !==
                                                                                service.totalAmount && (
                                                                                <p className="text-xs text-black/40 line-through">
                                                                                    {service.servicePrice.toLocaleString()}{' '}
                                                                                    VNĐ
                                                                                </p>
                                                                            )}
                                                                            <p className="text-lg font-bold text-black">
                                                                                {service.totalAmount.toLocaleString()}{' '}
                                                                                VNĐ
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        },
                                                    )}
                                                </div>

                                                {/* Room Total */}
                                                <div className="mt-4 pt-3 border-t border-black/10 flex justify-between items-center">
                                                    <span className="text-sm font-semibold text-black/70">
                                                        Room {roomNumber}{' '}
                                                        Services Total
                                                    </span>
                                                    <span className="text-lg font-bold text-red-600">
                                                        {roomServices
                                                            .reduce(
                                                                (sum, s) =>
                                                                    sum +
                                                                    s.totalAmount,
                                                                0,
                                                            )
                                                            .toLocaleString()}{' '}
                                                        VNĐ
                                                    </span>
                                                </div>
                                            </div>
                                        ),
                                    )}

                                    {/* Overall Services Total */}
                                    {Object.keys(servicesByRoom).length > 1 && (
                                        <div className="bg-green-50 p-5 rounded-xl border-2 border-green-200">
                                            <div className="flex justify-between items-center">
                                                <span className="text-base font-bold text-gray-900">
                                                    Total Services Cost
                                                </span>
                                                <span className="text-2xl font-bold text-red-600">
                                                    {services
                                                        .reduce(
                                                            (sum, s) =>
                                                                sum +
                                                                s.totalAmount,
                                                            0,
                                                        )
                                                        .toLocaleString()}{' '}
                                                    VNĐ
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT — PAYMENT + ACTIONS */}
                    <div className="space-y-6">
                        {/* PAYMENT CARD */}
                        <div className="bg-black text-white p-6 rounded-2xl">
                            <h3 className="text-lg font-semibold mb-6 border-b border-white/20 pb-3">
                                Payment Summary
                            </h3>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-white/70">
                                        Subtotal
                                    </span>
                                    <span>
                                        {booking.totalAmount.toLocaleString()}{' '}
                                        VNĐ
                                    </span>
                                </div>

                                {/* Services Fee */}
                                {services.length > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-white/70">
                                            Services ({services.length})
                                        </span>
                                        <span>
                                            {services
                                                .reduce(
                                                    (sum, s) =>
                                                        sum + s.totalAmount,
                                                    0,
                                                )
                                                .toLocaleString()}{' '}
                                            VNĐ
                                        </span>
                                    </div>
                                )}

                                {/* Early Check-in Fee */}
                                {earlyCheckinRequest?.approvalStatus ===
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

                                {/* ⭐ Late Checkout Fee — THÊM MỚI ⭐ */}
                                {lateCheckoutRequest?.approvalStatus ===
                                    'APPROVED' && (
                                    <div className="flex justify-between">
                                        <span className="text-white/70">
                                            Late Check-out Fee
                                        </span>
                                        <span>
                                            {lateCheckoutRequest.additionalFee.toLocaleString()}{' '}
                                            VNĐ
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between">
                                    <span className="text-white/70">
                                        Tax (10%)
                                    </span>
                                    <span>
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

                                            const servicesFee = services.reduce(
                                                (sum, s) => sum + s.totalAmount,
                                                0,
                                            );

                                            return (
                                                (booking.totalAmount +
                                                    earlyFee +
                                                    lateFee +
                                                    servicesFee) *
                                                0.1
                                            ).toLocaleString();
                                        })()}{' '}
                                        VNĐ
                                    </span>
                                </div>
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

                                        const servicesFee = services.reduce(
                                            (sum, s) => sum + s.totalAmount,
                                            0,
                                        );

                                        return (
                                            (booking.totalAmount +
                                                earlyFee +
                                                lateFee +
                                                servicesFee) *
                                            1.1
                                        ).toLocaleString();
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

            {/* Early Check-in Modal */}
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
        </div>
    );
}
