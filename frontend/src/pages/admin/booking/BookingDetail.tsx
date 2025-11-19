/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getBookingById } from '../../../services/bookingService';
import type { Booking } from '../../../types/Booking';
import Header from '../../../components/Header';

const statusColor: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    CHECKED_IN: 'bg-green-100 text-green-700 border-green-300',
    CHECKED_OUT: 'bg-blue-100 text-blue-700 border-blue-300',
    CANCELLED: 'bg-red-100 text-red-700 border-red-300',
};

export default function BookingDetail() {
    const { id } = useParams();
    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        getBookingById(id)
            .then((res) => {
                setBooking(res);
            })
            .finally(() => setLoading(false));
    }, [id]);

    /** LOADING */
    if (loading)
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin h-10 w-10 border-4 border-gray-300 border-t-black rounded-full"></div>
            </div>
        );

    /** NOT FOUND */
    if (!booking)
        return (
            <div className="text-center py-20 text-gray-500">
                Booking not found...
            </div>
        );

    return (
        <div className="bg-[#F8F6F1] min-h-screen">
            <Header />

            <div className="max-w-5xl mx-auto px-6 py-10">
                {/* Title */}
                <h1 className="text-3xl font-semibold tracking-wide mb-6 text-gray-800">
                    Booking Details
                </h1>

                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
                    {/* Booking ID + Status */}
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-700">
                            Booking ID:{' '}
                            <span className="text-gray-900">
                                {booking.bookingID}
                            </span>
                        </h2>

                        <span
                            className={`px-4 py-1 rounded-full text-sm font-semibold border 
                                ${statusColor[booking.status]}`}
                        >
                            {booking.status.replace('_', ' ')}
                        </span>
                    </div>

                    {/* Info */}
                    <div className="border-t pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Customer Info */}
                        <section>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                Customer Information
                            </h3>
                            <div className="space-y-2 text-gray-700">
                                <p>
                                    <span className="font-medium">Name:</span>{' '}
                                    {booking.customer.fullName}
                                </p>
                                <p>
                                    <span className="font-medium">Phone:</span>{' '}
                                    {booking.customer.phone}
                                </p>
                                <p>
                                    <span className="font-medium">Email:</span>{' '}
                                    {booking.customer.email}
                                </p>
                            </div>
                        </section>

                        {/* Dates */}
                        <section>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                Schedule
                            </h3>
                            <div className="space-y-2 text-gray-700">
                                <p>
                                    <span className="font-medium">
                                        Check-in:
                                    </span>{' '}
                                    {booking.checkInDate}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Check-out:
                                    </span>{' '}
                                    {booking.checkOutDate}
                                </p>
                                <p>
                                    <span className="font-medium">Guests:</span>{' '}
                                    {booking.numberOfGuests} people
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* Rooms Booked */}
                    <section className="pt-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Rooms Booked
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {booking.bookingDetails?.length > 0 ? (
                                booking.bookingDetails.map((detail, index) => (
                                    <div
                                        key={index}
                                        className="border rounded-xl p-5 shadow-sm hover:shadow-md transition bg-gray-50"
                                    >
                                        <h4 className="text-lg font-semibold text-gray-700 mb-2">
                                            Room{' '}
                                            {detail.room?.roomNumber ?? 'N/A'}
                                        </h4>

                                        <p className="text-gray-600 text-sm">
                                            <span className="font-medium">
                                                Type:
                                            </span>{' '}
                                            {detail.room?.roomType?.typeName ??
                                                'Unknown'}
                                        </p>

                                        <p className="text-gray-600 text-sm mt-1">
                                            <span className="font-medium">
                                                Base Price:
                                            </span>{' '}
                                            $
                                            {detail.room?.roomType?.basePrice ??
                                                '0'}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 italic">
                                    No rooms found for this booking.
                                </p>
                            )}
                        </div>
                    </section>

                    {/* Payment */}
                    <div className="text-right border-t pt-6">
                        <p className="text-lg text-gray-700">
                            <span className="font-semibold">Total:</span>{' '}
                            <span className="text-2xl font-bold text-gray-900">
                                {booking.totalAmount.toLocaleString()} VNĐ
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
