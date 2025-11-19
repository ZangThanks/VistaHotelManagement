import { useState } from 'react';
import { X, Check, Minus, Minimize2, Maximize2 } from 'lucide-react';
import type { Room } from '../../types/Room';

interface RoomCompareModalProps {
    rooms: Room[];
    onClose: () => void;
    onRemoveRoom: (roomNumber: string) => void;
    onMinimizeChange?: (isMinimized: boolean) => void;
}

export default function RoomCompareModal({
    rooms,
    onClose,
    onRemoveRoom,
    onMinimizeChange,
}: RoomCompareModalProps) {
    const [isMinimized, setIsMinimized] = useState(false);
    const [showDifferencesOnly, setShowDifferencesOnly] = useState(false);

    const handleMinimize = (minimized: boolean) => {
        setIsMinimized(minimized);
        onMinimizeChange?.(minimized);
    };

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);

    const features = [
        { key: 'typeName', label: 'Loại phòng', format: (v: string) => v },
        {
            key: 'basePrice',
            label: 'Giá / đêm',
            format: (v: number) => formatPrice(v),
        },
        {
            key: 'maxOccupancy',
            label: 'Số người tối đa',
            format: (v: number) => `${v} người`,
        },
        {
            key: 'roomSize',
            label: 'Diện tích',
            format: (v: number) => `${v} m²`,
        },
        {
            key: 'bedType',
            label: 'Loại giường',
            format: (v: string) => v || 'Không có thông tin',
        },
        {
            key: 'hasBalcony',
            label: 'Ban công',
            format: (v: boolean) =>
                v ? <Check size={20} /> : <Minus size={20} />,
        },
        {
            key: 'hasSeaView',
            label: 'View biển',
            format: (v: boolean) =>
                v ? <Check size={20} /> : <Minus size={20} />,
        },
        { key: 'floor', label: 'Tầng', format: (v: number) => `Tầng ${v}` },
        {
            key: 'description',
            label: 'Mô tả',
            format: (v: string) => v || 'Không có mô tả',
        },
    ];

    // Helper function to check if feature has differences
    const hasFeatureDifference = (feature: { key: string }) => {
        const values = rooms.map((room) => {
            if (feature.key === 'floor') {
                return room.floor;
            } else if (feature.key === 'description') {
                return room.roomType?.description || room.notes;
            } else {
                return room.roomType?.[
                    feature.key as keyof typeof room.roomType
                ];
            }
        });

        // Check if all values are the same
        const firstValue = JSON.stringify(values[0]);
        return !values.every((val) => JSON.stringify(val) === firstValue);
    };

    // Filter features based on showDifferencesOnly
    const displayedFeatures = showDifferencesOnly
        ? features.filter((feature) => hasFeatureDifference(feature))
        : features;

    return (
        <>
            {/* Minimized Button - Bottom Right Corner */}
            {isMinimized && (
                <button
                    onClick={() => handleMinimize(false)}
                    className="fixed bottom-6 right-6 z-50 bg-[#CCBDA3] text-white rounded-full shadow-2xl hover:bg-[#b8a88a] transition-all hover:scale-110 group"
                    aria-label="Expand comparison"
                >
                    <div className="flex items-center gap-3 px-5 py-4">
                        <Maximize2 size={20} />
                        <div className="flex flex-col items-start">
                            <span className="text-sm font-semibold">
                                So sánh ({rooms.length})
                            </span>
                            <span className="text-xs opacity-90">
                                Click để mở rộng
                            </span>
                        </div>
                    </div>
                </button>
            )}

            {/* Full Modal */}
            {!isMinimized && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="relative w-full max-w-7xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                        {/* Header */}
                        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-800">
                                        So sánh phòng
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Đang so sánh {rooms.length} phòng
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleMinimize(true)}
                                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                        aria-label="Minimize"
                                        title="Thu gọn"
                                    >
                                        <Minimize2
                                            size={20}
                                            className="text-gray-600"
                                        />
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                        aria-label="Close"
                                        title="Đóng"
                                    >
                                        <X
                                            size={24}
                                            className="text-gray-600"
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Checkbox filter */}
                            <div className="px-6 py-3 border-b border-gray-100 bg-gray-50">
                                <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={showDifferencesOnly}
                                        onChange={(e) =>
                                            setShowDifferencesOnly(
                                                e.target.checked,
                                            )
                                        }
                                        className="w-4 h-4 rounded border-gray-300 text-[#CCBDA3] focus:ring-[#CCBDA3] cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-700 select-none">
                                        Chỉ xem điểm khác biệt
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Content - Scrollable */}
                        <div className="flex-1 overflow-y-auto overflow-x-auto custom-scrollbar">
                            <table className="w-full border-collapse">
                                <thead className="sticky top-0 bg-gray-50 z-10">
                                    <tr>
                                        <th className="w-48 px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200">
                                            Đặc điểm
                                        </th>
                                        {rooms.map((room) => (
                                            <th
                                                key={room.roomNumber}
                                                className="px-6 py-4 text-center border-b border-l border-gray-200 min-w-[280px]"
                                            >
                                                <div className="relative">
                                                    <button
                                                        onClick={() =>
                                                            room.roomNumber &&
                                                            onRemoveRoom(
                                                                room.roomNumber,
                                                            )
                                                        }
                                                        className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                                        aria-label="Remove room"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                    <div className="aspect-video rounded-lg overflow-hidden mb-3 bg-gray-100">
                                                        {room.images &&
                                                        room.images.length >
                                                            0 ? (
                                                            <img
                                                                src={
                                                                    room
                                                                        .images[0]
                                                                }
                                                                alt={
                                                                    room
                                                                        .roomType
                                                                        ?.typeName ||
                                                                    room.roomNumber
                                                                }
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                No image
                                                            </div>
                                                        )}
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-gray-800">
                                                        {room.roomType
                                                            ?.typeName ||
                                                            room.roomNumber}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        Phòng {room.roomNumber}
                                                    </p>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedFeatures.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={rooms.length + 1}
                                                className="px-6 py-12 text-center text-gray-500"
                                            >
                                                <div className="flex flex-col items-center gap-2">
                                                    <Check
                                                        size={48}
                                                        className="text-green-500"
                                                    />
                                                    <p className="text-lg font-medium">
                                                        Các phòng có thông tin
                                                        giống nhau
                                                    </p>
                                                    <p className="text-sm">
                                                        Không có điểm khác biệt
                                                        nào
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        displayedFeatures.map(
                                            (feature, idx) => (
                                                <tr
                                                    key={feature.key}
                                                    className={
                                                        idx % 2 === 0
                                                            ? 'bg-white'
                                                            : 'bg-gray-50'
                                                    }
                                                >
                                                    <td className="px-6 py-4 text-sm font-medium text-gray-700 border-b border-gray-200">
                                                        {feature.label}
                                                    </td>
                                                    {rooms.map((room) => {
                                                        let value: unknown;
                                                        if (
                                                            feature.key ===
                                                            'floor'
                                                        ) {
                                                            value = room.floor;
                                                        } else if (
                                                            feature.key ===
                                                            'description'
                                                        ) {
                                                            value =
                                                                room.roomType
                                                                    ?.description ||
                                                                room.notes;
                                                        } else {
                                                            value =
                                                                room.roomType?.[
                                                                    feature.key as keyof typeof room.roomType
                                                                ];
                                                        }

                                                        return (
                                                            <td
                                                                key={
                                                                    room.roomNumber
                                                                }
                                                                className="px-6 py-4 text-center text-sm text-gray-600 border-b border-l border-gray-200"
                                                            >
                                                                <div className="flex items-center justify-center">
                                                                    {feature.format(
                                                                        value as never,
                                                                    )}
                                                                </div>
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            ),
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer */}
                        <div className="flex-shrink-0 bg-white border-t border-gray-200 px-6 py-4">
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Đóng
                                </button>
                                <button className="px-6 py-2.5 text-sm font-medium text-white bg-[#CCBDA3] rounded-lg hover:bg-[#b8a88a] transition-colors">
                                    Đặt phòng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Scrollbar & Animation Styles */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #CCBDA3;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #b8a88a;
                }
                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: #CCBDA3 #f1f1f1;
                }
                
                /* Pulse animation for minimized button */
                @keyframes pulse-soft {
                    0%, 100% {
                        box-shadow: 0 0 0 0 rgba(204, 189, 163, 0.7);
                    }
                    50% {
                        box-shadow: 0 0 0 10px rgba(204, 189, 163, 0);
                    }
                }
                
                .fixed.bottom-6.right-6 {
                    animation: pulse-soft 2s infinite;
                }
            `}</style>
        </>
    );
}
