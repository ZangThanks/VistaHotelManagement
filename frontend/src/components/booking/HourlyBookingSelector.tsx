import { useState } from "react";
import { Calendar, Clock, Plus, Minus } from "lucide-react";

interface HourlyBookingSelectorProps {
  checkInDate: Date | null;
  onCheckInDateSelect: (date: Date) => void;
  checkInTime: string;
  onCheckInTimeChange: (time: string) => void;
  duration: number;
  onDurationChange: (hours: number) => void;
  minHours?: number;
  maxHours?: number;
}

export default function HourlyBookingSelector({
  checkInDate,
  onCheckInDateSelect,
  checkInTime,
  onCheckInTimeChange,
  duration,
  onDurationChange,
  minHours = 2,
  maxHours = 9,
}: HourlyBookingSelectorProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate time slots (every 30 minutes from 6:00 to 23:30)
  const generateTimeSlots = () => {
    const slots: string[] = [];
    for (let hour = 6; hour <= 23; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      if (hour < 23) {
        slots.push(`${hour.toString().padStart(2, "0")}:30`);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Calendar logic
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    onCheckInDateSelect(newDate);
  };

  const previousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate check-out time
  const calculateCheckOutTime = () => {
    if (!checkInDate || !checkInTime) return "N/A";

    const [hours, minutes] = checkInTime.split(":").map(Number);
    const checkInDateTime = new Date(checkInDate);
    checkInDateTime.setHours(hours, minutes, 0, 0);

    const checkOutDateTime = new Date(
      checkInDateTime.getTime() + duration * 60 * 60 * 1000
    );

    const outHours = checkOutDateTime.getHours().toString().padStart(2, "0");
    const outMinutes = checkOutDateTime
      .getMinutes()
      .toString()
      .padStart(2, "0");

    return `${checkOutDateTime.toLocaleDateString(
      "en-GB"
    )} ${outHours}:${outMinutes}`;
  };

  const handleDurationChange = (change: number) => {
    const newDuration = duration + change;
    if (newDuration >= minHours && newDuration <= maxHours) {
      onDurationChange(newDuration);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Date Selection */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <label className="block text-sm font-semibold text-gray-900 mb-4">
          Select Date
        </label>
        <div className="flex items-center gap-2 mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <Calendar size={20} className="text-gray-600" />
          <input
            type="text"
            value={checkInDate ? checkInDate.toLocaleDateString("en-GB") : ""}
            readOnly
            className="flex-1 bg-transparent text-gray-900 font-medium focus:outline-none"
            placeholder="Select a date"
          />
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              ←
            </button>
            <h3 className="font-semibold text-gray-900">
              {currentMonth.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h3>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <div
                key={day}
                className="text-center text-xs font-semibold text-gray-600 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: startingDayOfWeek }).map((_, index) => (
              <div key={`empty-${index}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const date = new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth(),
                day
              );
              date.setHours(0, 0, 0, 0);

              const isSelected =
                checkInDate && date.getTime() === checkInDate.getTime();
              const isPast = date < today;

              return (
                <button
                  key={day}
                  onClick={() => !isPast && handleDateClick(day)}
                  disabled={isPast}
                  className={`p-2 text-sm rounded-lg transition ${
                    isSelected
                      ? "bg-[#c9b8a8] text-white font-bold"
                      : isPast
                      ? "text-gray-300 cursor-not-allowed"
                      : "hover:bg-gray-100 text-gray-900"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Time and Duration Selection */}
      <div className="space-y-6">
        {/* Time Selection */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <label className="block text-sm font-semibold text-gray-900 mb-4">
            Check-in Time
          </label>
          <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <Clock size={20} className="text-gray-600" />
            <select
              value={checkInTime}
              onChange={(e) => onCheckInTimeChange(e.target.value)}
              className="flex-1 bg-transparent text-gray-900 font-medium focus:outline-none cursor-pointer"
            >
              <option value="">Select time</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Duration Selection */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <label className="block text-sm font-semibold text-gray-900 mb-4">
            Duration (Hours)
          </label>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => handleDurationChange(-1)}
              disabled={duration <= minHours}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                duration <= minHours
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#c9b8a8] text-white hover:bg-[#b8a896]"
              }`}
            >
              <Minus className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-[#c9b8a8]">
                {duration}
              </span>
              <span className="text-sm text-gray-600">hours</span>
            </div>

            <button
              onClick={() => handleDurationChange(1)}
              disabled={duration >= maxHours}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                duration >= maxHours
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-[#c9b8a8] text-white hover:bg-[#b8a896]"
              }`}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-600">
              Min: {minHours}h | Max: {maxHours}h
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-[#f5f1ed] rounded-lg p-4 border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">Booking Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Check-in:</span>
              <span className="font-medium text-gray-900">
                {checkInDate && checkInTime
                  ? `${checkInDate.toLocaleDateString("en-GB")} ${checkInTime}`
                  : "Not selected"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium text-gray-900">
                {duration} hours
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-gray-300">
              <span className="text-gray-600">Check-out:</span>
              <span className="font-medium text-gray-900">
                {calculateCheckOutTime()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
