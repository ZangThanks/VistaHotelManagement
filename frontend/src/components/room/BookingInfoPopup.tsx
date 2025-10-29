import React from "react";
import {
  FaUser,
  FaBed,
  FaCalendarCheck,
  FaCalendarTimes,
  FaMoon,
  FaDollarSign,
  FaTimes,
} from "react-icons/fa";
import type { Room } from "./RoomTableView";
import type { RoomBooking } from "./RoomCalendarView";

interface BookingInfoPopupProps {
  booking: RoomBooking;
  room: Room;
  position: { x: number; y: number };
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

/**
 * Popup hiển thị thông tin chi tiết đơn đặt phòng
 */
const BookingInfoPopup: React.FC<BookingInfoPopupProps> = ({
  booking,
  room,
  position,
  onClose,
  onMouseEnter,
  onMouseLeave,
}) => {
  const statusConfig = {
    confirmed: {
      label: "Đã xác nhận",
      bg: "bg-amber-500",
      text: "text-amber-50",
    },
    "checked-in": {
      label: "Đang ở",
      bg: "bg-emerald-500",
      text: "text-emerald-50",
    },
    "checked-out": {
      label: "Đã trả phòng",
      bg: "bg-rose-500",
      text: "text-rose-50",
    },
  };

  const nights =
    Math.ceil(
      (new Date(booking.checkOut).getTime() -
        new Date(booking.checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
    ) || 1;

  const totalPrice = room.price * nights;

  return (
    <>
      {/* Overlay - không có onClick để không đóng khi click */}
      <div className="fixed inset-0 z-40" />

      {/* Popup */}
      <div
        className="fixed z-50 bg-white rounded-xl shadow-2xl border-2 border-gray-200 w-[400px] max-h-[600px] overflow-y-auto"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: "translate(-50%, -100%)",
          marginTop: "-20px",
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#6b5e4c] to-[#8b7355] p-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">
                Phòng {booking.roomNumber}
              </h3>
              <p className="text-sm text-gray-100 mt-1">{room.roomType}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <FaTimes className="text-white text-lg" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Status Badge */}
          <div className="flex justify-center">
            <div
              className={`${statusConfig[booking.status].bg} ${
                statusConfig[booking.status].text
              } px-4 py-2 rounded-full font-semibold text-sm shadow-md`}
            >
              {statusConfig[booking.status].label}
            </div>
          </div>

          {/* Guest Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
              Thông tin khách hàng
            </h4>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#6b5e4c] rounded-full flex items-center justify-center">
                <FaUser className="text-white text-sm" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Tên khách hàng</p>
                <p className="font-bold text-gray-800">{booking.guestName}</p>
              </div>
            </div>
          </div>

          {/* Room Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
              Thông tin phòng
            </h4>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <FaBed className="text-white text-sm" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Loại phòng</p>
                <p className="font-bold text-gray-800">{room.roomType}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                <FaUser className="text-white text-sm" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Sức chứa</p>
                <p className="font-bold text-gray-800">{room.capacity} người</p>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
              Chi tiết đặt phòng
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <FaCalendarCheck className="text-white text-sm" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Ngày nhận phòng</p>
                  <p className="font-bold text-gray-800">
                    {new Date(booking.checkIn).toLocaleDateString("vi-VN", {
                      weekday: "long",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <FaCalendarTimes className="text-white text-sm" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Ngày trả phòng</p>
                  <p className="font-bold text-gray-800">
                    {new Date(booking.checkOut).toLocaleDateString("vi-VN", {
                      weekday: "long",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                  <FaMoon className="text-white text-sm" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Số đêm</p>
                  <p className="font-bold text-gray-800">{nights} đêm</p>
                </div>
              </div>
            </div>
          </div>

          {/* Price Info */}
          <div className="bg-gradient-to-r from-[#6b5e4c] to-[#8b7355] rounded-lg p-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <FaDollarSign className="text-white text-lg" />
                </div>
                <div>
                  <p className="text-xs text-gray-200">Giá phòng/đêm</p>
                  <p className="font-bold text-lg">
                    {room.price.toLocaleString("vi-VN")} VNĐ
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-white/30">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-200">Tổng tiền:</span>
                <span className="text-2xl font-bold text-white">
                  {totalPrice.toLocaleString("vi-VN")} VNĐ
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button className="flex-1 bg-[#6b5e4c] text-white px-4 py-3 rounded-lg font-semibold hover:bg-[#5a4d3e] transition-colors shadow-md">
              Xem chi tiết
            </button>
            <button className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md">
              Liên hệ khách
            </button>
          </div>
        </div>

        {/* Arrow pointing down */}
        <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-[12px] border-r-[12px] border-t-[12px] border-l-transparent border-r-transparent border-t-gray-200" />
      </div>
    </>
  );
};

export default BookingInfoPopup;
