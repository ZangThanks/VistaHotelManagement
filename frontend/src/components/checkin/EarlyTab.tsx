/* eslint-disable */
import React from 'react';
import { FaCheck, FaTimes, FaEye, FaComment } from 'react-icons/fa';

const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const hasEarlyCheckinRequest = (booking) => {
    if (!booking) return false;
    return booking.specialRequests?.toLowerCase().includes('early') || false;
};

const calculateEarlyFee = (booking) => {
    if (!booking) return '$0';
    const regularCheckIn = new Date();
    regularCheckIn.setHours(14, 0, 0, 0);

    const earlyTime = booking.specialRequests?.match(/(\d{1,2}):(\d{2})/);
    if (!earlyTime) return '$65 (30%)';

    const earlyHour = parseInt(earlyTime[1]);
    const earlyMinute = parseInt(earlyTime[2]);
    const earlyCheckIn = new Date();
    earlyCheckIn.setHours(earlyHour, earlyMinute, 0, 0);

    const hoursDiff = (regularCheckIn - earlyCheckIn) / (1000 * 60 * 60);

    if (hoursDiff > 6) return '$125 (50%)';
    if (hoursDiff > 3) return '$65 (30%)';
    return '$45 (20%)';
};

const EarlyTab = ({ onViewDetails, bookings = [] }) => {
    const earlyCheckIns = bookings
        .filter((booking) => hasEarlyCheckinRequest(booking))
        .map((booking, index) => {
            const requestId = `ER-${new Date()
                .getFullYear()
                .toString()
                .slice(-2)}${(new Date().getMonth() + 1)
                .toString()
                .padStart(2, '0')}${new Date()
                .getDate()
                .toString()
                .padStart(2, '0')}${(index + 1).toString().padStart(2, '0')}`;

            return {
                id: requestId,
                guest: {
                    name: booking.customer?.fullName || 'Guest',
                    email: booking.customer?.email || 'No email',
                    image: `https://randomuser.me/api/portraits/${
                        index % 2 === 0 ? 'women' : 'men'
                    }/${Math.floor(Math.random() * 70) + 10}.jpg`,
                },
                room: `${
                    booking.bookingDetails[0]?.room?.roomNumber || 'N/A'
                } - ${
                    booking.bookingDetails[0]?.room?.roomType?.typeName ||
                    'Standard'
                }`,
                regularCheckIn: '14:00 PM',
                requestedTime:
                    booking.specialRequests?.match(/(\d{1,2}:\d{2})/) &&
                    booking.specialRequests.match(/(\d{1,2}:\d{2})/)[0]
                        ? booking.specialRequests.match(/(\d{1,2}:\d{2})/)[0] +
                          ' AM'
                        : '10:30 AM',
                earlyFee: calculateEarlyFee(booking),
                status:
                    index % 3 === 0
                        ? 'pending'
                        : index % 3 === 1
                        ? 'approved'
                        : 'unavailable',
            };
        });

    // TODO: GET API
    const displayRequests =
        earlyCheckIns.length > 0
            ? earlyCheckIns
            : [
                  {
                      id: 'ER-23062501',
                      guest: {
                          name: 'Olivia Davis',
                          email: 'olivia.d@example.com',
                          image: 'https://randomuser.me/api/portraits/women/12.jpg',
                      },
                      room: '302 - Deluxe King',
                      regularCheckIn: '14:00 PM',
                      requestedTime: '10:30 AM',
                      earlyFee: '$65 (30%)',
                      status: 'pending',
                  },
                  {
                      id: 'ER-23062502',
                      guest: {
                          name: 'Michael Chen',
                          email: 'michael.c@example.com',
                          image: 'https://randomuser.me/api/portraits/men/77.jpg',
                      },
                      room: '506 - Suite',
                      regularCheckIn: '14:00 PM',
                      requestedTime: '07:00 AM',
                      earlyFee: '$125 (50%)',
                      status: 'approved',
                  },
                  {
                      id: 'ER-23062503',
                      guest: {
                          name: 'Amanda Wilson',
                          email: 'amanda.w@example.com',
                          image: 'https://randomuser.me/api/portraits/women/32.jpg',
                      },
                      room: '205 - Standard Twin',
                      regularCheckIn: '14:00 PM',
                      requestedTime: '11:30 AM',
                      earlyFee: '$45 (20%)',
                      status: 'unavailable',
                  },
              ];

    if (earlyCheckIns.length === 0 && bookings.length > 0) {
        return (
            <div className="p-10 text-center">
                <p className="text-gray-500">
                    No early check-in requests found.
                </p>
            </div>
        );
    }

    const renderStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return (
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-600">
                        Pending
                    </span>
                );
            case 'approved':
                return (
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-600">
                        Approved
                    </span>
                );
            case 'unavailable':
                return (
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-600">
                        Room Unavailable
                    </span>
                );
            default:
                return (
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                        {status}
                    </span>
                );
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead>
                    <tr className="bg-[#EBE3D7]/30 text-left">
                        <th className="py-4 px-4 font-semibold">Request ID</th>
                        <th className="py-4 px-4 font-semibold">Guest Name</th>
                        <th className="py-4 px-4 font-semibold">Room</th>
                        <th className="py-4 px-4 font-semibold">
                            Regular Check-in
                        </th>
                        <th className="py-4 px-4 font-semibold">
                            Requested Time
                        </th>
                        <th className="py-4 px-4 font-semibold">Early Fee</th>
                        <th className="py-4 px-4 font-semibold">Status</th>
                        <th className="py-4 px-4 font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {displayRequests.map((request) => (
                        <tr
                            key={request.id}
                            className="border-b border-[#EBE3D7]/50 hover:bg-[#EBE3D7]/10"
                        >
                            <td className="py-4 px-4">{request.id}</td>
                            <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={request.guest.image}
                                        alt={request.guest.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-medium">
                                            {request.guest.name}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {request.guest.email}
                                        </span>
                                    </div>
                                </div>
                            </td>
                            <td className="py-4 px-4">{request.room}</td>
                            <td className="py-4 px-4">
                                {request.regularCheckIn}
                            </td>
                            <td className="py-4 px-4">
                                {request.requestedTime}
                            </td>
                            <td className="py-4 px-4">{request.earlyFee}</td>
                            <td className="py-4 px-4">
                                {renderStatusBadge(request.status)}
                            </td>
                            <td className="py-4 px-4">
                                <div className="flex gap-1">
                                    {request.status === 'pending' && (
                                        <>
                                            <button
                                                title="Approve"
                                                className="w-8 h-8 rounded-full bg-[#F5F0EB] hover:bg-[#EBE3D7] transition flex items-center justify-center text-green-600"
                                            >
                                                <FaCheck size={14} />
                                            </button>
                                            <button
                                                title="Reject"
                                                className="w-8 h-8 rounded-full bg-[#F5F0EB] hover:bg-[#EBE3D7] transition flex items-center justify-center text-red-600"
                                            >
                                                <FaTimes size={14} />
                                            </button>
                                        </>
                                    )}
                                    {request.status === 'approved' && (
                                        <button
                                            title="Check In"
                                            className="w-8 h-8 rounded-full bg-[#F5F0EB] hover:bg-[#EBE3D7] transition flex items-center justify-center text-green-600"
                                        >
                                            <FaCheck size={14} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => onViewDetails(request)}
                                        title="View Details"
                                        className="w-8 h-8 rounded-full bg-[#F5F0EB] hover:bg-[#EBE3D7] transition flex items-center justify-center"
                                    >
                                        <FaEye size={14} />
                                    </button>
                                    {request.status === 'unavailable' && (
                                        <button
                                            title="Send Message"
                                            className="w-8 h-8 rounded-full bg-[#F5F0EB] hover:bg-[#EBE3D7] transition flex items-center justify-center"
                                        >
                                            <FaComment size={14} />
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EarlyTab;
