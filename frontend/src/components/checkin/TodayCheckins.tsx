import React from "react";
import { FaCheck, FaEye, FaConciergeBell } from "react-icons/fa";

const todayCheckins = [
  {
    id: "VH-23062501",
    guest: {
      name: "John Anderson",
      email: "john.a@example.com",
      image: "https://randomuser.me/api/portraits/men/42.jpg",
    },
    room: "301 - Deluxe King",
    checkInTime: "14:00 PM",
    status: "pending",
    trustScore: { value: 85, level: "high" },
    paymentStatus: { type: "complete", label: "Paid in Full" },
    actions: ["checkin", "view"],
  },
  {
    id: "VH-23062502",
    guest: {
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      image: "https://randomuser.me/api/portraits/women/28.jpg",
    },
    room: "212 - Standard Twin",
    checkInTime: "15:30 PM",
    status: "completed",
    trustScore: { value: 63, level: "medium" },
    paymentStatus: { type: "partial", label: "Partial (30%)" },
    actions: ["view", "services"],
  },
];

function TodayTab({ onViewDetails }) {
  const renderStatusBadge = (status) => {
    const statusClasses = {
      pending: "bg-amber-50 text-amber-700",
      completed: "bg-green-50 text-green-700",
      upcoming: "bg-blue-50 text-blue-700",
    };

    return (
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-medium inline-block min-w-20 text-center ${statusClasses[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const renderTrustScore = (score) => {
    const scoreClasses = {
      high: "bg-green-50 text-green-700 border-green-200",
      medium: "bg-amber-50 text-amber-700 border-amber-200",
      low: "bg-red-50 text-red-700 border-red-200",
    };

    return (
      <div
        className={`flex flex-col items-center p-1 rounded border ${
          scoreClasses[score.level]
        }`}
      >
        <span className="font-bold">{score.value}</span>
        <div className="text-xs">
          {score.level.charAt(0).toUpperCase() + score.level.slice(1)}
        </div>
      </div>
    );
  };

  const renderPaymentBadge = (payment) => {
    const paymentClasses = {
      complete: "bg-green-50 text-green-700",
      partial: "bg-amber-50 text-amber-700",
      checkout: "bg-purple-50 text-purple-700",
    };

    return (
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-medium inline-block min-w-20 text-center ${
          paymentClasses[payment.type]
        }`}
      >
        {payment.label}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-[#EBE3D7]/30 text-left">
            <th className="py-4 px-4 font-semibold">Booking ID</th>
            <th className="py-4 px-4 font-semibold">Guest Name</th>
            <th className="py-4 px-4 font-semibold">Room</th>
            <th className="py-4 px-4 font-semibold">Check-in Time</th>
            <th className="py-4 px-4 font-semibold">Status</th>
            <th className="py-4 px-4 font-semibold">Trust Score</th>
            <th className="py-4 px-4 font-semibold">Payment Status</th>
            <th className="py-4 px-4 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {todayCheckins.map((booking) => (
            <tr
              key={booking.id}
              className="border-b border-[#EBE3D7]/50 hover:bg-[#EBE3D7]/10"
            >
              <td className="py-4 px-4">{booking.id}</td>
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <img
                    src={booking.guest.image}
                    alt={booking.guest.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{booking.guest.name}</span>
                    <span className="text-sm text-gray-500">
                      {booking.guest.email}
                    </span>
                  </div>
                </div>
              </td>
              <td className="py-4 px-4">{booking.room}</td>
              <td className="py-4 px-4">{booking.checkInTime}</td>
              <td className="py-4 px-4">{renderStatusBadge(booking.status)}</td>
              <td className="py-4 px-4">
                {renderTrustScore(booking.trustScore)}
              </td>
              <td className="py-4 px-4">
                {renderPaymentBadge(booking.paymentStatus)}
              </td>
              <td className="py-4 px-4">
                <div className="flex gap-1">
                  {booking.actions.includes("checkin") && (
                    <button
                      title="Check In"
                      className="w-8 h-8 rounded-full bg-[#F5F0EB] hover:bg-[#EBE3D7] transition flex items-center justify-center"
                    >
                      <FaCheck size={14} />
                    </button>
                  )}

                  {booking.actions.includes("view") && (
                    <button
                      title="View Details"
                      className="w-8 h-8 rounded-full bg-[#F5F0EB] hover:bg-[#EBE3D7] transition flex items-center justify-center"
                      onClick={() => onViewDetails(booking)}
                    >
                      <FaEye size={14} />
                    </button>
                  )}

                  {booking.actions.includes("services") && (
                    <button
                      title="Room Services"
                      className="w-8 h-8 rounded-full bg-[#F5F0EB] hover:bg-[#EBE3D7] transition flex items-center justify-center"
                    >
                      <FaConciergeBell size={14} />
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
}

export default TodayTab;
