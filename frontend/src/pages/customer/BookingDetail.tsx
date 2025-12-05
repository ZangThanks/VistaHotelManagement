/* eslint-disable */
import React from 'react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';

import {
    getBookingById,
    saveBookingWithDetails,
} from '../../services/bookingService';
import { getAll as getAllServices } from '../../services/serviceService';
import { getAllEarlyCheckins } from '../../services/earlyCheckinService';
import { getAllLateCheckouts } from '../../services/lateCheckoutService';

import EarlyCheckinModal from '../../components/checkin/EarlyCheckinModal';
import LateCheckoutModal from '../../components/checkout/LateCheckoutModal';
import { MdRoomService } from 'react-icons/md';
import { FiCheck, FiClock, FiX, FiPackage } from 'react-icons/fi';

import type { Booking } from '../../types/Booking';
import type { BookingDetail } from '../../types/BookingDetail';
import type { BookingService } from '../../types/BookingService';
import type { Service } from '../../types/Service';
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
    // Service Picker modal state
    const [showServicePicker, setShowServicePicker] = useState(false);
    const [availableServices, setAvailableServices] = useState<Service[]>([]);
    const [servicesLoading, setServicesLoading] = useState(false);
    const [servicesError, setServicesError] = useState<string | null>(null);
    // Selected services to add: serviceID -> {service, quantity, applyTo (UI only)}
    const [selectedServices, setSelectedServices] = useState<
        Record<string, { service: Service; quantity: number; applyTo: string }>
    >({});

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

    // -------------------------------
    // SERVICE PICKER HANDLERS
    // -------------------------------
    // Load modal: prefill Selected với toàn bộ services hiện có
    const openServicePicker = async () => {
        setShowServicePicker(true);
        const existingSelected: Record<
            string,
            { service: Service; quantity: number; applyTo: string }
        > = {};
        services.forEach((bs, idx) => {
            if (bs.service) {
                const fakeRoomIndex = idx % details.length;
                const assignedRoom = details[fakeRoomIndex]?.room;
                const roomNumber = assignedRoom?.roomNumber
                    ? String(assignedRoom.roomNumber)
                    : 'ALL';
                existingSelected[bs.service.serviceID] = {
                    service: bs.service,
                    quantity: bs.quantity,
                    applyTo: roomNumber,
                };
            }
        });
        setSelectedServices(existingSelected);

        if (availableServices.length === 0) {
            setServicesLoading(true);
            setServicesError(null);
            try {
                const list = await getAllServices();
                setAvailableServices(Array.isArray(list) ? list : []);
            } catch (e: any) {
                setServicesError(e?.message || 'Failed to load services');
            } finally {
                setServicesLoading(false);
            }
        }
    };

    const closeServicePicker = () => {
        setShowServicePicker(false);
        setSelectedServices({});
    };

    const handleAddToSelected = (svc: Service) => {
        setSelectedServices((prev) => {
            if (prev[svc.serviceID]) {
                // If already exists, increment quantity
                const q = prev[svc.serviceID].quantity + 1;
                return {
                    ...prev,
                    [svc.serviceID]: { ...prev[svc.serviceID], quantity: q },
                };
            }
            // New service - use first room or ALL
            const firstRoom = details[0]?.room?.roomNumber
                ? String(details[0].room.roomNumber)
                : 'ALL';
            return {
                ...prev,
                [svc.serviceID]: {
                    service: svc,
                    quantity: 1,
                    applyTo: firstRoom,
                },
            };
        });
    };

    const handleRemoveSelected = (serviceID: string) => {
        setSelectedServices((prev) => {
            const current = prev[serviceID];
            if (!current) return prev;

            // If quantity > 1, decrement instead of removing
            if (current.quantity > 1) {
                return {
                    ...prev,
                    [serviceID]: { ...current, quantity: current.quantity - 1 },
                };
            }

            // Only remove if quantity is 1
            const next = { ...prev };
            delete next[serviceID];
            return next;
        });
    };

    const handleChangeQty = (serviceID: string, qty: number) => {
        setSelectedServices((prev) => {
            if (!prev[serviceID]) return prev;
            return {
                ...prev,
                [serviceID]: { ...prev[serviceID], quantity: Math.max(1, qty) },
            };
        });
    };

    const handleChangeApplyTo = (serviceID: string, value: string) => {
        setSelectedServices((prev) => {
            if (!prev[serviceID]) return prev;
            return {
                ...prev,
                [serviceID]: { ...prev[serviceID], applyTo: value },
            };
        });
    };

    // Helper: refresh booking and services from backend
    const refreshBooking = async () => {
        if (!id) return;
        const updated = await getBookingById(id);
        setBooking(updated);
        setDetails(updated.bookingDetails || []);
        setServices(updated.bookingServices || []);
    };

    // Lưu: gửi toàn bộ selectedServices (cũ + mới), không chỉ dịch vụ mới
    const saveSelectedServices = async () => {
        if (!id || !booking) return;

        // Map hiện có: serviceID -> BookingService (từ backend)
        const existingMap = new Map<string, BookingService>();
        services.forEach((bs) => {
            const sid = bs.service?.serviceID;
            if (sid) existingMap.set(sid, bs);
        });

        // mergedMap lưu thêm bookingServiceId (id của bản ghi booking_service nếu có)
        const mergedMap = new Map<
            string,
            {
                bookingServiceId?: number | string | null;
                service: Service;
                servicePrice: number;
                quantity: number;
                totalAmount: number;
                orderStatus:
                    | 'PLACE'
                    | 'PREPARING'
                    | 'READY'
                    | 'DELIVERED'
                    | 'CANCELLED';
                paymentMethod: string;
            }
        >();

        // Bước 1: bắt đầu từ dịch vụ cũ (giữ nguyên bookingServiceId nếu có)
        for (const [sid, bs] of existingMap.entries()) {
            const svc = bs.service!;
            mergedMap.set(sid, {
                bookingServiceId: (bs as any).id ?? null,
                service: svc,
                servicePrice: bs.servicePrice ?? svc.price ?? 0,
                quantity: bs.quantity ?? 1,
                totalAmount:
                    bs.totalAmount ?? (svc.price ?? 0) * (bs.quantity ?? 1),
                orderStatus: bs.orderStatus ?? 'PLACE',
                paymentMethod:
                    bs.paymentMethod || booking.paymentMethod || 'VNPAY_QR',
            });
        }

        // Bước 2: overlay bằng dịch vụ đang chọn trong modal (cũ + mới)
        for (const [sid, sel] of Object.entries(selectedServices)) {
            const svc = sel.service;
            const unit = svc.price ?? 0;

            // if service already exists in mergedMap, keep its bookingServiceId
            const existing = mergedMap.get(sid);
            mergedMap.set(sid, {
                bookingServiceId: existing?.bookingServiceId ?? null,
                service: {
                    serviceID: svc.serviceID,
                    serviceName: svc.serviceName,
                    description: svc.description,
                    price: svc.price,
                    availability: svc.availability,
                    serviceHours: svc.serviceHours,
                    serviceCategory: svc.serviceCategory,
                    images: svc.images,
                },
                servicePrice: unit,
                quantity: sel.quantity,
                totalAmount: unit * sel.quantity,
                orderStatus: existing?.orderStatus ?? 'PLACE',
                paymentMethod: booking.paymentMethod || 'VNPAY_QR',
            });
        }

        // Chuẩn hóa payload theo BE — include bookingServiceId nếu có (field name "id")
        const allServicesPayload = Array.from(mergedMap.entries()).map(
            ([serviceId, m]) => ({
                // include backend booking_service id if exists so BE can update instead of recreate
                ...(m.bookingServiceId ? { id: m.bookingServiceId } : {}),
                service: m.service,
                servicePrice: m.servicePrice,
                quantity: m.quantity,
                totalAmount: m.totalAmount,
                orderStatus: m.orderStatus,
                paymentMethod: m.paymentMethod,
            }),
        );

        try {
            await saveBookingWithDetails(
                // Booking - giữ nguyên tất cả thông tin
                {
                    bookingID: booking.bookingID,
                    customer: booking.customer,
                    checkInDate: booking.checkInDate,
                    checkOutDate: booking.checkOutDate,
                    numberOfGuests: booking.numberOfGuests,
                    totalAmount: booking.totalAmount,
                    paymentMethod: booking.paymentMethod,
                    status: booking.status,
                },
                // BookingDetails - giữ nguyên
                details.map((d) => ({
                    room: { roomNumber: d.room.roomNumber },
                    roomPrice: d.roomPrice,
                })),
                // Gửi đầy đủ dịch vụ đã merge (có id nếu là service cũ)
                allServicesPayload,
            );
        } catch (err) {
            console.error('Failed to save services:', err);
            alert('Failed to save services. Please try again.');
            return;
        }

        await refreshBooking(); // reload to rerender
        setShowServicePicker(false);
        setSelectedServices({});
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
                        {/* <p className="text-green-600 text-sm">
                            Phí bổ sung: {req.additionalFee.toLocaleString()}{' '}
                            VNĐ
                        </p> */}
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
                        {/* {req.additionalFee > 0 && (
                            <p className="text-green-600 text-sm">
                                Phí bổ sung:{' '}
                                {req.additionalFee.toLocaleString()} VNĐ
                            </p>
                        )} */}
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
                                                {/* <p className="text-lg font-bold">
                                                    {detail.roomPrice.toLocaleString()}{' '}
                                                    VNĐ
                                                </p> */}
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

                                            {/* Fake room assignment: pick a random booked room */}
                                            {details.length > 1 && (
                                                <div className="flex items-center text-xs text-black/50">
                                                    <span className="mr-1">
                                                        |
                                                    </span>
                                                    <span>
                                                        Assigned to:{' '}
                                                        {detail.room.roomNumber}{' '}
                                                        -{' '}
                                                        {
                                                            detail.room.roomType
                                                                ?.typeName
                                                        }
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* SERVICES SECTION */}
                        <div className="bg-white border p-6 rounded-2xl">
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center">
                                        <MdRoomService className="w-5 h-5 text-white" />
                                    </div>
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
                                <button
                                    type="button"
                                    onClick={openServicePicker}
                                    className="px-3 py-2 rounded-lg text-xs font-semibold bg-black text-white hover:bg-black/90"
                                >
                                    + Add Service
                                </button>
                            </div>

                            {/* Services List */}
                            {services.length > 0 ? (
                                <div className="space-y-4">
                                    {services.map((service, idx) => {
                                        // Fake room assignment: pick a random booked room
                                        const fakeRoomIndex =
                                            idx % details.length;
                                        const assignedRoom =
                                            details[fakeRoomIndex]?.room;

                                        return (
                                            <div
                                                key={idx}
                                                className="bg-[#F5F0EB] p-5 rounded-xl border"
                                            >
                                                {/* Service Header */}
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex-1">
                                                        <h5 className="font-semibold text-gray-900 text-lg">
                                                            {service.service
                                                                ?.serviceName ||
                                                                'Unknown Service'}
                                                        </h5>
                                                        {service.service
                                                            ?.description && (
                                                            <p className="text-sm text-black/60 mt-1">
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

                                                {/* Service Image */}
                                                {service.service?.images &&
                                                    service.service.images
                                                        .length > 0 && (
                                                        <div className="mb-4">
                                                            <img
                                                                src={
                                                                    service
                                                                        .service
                                                                        .images[0]
                                                                }
                                                                alt={
                                                                    service
                                                                        .service
                                                                        .serviceName
                                                                }
                                                                className="w-full h-40 object-cover rounded-lg border"
                                                            />
                                                        </div>
                                                    )}

                                                {/* Room Assignment (Fake Data) */}
                                                <div className="mb-3 p-3 bg-white rounded-lg border border-purple-200">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <span className="text-gray-600 font-medium">
                                                            Applied to:
                                                        </span>
                                                        <span className="font-semibold text-black">
                                                            Room{' '}
                                                            {assignedRoom?.roomNumber ||
                                                                'N/A'}
                                                        </span>
                                                        {assignedRoom?.roomType
                                                            ?.typeName && (
                                                            <span className="text-gray-500">
                                                                -{' '}
                                                                {
                                                                    assignedRoom
                                                                        .roomType
                                                                        .typeName
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Service Details */}
                                                <div className="grid grid-cols-2 gap-3 mb-3">
                                                    <div className="bg-white p-3 rounded-lg border">
                                                        <p className="text-xs text-gray-500">
                                                            Quantity
                                                        </p>
                                                        <p className="text-lg font-bold text-black">
                                                            {service.quantity}
                                                        </p>
                                                    </div>
                                                    <div className="bg-white p-3 rounded-lg border">
                                                        <p className="text-xs text-gray-500">
                                                            Unit Price
                                                        </p>
                                                        <p className="text-lg font-bold text-black">
                                                            {service.servicePrice?.toLocaleString() ||
                                                                '0'}{' '}
                                                            VNĐ
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Service Footer */}
                                                <div className="flex items-center justify-between pt-3 border-t border-black/10">
                                                    <div className="flex items-center gap-3">
                                                        {service.service
                                                            ?.serviceCategory && (
                                                            <span className="text-xs px-2.5 py-1 bg-white border rounded-full text-gray-700">
                                                                {service.service.serviceCategory.replace(
                                                                    '_',
                                                                    ' ',
                                                                )}
                                                            </span>
                                                        )}
                                                        {service.paymentMethod && (
                                                            <span className="text-xs text-gray-500">
                                                                {service.paymentMethod.replace(
                                                                    '_',
                                                                    ' ',
                                                                )}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-500">
                                                            Total
                                                        </p>
                                                        <p className="text-xl font-bold text-red-600">
                                                            {service.totalAmount?.toLocaleString() ||
                                                                '0'}{' '}
                                                            VNĐ
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Total Services Cost */}
                                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-xl border-2 border-purple-200">
                                        <div className="flex justify-between items-center">
                                            <span className="text-base font-bold text-gray-900">
                                                Total Services Cost
                                            </span>
                                            <span className="text-2xl font-bold text-red-600">
                                                {services
                                                    .reduce(
                                                        (sum, s) =>
                                                            sum +
                                                            (s.totalAmount ||
                                                                0),
                                                        0,
                                                    )
                                                    .toLocaleString()}{' '}
                                                VNĐ
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                                    <MdRoomService className="w-16 h-16 mx-auto text-gray-300 mb-3" />
                                    <p className="text-gray-500 font-medium">
                                        No services ordered yet
                                    </p>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Click "Add Service" to order room
                                        services
                                    </p>
                                </div>
                            )}
                        </div>
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
                                    {/* <span>
                                        {booking.totalAmount.toLocaleString()} VNĐ
                                    </span> */}
                                </div>

                                {/* Services Fee */}
                                {services.length > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-white/70">
                                            Services ({services.length})
                                        </span>
                                        {/* <span>
                                        {services
                                            .reduce(
                                                (sum, s) => sum + s.totalAmount,
                                                0,
                                            )
                                            // .toLocaleString()}{' '}
                                        VNĐ
                                    </span> */}
                                    </div>
                                )}

                                {/* Early Check-in Fee */}
                                {earlyCheckinRequest?.approvalStatus ===
                                    'APPROVED' && (
                                    <div className="flex justify-between">
                                        <span className="text-white/70">
                                            Early Check-in Fee
                                        </span>

                                        {/* <span>
                                        {earlyCheckinRequest.additionalFee.toLocaleString()}{' '}
                                        VNĐ
                                    </span> */}
                                    </div>
                                )}

                                {/* Late Checkout Fee */}
                                {lateCheckoutRequest?.approvalStatus ===
                                    'APPROVED' && (
                                    <div className="flex justify-between">
                                        <span className="text-white/70">
                                            Late Check-out Fee
                                        </span>
                                        {/* <span>
                                        {lateCheckoutRequest.additionalFee.toLocaleString()}{' '}
                                        VNĐ
                                    </span> */}
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
                                            );
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
                                        );
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
                {/* Service Picker Modal */}
                {showServicePicker && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={closeServicePicker}
                        />
                        <div className="relative bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden">
                            {/* Header - More Elegant */}
                            <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                                            Select Premium Services
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Enhance your stay with our exclusive
                                            offerings
                                        </p>
                                    </div>
                                    <button
                                        onClick={closeServicePicker}
                                        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200 hover:rotate-90"
                                    >
                                        <FiX className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>
                            </div>

                            {/* Body - Enhanced Layout */}
                            <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 max-h-[70vh] overflow-auto bg-gray-50">
                                {/* Available Services - Premium Card Design */}
                                <div>
                                    <div className="flex items-center justify-between mb-5">
                                        <h4 className="text-lg font-bold text-gray-900">
                                            Available Services
                                        </h4>
                                        <span className="text-xs font-medium text-gray-500 bg-white px-3 py-1 rounded-full border">
                                            {availableServices.length} services
                                        </span>
                                    </div>

                                    {servicesLoading && (
                                        <div className="flex items-center justify-center py-12">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                                        </div>
                                    )}
                                    {servicesError && (
                                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                                            <p className="text-sm text-red-600">
                                                {servicesError}
                                            </p>
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        {availableServices.map((svc) => {
                                            const selected =
                                                selectedServices[svc.serviceID];
                                            return (
                                                <div
                                                    key={svc.serviceID}
                                                    className={`group relative bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                                                        selected
                                                            ? 'border-black shadow-lg scale-[1.02]'
                                                            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                                                    }`}
                                                >
                                                    {/* Selected Badge */}
                                                    {selected && (
                                                        <div className="absolute top-3 right-3 z-10">
                                                            <div className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                                                                <FiCheck className="w-3 h-3" />
                                                                Selected
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="p-5">
                                                        <div className="flex gap-4">
                                                            {/* Service Image */}
                                                            {svc.images &&
                                                                svc.images
                                                                    .length >
                                                                    0 && (
                                                                    <div className="flex-shrink-0">
                                                                        <img
                                                                            src={
                                                                                svc
                                                                                    .images[0]
                                                                            }
                                                                            alt={
                                                                                svc.serviceName
                                                                            }
                                                                            className="w-20 h-20 rounded-xl object-cover border border-gray-200"
                                                                        />
                                                                    </div>
                                                                )}

                                                            {/* Service Info */}
                                                            <div className="flex-1 min-w-0">
                                                                <h5 className="font-bold text-gray-900 text-base mb-1 truncate">
                                                                    {
                                                                        svc.serviceName
                                                                    }
                                                                </h5>
                                                                {svc.description && (
                                                                    <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                                                                        {
                                                                            svc.description
                                                                        }
                                                                    </p>
                                                                )}
                                                                <div className="flex items-center gap-3 mt-2">
                                                                    <span className="text-lg font-bold text-black">
                                                                        {svc.price !=
                                                                        null
                                                                            ? svc.price.toLocaleString()
                                                                            : 'N/A'}{' '}
                                                                        VNĐ
                                                                    </span>
                                                                    {svc.serviceCategory && (
                                                                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full font-medium">
                                                                            {svc.serviceCategory.replace(
                                                                                '_',
                                                                                ' ',
                                                                            )}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Action Button */}
                                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                                            {selected ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleRemoveSelected(
                                                                            svc.serviceID,
                                                                        )
                                                                    }
                                                                    className="w-full py-2.5 text-sm font-semibold border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                                                                >
                                                                    Remove from
                                                                    Selection
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleAddToSelected(
                                                                            svc,
                                                                        )
                                                                    }
                                                                    className="w-full py-2.5 text-sm font-semibold bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
                                                                >
                                                                    Add to
                                                                    Booking
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {availableServices.length === 0 &&
                                            !servicesLoading &&
                                            !servicesError && (
                                                <div className="p-12 text-center bg-white rounded-2xl border-2 border-dashed border-gray-300">
                                                    <MdRoomService className="w-16 h-16 mx-auto text-gray-300 mb-3" />
                                                    <p className="text-gray-500 font-medium">
                                                        No services available
                                                    </p>
                                                </div>
                                            )}
                                    </div>
                                </div>

                                {/* Selected Services - Premium Summary */}
                                <div className="lg:sticky lg:top-0 lg:self-start">
                                    <div className="flex items-center justify-between mb-5">
                                        <h4 className="text-lg font-bold text-gray-900">
                                            Your Selection
                                        </h4>
                                        <span className="text-xs font-medium text-white bg-black px-3 py-1 rounded-full">
                                            {
                                                Object.keys(selectedServices)
                                                    .length
                                            }{' '}
                                            items
                                        </span>
                                    </div>

                                    {Object.keys(selectedServices).length ===
                                    0 ? (
                                        <div className="p-12 text-center bg-white rounded-2xl border-2 border-dashed border-gray-300">
                                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                                <MdRoomService className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <p className="text-gray-500 font-medium mb-1">
                                                No services selected
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                Choose from available services
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {Object.values(
                                                selectedServices,
                                            ).map(
                                                ({
                                                    service,
                                                    quantity,
                                                    applyTo,
                                                }) => (
                                                    <div
                                                        key={service.serviceID}
                                                        className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                                                    >
                                                        <div className="p-5">
                                                            <div className="flex items-start justify-between mb-4">
                                                                <div className="flex-1 min-w-0">
                                                                    <h5 className="font-bold text-gray-900 text-base truncate">
                                                                        {
                                                                            service.serviceName
                                                                        }
                                                                    </h5>
                                                                    <p className="text-sm text-gray-500 mt-1">
                                                                        {service.price !=
                                                                        null
                                                                            ? service.price.toLocaleString()
                                                                            : 'N/A'}{' '}
                                                                        VNĐ ×{' '}
                                                                        {
                                                                            quantity
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleRemoveSelected(
                                                                            service.serviceID,
                                                                        )
                                                                    }
                                                                    className="ml-3 w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors"
                                                                >
                                                                    <FiX className="w-4 h-4" />
                                                                </button>
                                                            </div>

                                                            {/* Quantity Control */}
                                                            <div className="mb-4">
                                                                <label className="text-xs font-semibold text-gray-700 block mb-2">
                                                                    Quantity
                                                                </label>
                                                                <div className="flex items-center gap-3">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleChangeQty(
                                                                                service.serviceID,
                                                                                quantity -
                                                                                    1,
                                                                            )
                                                                        }
                                                                        className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-700 transition-colors"
                                                                    >
                                                                        −
                                                                    </button>
                                                                    <input
                                                                        type="number"
                                                                        min={1}
                                                                        value={
                                                                            quantity
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            handleChangeQty(
                                                                                service.serviceID,
                                                                                Number(
                                                                                    e
                                                                                        .target
                                                                                        .value ||
                                                                                        1,
                                                                                ),
                                                                            )
                                                                        }
                                                                        className="flex-1 text-center text-base font-bold py-2.5 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleChangeQty(
                                                                                service.serviceID,
                                                                                quantity +
                                                                                    1,
                                                                            )
                                                                        }
                                                                        className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-700 transition-colors"
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {/* Room Selection */}
                                                            <div>
                                                                <label className="text-xs font-semibold text-gray-700 block mb-2">
                                                                    Apply to
                                                                    Room
                                                                </label>
                                                                <select
                                                                    value={
                                                                        applyTo
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        handleChangeApplyTo(
                                                                            service.serviceID,
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    className="w-full py-2.5 px-4 border-2 border-gray-200 rounded-xl text-sm font-medium focus:border-black focus:outline-none bg-white"
                                                                >
                                                                    <option value="ALL">
                                                                        All
                                                                        Rooms (
                                                                        {
                                                                            details.length
                                                                        }
                                                                        )
                                                                    </option>
                                                                    {details.map(
                                                                        (d) => {
                                                                            const rn =
                                                                                String(
                                                                                    d
                                                                                        .room
                                                                                        .roomNumber,
                                                                                );
                                                                            return (
                                                                                <option
                                                                                    key={
                                                                                        rn
                                                                                    }
                                                                                    value={
                                                                                        rn
                                                                                    }
                                                                                >
                                                                                    Room{' '}
                                                                                    {
                                                                                        rn
                                                                                    }{' '}
                                                                                    -{' '}
                                                                                    {d
                                                                                        .room
                                                                                        .roomType
                                                                                        ?.typeName ??
                                                                                        ''}
                                                                                </option>
                                                                            );
                                                                        },
                                                                    )}
                                                                </select>
                                                            </div>

                                                            {/* Subtotal */}
                                                            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                                                <span className="text-sm font-medium text-gray-600">
                                                                    Subtotal
                                                                </span>
                                                                <span className="text-lg font-bold text-black">
                                                                    {(
                                                                        (service.price ||
                                                                            0) *
                                                                        quantity
                                                                    ).toLocaleString()}{' '}
                                                                    VNĐ
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ),
                                            )}

                                            {/* Total Summary */}
                                            <div className="bg-gradient-to-br from-black to-gray-800 rounded-2xl p-6 text-white">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm text-white/70 mb-1">
                                                            Total Amount
                                                        </p>
                                                        <p className="text-3xl font-bold">
                                                            {Object.values(
                                                                selectedServices,
                                                            )
                                                                .reduce(
                                                                    (
                                                                        sum,
                                                                        {
                                                                            service,
                                                                            quantity,
                                                                        },
                                                                    ) =>
                                                                        sum +
                                                                        (service.price ||
                                                                            0) *
                                                                            quantity,
                                                                    0,
                                                                )
                                                                .toLocaleString()}{' '}
                                                            VNĐ
                                                        </p>
                                                    </div>
                                                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                                        <MdRoomService className="w-6 h-6" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer - Enhanced Actions */}
                            <div className="px-8 py-6 border-t border-gray-100 bg-white flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    {Object.keys(selectedServices).length >
                                    0 ? (
                                        <span>
                                            <strong className="text-gray-900">
                                                {
                                                    Object.keys(
                                                        selectedServices,
                                                    ).length
                                                }
                                            </strong>{' '}
                                            service(s) selected
                                        </span>
                                    ) : (
                                        <span>Select services to continue</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={closeServicePicker}
                                        className="px-6 py-3 text-sm font-semibold border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={saveSelectedServices}
                                        disabled={
                                            Object.keys(selectedServices)
                                                .length === 0
                                        }
                                        className="px-8 py-3 text-sm font-semibold bg-black text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg disabled:shadow-none"
                                    >
                                        Confirm Services
                                    </button>
                                </div>
                            </div>
                        </div>{' '}
                    </div>
                )}
                ;{/* Early Check-in Modal */}
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
                {/* Service Picker Modal */}
                {showServicePicker && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={closeServicePicker}
                        />
                        <div className="relative bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden">
                            {/* Header - More Elegant */}
                            <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
                                            Select Premium Services
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Enhance your stay with our exclusive
                                            offerings
                                        </p>
                                    </div>
                                    <button
                                        onClick={closeServicePicker}
                                        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all duration-200 hover:rotate-90"
                                    >
                                        <FiX className="w-5 h-5 text-gray-600" />
                                    </button>
                                </div>
                            </div>

                            {/* Body - Enhanced Layout */}
                            <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 max-h-[70vh] overflow-auto bg-gray-50">
                                {/* Available Services - Premium Card Design */}
                                <div>
                                    <div className="flex items-center justify-between mb-5">
                                        <h4 className="text-lg font-bold text-gray-900">
                                            Available Services
                                        </h4>
                                        <span className="text-xs font-medium text-gray-500 bg-white px-3 py-1 rounded-full border">
                                            {availableServices.length} services
                                        </span>
                                    </div>

                                    {servicesLoading && (
                                        <div className="flex items-center justify-center py-12">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                                        </div>
                                    )}
                                    {servicesError && (
                                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                                            <p className="text-sm text-red-600">
                                                {servicesError}
                                            </p>
                                        </div>
                                    )}

                                    <div className="space-y-3">
                                        {availableServices.map((svc) => {
                                            const selected =
                                                selectedServices[svc.serviceID];
                                            return (
                                                <div
                                                    key={svc.serviceID}
                                                    className={`group relative bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
                                                        selected
                                                            ? 'border-black shadow-lg scale-[1.02]'
                                                            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                                                    }`}
                                                >
                                                    {/* Selected Badge */}
                                                    {selected && (
                                                        <div className="absolute top-3 right-3 z-10">
                                                            <div className="bg-black text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                                                                <FiCheck className="w-3 h-3" />
                                                                Selected
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="p-5">
                                                        <div className="flex gap-4">
                                                            {/* Service Image */}
                                                            {svc.images &&
                                                                svc.images
                                                                    .length >
                                                                    0 && (
                                                                    <div className="flex-shrink-0">
                                                                        <img
                                                                            src={
                                                                                svc
                                                                                    .images[0]
                                                                            }
                                                                            alt={
                                                                                svc.serviceName
                                                                            }
                                                                            className="w-20 h-20 rounded-xl object-cover border border-gray-200"
                                                                        />
                                                                    </div>
                                                                )}

                                                            {/* Service Info */}
                                                            <div className="flex-1 min-w-0">
                                                                <h5 className="font-bold text-gray-900 text-base mb-1 truncate">
                                                                    {
                                                                        svc.serviceName
                                                                    }
                                                                </h5>
                                                                {svc.description && (
                                                                    <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                                                                        {
                                                                            svc.description
                                                                        }
                                                                    </p>
                                                                )}
                                                                <div className="flex items-center gap-3 mt-2">
                                                                    <span className="text-lg font-bold text-black">
                                                                        {svc.price !=
                                                                        null
                                                                            ? svc.price.toLocaleString()
                                                                            : 'N/A'}{' '}
                                                                        VNĐ
                                                                    </span>
                                                                    {svc.serviceCategory && (
                                                                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full font-medium">
                                                                            {svc.serviceCategory.replace(
                                                                                '_',
                                                                                ' ',
                                                                            )}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Action Button */}
                                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                                            {selected ? (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleRemoveSelected(
                                                                            svc.serviceID,
                                                                        )
                                                                    }
                                                                    className="w-full py-2.5 text-sm font-semibold border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                                                                >
                                                                    Remove from
                                                                    Selection
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleAddToSelected(
                                                                            svc,
                                                                        )
                                                                    }
                                                                    className="w-full py-2.5 text-sm font-semibold bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
                                                                >
                                                                    Add to
                                                                    Booking
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {availableServices.length === 0 &&
                                            !servicesLoading &&
                                            !servicesError && (
                                                <div className="p-12 text-center bg-white rounded-2xl border-2 border-dashed border-gray-300">
                                                    <MdRoomService className="w-16 h-16 mx-auto text-gray-300 mb-3" />
                                                    <p className="text-gray-500 font-medium">
                                                        No services available
                                                    </p>
                                                </div>
                                            )}
                                    </div>
                                </div>

                                {/* Selected Services - Premium Summary */}
                                <div className="lg:sticky lg:top-0 lg:self-start">
                                    <div className="flex items-center justify-between mb-5">
                                        <h4 className="text-lg font-bold text-gray-900">
                                            Your Selection
                                        </h4>
                                        <span className="text-xs font-medium text-white bg-black px-3 py-1 rounded-full">
                                            {
                                                Object.keys(selectedServices)
                                                    .length
                                            }{' '}
                                            items
                                        </span>
                                    </div>

                                    {Object.keys(selectedServices).length ===
                                    0 ? (
                                        <div className="p-12 text-center bg-white rounded-2xl border-2 border-dashed border-gray-300">
                                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                                                <MdRoomService className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <p className="text-gray-500 font-medium mb-1">
                                                No services selected
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                Choose from available services
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {Object.values(
                                                selectedServices,
                                            ).map(
                                                ({
                                                    service,
                                                    quantity,
                                                    applyTo,
                                                }) => (
                                                    <div
                                                        key={service.serviceID}
                                                        className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                                                    >
                                                        <div className="p-5">
                                                            <div className="flex items-start justify-between mb-4">
                                                                <div className="flex-1 min-w-0">
                                                                    <h5 className="font-bold text-gray-900 text-base truncate">
                                                                        {
                                                                            service.serviceName
                                                                        }
                                                                    </h5>
                                                                    <p className="text-sm text-gray-500 mt-1">
                                                                        {service.price !=
                                                                        null
                                                                            ? service.price.toLocaleString()
                                                                            : 'N/A'}{' '}
                                                                        VNĐ ×{' '}
                                                                        {
                                                                            quantity
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleRemoveSelected(
                                                                            service.serviceID,
                                                                        )
                                                                    }
                                                                    className="ml-3 w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center transition-colors"
                                                                >
                                                                    <FiX className="w-4 h-4" />
                                                                </button>
                                                            </div>

                                                            {/* Quantity Control */}
                                                            <div className="mb-4">
                                                                <label className="text-xs font-semibold text-gray-700 block mb-2">
                                                                    Quantity
                                                                </label>
                                                                <div className="flex items-center gap-3">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleChangeQty(
                                                                                service.serviceID,
                                                                                quantity -
                                                                                    1,
                                                                            )
                                                                        }
                                                                        className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-700 transition-colors"
                                                                    >
                                                                        −
                                                                    </button>
                                                                    <input
                                                                        type="number"
                                                                        min={1}
                                                                        value={
                                                                            quantity
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            handleChangeQty(
                                                                                service.serviceID,
                                                                                Number(
                                                                                    e
                                                                                        .target
                                                                                        .value ||
                                                                                        1,
                                                                                ),
                                                                            )
                                                                        }
                                                                        className="flex-1 text-center text-base font-bold py-2.5 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleChangeQty(
                                                                                service.serviceID,
                                                                                quantity +
                                                                                    1,
                                                                            )
                                                                        }
                                                                        className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-gray-700 transition-colors"
                                                                    >
                                                                        +
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {/* Room Selection */}
                                                            <div>
                                                                <label className="text-xs font-semibold text-gray-700 block mb-2">
                                                                    Apply to
                                                                    Room
                                                                </label>
                                                                <select
                                                                    value={
                                                                        applyTo
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        handleChangeApplyTo(
                                                                            service.serviceID,
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    className="w-full py-2.5 px-4 border-2 border-gray-200 rounded-xl text-sm font-medium focus:border-black focus:outline-none bg-white"
                                                                >
                                                                    <option value="ALL">
                                                                        All
                                                                        Rooms (
                                                                        {
                                                                            details.length
                                                                        }
                                                                        )
                                                                    </option>
                                                                    {details.map(
                                                                        (d) => {
                                                                            const rn =
                                                                                String(
                                                                                    d
                                                                                        .room
                                                                                        .roomNumber,
                                                                                );
                                                                            return (
                                                                                <option
                                                                                    key={
                                                                                        rn
                                                                                    }
                                                                                    value={
                                                                                        rn
                                                                                    }
                                                                                >
                                                                                    Room{' '}
                                                                                    {
                                                                                        rn
                                                                                    }{' '}
                                                                                    -{' '}
                                                                                    {d
                                                                                        .room
                                                                                        .roomType
                                                                                        ?.typeName ??
                                                                                        ''}
                                                                                </option>
                                                                            );
                                                                        },
                                                                    )}
                                                                </select>
                                                            </div>

                                                            {/* Subtotal */}
                                                            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                                                <span className="text-sm font-medium text-gray-600">
                                                                    Subtotal
                                                                </span>
                                                                <span className="text-lg font-bold text-black">
                                                                    {(
                                                                        (service.price ||
                                                                            0) *
                                                                        quantity
                                                                    ).toLocaleString()}{' '}
                                                                    VNĐ
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ),
                                            )}

                                            {/* Total Summary */}
                                            <div className="bg-gradient-to-br from-black to-gray-800 rounded-2xl p-6 text-white">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm text-white/70 mb-1">
                                                            Total Amount
                                                        </p>
                                                        <p className="text-3xl font-bold">
                                                            {Object.values(
                                                                selectedServices,
                                                            )
                                                                .reduce(
                                                                    (
                                                                        sum,
                                                                        {
                                                                            service,
                                                                            quantity,
                                                                        },
                                                                    ) =>
                                                                        sum +
                                                                        (service.price ||
                                                                            0) *
                                                                            quantity,
                                                                    0,
                                                                )
                                                                .toLocaleString()}{' '}
                                                            VNĐ
                                                        </p>
                                                    </div>
                                                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                                        <MdRoomService className="w-6 h-6" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer - Enhanced Actions */}
                            <div className="px-8 py-6 border-t border-gray-100 bg-white flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                    {Object.keys(selectedServices).length >
                                    0 ? (
                                        <span>
                                            <strong className="text-gray-900">
                                                {
                                                    Object.keys(
                                                        selectedServices,
                                                    ).length
                                                }
                                            </strong>{' '}
                                            service(s) selected
                                        </span>
                                    ) : (
                                        <span>Select services to continue</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={closeServicePicker}
                                        className="px-6 py-3 text-sm font-semibold border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={saveSelectedServices}
                                        disabled={
                                            Object.keys(selectedServices)
                                                .length === 0
                                        }
                                        className="px-8 py-3 text-sm font-semibold bg-black text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg disabled:shadow-none"
                                    >
                                        Confirm Services
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
