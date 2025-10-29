import React, { useState, useMemo, useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import type { Room } from "./RoomTableView";
import BookingInfoPopup from "./BookingInfoPopup";

export interface RoomBooking {
  id: string;
  roomId: string;
  roomNumber: string;
  guestName: string;
  checkIn: Date;
  checkOut: Date;
  status: "confirmed" | "checked-in" | "checked-out";
}

interface RoomCalendarViewProps {
  rooms: Room[];
  bookings: RoomBooking[];
  onRoomClick?: (room: Room) => void;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  bookings: Array<{
    booking: RoomBooking;
    room: Room;
    isStart: boolean;
    isEnd: boolean;
    spanDays: number;
    position: number; // Vị trí trong ô (để xếp chồng nhiều booking)
  }>;
}

/**
 * Calendar dạng tháng với các booking hiển thị như thanh kéo dài
 */
const RoomCalendarView: React.FC<RoomCalendarViewProps> = ({
  rooms,
  bookings,
  onRoomClick,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"month" | "week">("month");
  const [selectedBooking, setSelectedBooking] = useState<{
    booking: RoomBooking;
    room: Room;
    position: { x: number; y: number };
  } | null>(null);

  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  // Tính các ngày cần hiển thị (theo tháng hoặc tuần)
  const calendarDays = useMemo(() => {
    const days: CalendarDay[] = [];

    if (viewMode === "week") {
      // Hiển thị tuần chứa ngày được chọn
      const startOfWeek = new Date(selectedDate);
      const dayOfWeek = startOfWeek.getDay();
      startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek); // Về CN

      for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        days.push({ date, isCurrentMonth: true, bookings: [] });
      }
    } else {
      // Hiển thị theo tháng
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();

      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);

      const startPadding = firstDay.getDay();

      for (let i = startPadding - 1; i >= 0; i--) {
        const date = new Date(year, month, -i);
        days.push({ date, isCurrentMonth: false, bookings: [] });
      }

      for (let i = 1; i <= lastDay.getDate(); i++) {
        const date = new Date(year, month, i);
        days.push({ date, isCurrentMonth: true, bookings: [] });
      }

      const totalCells = Math.ceil(days.length / 7) * 7;
      const endPadding = totalCells - days.length;
      for (let i = 1; i <= endPadding; i++) {
        const date = new Date(year, month + 1, i);
        days.push({ date, isCurrentMonth: false, bookings: [] });
      }
    }

    return days;
  }, [currentDate, viewMode, selectedDate]);

  // Xử lý bookings cho từng ngày
  const calendarWithBookings = useMemo(() => {
    const daysMap = new Map<string, CalendarDay>();

    calendarDays.forEach((day) => {
      const dateKey = day.date.toDateString();
      daysMap.set(dateKey, { ...day, bookings: [] });
    });

    // Duyệt qua từng booking
    bookings.forEach((booking) => {
      const room = rooms.find((r) => r.id === booking.roomId);
      if (!room) return;

      const checkIn = new Date(booking.checkIn);
      checkIn.setHours(0, 0, 0, 0);
      const checkOut = new Date(booking.checkOut);
      checkOut.setHours(0, 0, 0, 0);

      // Duyệt qua tất cả các ngày trong calendar để tìm ngày check-in
      for (let i = 0; i < calendarDays.length; i++) {
        const calendarDay = calendarDays[i];
        const currentDate = new Date(calendarDay.date);
        currentDate.setHours(0, 0, 0, 0);

        // Nếu tìm thấy ngày check-in
        if (currentDate.getTime() === checkIn.getTime()) {
          const dateKey = currentDate.toDateString();
          const dayInMap = daysMap.get(dateKey);

          // Tính số ngày còn lại trong tuần (để không vượt qua sang hàng khác)
          const dayOfWeek = currentDate.getDay();
          const daysUntilEndOfWeek = 6 - dayOfWeek + 1; // Số ngày từ hôm nay đến hết Thứ 7

          // Tính tổng số ngày của booking
          const totalBookingDays =
            Math.ceil(
              (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
            ) + 1;

          if (dayInMap) {
            // Span không được vượt qua cuối tuần (để không tràn sang hàng dưới)
            const spanDays = Math.min(daysUntilEndOfWeek, totalBookingDays);

            // Tính vị trí để xếp chồng
            const existingBookings = dayInMap.bookings.filter((b) => b.isStart);
            const position = existingBookings.length;

            dayInMap.bookings.push({
              booking,
              room,
              isStart: true,
              isEnd: false,
              spanDays,
              position,
            });
          }

          // Nếu booking kéo dài qua tuần tiếp theo
          if (totalBookingDays > daysUntilEndOfWeek) {
            // Tìm Chủ nhật tuần tiếp theo
            let nextWeekStart = i + daysUntilEndOfWeek;
            let remainingDays = totalBookingDays - daysUntilEndOfWeek;

            while (remainingDays > 0 && nextWeekStart < calendarDays.length) {
              const nextWeekDay = calendarDays[nextWeekStart];
              const nextDateKey = nextWeekDay.date.toDateString();
              const nextDayInMap = daysMap.get(nextDateKey);

              if (nextDayInMap) {
                // Tính span cho tuần này (tối đa 7 ngày)
                const nextSpanDays = Math.min(7, remainingDays);

                // Tính vị trí
                const existingNextBookings = nextDayInMap.bookings.filter(
                  (b) => b.isStart
                );
                const nextPosition = existingNextBookings.length;

                nextDayInMap.bookings.push({
                  booking,
                  room,
                  isStart: true,
                  isEnd: false,
                  spanDays: nextSpanDays,
                  position: nextPosition,
                });

                remainingDays -= nextSpanDays;
                nextWeekStart += 7;
              } else {
                break;
              }
            }
          }

          break;
        }
      }
    });

    return Array.from(daysMap.values());
  }, [calendarDays, bookings, rooms]);

  const previousMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const goToday = () => {
    setCurrentDate(new Date());
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString("vi-VN", {
      month: "long",
      year: "numeric",
    });
  };

  const statusColors = {
    confirmed: "bg-amber-500",
    "checked-in": "bg-emerald-500",
    "checked-out": "bg-rose-500",
  };

  const statusBorderColors = {
    confirmed: "border-amber-600",
    "checked-in": "border-emerald-600",
    "checked-out": "border-rose-600",
  };

  const handleMouseEnter = (
    booking: RoomBooking,
    room: Room,
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    // Hủy timeout nếu đang có
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    setSelectedBooking({
      booking,
      room,
      position: {
        x: rect.left + rect.width / 2,
        y: rect.top - 10,
      },
    });
  };

  const handleMouseLeave = () => {
    // Đặt timeout để đóng popup
    closeTimeoutRef.current = setTimeout(() => {
      setSelectedBooking(null);
    }, 100);
  };

  const handlePopupMouseEnter = () => {
    // Hủy timeout khi hover vào popup
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handlePopupMouseLeave = () => {
    // Đóng popup khi rời khỏi popup
    setSelectedBooking(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {viewMode === "month"
                ? formatMonth(currentDate)
                : `Tuần ${Math.ceil(
                    selectedDate.getDate() / 7
                  )} - ${formatMonth(selectedDate)}`}
            </h2>
            <button
              onClick={goToday}
              className="px-4 py-2 text-sm bg-[#6b5e4c] text-white rounded-lg hover:bg-[#5a4d3e] transition-colors"
            >
              Hôm nay
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaChevronLeft className="text-gray-600" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaChevronRight className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* View Mode Toggle & Date Picker */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("month")}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                viewMode === "month"
                  ? "bg-white text-[#6b5e4c] font-semibold shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Tháng
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={`px-4 py-2 text-sm rounded-md transition-colors ${
                viewMode === "week"
                  ? "bg-white text-[#6b5e4c] font-semibold shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Tuần
            </button>
          </div>

          {/* Date Picker */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 font-medium">
              Chọn ngày:
            </label>
            <input
              type="date"
              value={selectedDate.toISOString().split("T")[0]}
              onChange={(e) => {
                const newDate = new Date(e.target.value);
                setSelectedDate(newDate);
                setCurrentDate(newDate);
                if (viewMode === "week") {
                  // Force re-render week view
                  setViewMode("month");
                  setTimeout(() => setViewMode("week"), 0);
                }
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6b5e4c] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="border border-[#ebe3d7] rounded-lg overflow-hidden">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 bg-[#f5f0eb]">
          {weekDays.map((day, idx) => (
            <div
              key={idx}
              className="p-3 text-center font-semibold text-[#6b5e4c] border-r border-[#ebe3d7] last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {calendarWithBookings.map((day, idx) => {
            const maxBookings = Math.max(
              day.bookings.filter((b) => b.isStart).length,
              1
            );
            const minHeight = 100 + maxBookings * 32; // 32px per booking

            return (
              <div
                key={idx}
                className={`border-r border-b border-[#ebe3d7] p-2 last:border-r-0 ${
                  !day.isCurrentMonth ? "bg-gray-50" : "bg-white"
                } ${
                  day.date.toDateString() === new Date().toDateString()
                    ? "bg-blue-50"
                    : ""
                }`}
                style={{ minHeight: `${minHeight}px` }}
              >
                {/* Date Number */}
                <div
                  className={`text-sm font-semibold mb-1 ${
                    day.isCurrentMonth ? "text-gray-800" : "text-gray-400"
                  } ${
                    day.date.toDateString() === new Date().toDateString()
                      ? "text-blue-600"
                      : ""
                  }`}
                >
                  {day.date.getDate()}
                </div>

                {/* Bookings */}
                <div
                  className="relative"
                  style={{ minHeight: `${maxBookings * 32}px` }}
                >
                  {day.bookings
                    .filter((item) => item.isStart)
                    .map((item, bookingIdx) => {
                      // Tính width để kéo dài qua nhiều cells
                      // Mỗi cell có border, nên cần tính cả border width
                      const cellWidth = 100; // 100% của 1 cell
                      const gapBetweenCells = 1; // border width ~1px
                      const totalWidth = `calc(${
                        item.spanDays * cellWidth
                      }% + ${(item.spanDays - 1) * gapBetweenCells}px)`;

                      return (
                        <div
                          key={bookingIdx}
                          onMouseEnter={(e) =>
                            handleMouseEnter(item.booking, item.room, e)
                          }
                          onMouseLeave={handleMouseLeave}
                          className={`${statusColors[item.booking.status]} ${
                            statusBorderColors[item.booking.status]
                          } text-white text-xs px-2 py-1.5 rounded-md cursor-pointer hover:opacity-90 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 truncate absolute border-l-4 font-medium`}
                          style={{
                            width: totalWidth,
                            top: `${item.position * 32}px`,
                            left: 0,
                            zIndex:
                              selectedBooking?.booking.id === item.booking.id
                                ? 20
                                : 10 + item.position,
                          }}
                        >
                          <div className="flex items-center gap-1 whitespace-nowrap overflow-hidden">
                            <span className="font-bold">
                              {item.room.roomNumber}
                            </span>
                            <span className="opacity-90">•</span>
                            <span className="truncate">
                              {item.booking.guestName}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-4 bg-amber-500 rounded border-l-4 border-amber-600" />
          <span className="text-gray-700 font-medium">Đã xác nhận</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-4 bg-emerald-500 rounded border-l-4 border-emerald-600" />
          <span className="text-gray-700 font-medium">Đang ở</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-4 bg-rose-500 rounded border-l-4 border-rose-600" />
          <span className="text-gray-700 font-medium">Đã trả phòng</span>
        </div>
      </div>

      {/* Booking Info Popup */}
      {selectedBooking && (
        <BookingInfoPopup
          booking={selectedBooking.booking}
          room={selectedBooking.room}
          position={selectedBooking.position}
          onClose={handlePopupMouseLeave}
          onMouseEnter={handlePopupMouseEnter}
          onMouseLeave={handlePopupMouseLeave}
        />
      )}
    </div>
  );
};

export default RoomCalendarView;
