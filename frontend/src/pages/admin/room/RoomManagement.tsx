import React, { useState, useMemo, useEffect, useContext } from "react";
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
import RoomTableView from "../../../components/room/view/RoomTableView";
import RoomCardView from "../../../components/room/view/RoomCardView";
import RoomCalendarView from "../../../components/room/view/RoomCalendarView";
import RoomStatusBoard from "../../../components/room/view/RoomStatusBoard";
import RoomDetailModal from "../../../components/room/modal/RoomDetailModal";
import RoomFilters from "../../../components/room/RoomFilters";
import type { FilterOptions } from "../../../components/room/RoomFilters";
import Pagination from "../../../components/common/Pagination";
import type { Room } from "../../../components/room/view/RoomTableView";
import AddRoomModal from "../../../components/room/modal/AddRoomModal";
import EditRoomModal from "../../../components/room/modal/EditRoomModal";
import ConfirmDialog from "../../../components/dialog/ConfirmDialog";
import { motion } from "framer-motion";
import { roomService } from "../../../services/roomService";
import type { Room as ApiRoom, RoomStatus } from "../../../types/Room";
import bookingService from "../../../services/bookingService";
import type { RoomBooking } from "../../../types/Booking";
import { uploadMultipleImagesToCloudinary } from "../../../services/cloudinaryService";
import type { RoomFormData } from "../../../components/room/modal/AddRoomModal";
import type { EditRoomFormData } from "../../../components/room/modal/EditRoomModal";
import { ToastContext } from "../../../context/ToastContext";

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

  // Edit room modal
  const [isEditRoomModalOpen, setIsEditRoomModalOpen] = useState(false);
  const [roomToEdit, setRoomToEdit] = useState<Room | null>(null);

  // Delete confirmation
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast context
  const toast = useContext(ToastContext);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Rooms data from API
  const [rooms, setRooms] = useState<Room[]>([]);

  // Bookings data from API
  const [bookings, setBookings] = useState<RoomBooking[]>([]);

  // Filters
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: "",
    status: "all",
    roomType: "all",
    floor: "all",
    priceRange: "all",
  });

  // Chuyển đổi API Room thành UI Room
  const convertApiRoomToUiRoom = (apiRoom: ApiRoom): Room | null => {
    // Skip rooms without roomType
    if (!apiRoom.roomType) {
      console.warn(`Room ${apiRoom.roomNumber} has null roomType, skipping...`);
      return null;
    }

    // Map backend RoomStatus với frontend Room status
    const statusMap: Record<RoomStatus, Room["status"]> = {
      AVAILABLE: "available",
      BOOKED: "occupied",
      MAINTENANCE: "maintenance",
      CLEANING: "cleaning",
    };

    return {
      id: apiRoom.roomNumber || "",
      roomNumber: apiRoom.roomNumber || "",
      roomType: apiRoom.roomType.typeName,
      floor: apiRoom.floor || 0,
      price: apiRoom.roomType.basePrice,
      status: statusMap[apiRoom.status],
      capacity: apiRoom.roomType.maxOccupancy,
      amenities: apiRoom.roomType.amenties,
      image: apiRoom.images?.[0] || "", // Images belong to Room, not RoomType
      notes: apiRoom.notes || undefined,
      lastCleaned: apiRoom.lastCleaned || undefined,
    };
  };

  // Load danh sách từ API
  useEffect(() => {
    const loadRooms = async () => {
      try {
        setLoading(true);
        const apiRooms = await roomService.getAllRooms();
        const uiRooms = apiRooms
          .map(convertApiRoomToUiRoom)
          .filter((room): room is Room => room !== null);
        setRooms(uiRooms);
      } catch (error) {
        console.error("Lỗi khi tải danh sách phòng:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, []);

  // Load bookings từ API
  useEffect(() => {
    const loadBookings = async () => {
      try {
        const roomBookings = await bookingService.getAllRoomBookings();
        setBookings(roomBookings);
      } catch (error) {
        console.error("Lỗi khi tải danh sách booking:", error);
        toast?.error("Không thể tải danh sách booking");
      }
    };

    loadBookings();
  }, [toast]);

  // Filter rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      // Search filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const roomTypeName =
          typeof room.roomType === "string"
            ? room.roomType
            : room.roomType.typeName;

        if (
          !room.roomNumber.toLowerCase().includes(searchLower) &&
          !roomTypeName.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      // Status filter
      if (filters.status !== "all" && room.status !== filters.status) {
        return false;
      }

      // Room type filter
      if (filters.roomType !== "all") {
        const roomTypeName =
          typeof room.roomType === "string"
            ? room.roomType
            : room.roomType.typeName;
        if (roomTypeName !== filters.roomType) {
          return false;
        }
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
    const occupancyRate =
      rooms.length > 0 ? ((occupied / rooms.length) * 100).toFixed(1) : "0";

    // Calculate booking statistics
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayBookings = bookings.filter((booking) => {
      const checkIn = new Date(booking.checkIn);
      checkIn.setHours(0, 0, 0, 0);
      return checkIn.getTime() === today.getTime();
    });

    const activeBookings = bookings.filter((booking) => {
      return booking.status === "checked-in" || booking.status === "pending";
    });

    // Calculate daily revenue from today's bookings
    const dailyRevenue = todayBookings.reduce(
      (sum, booking) => sum + booking.totalAmount,
      0
    );

    return {
      available,
      occupied,
      maintenance,
      occupancyRate,
      todayBookings: todayBookings.length,
      activeBookings: activeBookings.length,
      dailyRevenue,
    };
  }, [rooms, bookings]);

  // Get unique room types and floors for filters
  const roomTypes = Array.from(
    new Set(
      rooms.map((r) =>
        typeof r.roomType === "string" ? r.roomType : r.roomType.typeName
      )
    )
  );
  const floors = Array.from(new Set(rooms.map((r) => r.floor))).sort();

  // Handlers
  const handleEdit = (room: Room) => {
    console.log("Edit room:", room);
    handleEditRoom(room);
  };

  const handleView = (room: Room) => {
    console.log("View room:", room);
    setSelectedRoom(room);
  };

  const handleDelete = (room: Room) => {
    console.log("Delete room:", room);
    handleDeleteRoom(room);
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
      // Images belong to Room entity, not RoomType
      let cloudinaryUrls: string[] = [];
      if (roomData.imageFiles.length > 0) {
        const uploadImages = await uploadMultipleImagesToCloudinary(
          roomData.imageFiles
        );
        cloudinaryUrls = uploadImages.map((img) => img.secure_url);
      }

      // 2. Chuẩn bị dữ liệu phòng
      // Room has images, RoomType is selected (not created)
      const roomApiData = {
        roomNumber: roomData.roomNumber,
        floor: parseInt(roomData.floor),
        status: roomData.roomStatus as RoomStatus,
        lastCleaned: roomData.lastCleaned,
        notes: roomData.notes,
        roomType: {
          roomTypeID: roomData.roomTypeId,
        } as ApiRoom["roomType"],
        images: cloudinaryUrls, // Images belong to Room
      };

      // 3. Lưu phòng
      await roomService.saveRoom(roomApiData);

      // 4. Reload danh sách phòng
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

      // 5. Đóng modal
      setIsAddRoomModalOpen(false);

      // 6. Show success toast
      toast?.success("Room created successfully!", {
        duration: 3000,
        position: "top-right",
      });
    } catch (error) {
      console.error("Failed to add room:", error);
      toast?.error("Failed to create room. Please try again.", {
        duration: 5000,
        position: "top-right",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleEditRoom = async (room: Room) => {
    try {
      // Fetch full room data from API to get complete information
      const fullRoomData = await roomService.getRoomById(room.roomNumber);
      if (fullRoomData) {
        setRoomToEdit(fullRoomData as unknown as Room);
        setIsEditRoomModalOpen(true);
      } else {
        toast?.error("Failed to load room data", {
          duration: 3000,
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Failed to fetch room data:", error);
      toast?.error("Failed to load room data", {
        duration: 3000,
        position: "top-right",
      });
    }
  };

  const handleEditRoomSubmit = async (roomData: EditRoomFormData) => {
    console.log("Edit room data submitted:", roomData);

    try {
      setLoading(true);

      // 1. Upload new images to Cloudinary
      let newCloudinaryUrls: string[] = [];
      if (roomData.imageFiles.length > 0) {
        const uploadImages = await uploadMultipleImagesToCloudinary(
          roomData.imageFiles
        );
        newCloudinaryUrls = uploadImages.map((img) => img.secure_url);
      }

      // 2. Combine existing and new image URLs
      const allImageUrls = [...roomData.imageUrls, ...newCloudinaryUrls];

      // 3. Prepare room data for API
      const roomApiData = {
        roomNumber: roomData.roomNumber,
        floor: parseInt(roomData.floor),
        status: roomData.roomStatus as RoomStatus,
        lastCleaned: roomData.lastCleaned,
        notes: roomData.notes,
        roomType: {
          roomTypeID: roomData.roomTypeId,
        } as ApiRoom["roomType"],
        images: allImageUrls,
      };

      // 4. Update room
      await roomService.saveRoom(roomApiData);

      // 5. Reload rooms
      const apiRooms = await roomService.getAllRooms();
      const uiRooms = apiRooms
        .map((apiRoom) => {
          if (!apiRoom.roomType) {
            console.warn(
              `Room ${apiRoom.roomNumber} has null roomType, skipping...`
            );
            return null;
          }
          return convertApiRoomToUiRoom(apiRoom);
        })
        .filter((room): room is Room => room !== null);

      setRooms(uiRooms);

      // 6. Close modal
      setIsEditRoomModalOpen(false);
      setRoomToEdit(null);

      // 7. Show success toast
      toast?.success("Room updated successfully!", {
        duration: 3000,
        position: "top-right",
      });
    } catch (error) {
      console.error("Failed to update room:", error);
      toast?.error("Failed to update room. Please try again.", {
        duration: 5000,
        position: "top-right",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = (room: Room) => {
    setRoomToDelete(room);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDeleteRoom = async () => {
    if (!roomToDelete) return;

    try {
      setIsDeleting(true);

      // Delete room via API
      await roomService.deleteRoom(roomToDelete.roomNumber);

      // Reload rooms
      const apiRooms = await roomService.getAllRooms();
      const uiRooms = apiRooms
        .map((apiRoom) => {
          if (!apiRoom.roomType) {
            console.warn(
              `Room ${apiRoom.roomNumber} has null roomType, skipping...`
            );
            return null;
          }
          return convertApiRoomToUiRoom(apiRoom);
        })
        .filter((room): room is Room => room !== null);

      setRooms(uiRooms);

      // Close dialog
      setIsDeleteConfirmOpen(false);
      setRoomToDelete(null);

      // Show success toast
      toast?.success("Room deleted successfully!", {
        duration: 3000,
        position: "top-right",
      });
    } catch (error) {
      console.error("Failed to delete room:", error);
      toast?.error("Failed to delete room. Please try again.", {
        duration: 5000,
        position: "top-right",
      });
    } finally {
      setIsDeleting(false);
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
            value={`${stats.dailyRevenue.toLocaleString("vi-VN")}đ`}
            label="Daily Revenue"
            trend={{
              value: `${stats.todayBookings} bookings today`,
              isPositive: true,
            }}
          />
          <RoomStatCard
            icon={FaTools}
            iconBgColor="bg-[#ffebee]"
            iconColor="text-[#c62828]"
            value={stats.maintenance}
            label="Maintenance"
            trend={{
              value: `${stats.activeBookings} active bookings`,
              isPositive: false,
            }}
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
              bookings={bookings}
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
        onEdit={handleEditRoom}
      />

      {/* Add Room Modal */}
      <AddRoomModal
        isOpen={isAddRoomModalOpen}
        onClose={() => setIsAddRoomModalOpen(false)}
        onSubmit={handleAddRoomSubmit}
      />

      {/* Edit Room Modal */}
      {roomToEdit && (
        <EditRoomModal
          isOpen={isEditRoomModalOpen}
          onClose={() => {
            setIsEditRoomModalOpen(false);
            setRoomToEdit(null);
          }}
          onSubmit={handleEditRoomSubmit}
          room={roomToEdit}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setRoomToDelete(null);
        }}
        onConfirm={confirmDeleteRoom}
        title="Delete Room"
        message={`Are you sure you want to delete Room ${roomToDelete?.roomNumber}? This action cannot be undone.`}
        type="danger"
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default RoomManagement;
