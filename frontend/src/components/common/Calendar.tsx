import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
    selectedDate: Date | null;
    onDateSelect: (date: Date) => void;
    minDate?: Date | null; // Ngày tối thiểu có thể chọn
    maxDate?: Date | null; // Ngày tối đa có thể chọn (nếu cần)
}

export default function Calendar({
    selectedDate,
    onDateSelect,
    minDate = null,
    maxDate = null,
}: CalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const monthName = currentMonth.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    });
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    const handlePrevMonth = () => {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1),
        );
    };

    const handleNextMonth = () => {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1),
        );
    };

    const handleDateClick = (day: number) => {
        const newDate = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            day,
        );
        onDateSelect(newDate);

        // Kiểm tra xem ngày có hợp lệ không
        if (!isDateDisabled(day)) {
            onDateSelect(newDate);
        }
    };

    // Kiểm tra xem ngày có bị disabled không
    const isDateDisabled = (day: number) => {
        const date = new Date(
            currentMonth.getFullYear(),
            currentMonth.getMonth(),
            day,
        );

        // Reset giờ về 00:00:00 để so sánh chính xác ngày
        date.setHours(0, 0, 0, 0);

        if (minDate) {
            const min = new Date(minDate);
            min.setHours(0, 0, 0, 0);
            if (date < min) return true;
        }

        if (maxDate) {
            const max = new Date(maxDate);
            max.setHours(0, 0, 0, 0);
            if (date > max) return true;
        }

        return false;
    };

    const isDateSelected = (day: number) => {
        if (!selectedDate) return false;
        return (
            selectedDate.getDate() === day &&
            selectedDate.getMonth() === currentMonth.getMonth() &&
            selectedDate.getFullYear() === currentMonth.getFullYear()
        );
    };

    return (
        <div className="w-full">
            {/* Month Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-semibold text-gray-900">
                    {monthName}
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={handlePrevMonth}
                        className="p-1 hover:bg-gray-100 rounded transition"
                    >
                        <ChevronLeft size={18} className="text-gray-600" />
                    </button>
                    <button
                        onClick={handleNextMonth}
                        className="p-1 hover:bg-gray-100 rounded transition"
                    >
                        <ChevronRight size={18} className="text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
                    <div
                        key={day}
                        className="text-center text-xs font-semibold text-gray-600 py-2"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                    const disabled = day ? isDateDisabled(day) : true;
                    return (
                        <button
                            key={index}
                            onClick={() => day && handleDateClick(day)}
                            disabled={!day}
                            className={`aspect-square flex items-center justify-center text-sm font-medium rounded transition ${
                                !day
                                    ? 'text-gray-300 cursor-default'
                                    : disabled
                                    ? 'text-gray-300 cursor-not-allowed bg-gray-50'
                                    : isDateSelected(day)
                                    ? 'bg-[#c9b8a8] text-white font-semibold'
                                    : 'text-gray-900 hover:bg-gray-100'
                            }`}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
