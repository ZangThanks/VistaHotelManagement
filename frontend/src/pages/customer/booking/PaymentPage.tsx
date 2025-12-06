import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    generateQRPayment,
    getBookingById,
    cancelBookingPayment,
} from '../../../services/bookingService';
import type { Booking } from '../../../types/Booking';
import CountdownTimer from '../../../components/common/CountdownTimer';

const PaymentPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const booking: Booking | null = location.state?.booking || null;

    const [imageUrl, setImageUrl] = useState<string>('');
    const [selectedChoice, setSelectedChoice] = useState<number>(1);
    const [loading, setLoading] = useState(false);

    const [paymentCompleted, setPaymentCompleted] = useState(false);
    const [paymentExpired, setPaymentExpired] = useState(false);
    const [showTimer, setShowTimer] = useState(false);

    const reputationPoint = booking?.customer?.reputationPoint || 0;
    const totalAmount = booking?.totalAmount || 0;

    const getPaymentInfo = () => {
        if (reputationPoint >= 0 && reputationPoint <= 40) {
            return {
                required: totalAmount,
                percentage: 100,
                hasChoice: false,
                message:
                    'Low reputation (0-40 points): 100% prepayment required',
            };
        } else if (reputationPoint > 40 && reputationPoint <= 80) {
            return {
                required: totalAmount * 0.3,
                percentage: 30,
                hasChoice: false,
                message:
                    'Medium reputation (41-80 points): 30% prepayment required',
            };
        } else {
            return {
                required: 0,
                percentage: 0,
                hasChoice: true,
                message:
                    'High reputation (81-100 points): Choose your payment option',
            };
        }
    };

    const paymentInfo = getPaymentInfo();

    const getAmountByChoice = (choice: number) => {
        if (choice === 1) return totalAmount; // 100%
        if (choice === 2) return totalAmount * 0.5; // 50%
        return 0;
    };

    const fetchQRCode = async (choice: number) => {
        if (!booking?.bookingID) {
            console.error('No booking ID available');
            return;
        }

        // Skip qr nếu chọn pay at check-out
        if (choice === 0) {
            setLoading(true);
            setTimeout(() => {
                setLoading(false);
                setPaymentCompleted(true);
                setTimeout(() => navigate('/'), 3000);
            }, 1000);
            return;
        }

        try {
            setLoading(true);

            const blob = await generateQRPayment(booking.bookingID, choice);
            const url = URL.createObjectURL(blob);
            setImageUrl(url);
            // Start countdown timer
            setShowTimer(true);

            startPaymentPolling();
        } catch (error) {
            console.error('Error fetching payment image:', error);
            alert('Failed to generate QR code. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const startPaymentPolling = async () => {
        if (!booking?.bookingID) return;

        const maxAttempts = 60; // Poll mỗi 60s
        const delayMs = 1000; // Check mỗi 1s

        for (let i = 0; i < maxAttempts; i++) {
            await new Promise((res) => setTimeout(res, delayMs));

            try {
                const refreshed = await getBookingById(booking.bookingID);
                if (
                    refreshed?.paymentStatus === 'PAID' ||
                    refreshed?.paymentStatus === 'PERCENTAGE_30' ||
                    refreshed?.paymentStatus === 'PERCENTAGE_50' ||
                    refreshed?.paymentStatus === 'COMPLETED'
                ) {
                    setPaymentCompleted(true);
                    setTimeout(
                        () =>
                            navigate(
                                `/customer/mybooking/${booking.bookingID}`,
                            ),
                        5000,
                    );
                    return;
                }
            } catch (error) {
                console.debug('Polling attempt failed:', error);
            }
        }
    };

    const handlePaymentExpiry = async () => {
        if (!booking?.bookingID) return;

        try {
            setPaymentExpired(true);
            await cancelBookingPayment(booking.bookingID);

            setTimeout(() => {
                alert(
                    'Payment time has expired. Your booking has been cancelled.',
                );
                navigate('/customer/bookingPage');
            }, 2000);
        } catch (error) {
            console.error('Error cancelling booking:', error);
            alert('Payment time expired. Please try booking again.');
            navigate('/customer/bookingPage');
        }
    };

    useEffect(() => {
        if (!booking) {
            alert('No booking information found. Redirecting...');
            navigate('/bookingPage');
            return;
        }

        if (!booking.bookingID) {
            alert('Booking ID is missing. Please try booking again.');
            navigate('/bookingPage');
            return;
        }

        // Auto-generate QR cho uy tín 0-80
        if (!paymentInfo.hasChoice) {
            fetchQRCode(1); // Default choice cho < 80
        }

        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChoiceChange = (choice: number) => {
        setSelectedChoice(choice);
        if (imageUrl) {
            URL.revokeObjectURL(imageUrl);
            setImageUrl('');
        }
    };

    const handleGenerateQR = () => {
        fetchQRCode(selectedChoice);
    };

    if (!booking) {
        return null;
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
                    Payment
                </h1>

                {/* Booking Information */}
                <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                    <h2 className="font-semibold text-lg mb-3">
                        Booking Information
                    </h2>
                    <div className="space-y-2 text-sm">
                        <p>
                            <span className="font-medium">Booking ID:</span>{' '}
                            {booking.bookingID}
                        </p>
                        <p>
                            <span className="font-medium">Customer:</span>{' '}
                            {booking.customer?.fullName}
                        </p>
                        <p>
                            <span className="font-medium">Total Amount:</span> $
                            {totalAmount.toFixed(2)}
                        </p>
                        <p>
                            <span className="font-medium">
                                Reputation Points:
                            </span>{' '}
                            {reputationPoint}
                        </p>
                    </div>
                </div>

                {/* Reputation Level Message */}
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                        {paymentInfo.message}
                    </p>
                </div>

                {/* Countdown Timer */}
                {showTimer && !paymentCompleted && !paymentExpired && (
                    <div className="mb-6">
                        <CountdownTimer
                            durationInMinutes={15}
                            onExpire={handlePaymentExpiry}
                        />
                    </div>
                )}

                {/* Payment Expired Message */}
                {paymentExpired && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800 font-semibold">
                            ⚠️ Payment time has expired. Your booking is being
                            cancelled...
                        </p>
                    </div>
                )}

                {/* Payment Options for High Reputation Customers */}
                {paymentInfo.hasChoice && !imageUrl && (
                    <div className="mb-6">
                        <h3 className="font-semibold mb-4">
                            Select Payment Option:
                        </h3>
                        <div className="space-y-3">
                            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                                <input
                                    type="radio"
                                    name="paymentChoice"
                                    value={1}
                                    checked={selectedChoice === 1}
                                    onChange={() => handleChoiceChange(1)}
                                    className="mr-3"
                                />
                                <div className="flex-1">
                                    <span className="font-medium">
                                        Pay 100% now
                                    </span>
                                    <span className="ml-2 text-gray-600">
                                        (${totalAmount.toFixed(2)})
                                    </span>
                                </div>
                            </label>

                            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                                <input
                                    type="radio"
                                    name="paymentChoice"
                                    value={2}
                                    checked={selectedChoice === 2}
                                    onChange={() => handleChoiceChange(2)}
                                    className="mr-3"
                                />
                                <div className="flex-1">
                                    <span className="font-medium">
                                        Pay 50% now
                                    </span>
                                    <span className="ml-2 text-gray-600">
                                        (${(totalAmount * 0.5).toFixed(2)})
                                    </span>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Remaining 50% at check-out
                                    </p>
                                </div>
                            </label>

                            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                                <input
                                    type="radio"
                                    name="paymentChoice"
                                    value={0}
                                    checked={selectedChoice === 0}
                                    onChange={() => handleChoiceChange(0)}
                                    className="mr-3"
                                />
                                <div className="flex-1">
                                    <span className="font-medium">
                                        Pay at check-out
                                    </span>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Full payment during check-out
                                    </p>
                                </div>
                            </label>
                        </div>

                        <button
                            onClick={handleGenerateQR}
                            className="w-full mt-6 px-6 py-3 bg-[#c9b8a8] text-white font-semibold rounded-lg hover:bg-[#b8a896] transition"
                        >
                            {selectedChoice === 0
                                ? 'Confirm Booking'
                                : 'Get Payment QR Code'}
                        </button>
                    </div>
                )}

                {/* QR Code Display */}
                {loading && (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c9b8a8] mx-auto"></div>
                        <p className="mt-4 text-gray-600">
                            Generating QR code...
                        </p>
                    </div>
                )}

                {imageUrl && !paymentCompleted && (
                    <div className="text-center">
                        <h3 className="font-semibold mb-4">
                            {paymentInfo.hasChoice
                                ? `Payment Amount: $${getAmountByChoice(
                                      selectedChoice,
                                  ).toFixed(2)}`
                                : `Payment Required: $${paymentInfo.required.toFixed(
                                      2,
                                  )} (${paymentInfo.percentage}%)`}
                        </h3>
                        <img
                            src={imageUrl}
                            alt="Payment QR Code"
                            className="max-w-md mx-auto border rounded shadow-lg"
                        />
                        <p className="mt-4 text-sm text-gray-600">
                            Scan this QR code with your banking app to complete
                            payment
                        </p>
                        <p className="mt-2 text-xs text-gray-500">
                            Payment status will be automatically detected...
                        </p>

                        <div className="mt-6 space-y-3">
                            {paymentInfo.hasChoice && (
                                <button
                                    onClick={() => {
                                        URL.revokeObjectURL(imageUrl);
                                        setImageUrl('');
                                    }}
                                    className="w-full px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                                >
                                    Change Payment Option
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {paymentCompleted && (
                    <div className="text-center py-8">
                        <div className="mb-4 text-green-600">
                            <svg
                                className="w-16 h-16 mx-auto"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-green-600 mb-2">
                            Payment Successful!
                        </h3>
                        <p className="text-gray-600">
                            Your booking has been confirmed.
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            Redirecting to home page...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentPage;
