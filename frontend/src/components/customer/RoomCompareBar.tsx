import { X } from 'lucide-react';
import type { Room } from '../../types/Room';

interface RoomCompareBarProps {
    selectedRooms: Room[];
    onRemove: (roomNumber: string) => void;
    onCompare: () => void;
    onClear: () => void;
}

export default function RoomCompareBar({
    selectedRooms,
    onRemove,
    onCompare,
    onClear,
}: RoomCompareBarProps) {
    if (selectedRooms.length === 0) return null;

    const maxRooms = 3;
    const emptySlots = maxRooms - selectedRooms.length;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-[#CCBDA3] shadow-2xl">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between gap-4">
                    {/* Left: Selected rooms preview */}
                    <div className="flex items-center gap-4 flex-1 overflow-x-auto">
                        <div className="flex items-center gap-2 min-w-fit">
                            <h3 className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                                So sánh phòng
                            </h3>
                            <span className="px-2 py-0.5 text-xs font-medium text-white bg-[#CCBDA3] rounded-full">
                                {selectedRooms.length}/{maxRooms}
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Selected rooms */}
                            {selectedRooms.map((room) => (
                                <div
                                    key={room.roomNumber}
                                    className="relative group"
                                >
                                    <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-[#CCBDA3] shadow-md">
                                        {room.images &&
                                        room.images.length > 0 ? (
                                            <img
                                                src={room.images[0]}
                                                alt={
                                                    room.roomType?.typeName ||
                                                    room.roomNumber
                                                }
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-400">
                                                No img
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() =>
                                            room.roomNumber &&
                                            onRemove(room.roomNumber)
                                        }
                                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                        aria-label="Remove"
                                    >
                                        <X size={14} />
                                    </button>
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg" />
                                </div>
                            ))}

                            {/* Empty slots */}
                            {Array.from({ length: emptySlots }).map((_, i) => (
                                <div
                                    key={`empty-${i}`}
                                    className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center"
                                >
                                    <span className="text-2xl text-gray-300">
                                        +
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClear}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Xóa tất cả
                        </button>
                        <button
                            onClick={onCompare}
                            disabled={selectedRooms.length < 2}
                            className="px-6 py-2.5 text-sm font-medium text-white bg-[#CCBDA3] rounded-lg hover:bg-[#b8a88a] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md"
                        >
                            So sánh ngay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
