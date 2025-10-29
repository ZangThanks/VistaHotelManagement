import React, { useState } from "react";
import { FaTimes, FaCheck } from "react-icons/fa";
import type { Room } from "./RoomTableView";

interface ChangeStatusModalProps {
  room: Room | null;
  onClose: () => void;
  onConfirm: (roomId: string, newStatus: Room["status"], note?: string) => void;
}

/**
 * Modal để thay đổi trạng thái phòng với ghi chú
 */
const ChangeStatusModal: React.FC<ChangeStatusModalProps> = ({
  room,
  onClose,
  onConfirm,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<Room["status"] | null>(
    null
  );
  const [note, setNote] = useState("");

  if (!room) return null;

  const statusOptions: Array<{
    value: Room["status"];
    label: string;
    description: string;
    color: string;
  }> = [
    {
      value: "available",
      label: "Available",
      description: "Room is ready for check-in",
      color: "bg-[#e8f5e9] text-[#2e7d32] border-[#2e7d32]",
    },
    {
      value: "occupied",
      label: "Occupied",
      description: "Room is currently occupied by guest",
      color: "bg-[#e3f2fd] text-[#1976d2] border-[#1976d2]",
    },
    {
      value: "cleaning",
      label: "Cleaning",
      description: "Room is being cleaned",
      color: "bg-[#fff8e1] text-[#f57c00] border-[#f57c00]",
    },
    {
      value: "maintenance",
      label: "Maintenance",
      description: "Room is under maintenance",
      color: "bg-[#ffebee] text-[#c62828] border-[#c62828]",
    },
  ];

  const handleConfirm = () => {
    if (selectedStatus) {
      onConfirm(room.id, selectedStatus, note);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            Change Room Status
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Room</div>
            <div className="text-xl font-bold text-gray-800">
              {room.roomNumber} - {room.roomType}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select New Status
            </label>
            <div className="space-y-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedStatus(option.value)}
                  disabled={room.status === option.value}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedStatus === option.value
                      ? `${option.color} border-opacity-100 shadow-md`
                      : "bg-white border-gray-200 hover:border-gray-300"
                  } ${
                    room.status === option.value
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-semibold">{option.label}</div>
                      <div className="text-xs text-gray-600 mt-1">
                        {option.description}
                      </div>
                    </div>
                    {selectedStatus === option.value && (
                      <FaCheck className="text-lg" />
                    )}
                    {room.status === option.value && (
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        Current
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="note"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Note (Optional)
            </label>
            <textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note about this status change..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6b5e4c] focus:border-transparent outline-none resize-none"
              rows={3}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedStatus || selectedStatus === room.status}
            className="flex-1 bg-[#6b5e4c] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#5a4d3e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Change
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeStatusModal;
