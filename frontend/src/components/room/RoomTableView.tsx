import React from "react";
import { FaEdit, FaEye, FaTrashAlt } from "react-icons/fa";
import { motion } from "framer-motion";

export interface Room {
  id: string;
  roomNumber: string;
  roomType: string;
  floor: number;
  price: number;
  status: "available" | "occupied" | "maintenance" | "cleaning";
  capacity: number;
  amenities: string[];
  image?: string;
}

interface RoomTableViewProps {
  rooms: Room[];
  onEdit: (room: Room) => void;
  onView: (room: Room) => void;
  onDelete: (room: Room) => void;
}

const statusConfig = {
  available: {
    label: "Available",
    bgColor: "bg-[#e8f5e9]",
    textColor: "text-[#2e7d32]",
  },
  occupied: {
    label: "Booked",
    bgColor: "bg-[#e3f2fd]",
    textColor: "text-[#1976d2]",
  },
  maintenance: {
    label: "Unavailable",
    bgColor: "bg-[#ffebee]",
    textColor: "text-[#c62828]",
  },
  cleaning: {
    label: "Cleaning",
    bgColor: "bg-[#fff8e1]",
    textColor: "text-[#f57c00]",
  },
};

/**
 * Component hiển thị danh sách phòng dạng bảng
 * @param rooms - Danh sách phòng
 * @param onEdit - Callback khi chỉnh sửa phòng
 * @param onView - Callback khi xem chi tiết phòng
 * @param onDelete - Callback khi xóa phòng
 */
const RoomTableView: React.FC<RoomTableViewProps> = ({
  rooms,
  onEdit,
  onView,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#ebe3d7] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#f5f0eb] border-b border-[#ebe3d7]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Room No.
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Room Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Floor
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Capacity
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Price/Night
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rooms.map((room, index) => (
              <motion.tr
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-bold text-gray-900">
                      {room.roomNumber}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{room.roomType}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">
                    Floor {room.floor}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">
                    {room.capacity} guest
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    {room.price.toLocaleString("vi-VN")} VNĐ
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      statusConfig[room.status].bgColor
                    } ${statusConfig[room.status].textColor}`}
                  >
                    {statusConfig[room.status].label}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onView(room)}
                      className="text-[#1976d2] hover:text-[#1565c0] transition-colors p-2 hover:bg-blue-50 rounded-lg cursor-pointer"
                      title="View details"
                    >
                      <FaEye className="text-lg" />
                    </button>
                    <button
                      onClick={() => onEdit(room)}
                      className="text-[#2e7d32] hover:text-[#1b5e20] transition-colors p-2 hover:bg-green-50 rounded-lg cursor-pointer"
                      title="Edit"
                    >
                      <FaEdit className="text-lg" />
                    </button>
                    <button
                      onClick={() => onDelete(room)}
                      className="text-[#c62828] hover:text-[#b71c1c] transition-colors p-2 hover:bg-red-50 rounded-lg cursor-pointer"
                      title="Delete"
                    >
                      <FaTrashAlt className="text-lg" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      {rooms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No rooms found</p>
        </div>
      )}
    </div>
  );
};

export default RoomTableView;
