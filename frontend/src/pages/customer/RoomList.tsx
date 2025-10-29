import React, { useEffect, useMemo, useState } from 'react';
import RoomService from '../../services/roomService';
import type { Room } from '../../types/Room';
import RoomCard from '../../components/RoomCard';

export default function RoomList() {
    const baseUrl = process.env.REACT_APP_API_URL || ''; // ensure .env has REACT_APP_API_URL
    const getAuthToken = () => localStorage.getItem('token') || null;
    const service = useMemo(
        () => new RoomService(baseUrl, getAuthToken),
        [baseUrl],
    );

    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [checkIn, setCheckIn] = useState<string>('');
    const [checkOut, setCheckOut] = useState<string>('');
    const [guests, setGuests] = useState<number>(1);
    const [selectedType, setSelectedType] = useState<string>('');
    const [minPrice, setMinPrice] = useState<number | ''>('');
    const [maxPrice, setMaxPrice] = useState<number | ''>('');

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        service
            .getRooms()
            .then((data) => {
                if (!mounted) return;
                setRooms(Array.isArray(data) ? data : []);
                setError(null);
            })
            .catch((err) => {
                console.error(err);
                setError('Không thể tải danh sách phòng.');
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });
        return () => {
            mounted = false;
        };
    }, [service]);

    const roomTypes = useMemo(() => {
        const map = new Map<string, string>();
        rooms.forEach((r) => {
            const tname = r.roomType?.name || 'Unknown';
            if (!map.has(tname) && r.roomType?.name) map.set(tname, tname);
        });
        return Array.from(map.values());
    }, [rooms]);

    const computedPriceRange = useMemo(() => {
        const prices = rooms
            .map((r) => r.roomType?.basePrice ?? 0)
            .filter((p) => p > 0);
        if (prices.length === 0) return { min: 0, max: 0 };
        return { min: Math.min(...prices), max: Math.max(...prices) };
    }, [rooms]);

    // Apply filters client-side
    const filteredRooms = rooms.filter((r) => {
        const price = r.roomType?.basePrice ?? 0;
        if (selectedType && (r.roomType?.name || '') !== selectedType)
            return false;
        if (minPrice !== '' && price < Number(minPrice)) return false;
        if (maxPrice !== '' && price > Number(maxPrice)) return false;
        if (
            guests &&
            r.roomType?.maxOccupancy &&
            guests > r.roomType.maxOccupancy
        )
            return false;
        // For dates: assume availability not known client-side; skip availability check or filter by status
        if (r.status === 'BOOKED' || r.status === 'MAINTENANCE') return false;
        return true;
    });

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Search criteria - always visible */}
            <div className="sticky top-4 bg-white z-10 p-4 rounded-lg shadow-sm mb-6">
                <h2 className="text-2xl font-semibold mb-3">Tìm kiếm phòng</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                    <div>
                        <label className="block text-sm text-gray-600">
                            Check-in
                        </label>
                        <input
                            type="date"
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            className="mt-1 w-full border rounded px-2 py-1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600">
                            Check-out
                        </label>
                        <input
                            type="date"
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            className="mt-1 w-full border rounded px-2 py-1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600">
                            Khách
                        </label>
                        <input
                            type="number"
                            min={1}
                            value={guests}
                            onChange={(e) => setGuests(Number(e.target.value))}
                            className="mt-1 w-full border rounded px-2 py-1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600">
                            Loại phòng
                        </label>
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="mt-1 w-full border rounded px-2 py-1"
                        >
                            <option value="">Tất cả</option>
                            {roomTypes.map((rt) => (
                                <option key={rt} value={rt}>
                                    {rt}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-600">
                            Giá từ
                        </label>
                        <input
                            type="number"
                            min={computedPriceRange.min}
                            value={minPrice}
                            onChange={(e) =>
                                setMinPrice(
                                    e.target.value === ''
                                        ? ''
                                        : Number(e.target.value),
                                )
                            }
                            placeholder={`${computedPriceRange.min || 0}`}
                            className="mt-1 w-full border rounded px-2 py-1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600">
                            Giá tới
                        </label>
                        <input
                            type="number"
                            max={computedPriceRange.max}
                            value={maxPrice}
                            onChange={(e) =>
                                setMaxPrice(
                                    e.target.value === ''
                                        ? ''
                                        : Number(e.target.value),
                                )
                            }
                            placeholder={`${computedPriceRange.max || 0}`}
                            className="mt-1 w-full border rounded px-2 py-1"
                        />
                    </div>

                    <div className="md:col-span-2 flex space-x-3">
                        <button
                            onClick={() => {
                                /* Currently filters apply instantly; maybe reset dates or other logic */
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded"
                        >
                            Tìm kiếm
                        </button>
                        <button
                            onClick={() => {
                                setCheckIn('');
                                setCheckOut('');
                                setGuests(1);
                                setSelectedType('');
                                setMinPrice('');
                                setMaxPrice('');
                            }}
                            className="px-4 py-2 bg-gray-200 rounded"
                        >
                            Đặt lại
                        </button>
                    </div>
                </div>
            </div>

            {/* Results */}
            <div>
                {loading && <p>Đang tải phòng...</p>}
                {error && <p className="text-red-600">{error}</p>}
                {!loading && !error && filteredRooms.length === 0 && (
                    <p>Không có phòng phù hợp với tiêu chí.</p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {filteredRooms.map((r) => (
                        <RoomCard key={r.id} room={r} />
                    ))}
                </div>
            </div>
        </div>
    );
}
