/* eslint-disable */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type Props = {
    booking: any;
    onClose: () => void;
};

const membershipFree = ['GOLD', 'PLATINUM', 'DIAMOND'];

export default function LateCheckoutModal({ booking, onClose }: Props) {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [fee, setFee] = useState(0);

    const roomPrice = booking.bookingDetails[0]?.roomPrice || 0;
    const userLevel = booking.customer?.memberShipLevel || 'STANDARD';

    useEffect(() => {
        calculateFee();
    }, [selectedTime]);

    const calculateFee = () => {
        if (!selectedTime) return;

        const [hour] = selectedTime.split(':').map(Number);

        let calculatedFee = 0;

        if (hour >= 12 && hour < 13) {
            calculatedFee = membershipFree.includes(userLevel) ? 0 : 0;
        } else if (hour >= 13 && hour < 15) {
            calculatedFee = roomPrice * 0.3;
        } else if (hour >= 15 && hour < 18) {
            calculatedFee = roomPrice * 0.5;
        } else if (hour >= 18) {
            calculatedFee = roomPrice; // 100%
        }

        setFee(calculatedFee);
    };

    const handleSubmit = async () => {
        if (!selectedDate || !selectedTime) return alert('Please select time');

        const body = {
            bookingId: booking.bookingID,
            requestDate: selectedDate,
            requestTime: selectedTime,
            additionalFee: fee,
        };

        console.log('Late Checkout Request:', body);

        // TODO: call API here
        // await createLateCheckout(body);

        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl p-8 w-full max-w-md shadow-lg"
            >
                {/* Title */}
                <h2 className="text-2xl font-bold mb-4 text-center">
                    Late Check-out
                </h2>

                {/* Select date */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                        Select Date
                    </label>
                    <input
                        type="date"
                        className="w-full border rounded-lg p-3"
                        min={booking.checkOutDate.split('T')[0]}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>

                {/* Select time */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                        Select Time
                    </label>
                    <input
                        type="time"
                        className="w-full border rounded-lg p-3"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                    />
                </div>

                {/* Fee */}
                <div className="mb-6 p-4 bg-gray-50 rounded-xl border">
                    <p className="text-sm text-gray-600">Late Check-out Fee:</p>
                    <p className="text-xl font-bold text-black">
                        {fee.toLocaleString()} VND
                    </p>

                    {membershipFree.includes(userLevel) &&
                        selectedTime >= '12:00' &&
                        selectedTime < '13:00' && (
                            <p className="text-xs text-green-600 mt-1">
                                *Miễn phí cho hội viên Gold trở lên
                            </p>
                        )}
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        className="flex-1 py-3 bg-gray-200 rounded-xl"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="flex-1 py-3 bg-black text-white rounded-xl"
                        onClick={handleSubmit}
                    >
                        Confirm
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
