/* eslint-disable */
import { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaEye } from 'react-icons/fa';
import {
    getAllLateCheckouts,
    approveLateCheckout,
} from '../../services/lateCheckoutService';

export default function CheckoutTable({
    activeTab,
    onProcessCheckout,
    onViewDetails,
}: {
    activeTab: string;
    onProcessCheckout: (bookingId: string) => void;
    onViewDetails: () => void;
}) {
    const [lateCheckoutData, setLateCheckoutData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch late checkout data when switching tab to "late"
    useEffect(() => {
        const fetchLateCheckoutData = async () => {
            if (activeTab !== 'late') return;

            try {
                setLoading(true);
                setError('');

                const data = await getAllLateCheckouts();

                console.log('📌 BE Response:', data);

                setLateCheckoutData(data);
            } catch (err) {
                console.error('Error fetching late checkout data:', err);
                setError('Failed to load late checkout requests');
            } finally {
                setLoading(false);
            }
        };

        fetchLateCheckoutData();
    }, [activeTab]);

    // Handle approve/reject
    const handleApproveRequest = async (
        requestId: string,
        status: 'APPROVED' | 'REJECTED',
    ) => {
        try {
            await approveLateCheckout(requestId, status, 'Current Staff');

            if (activeTab === 'late') {
                const updated = await getAllLateCheckouts();
                setLateCheckoutData(updated);
            }
        } catch (err) {
            console.error('Error approving late checkout:', err);
        }
    };

    // Dummy data for normal checkout tab
    const checkoutData = [
        {
            bookingId: 'VH-23062801',
            guestInfo: {
                name: 'Sarah Johnson',
                email: 'sarah.j@example.com',
                image: 'https://randomuser.me/api/portraits/women/42.jpg',
            },
            room: '301 - Deluxe King',
            checkoutTime: '12:00 PM',
            status: 'pending',
            trustScore: { score: 92, level: 'high' },
            balanceDue: '850,000 VND',
            actions: ['checkout', 'view'],
        },
    ];

    const renderTrustScore = (score: number, level: string) => {
        const bgColors = {
            high: 'bg-green-50 text-success',
            medium: 'bg-amber-50 text-amber-600',
            low: 'bg-red-50 text-danger',
        };
        return (
            <div
                className={`rounded-md py-1 px-2 text-center ${
                    bgColors[level as keyof typeof bgColors]
                }`}
            >
                <span className="block font-semibold">{score}</span>
                <div className="text-xs capitalize">{level}</div>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-md overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-cream">
                        <tr>
                            <th className="text-left py-4 px-4 font-semibold">
                                Booking ID
                            </th>
                            <th className="text-left py-4 px-4 font-semibold">
                                Guest
                            </th>
                            <th className="text-left py-4 px-4 font-semibold">
                                Room
                            </th>
                            <th className="text-left py-4 px-4 font-semibold">
                                {activeTab === 'late'
                                    ? 'Request Time'
                                    : 'Check-out Time'}
                            </th>
                            <th className="text-left py-4 px-4 font-semibold">
                                Status
                            </th>
                            <th className="text-left py-4 px-4 font-semibold">
                                {activeTab === 'late'
                                    ? 'Additional Fee'
                                    : 'Trust Score'}
                            </th>
                            {activeTab !== 'late' && (
                                <th className="text-left py-4 px-4 font-semibold">
                                    Balance Due
                                </th>
                            )}
                            <th className="text-left py-4 px-4 font-semibold">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {activeTab === 'late' ? (
                            loading ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="text-center py-8"
                                    >
                                        Loading late checkout requests...
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="text-center py-8 text-red-500"
                                    >
                                        {error}
                                    </td>
                                </tr>
                            ) : lateCheckoutData.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="text-center py-8 text-gray-500"
                                    >
                                        No late checkout requests found
                                    </td>
                                </tr>
                            ) : (
                                lateCheckoutData.map((item: any, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-light/50"
                                    >
                                        {/* Booking ID */}
                                        <td className="py-4 px-4 border-b border-light">
                                            {item.bookingId}
                                        </td>

                                        {/* Guest Name + Email */}
                                        <td className="py-4 px-4 border-b border-light">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <span className="font-medium">
                                                        {item.customerName?.charAt(
                                                            0,
                                                        )}
                                                    </span>
                                                </div>
                                                <div>
                                                    <div className="font-medium">
                                                        {item.customerName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {item.customerEmail}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Room */}
                                        <td className="py-4 px-4 border-b border-light">
                                            {item.roomNumber
                                                ? `${item.roomNumber} - ${item.roomType}`
                                                : 'N/A'}
                                        </td>

                                        {/* Request Time */}
                                        <td className="py-4 px-4 border-b border-light">
                                            {new Date(
                                                item.requestTime,
                                            ).toLocaleString('vi-VN')}
                                        </td>

                                        {/* Status */}
                                        <td className="py-4 px-4 border-b border-light">
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm ${
                                                    item.approvalStatus ===
                                                    'APPROVED'
                                                        ? 'bg-green-50 text-green-600'
                                                        : item.approvalStatus ===
                                                          'REJECTED'
                                                        ? 'bg-red-50 text-red-600'
                                                        : 'bg-amber-50 text-amber-600'
                                                }`}
                                            >
                                                {item.approvalStatus}
                                            </span>
                                        </td>

                                        {/* Additional Fee */}
                                        <td className="py-4 px-4 border-b border-light font-medium">
                                            {item.additionalFee?.toLocaleString()}{' '}
                                            VND
                                        </td>

                                        {/* Actions */}
                                        <td className="py-4 px-4 border-b border-light">
                                            <div className="flex gap-2 items-center">
                                                {item.approvalStatus ===
                                                    'PENDING' && (
                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                handleApproveRequest(
                                                                    item.requestID,
                                                                    'APPROVED',
                                                                )
                                                            }
                                                            className="w-8 h-8 rounded-full bg-[#F5F0EB] hover:bg-green-100 text-green-600 flex items-center justify-center"
                                                        >
                                                            <FaCheck
                                                                size={14}
                                                            />
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                handleApproveRequest(
                                                                    item.requestID,
                                                                    'REJECTED',
                                                                )
                                                            }
                                                            className="w-8 h-8 rounded-full bg-[#F5F0EB] hover:bg-red-100 text-red-600 flex items-center justify-center"
                                                        >
                                                            <FaTimes
                                                                size={14}
                                                            />
                                                        </button>
                                                    </>
                                                )}

                                                <button
                                                    onClick={onViewDetails}
                                                    className="w-8 h-8 rounded-full bg-[#F5F0EB] hover:bg-[#EBE3D7] flex items-center justify-center"
                                                >
                                                    <FaEye size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )
                        ) : (
                            checkoutData.map((item, index) => (
                                <tr key={index} className="hover:bg-light/50">
                                    <td className="py-4 px-4 border-b border-light">
                                        {item.bookingId}
                                    </td>
                                    <td className="py-4 px-4 border-b border-light">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={item.guestInfo.image}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <div>
                                                <div className="font-medium">
                                                    {item.guestInfo.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {item.guestInfo.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 border-b border-light">
                                        {item.room}
                                    </td>
                                    <td className="py-4 px-4 border-b border-light">
                                        {item.checkoutTime}
                                    </td>
                                    <td className="py-4 px-4 border-b border-light">
                                        <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs">
                                            Completed
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 border-b border-light">
                                        {renderTrustScore(
                                            item.trustScore.score,
                                            item.trustScore.level,
                                        )}
                                    </td>
                                    <td className="py-4 px-4 border-b border-light">
                                        {item.balanceDue}
                                    </td>
                                    <td className="py-4 px-4 border-b border-light">
                                        <button
                                            onClick={onViewDetails}
                                            className="px-3 py-1 bg-gray-600 text-white rounded"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
