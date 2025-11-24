import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../../components/Header';
import {
    getBookingById,
    getBookingDetailsById
} from '../../../services/bookingService';
import type { Booking } from '../../../types/Booking';
import type { BookingDetail } from '../../../types/BookingDetail';

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

    // FETCH DATA
    useEffect(() => {
        if (!id) return;

        (async () => {
            try {
                const bookingRes = await getBookingById(id);
                setBooking(bookingRes);

                const detailRes = await getBookingDetailsById(id);
                setDetails(detailRes);
            } catch (error) {
                console.error('Error fetching booking detail:', error);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

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

                {/* TITLE */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-black">
                            Booking Details
                        </h1>
                        <p className="text-black/60">
                            ID:{' '}
                            <span className="font-mono font-semibold">
                                {booking.bookingID}
                            </span>
                        </p>
                    </div>

                    <span
                        className={`px-5 py-2 rounded-full text-sm font-semibold border-2 ${
                            statusColor[
                                booking.status as keyof typeof statusColor
                            ]
                        }`}
                    >
                        {booking.status.replace('_', ' ')}
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
                                    <span>{booking.customer.fullName}</span>
                                </div>
                                <div className="p-3 bg-[#F5F0EB] rounded-lg flex gap-3">
                                    <strong className="min-w-[70px] text-black/70">
                                        Phone
                                    </strong>
                                    <span>{booking.customer.phone}</span>
                                </div>
                                <div className="p-3 bg-[#F5F0EB] rounded-lg flex gap-3">
                                    <strong className="min-w-[70px] text-black/70">
                                        Email
                                    </strong>
                                    <span>{booking.customer.email}</span>
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
                                        {booking.checkInDate.split('T')[0]}
                                    </p>
                                    <p className="text-sm font-semibold text-black">
                                        {booking.checkInDate.split('T')[1]}
                                    </p>
                                </div>
                                <div className="bg-[#F5F0EB] p-4 rounded-xl">
                                    <p className="text-black/60 text-sm">
                                        Check-out
                                    </p>
                                    <p className="text-lg font-bold text-black">
                                        {booking.checkOutDate.split('T')[0]}
                                    </p>
                                    <p className="text-sm font-semibold text-black">
                                        {booking.checkOutDate.split('T')[1]}
                                    </p>
                                </div>
                            </div>

                            <div className="p-3 bg-[#F5F0EB] rounded-lg flex gap-2">
                                <span className="font-semibold">
                                    {booking.numberOfGuests} Guests
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

                                        {/* IMAGES */}
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
                                        {booking.totalAmount.toLocaleString()}{' '}
                                        VNĐ
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-white/70">
                                        Tax (10%)
                                    </span>
                                    <span>
                                        {(
                                            booking.totalAmount * 0.1
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
                                    {(
                                        booking.totalAmount * 1.1
                                    ).toLocaleString()}{' '}
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
                                <button className="w-full bg-black hover:bg-black/90 text-white py-3 rounded-xl">
                                    Early Check-in
                                </button>
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
        </div>
    );
}
