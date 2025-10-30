import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaUser,
  FaBed,
  FaDollarSign,
  FaWifi,
  FaTv,
  FaCoffee,
  FaSnowflake,
  FaGlassMartiniAlt,
  FaDoorOpen,
  FaHotTub,
  FaUtensils,
  FaLock,
  FaConciergeBell,
  FaWind,
  FaTshirt,
  FaExchangeAlt,
  FaEdit,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaStickyNote,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import type { Room } from "../view/RoomTableView";
import ChangeStatusModal from "./ChangeStatusModal";

interface RoomDetailModalProps {
  room: Room | null;
  onClose: () => void;
  onEdit?: (room: Room) => void;
}

const RoomDetailModal: React.FC<RoomDetailModalProps> = ({
  room,
  onClose,
  onEdit,
}) => {
  const [showChangeStatus, setShowChangeStatus] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!room) return null;

  const statusConfig = {
    available: {
      label: "Available",
      bg: "bg-[#e8f5e9]",
      text: "text-[#2e7d32]",
      borderColor: "border-[#2e7d32]",
    },
    occupied: {
      label: "Occupied",
      bg: "bg-[#e3f2fd]",
      text: "text-[#1976d2]",
      borderColor: "border-[#1976d2]",
    },
    maintenance: {
      label: "Maintenance",
      bg: "bg-[#ffebee]",
      text: "text-[#c62828]",
      borderColor: "border-[#c62828]",
    },
    cleaning: {
      label: "Cleaning",
      bg: "bg-[#fff8e1]",
      text: "text-[#f57c00]",
      borderColor: "border-[#f57c00]",
    },
  };

  const amenityIcons: { [key: string]: React.ReactElement } = {
    wifi: <FaWifi />,
    tv: <FaTv />,
    coffee: <FaCoffee />,
    ac: <FaSnowflake />,
    minibar: <FaGlassMartiniAlt />,
    balcony: <FaDoorOpen />,
    jacuzzi: <FaHotTub />,
    kitchen: <FaUtensils />,
    safe: <FaLock />,
    dining: <FaConciergeBell />,
    hairdryer: <FaWind />,
    iron: <FaTshirt />,
  };

  const handleStatusChange = (
    roomId: string,
    newStatus: Room["status"],
    note?: string
  ) => {
    console.log("Change status:", roomId, newStatus, note);
    setShowChangeStatus(false);
    onClose();
  };

  // Mock images array - replace with room.images when available
  const roomImages = room.image ? [room.image] : [];

  return (
    <>
      <AnimatePresence>
        {room && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 z-[100]"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[101] flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-[#6b5e4c] to-[#8b7355]">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Room {room.roomNumber}
                    </h2>
                    <p className="text-sm text-white/80 mt-1">
                      {typeof room.roomType === "string"
                        ? room.roomType
                        : room.roomType.typeName}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
                  >
                    <FaTimes className="text-white text-xl" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                  {/* Image Gallery with Navigation */}
                  {roomImages.length > 0 && (
                    <div className="mb-6">
                      <div className="relative h-80 rounded-xl overflow-hidden shadow-lg bg-gray-100">
                        <img
                          src={roomImages[currentImageIndex]}
                          alt={`Room ${room.roomNumber} - Image ${
                            currentImageIndex + 1
                          }`}
                          className="w-full h-full object-cover"
                        />

                        {/* Navigation Arrows */}
                        {roomImages.length > 1 && (
                          <>
                            <button
                              onClick={() =>
                                setCurrentImageIndex((prev) =>
                                  prev === 0 ? roomImages.length - 1 : prev - 1
                                )
                              }
                              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all cursor-pointer"
                            >
                              <FaArrowLeft className="text-xl" />
                            </button>
                            <button
                              onClick={() =>
                                setCurrentImageIndex((prev) =>
                                  prev === roomImages.length - 1 ? 0 : prev + 1
                                )
                              }
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all cursor-pointer"
                            >
                              <FaArrowRight className="text-xl" />
                            </button>
                          </>
                        )}

                        {/* Image Counter */}
                        <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                          {currentImageIndex + 1} / {roomImages.length}
                        </div>

                        {/* Dots Indicator */}
                        {roomImages.length > 1 && (
                          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                            {roomImages.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentImageIndex(index)}
                                className={`transition-all cursor-pointer ${
                                  index === currentImageIndex
                                    ? "bg-white w-8 h-2"
                                    : "bg-white/50 w-2 h-2"
                                } rounded-full`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Status Card */}
                  <div
                    className={`mb-6 p-4 rounded-lg border-2 ${
                      statusConfig[room.status].bg
                    } ${statusConfig[room.status].borderColor}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          Current Status
                        </p>
                        <div
                          className={`inline-flex items-center px-4 py-2 rounded-lg font-bold text-lg ${
                            statusConfig[room.status].text
                          }`}
                        >
                          {statusConfig[room.status].label}
                        </div>
                      </div>
                      <button
                        onClick={() => setShowChangeStatus(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#6b5e4c] text-white rounded-lg font-medium hover:bg-[#5a4d3e] transition-colors cursor-pointer"
                      >
                        <FaExchangeAlt />
                        Change Status
                      </button>
                    </div>
                  </div>

                  {/* Room Information Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 text-blue-600 mb-2">
                        <FaBed className="text-xl" />
                        <span className="text-sm font-medium">Room Type</span>
                      </div>
                      <p className="text-lg font-bold text-gray-800">
                        {typeof room.roomType === "string"
                          ? room.roomType
                          : room.roomType.typeName}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 text-green-600 mb-2">
                        <FaUser className="text-xl" />
                        <span className="text-sm font-medium">Capacity</span>
                      </div>
                      <p className="text-lg font-bold text-gray-800">
                        {room.capacity} guests
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                      <div className="flex items-center gap-2 text-purple-600 mb-2">
                        <FaMapMarkerAlt className="text-xl" />
                        <span className="text-sm font-medium">Floor</span>
                      </div>
                      <p className="text-lg font-bold text-gray-800">
                        Floor {room.floor}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg border border-amber-200">
                      <div className="flex items-center gap-2 text-amber-600 mb-2">
                        <FaDollarSign className="text-xl" />
                        <span className="text-sm font-medium">Price/Night</span>
                      </div>
                      <p className="text-lg font-bold text-[#6b5e4c]">
                        ${room.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Amenities */}
                  {room.amenities && room.amenities.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <FaConciergeBell className="text-[#6b5e4c]" />
                        Amenities
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {room.amenities.map((amenity, idx) => {
                          const amenityKey = amenity
                            .toLowerCase()
                            .replace(/\s+/g, "");
                          const icon = amenityIcons[amenityKey] || (
                            <FaConciergeBell />
                          );
                          return (
                            <div
                              key={idx}
                              className="flex items-center gap-3 bg-gray-50 border border-gray-200 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <span className="text-xl text-[#6b5e4c]">
                                {icon}
                              </span>
                              <span className="font-medium text-gray-700">
                                {amenity}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Additional Information */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <FaStickyNote className="text-[#6b5e4c]" />
                      Additional Information
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaClock className="text-gray-400" />
                        <span>
                          Last cleaned: {new Date().toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-gray-400" />
                        <span>Available for booking</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
                  <button
                    onClick={onClose}
                    className="flex-1 bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  {onEdit && (
                    <button
                      onClick={() => onEdit(room)}
                      className="flex-1 bg-[#6b5e4c] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#5a4d3e] transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <FaEdit />
                      Edit Room
                    </button>
                  )}
                  <button className="flex-1 bg-[#1976d2] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1565c0] transition-colors cursor-pointer flex items-center justify-center gap-2">
                    <FaCalendarAlt />
                    View Bookings
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Change Status Modal - Outside AnimatePresence to avoid conflicts */}
      {showChangeStatus && (
        <ChangeStatusModal
          room={room}
          onClose={() => setShowChangeStatus(false)}
          onConfirm={handleStatusChange}
        />
      )}
    </>
  );
};

export default RoomDetailModal;
