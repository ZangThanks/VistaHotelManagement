import React, { useState } from "react";
import {
  FaTimes,
  FaUser,
  FaBed,
  FaDollarSign,
  FaWifi,
  FaExchangeAlt,
} from "react-icons/fa";
import type { Room } from "./RoomTableView";
import ChangeStatusModal from "./ChangeStatusModal";

interface RoomDetailModalProps {
  room: Room | null;
  onClose: () => void;
}

const RoomDetailModal: React.FC<RoomDetailModalProps> = ({ room, onClose }) => {
  const [showChangeStatus, setShowChangeStatus] = useState(false);

  if (!room) return null;

  const statusConfig = {
    available: {
      label: "Available",
      bg: "bg-[#e8f5e9]",
      text: "text-[#2e7d32]",
    },
    occupied: {
      label: "Occupied",
      bg: "bg-[#e3f2fd]",
      text: "text-[#1976d2]",
    },
    maintenance: {
      label: "Maintenance",
      bg: "bg-[#ffebee]",
      text: "text-[#c62828]",
    },
    cleaning: {
      label: "Cleaning",
      bg: "bg-[#fff8e1]",
      text: "text-[#f57c00]",
    },
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

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">
              Room {room.roomNumber} Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <FaTimes className="text-gray-600" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {room.image && (
              <div className="relative h-64 rounded-lg overflow-hidden">
                <img
                  src={room.image}
                  alt={room.roomNumber}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <FaBed />
                  <span className="text-sm font-medium">Room Type</span>
                </div>
                <p className="text-lg font-bold text-gray-800">
                  {room.roomType}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <FaUser />
                  <span className="text-sm font-medium">Capacity</span>
                </div>
                <p className="text-lg font-bold text-gray-800">
                  {room.capacity} guests
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <span className="text-sm font-medium">Floor</span>
                </div>
                <p className="text-lg font-bold text-gray-800">
                  Floor {room.floor}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <FaDollarSign />
                  <span className="text-sm font-medium">Price/Night</span>
                </div>
                <p className="text-lg font-bold text-[#6b5e4c]">
                  {room.price.toLocaleString("vi-VN")} VNĐ
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">
                Current Status
              </h3>
              <div className="flex items-center justify-between">
                <div
                  className={`${statusConfig[room.status].bg} ${
                    statusConfig[room.status].text
                  } inline-flex items-center px-4 py-2 rounded-lg font-semibold`}
                >
                  {statusConfig[room.status].label}
                </div>
                <button
                  onClick={() => setShowChangeStatus(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#6b5e4c] text-white rounded-lg font-medium hover:bg-[#5a4d3e] transition-colors"
                >
                  <FaExchangeAlt />
                  Change Status
                </button>
              </div>
            </div>

            {room.amenities && room.amenities.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  Amenities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm"
                    >
                      <FaWifi className="text-[#6b5e4c]" />
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button className="flex-1 bg-[#6b5e4c] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#5a4d3e] transition-colors">
                Edit Room
              </button>
              <button className="flex-1 bg-[#1976d2] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1565c0] transition-colors">
                View Bookings
              </button>
            </div>
          </div>
        </div>
      </div>

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
