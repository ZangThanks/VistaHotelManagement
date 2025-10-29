import React, { useState, useMemo } from "react";
import {
  FaDoorOpen,
  FaBed,
  FaTools,
  FaChartLine,
  FaPlus,
  FaThLarge,
  FaList,
  FaCalendarAlt,
  FaTh,
} from "react-icons/fa";
import RoomStatCard from "../../../components/room/RoomStatCard";
import RoomChart from "../../../components/room/RoomChart";
import RoomTableView from "../../../components/room/RoomTableView";
import RoomCardView from "../../../components/room/RoomCardView";
import RoomCalendarView from "../../../components/room/RoomCalendarView";
import RoomStatusBoard from "../../../components/room/RoomStatusBoard";
import RoomDetailModal from "../../../components/room/RoomDetailModal";
import RoomFilters from "../../../components/room/RoomFilters";
import type { FilterOptions } from "../../../components/room/RoomFilters";
import Pagination from "../../../components/room/Pagination";
import type { Room } from "../../../components/room/RoomTableView";
import { motion } from "framer-motion";

/**
 * Component quản lý phòng
 * Hiển thị overview, chart, danh sách phòng với filter và phân trang
 * Hỗ trợ nhiều view: Card, Table, Calendar, Status Board
 */
const RoomManagement: React.FC = () => {
  // View mode: table, card, calendar, or status
  const [viewMode, setViewMode] = useState<
    "table" | "card" | "calendar" | "status"
  >("status");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected room for detail modal
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Filters
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: "",
    status: "all",
    roomType: "all",
    floor: "all",
    priceRange: "all",
  });

  // Mock data - Thay thế bằng API call thực tế
  const mockRooms: Room[] = useMemo(
    () => [
      {
        id: "1",
        roomNumber: "101",
        roomType: "Deluxe Single",
        floor: 1,
        price: 1200000,
        status: "available",
        capacity: 2,
        amenities: ["WiFi", "TV", "AC", "Minibar"],
        image:
          "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=500",
      },
      {
        id: "2",
        roomNumber: "102",
        roomType: "Deluxe Double",
        floor: 1,
        price: 1500000,
        status: "occupied",
        capacity: 3,
        amenities: ["WiFi", "TV", "AC", "Minibar", "Balcony"],
        image:
          "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500",
      },
      {
        id: "3",
        roomNumber: "201",
        roomType: "Suite",
        floor: 2,
        price: 3000000,
        status: "available",
        capacity: 4,
        amenities: ["WiFi", "TV", "AC", "Minibar", "Kitchen", "Living Room"],
        image:
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500",
      },
      {
        id: "4",
        roomNumber: "202",
        roomType: "Suite",
        floor: 2,
        price: 3200000,
        status: "maintenance",
        capacity: 4,
        amenities: ["WiFi", "TV", "AC", "Minibar", "Jacuzzi"],
        image:
          "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500",
      },
      {
        id: "5",
        roomNumber: "301",
        roomType: "Presidential Suite",
        floor: 3,
        price: 8000000,
        status: "available",
        capacity: 6,
        amenities: ["WiFi", "TV", "AC", "Minibar", "Kitchen", "2 Bathrooms"],
        image:
          "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500",
      },
      {
        id: "6",
        roomNumber: "103",
        roomType: "Standard Single",
        floor: 1,
        price: 800000,
        status: "cleaning",
        capacity: 1,
        amenities: ["WiFi", "TV", "AC"],
        image:
          "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=500",
      },
      {
        id: "7",
        roomNumber: "104",
        roomType: "Standard Double",
        floor: 1,
        price: 1000000,
        status: "available",
        capacity: 2,
        amenities: ["WiFi", "TV", "AC"],
        image:
          "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=500",
      },
      {
        id: "8",
        roomNumber: "203",
        roomType: "Deluxe Double",
        floor: 2,
        price: 1600000,
        status: "occupied",
        capacity: 3,
        amenities: ["WiFi", "TV", "AC", "Minibar", "Sea View"],
        image:
          "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=500",
      },
      {
        id: "9",
        roomNumber: "204",
        roomType: "Family Room",
        floor: 2,
        price: 2500000,
        status: "available",
        capacity: 5,
        amenities: ["WiFi", "TV", "AC", "Minibar", "2 Beds"],
        image:
          "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=500",
      },
      {
        id: "10",
        roomNumber: "302",
        roomType: "Executive Suite",
        floor: 3,
        price: 5000000,
        status: "available",
        capacity: 4,
        amenities: ["WiFi", "TV", "AC", "Minibar", "Office Space"],
        image:
          "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=500",
      },
    ],
    []
  );

  // Mock bookings data for calendar view
  const mockBookings = useMemo(
    () => [
      {
        id: "booking-1",
        roomId: "2",
        roomNumber: "102",
        checkIn: new Date(2025, 9, 28),
        checkOut: new Date(2025, 9, 31),
        guestName: "John Doe",
        status: "checked-in" as const,
      },
      {
        id: "booking-2",
        roomId: "8",
        roomNumber: "302",
        checkIn: new Date(2025, 9, 29),
        checkOut: new Date(2025, 10, 2),
        guestName: "Jane Smith",
        status: "checked-in" as const,
      },
      {
        id: "booking-3",
        roomId: "3",
        roomNumber: "201",
        checkIn: new Date(2025, 10, 1),
        checkOut: new Date(2025, 10, 5),
        guestName: "Bob Johnson",
        status: "confirmed" as const,
      },
      {
        id: "booking-4",
        roomId: "5",
        roomNumber: "204",
        checkIn: new Date(2025, 10, 3),
        checkOut: new Date(2025, 10, 7),
        guestName: "Alice Brown",
        status: "confirmed" as const,
      },
    ],
    []
  );

  // Mock chart data
  const chartData = [
    { month: "T1", occupied: 45, available: 30, maintenance: 5 },
    { month: "T2", occupied: 52, available: 23, maintenance: 5 },
    { month: "T3", occupied: 48, available: 27, maintenance: 5 },
    { month: "T4", occupied: 60, available: 15, maintenance: 5 },
    { month: "T5", occupied: 65, available: 10, maintenance: 5 },
    { month: "T6", occupied: 58, available: 17, maintenance: 5 },
  ];

  // Filter rooms
  const filteredRooms = useMemo(() => {
    return mockRooms.filter((room) => {
      // Search filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        if (
          !room.roomNumber.toLowerCase().includes(searchLower) &&
          !room.roomType.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      // Status filter
      if (filters.status !== "all" && room.status !== filters.status) {
        return false;
      }

      // Room type filter
      if (filters.roomType !== "all" && room.roomType !== filters.roomType) {
        return false;
      }

      // Floor filter
      if (filters.floor !== "all" && room.floor.toString() !== filters.floor) {
        return false;
      }

      // Price range filter
      if (filters.priceRange !== "all") {
        const [min, max] = filters.priceRange.split("-").map(Number);
        if (room.price < min || room.price > max) {
          return false;
        }
      }

      return true;
    });
  }, [mockRooms, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
  const paginatedRooms = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRooms.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRooms, currentPage, itemsPerPage]);

  // Statistics
  const stats = useMemo(() => {
    const available = mockRooms.filter((r) => r.status === "available").length;
    const occupied = mockRooms.filter((r) => r.status === "occupied").length;
    const maintenance = mockRooms.filter(
      (r) => r.status === "maintenance"
    ).length;
    const occupancyRate = ((occupied / mockRooms.length) * 100).toFixed(1);

    return { available, occupied, maintenance, occupancyRate };
  }, [mockRooms]);

  // Get unique room types and floors for filters
  const roomTypes = Array.from(new Set(mockRooms.map((r) => r.roomType)));
  const floors = Array.from(new Set(mockRooms.map((r) => r.floor))).sort();

  // Handlers
  const handleEdit = (room: Room) => {
    console.log("Edit room:", room);
    setSelectedRoom(room);
    // TODO: Open edit modal
  };

  const handleView = (room: Room) => {
    console.log("View room:", room);
    setSelectedRoom(room);
  };

  const handleDelete = (room: Room) => {
    console.log("Delete room:", room);
    // TODO: Show confirmation dialog
  };

  const handleAddRoom = () => {
    console.log("Add new room");
    // TODO: Open add room modal
  };

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
  };

  return (
    <div className="min-h-screen bg-[#f5f0eb] p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Rooms</h1>
            <p className="text-gray-600 mt-1">View and manage room</p>
          </div>
          <button
            onClick={handleAddRoom}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#6b5e4c] text-white font-semibold rounded-lg shadow-lg hover:bg-[#5a4d3e] transition-colors"
          >
            <FaPlus />
            Add room
          </button>
        </motion.div>

        {/* Statistics Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <RoomStatCard
            icon={FaDoorOpen}
            iconBgColor="bg-[#e8f5e9]"
            iconColor="text-[#2e7d32]"
            value={stats.available + stats.occupied + stats.maintenance}
            label="Total Rooms"
            trend={{ value: "+2 this month", isPositive: true }}
          />
          <RoomStatCard
            icon={FaBed}
            iconBgColor="bg-[#e3f2fd]"
            iconColor="text-[#1976d2]"
            value={`${stats.occupancyRate}%`}
            label="Occupancy Rate"
            trend={{ value: "+5% vs last week", isPositive: true }}
          />
          <RoomStatCard
            icon={FaChartLine}
            iconBgColor="bg-[#fff8e1]"
            iconColor="text-[#f57c00]"
            value={`2,380,000`}
            label="Daily Revenue"
            trend={{ value: "+6% vs last week", isPositive: true }}
          />
          <RoomStatCard
            icon={FaTools}
            iconBgColor="bg-[#ffebee]"
            iconColor="text-[#c62828]"
            value={stats.maintenance}
            label="Maintenance"
            trend={{ value: "+4% vs last week", isPositive: false }}
          />
        </motion.div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <RoomChart data={chartData} type="bar" />
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <RoomFilters
            filters={filters}
            onFilterChange={setFilters}
            roomTypes={roomTypes}
            floors={floors}
          />
        </motion.div>

        {/* View Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-[#6b5e4c] font-medium">Total room:</span>
              <span className="font-semibold text-gray-900">
                {filteredRooms.length} rooms
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-[#4caf50]"></span>
                <span className="text-gray-600">Available</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-[#2196f3]"></span>
                <span className="text-gray-600">Booked</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-[#ff9800]"></span>
                <span className="text-gray-600">Cleaning</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-[#f44336]"></span>
                <span className="text-gray-600">Unavailable</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("status")}
              className={`p-3 rounded-lg transition-colors ${
                viewMode === "status"
                  ? "bg-[#6b5e4c] text-white"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
              }`}
              title="Status Board"
            >
              <FaTh />
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`p-3 rounded-lg transition-colors ${
                viewMode === "calendar"
                  ? "bg-[#6b5e4c] text-white"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
              }`}
              title="Calendar view"
            >
              <FaCalendarAlt />
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`p-3 rounded-lg transition-colors ${
                viewMode === "card"
                  ? "bg-[#6b5e4c] text-white"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
              }`}
              title="Card view"
            >
              <FaThLarge />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-3 rounded-lg transition-colors ${
                viewMode === "table"
                  ? "bg-[#6b5e4c] text-white"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
              }`}
              title="Table view"
            >
              <FaList />
            </button>
          </div>
        </motion.div>

        {/* Room List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {viewMode === "status" ? (
            <RoomStatusBoard
              rooms={filteredRooms}
              onRoomClick={handleRoomClick}
            />
          ) : viewMode === "calendar" ? (
            <RoomCalendarView
              rooms={mockRooms}
              bookings={mockBookings}
              onRoomClick={handleRoomClick}
            />
          ) : viewMode === "card" ? (
            <RoomCardView
              rooms={paginatedRooms}
              onEdit={handleEdit}
              onView={handleView}
              onDelete={handleDelete}
            />
          ) : (
            <RoomTableView
              rooms={paginatedRooms}
              onEdit={handleEdit}
              onView={handleView}
              onDelete={handleDelete}
            />
          )}
        </motion.div>

        {/* Pagination - Only show for card and table views */}
        {(viewMode === "card" || viewMode === "table") &&
          filteredRooms.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalItems={filteredRooms.length}
              />
            </motion.div>
          )}
      </div>

      {/* Room Detail Modal */}
      <RoomDetailModal
        room={selectedRoom}
        onClose={() => setSelectedRoom(null)}
      />
    </div>
  );
};

export default RoomManagement;
