import React, { useEffect, useMemo, useState } from 'react';
import {getAllRooms } from '../../services/roomService';
import type { Room } from '../../types/Room';
import RoomCard from '../../components/RoomCard';
import Dropdown from '../../components/Dropdown';
import RoomCompareBar from '../../components/customer/RoomCompareBar';
import RoomCompareModal from '../../components/customer/RoomCompareModal';
import Header from '../../components/Header';

export default function RoomList() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Compare functionality
    const [compareRooms, setCompareRooms] = useState<Room[]>([]);
    const [showCompareModal, setShowCompareModal] = useState(false);
    const [isModalMinimized, setIsModalMinimized] = useState(false);
    const MAX_COMPARE = 3;

    // Filters
    const [selectedType, setSelectedType] = useState('');
    const [guests, setGuests] = useState(1);
    const [minPrice, setMinPrice] = useState<number | ''>('');
    const [maxPrice, setMaxPrice] = useState<number | ''>('');
    const [checkIn, setCheckIn] = useState<string>('');
    const [checkOut, setCheckOut] = useState<string>('');

    // Sort state
    const [sortOrder, setSortOrder] = useState<'price_asc' | 'price_desc' | ''>(
        '',
    );

    // UI open/close
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        accommodation: false,
        checkIn: false,
        checkOut: false,
        guests: false,
        price: false,
    });

    const toggleSection = (key: string) =>
        setOpenSections((s) => ({ ...s, [key]: !s[key] }));

    // Fetch rooms
    useEffect(() => {
        setLoading(true);
          getAllRooms()
            .then((data) => {
                setRooms(Array.isArray(data) ? data : []);
                setError(null);
            })
            .catch((err) => {
                setError((err as Error)?.message || '');
            })
            .finally(() => setLoading(false));
    }, []);

    const roomTypes = useMemo(() => {
        const setType = new Set<string>();
        rooms.forEach((r) => {
            if (r.roomType?.typeName) setType.add(r.roomType?.typeName);
        });
        return [...setType];
    }, [rooms]);

    const computedPriceRange = useMemo(() => {
        const prices = rooms
            .map((r) => r.roomType?.basePrice ?? 0)
            .filter((p) => p > 0);
        return prices.length
            ? { min: Math.min(...prices), max: Math.max(...prices) }
            : { min: 0, max: 0 };
    }, [rooms]);

    const filteredRooms = rooms.filter((r) => {
        const price = r.roomType?.basePrice ?? 0;

        if (selectedType && r.roomType?.typeName !== selectedType) return false;
        if (minPrice !== '' && price < Number(minPrice)) return false;
        if (maxPrice !== '' && price > Number(maxPrice)) return false;
        if (
            guests &&
            r.roomType?.maxOccupancy &&
            guests > r.roomType.maxOccupancy
        )
            return false;

        return true;
    });

    // Computed displayedRooms = filtered + sorted
    const displayedRooms = useMemo(() => {
        if (!sortOrder) return filteredRooms;
        const copy = [...filteredRooms];
        copy.sort((a, b) => {
            const pa = a.roomType?.basePrice ?? 0;
            const pb = b.roomType?.basePrice ?? 0;
            if (sortOrder === 'price_asc') return pa - pb;
            return pb - pa;
        });
        return copy;
    }, [filteredRooms, sortOrder]);

    const clearFilters = () => {
        setSelectedType('');
        setGuests(1);
        setMinPrice('');
        setMaxPrice('');
        setSortOrder('');
        setCheckIn('');
        setCheckOut('');
    };

    // Compare handlers
    const handleCompareToggle = (room: Room) => {
        setCompareRooms((prev) => {
            const exists = prev.some((r) => r.roomNumber === room.roomNumber);
            if (exists) {
                return prev.filter((r) => r.roomNumber !== room.roomNumber);
            } else {
                if (prev.length >= MAX_COMPARE) {
                    alert(`Bạn chỉ có thể so sánh tối đa ${MAX_COMPARE} phòng`);
                    return prev;
                }
                return [...prev, room];
            }
        });
    };

    const handleRemoveFromCompare = (roomNumber: string) => {
        setCompareRooms((prev) =>
            prev.filter((r) => r.roomNumber !== roomNumber),
        );
    };

    const handleClearCompare = () => {
        setCompareRooms([]);
    };

    const handleOpenCompareModal = () => {
        if (compareRooms.length < 2) {
            alert('Vui lòng chọn ít nhất 2 phòng để so sánh');
            return;
        }
        setShowCompareModal(true);
    };

    const handleCloseCompareModal = () => {
        setShowCompareModal(false);
        setIsModalMinimized(false);
    };

    // Sort options for Dropdown
    const sortOptions = [
        { value: '', label: 'Default' },
        { value: 'price_asc', label: 'Price: Low → High' },
        { value: 'price_desc', label: 'Price: High → Low' },
    ];

    const handleSortChange = (val: string) =>
        setSortOrder(val as 'price_asc' | 'price_desc' | '');

  return (
      <div>
          <div className="fixed top-0 left-0 w-full z-50 bg-white shadow">
              <Header />
          </div>

          <div
              style={{
                  background: 'var(--gradient-cream)',
                  fontFamily: 'var(--font-sans)',
              }}
          >
              {/* Header Section */}
              <div className="max-w-2xl text-center flex flex-col mx-auto pt-28 pb-8 px-4">
                  <h5 className="text-3xl font-semibold text-gray-800 mb-4 tracking-wide">
                      Room
                  </h5>
                  <p className="text-lg text-gray-600 leading-relaxed">
                      Our palatial suites extend over two exquisitely detailed
                      floors, connected by grand staircases. Inspiring and
                      intimate in equal measure.
                  </p>
              </div>

              <div className="container mx-auto px-6 py-10 grid grid-cols-12 gap-8">
                  {/* SIDEBAR - Sticky on large screens */}
                  <aside className="col-span-12 lg:col-span-4 xl:col-span-3">
                      <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)]">
                          <div className="h-full overflow-auto custom-scrollbar">
                              {/* Filter Content */}
                              <div className="px-5 py-4 space-y-6">
                                  {/* Header */}
                                  <div className="flex items-center justify-between">
                                      <button
                                          onClick={clearFilters}
                                          className="text-sm tracking-widest text-gray-600 hover:underline hover:text-gray-900 transition-colors"
                                      >
                                          CLEAR ALL
                                      </button>
                                  </div>

                                  <div className="h-px bg-gray-100" />

                                  {/* Scrollable filter body */}
                                  <div className="space-y-6 pb-4">
                                      {/* Accommodation Options */}
                                      <section>
                                          <div className="flex items-center justify-between">
                                              <h4 className="text-sm font-medium text-gray-700">
                                                  Accommodation Options
                                              </h4>

                                              <button
                                                  onClick={() =>
                                                      toggleSection(
                                                          'accommodation',
                                                      )
                                                  }
                                                  aria-expanded={
                                                      openSections.accommodation
                                                  }
                                                  className={`p-1 rounded-md transform transition-transform duration-200 ${
                                                      openSections.accommodation
                                                          ? 'rotate-180'
                                                          : ''
                                                  }`}
                                              >
                                                  <svg
                                                      className="w-4 h-4 text-gray-600"
                                                      viewBox="0 0 24 24"
                                                      fill="none"
                                                      stroke="currentColor"
                                                  >
                                                      <path
                                                          strokeLinecap="round"
                                                          strokeLinejoin="round"
                                                          strokeWidth={2}
                                                          d="M6 9l6 6 6-6"
                                                      />
                                                  </svg>
                                              </button>
                                          </div>

                                          {/* Collapse Body */}
                                          <div
                                              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                                  openSections.accommodation
                                                      ? 'max-h-96 opacity-100 translate-y-0'
                                                      : 'max-h-0 opacity-0 -translate-y-2'
                                              }`}
                                          >
                                              <div className="mt-3 space-y-3">
                                                  <label className="flex items-center gap-3 cursor-pointer">
                                                      <input
                                                          type="checkbox"
                                                          checked={
                                                              selectedType ===
                                                              ''
                                                          }
                                                          onChange={() =>
                                                              setSelectedType(
                                                                  '',
                                                              )
                                                          }
                                                          className="h-5 w-5 rounded-sm border-2 border-gray-300 checked:bg-[#CCBDA3] checked:border-[#CCBDA3] focus:outline-none cursor-pointer"
                                                      />
                                                      <span className="text-xs uppercase tracking-widest text-gray-700">
                                                          All
                                                      </span>
                                                  </label>

                                                  {roomTypes.map((t) => (
                                                      <label
                                                          key={t}
                                                          className="flex items-center gap-3 cursor-pointer"
                                                      >
                                                          <input
                                                              type="checkbox"
                                                              checked={
                                                                  selectedType ===
                                                                  t
                                                              }
                                                              onChange={() =>
                                                                  setSelectedType(
                                                                      t,
                                                                  )
                                                              }
                                                              className="h-5 w-5 rounded-sm border-2 border-gray-300 checked:bg-[#CCBDA3] checked:border-[#CCBDA3] focus:outline-none cursor-pointer"
                                                          />
                                                          <span className="text-xs uppercase tracking-widest text-gray-700">
                                                              {t}
                                                          </span>
                                                      </label>
                                                  ))}
                                              </div>
                                          </div>
                                      </section>

                                      <div className="h-px bg-gray-100" />

                                      {/* Check In */}
                                      <section>
                                          <div className="flex items-center justify-between">
                                              <h4 className="text-sm font-medium text-gray-700">
                                                  Check In
                                              </h4>

                                              <button
                                                  onClick={() =>
                                                      toggleSection('checkIn')
                                                  }
                                                  aria-expanded={
                                                      openSections.checkIn
                                                  }
                                                  className={`p-1 rounded-md transform transition-transform duration-200 ${
                                                      openSections.checkIn
                                                          ? 'rotate-180'
                                                          : ''
                                                  }`}
                                              >
                                                  <svg
                                                      className="w-4 h-4 text-gray-600"
                                                      viewBox="0 0 24 24"
                                                      fill="none"
                                                      stroke="currentColor"
                                                  >
                                                      <path
                                                          strokeLinecap="round"
                                                          strokeLinejoin="round"
                                                          strokeWidth={2}
                                                          d="M6 9l6 6 6-6"
                                                      />
                                                  </svg>
                                              </button>
                                          </div>

                                          <div
                                              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                                  openSections.checkIn
                                                      ? 'max-h-40 opacity-100 translate-y-0'
                                                      : 'max-h-0 opacity-0 -translate-y-2'
                                              }`}
                                          >
                                              <div className="mt-3">
                                                  <input
                                                      type="date"
                                                      value={checkIn}
                                                      onChange={(e) =>
                                                          setCheckIn(
                                                              e.target.value,
                                                          )
                                                      }
                                                      className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#CCBDA3] focus:border-[#CCBDA3]"
                                                  />
                                              </div>
                                          </div>
                                      </section>

                                      <div className="h-px bg-gray-100" />

                                      {/* Check Out */}
                                      <section>
                                          <div className="flex items-center justify-between">
                                              <h4 className="text-sm font-medium text-gray-700">
                                                  Check Out
                                              </h4>

                                              <button
                                                  onClick={() =>
                                                      toggleSection('checkOut')
                                                  }
                                                  aria-expanded={
                                                      openSections.checkOut
                                                  }
                                                  className={`p-1 rounded-md transform transition-transform duration-200 ${
                                                      openSections.checkOut
                                                          ? 'rotate-180'
                                                          : ''
                                                  }`}
                                              >
                                                  <svg
                                                      className="w-4 h-4 text-gray-600"
                                                      viewBox="0 0 24 24"
                                                      fill="none"
                                                      stroke="currentColor"
                                                  >
                                                      <path
                                                          strokeLinecap="round"
                                                          strokeLinejoin="round"
                                                          strokeWidth={2}
                                                          d="M6 9l6 6 6-6"
                                                      />
                                                  </svg>
                                              </button>
                                          </div>

                                          <div
                                              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                                  openSections.checkOut
                                                      ? 'max-h-40 opacity-100 translate-y-0'
                                                      : 'max-h-0 opacity-0 -translate-y-2'
                                              }`}
                                          >
                                              <div className="mt-3">
                                                  <input
                                                      type="date"
                                                      value={checkOut}
                                                      onChange={(e) =>
                                                          setCheckOut(
                                                              e.target.value,
                                                          )
                                                      }
                                                      className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#CCBDA3] focus:border-[#CCBDA3]"
                                                  />
                                              </div>
                                          </div>
                                      </section>

                                      <div className="h-px bg-gray-100" />

                                      {/* Guests */}
                                      <section>
                                          <div className="flex items-center justify-between mb-3">
                                              <h4 className="text-sm font-medium text-gray-700">
                                                  Guests
                                              </h4>

                                              <button
                                                  onClick={() =>
                                                      toggleSection('guests')
                                                  }
                                                  aria-expanded={
                                                      openSections.guests
                                                  }
                                                  className={`p-1 rounded-md transform transition-transform duration-200 ${
                                                      openSections.guests
                                                          ? 'rotate-180'
                                                          : ''
                                                  }`}
                                              >
                                                  <svg
                                                      className="w-4 h-4 text-gray-600"
                                                      viewBox="0 0 24 24"
                                                      fill="none"
                                                      stroke="currentColor"
                                                  >
                                                      <path
                                                          strokeLinecap="round"
                                                          strokeLinejoin="round"
                                                          strokeWidth={2}
                                                          d="M6 9l6 6 6-6"
                                                      />
                                                  </svg>
                                              </button>
                                          </div>

                                          <div
                                              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                                  openSections.guests
                                                      ? 'max-h-40 opacity-100 translate-y-0'
                                                      : 'max-h-0 opacity-0 -translate-y-2'
                                              }`}
                                          >
                                              <input
                                                  type="number"
                                                  value={guests}
                                                  min={1}
                                                  onChange={(e) =>
                                                      setGuests(
                                                          Number(
                                                              e.target.value,
                                                          ),
                                                      )
                                                  }
                                                  className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#CCBDA3] focus:border-[#CCBDA3]"
                                              />
                                          </div>
                                      </section>

                                      <div className="h-px bg-gray-100" />

                                      {/* Price Range */}
                                      <section>
                                          <div className="flex items-center justify-between mb-3">
                                              <h4 className="text-sm font-medium text-gray-700">
                                                  Price Range
                                              </h4>

                                              <button
                                                  onClick={() =>
                                                      toggleSection('price')
                                                  }
                                                  aria-expanded={
                                                      openSections.price
                                                  }
                                                  className={`p-1 rounded-md transform transition-transform duration-200 ${
                                                      openSections.price
                                                          ? 'rotate-180'
                                                          : ''
                                                  }`}
                                              >
                                                  <svg
                                                      className="w-4 h-4 text-gray-600"
                                                      viewBox="0 0 24 24"
                                                      fill="none"
                                                      stroke="currentColor"
                                                  >
                                                      <path
                                                          strokeLinecap="round"
                                                          strokeLinejoin="round"
                                                          strokeWidth={2}
                                                          d="M6 9l6 6 6-6"
                                                      />
                                                  </svg>
                                              </button>
                                          </div>

                                          <div
                                              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                                  openSections.price
                                                      ? 'max-h-40 opacity-100 translate-y-0'
                                                      : 'max-h-0 opacity-0 -translate-y-2'
                                              }`}
                                          >
                                              <div className="flex gap-2">
                                                  <input
                                                      type="number"
                                                      placeholder={`Min ${
                                                          computedPriceRange.min ||
                                                          0
                                                      }`}
                                                      value={minPrice}
                                                      onChange={(e) =>
                                                          setMinPrice(
                                                              e.target.value ===
                                                                  ''
                                                                  ? ''
                                                                  : Number(
                                                                        e.target
                                                                            .value,
                                                                    ),
                                                          )
                                                      }
                                                      className="w-1/2 rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#CCBDA3] focus:border-[#CCBDA3]"
                                                  />
                                                  <input
                                                      type="number"
                                                      placeholder={`Max ${
                                                          computedPriceRange.max ||
                                                          0
                                                      }`}
                                                      value={maxPrice}
                                                      onChange={(e) =>
                                                          setMaxPrice(
                                                              e.target.value ===
                                                                  ''
                                                                  ? ''
                                                                  : Number(
                                                                        e.target
                                                                            .value,
                                                                    ),
                                                          )
                                                      }
                                                      className="w-1/2 rounded-md border border-gray-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#CCBDA3] focus:border-[#CCBDA3]"
                                                  />
                                              </div>
                                          </div>
                                      </section>
                                  </div>
                              </div>

                              {/* Sticky Footer */}
                              <div className="sticky bottom-0 px-5 py-4 border-t border-gray-200">
                                  <button
                                      onClick={() => {
                                          // Apply filters logic here
                                          console.log('Filters applied');
                                      }}
                                      className="w-full flex items-center justify-center gap-3 rounded-md border border-gray-300 px-4 py-3 text-sm font-medium tracking-widest uppercase hover:shadow-md hover:bg-gray-50 transition-all"
                                  >
                                      <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="w-4 h-4"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                      >
                                          <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 019 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
                                          />
                                      </svg>
                                      Apply Filters
                                  </button>
                              </div>
                          </div>
                      </div>
                  </aside>

                  {/* ROOM RESULTS */}
                  <main className="col-span-12 lg:col-span-8 xl:col-span-9">
                      {/* Header with sort */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                          <div>
                              <h2 className="text-2xl font-semibold text-gray-800">
                                  Rooms
                              </h2>
                              <p className="text-sm text-gray-500 mt-1">
                                  {displayedRooms.length} options · curated for
                                  comfort
                              </p>
                          </div>

                          {/* Sort Dropdown */}
                          <div className="w-full sm:w-auto">
                              <Dropdown
                                  options={sortOptions}
                                  value={sortOrder}
                                  onChange={handleSortChange}
                                  className="sm:w-56"
                                  placeholder="Sort"
                              />
                          </div>
                      </div>

                      {/* Loading State */}
                      {loading && (
                          <div className="flex items-center justify-center py-20">
                              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#CCBDA3]"></div>
                          </div>
                      )}

                      {/* Error State */}
                      {error && (
                          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
                              {error}
                          </div>
                      )}

                      {/* Empty State */}
                      {!loading && !error && displayedRooms.length === 0 && (
                          <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center text-gray-600">
                              <svg
                                  className="mx-auto h-12 w-12 text-gray-400 mb-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                              >
                                  <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                  />
                              </svg>
                              <p className="text-lg font-medium">
                                  Không có phòng phù hợp
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                  Hãy thử điều chỉnh bộ lọc của bạn
                              </p>
                          </div>
                      )}

                    {/* Room Cards Grid */}
                    {!loading && !error && displayedRooms.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {displayedRooms.map((r) => (
                                <div
                                    key={r.roomNumber}
                                    className="transform transition-all duration-300 hover:scale-[1.02]"
                                >
                                    <RoomCard
                                        room={r}
                                        onCompareToggle={handleCompareToggle}
                                        isInCompare={compareRooms.some(
                                            (cr) =>
                                                cr.roomNumber === r.roomNumber,
                                        )}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* Compare Bar - Hidden when modal is minimized */}
            {!isModalMinimized && (
                <RoomCompareBar
                    selectedRooms={compareRooms}
                    onRemove={handleRemoveFromCompare}
                    onCompare={handleOpenCompareModal}
                    onClear={handleClearCompare}
                />
            )}

            {/* Compare Modal */}
            {showCompareModal && (
                <RoomCompareModal
                    rooms={compareRooms}
                    onClose={handleCloseCompareModal}
                    onRemoveRoom={handleRemoveFromCompare}
                    onMinimizeChange={setIsModalMinimized}
                />
            )}

              {/* Custom Scrollbar Styles */}
              <style>{`
                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: #ccbda3 #f3f4f6;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f3f4f6;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #ccbda3;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #b8a88a;
                }
            `}</style>
          </div>
      </div>
  );
}
