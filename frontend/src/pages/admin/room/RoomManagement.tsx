import React, { useState, useMemo, useEffect } from "react";
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
import RoomTableView from "../../../components/room/RoomTableView";
import RoomCardView from "../../../components/room/RoomCardView";
import RoomCalendarView from "../../../components/room/RoomCalendarView";
import RoomStatusBoard from "../../../components/room/RoomStatusBoard";
import RoomDetailModal from "../../../components/room/RoomDetailModal";
import RoomFilters from "../../../components/room/RoomFilters";
import type { FilterOptions } from "../../../components/room/RoomFilters";
import Pagination from "../../../components/room/Pagination";
import type { Room } from "../../../components/room/RoomTableView";
import AddRoomModal from "../../../components/room/AddRoomModal";
import { motion } from "framer-motion";
import {roomService, type Room as ApiRoom, type RoomStatus} from  "../../../services/roomService"
import { uploadMultipleImagesToCloudinary } from "../../../services/cloudinaryService";
import type { RoomFormData } from "../../../components/room/AddRoomModal";

/**
 * Component quản lý phòng
 * Hiển thị overview, danh sách phòng với filter và phân trang
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

  // Add room modal
  const [isAddRoomModalOpen, setIsAddRoomModalOpen] = useState(false);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Rooms data from API
  const [rooms, setRooms] = useState<Room[]>([]);

  // Filters
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: "",
    status: "all",
    roomType: "all",
    floor: "all",
    priceRange: "all",
  });

  // Chuyển đổi API Room thành UI Room
  const convertApiRoomToUiRoom = (apiRoom: ApiRoom): Room => {
    // Map backend RoomStatus với frontend Room status
    const statusMap: Record<RoomStatus, Room["status"]> = {
      AVAILABLE: "available",
      BOOKED: "occupied",
      MAINTENANCE: "maintenance",
      CLEANING: "cleaning",
    };

    return {
      id: apiRoom.roomNumber,
      roomNumber: apiRoom.roomNumber,
      roomType: apiRoom.roomType.typeName,
      floor: apiRoom.floor,
      price: apiRoom.roomType.basePrice,
      status: statusMap[apiRoom.status],
      capacity: apiRoom.roomType.maxOccupancy,
      amenities: apiRoom.roomType.amenties,
      image: apiRoom.roomType.images[0] || "",
    };
  };

  // Load danh sách từ API
  useEffect(() => {
    const loadRooms = async () => {
      try {
        setLoading(true);
        const apiRooms = await roomService.getAllRooms();
        const uiRooms = apiRooms.map(convertApiRoomToUiRoom);
        setRooms(uiRooms);
      } catch (error) {
        console.error("Lỗi khi tải danh sách phòng:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, []);

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

  // Filter rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
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
  }, [rooms, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
  const paginatedRooms = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRooms.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRooms, currentPage, itemsPerPage]);

  // Statistics
  const stats = useMemo(() => {
    const available = rooms.filter((r) => r.status === "available").length;
    const occupied = rooms.filter((r) => r.status === "occupied").length;
    const maintenance = rooms.filter((r) => r.status === "maintenance").length;
    const occupancyRate = ((occupied / rooms.length) * 100).toFixed(1);

    return { available, occupied, maintenance, occupancyRate };
  }, [rooms]);

  // Get unique room types and floors for filters
  const roomTypes = Array.from(new Set(rooms.map((r) => r.roomType)));
  const floors = Array.from(new Set(rooms.map((r) => r.floor))).sort();

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
    setIsAddRoomModalOpen(true);
  };

  const handleAddRoomSubmit = async (roomData: RoomFormData) => {
    console.log("Room data submitted:", roomData);
    
    try {
      setLoading(true);

      // 1. Upload ảnh lên Cloudinary và lấy URL về
      let cloudinaryUrls: string[] = [];
      if (roomData.imageFiles.length > 0) {
        const uploadImages = await uploadMultipleImagesToCloudinary(roomData.imageFiles);
        cloudinaryUrls = uploadImages.map(img => img.secure_url);
      }

      // 2. Chuẩn bị dữ liệu loại phòng
      const roomTypeData = {
        roomTypeID: roomData.roomTypeId,
        typeName: roomData.typeName,
        description: roomData.description,
        area: parseFloat(roomData.area),
        maxOccupancy: parseInt(roomData.maxOccupancy),
        amenties: roomData.amenities,
        basePrice: parseFloat(roomData.basePrice),
        images: cloudinaryUrls,
      }

      // 3. Lưu loại phòng đầu
      await roomService.saveRoomType(roomTypeData);

      // 4. Chuẩn bị dữ liệu phòng
      const roomApiData = {
        roomNumber: roomData.roomNumber,
        floor: parseInt(roomData.floor),
        status: roomData.roomStatus as RoomStatus,
        lastCleaned: roomData.lastCleaned,
        notes: roomData.notes,
        roomType: {
          roomTypeID: roomData.roomTypeId,
        } as ApiRoom["roomType"],
      };

      // 5. Lưu phòng
      await roomService.saveRoom(roomApiData);

      // 6. Reload danh sách phòng
      const apiRooms = await roomService.getAllRooms();
      const uiRooms = apiRooms
        .map((apiRoom) => {
          if (!apiRoom.roomType) {
            console.warn(
               `Room ${apiRoom.roomNumber} has null roomType,skipping...`
            );
            return null;
          }
          return convertApiRoomToUiRoom(apiRoom);
        })
        .filter((room): room is Room => room !== null);

      setRooms(uiRooms);

      // 7. Đóng modal
      setIsAddRoomModalOpen(false);

      // TODO: Show success notification
      alert("Room created successfully!");

    } catch (error) {
      console.error("Failed to add room:", error);
      alert("Failed to create room. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleRoomClick = (room: Room) => {
    setSelectedRoom(room);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f0eb] p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6b5e4c] mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải danh sách phòng...</p>
        </div>
      </div>
    );
  }

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
            <p className="text-gray-600 mt-1">View and manage rooms</p>
          </div>
          <button
            onClick={handleAddRoom}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#6b5e4c] text-white font-semibold rounded-lg shadow-lg hover:bg-[#5a4d3e] transition-colors cursor-pointer"
          >
            <FaPlus />
            Add Room
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

        {/* Filters - Chỉ hiển thị khi ở chế độ xem lưới hoặc bảng */}
        {(viewMode === "card" || viewMode === "table") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <RoomFilters
              filters={filters}
              onFilterChange={setFilters}
              roomTypes={roomTypes}
              floors={floors}
            />
          </motion.div>
        )}

        {/* View Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-[#6b5e4c] font-medium">Total rooms:</span>
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
                <span className="text-gray-600">Occupied</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-[#ff9800]"></span>
                <span className="text-gray-600">Cleaning</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-[#f44336]"></span>
                <span className="text-gray-600">Maintenance</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("status")}
              className={`p-3 rounded-lg transition-colors cursor-pointer ${
                viewMode === "status"
                  ? "bg-[#6b5e4c] text-white"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
              }`}
              title="Status Board View"
            >
              <FaTh />
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`p-3 rounded-lg transition-colors cursor-pointer ${
                viewMode === "calendar"
                  ? "bg-[#6b5e4c] text-white"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
              }`}
              title="Calendar View"
            >
              <FaCalendarAlt />
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`p-3 rounded-lg transition-colors cursor-pointer ${
                viewMode === "card"
                  ? "bg-[#6b5e4c] text-white"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
              }`}
              title="Card View"
            >
              <FaThLarge />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-3 rounded-lg transition-colors cursor-pointer ${
                viewMode === "table"
                  ? "bg-[#6b5e4c] text-white"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
              }`}
              title="Table View"
            >
              <FaList />
            </button>
          </div>
        </motion.div>

        {/* Room List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {viewMode === "status" ? (
            <RoomStatusBoard
              rooms={filteredRooms}
              onRoomClick={handleRoomClick}
            />
          ) : viewMode === "calendar" ? (
            <RoomCalendarView
              rooms={rooms}
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
              transition={{ delay: 0.5 }}
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

      {/* Add Room Modal */}
      <AddRoomModal
        isOpen={isAddRoomModalOpen}
        onClose={() => setIsAddRoomModalOpen(false)}
        onSubmit={handleAddRoomSubmit}
      />
    </div>
  );
};

export default RoomManagement;
