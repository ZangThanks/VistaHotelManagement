import React, { useState, useMemo, useEffect, useContext } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaBed,
  FaRulerCombined,
  FaUsers,
  FaDollarSign,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { ToastContext } from "../../../context/ToastContext";
import Pagination from "../../../components/common/Pagination";
import ConfirmDialog from "../../../components/dialog/ConfirmDialog";
import roomTypeService from "../../../services/roomTypeService";
import type { RoomType } from "../../../types/RoomType";

/**
 * Component quản lý loại phòng
 * Hiển thị danh sách loại phòng với các chức năng CRUD
 */
const RoomTypeManagement: React.FC = () => {
  // State
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(
    null
  );
  const [roomTypeToDelete, setRoomTypeToDelete] = useState<RoomType | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const toast = useContext(ToastContext);

  // Load room types
  useEffect(() => {
    loadRoomTypes();
  }, []);

  const loadRoomTypes = async () => {
    try {
      setLoading(true);
      const data = await roomTypeService.getAllRoomTypes();
      setRoomTypes(data);
    } catch (error) {
      console.error("Error loading room types:", error);
      toast?.error("Failed to load room types");
    } finally {
      setLoading(false);
    }
  };

  // Filter room types
  const filteredRoomTypes = useMemo(() => {
    if (!searchTerm) return roomTypes;

    const searchLower = searchTerm.toLowerCase();
    return roomTypes.filter(
      (rt) =>
        rt.typeName?.toLowerCase().includes(searchLower) ||
        rt.roomTypeID?.toLowerCase().includes(searchLower) ||
        rt.description?.toLowerCase().includes(searchLower)
    );
  }, [roomTypes, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredRoomTypes.length / itemsPerPage);
  const paginatedRoomTypes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRoomTypes.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRoomTypes, currentPage]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Statistics
  const stats = useMemo(() => {
    const totalTypes = roomTypes.length;
    const avgPrice =
      roomTypes.length > 0
        ? roomTypes.reduce((sum, rt) => sum + (rt.basePrice || 0), 0) /
          roomTypes.length
        : 0;
    const maxCapacity = Math.max(
      ...roomTypes.map((rt) => rt.maxOccupancy || 0),
      0
    );
    const totalArea = roomTypes.reduce((sum, rt) => sum + (rt.area || 0), 0);

    return {
      totalTypes,
      avgPrice,
      maxCapacity,
      totalArea,
    };
  }, [roomTypes]);

  // Handlers
  const handleAdd = () => {
    setSelectedRoomType(null);
    setIsAddModalOpen(true);
  };

  const handleEdit = (roomType: RoomType) => {
    setSelectedRoomType(roomType);
    setIsEditModalOpen(true);
  };

  const handleView = (roomType: RoomType) => {
    setSelectedRoomType(roomType);
    setIsDetailModalOpen(true);
  };

  const handleDelete = (roomType: RoomType) => {
    setRoomTypeToDelete(roomType);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!roomTypeToDelete?.roomTypeID) return;

    try {
      setIsDeleting(true);
      await roomTypeService.deleteRoomType(roomTypeToDelete.roomTypeID);
      toast?.success("Room type deleted successfully!");
      await loadRoomTypes();
      setIsDeleteConfirmOpen(false);
      setRoomTypeToDelete(null);
    } catch (error) {
      console.error("Error deleting room type:", error);
      toast?.error("Failed to delete room type");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (data: Partial<RoomType>) => {
    try {
      setSubmitting(true);
      await roomTypeService.saveRoomType(data);
      toast?.success(
        data.roomTypeID
          ? "Room type updated successfully!"
          : "Room type created successfully!"
      );
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      await loadRoomTypes();
    } catch (error) {
      console.error("Error saving room type:", error);
      toast?.error("Failed to save room type");
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f0eb] p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6b5e4c] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading room types...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f0eb] p-6">
      <div className="max-w-[1600px] mx-auto space-y-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mt-[-30px]"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Room Types</h1>
            <p className="text-gray-600 mt-1">
              Manage hotel room types and categories
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#6b5e4c] text-white font-semibold rounded-lg shadow-lg hover:bg-[#5a4d3e] transition-colors cursor-pointer"
          >
            <FaPlus />
            Add Room Type
          </button>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <div className="bg-white rounded-xl shadow-sm border border-[#ebe3d7] p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-[#e3f2fd] flex items-center justify-center">
                <FaBed className="text-2xl text-[#1976d2]" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-800">
                  {stats.totalTypes}
                </h3>
                <p className="text-sm text-gray-600 mt-1">Total Types</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-[#ebe3d7] p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-[#e8f5e9] flex items-center justify-center">
                <FaDollarSign className="text-2xl text-[#2e7d32]" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-800">
                  {stats.avgPrice.toLocaleString("vi-VN")}đ
                </h3>
                <p className="text-sm text-gray-600 mt-1">Avg. Price</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-[#ebe3d7] p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-[#fff8e1] flex items-center justify-center">
                <FaUsers className="text-2xl text-[#f57c00]" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-800">
                  {stats.maxCapacity}
                </h3>
                <p className="text-sm text-gray-600 mt-1">Max Capacity</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-[#ebe3d7] p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-[#ffebee] flex items-center justify-center">
                <FaRulerCombined className="text-2xl text-[#c62828]" />
              </div>
              <div>
                <h3 className="text-3xl font-bold text-gray-800">
                  {stats.totalArea.toFixed(0)}m²
                </h3>
                <p className="text-sm text-gray-600 mt-1">Total Area</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-[#ebe3d7] p-4"
        >
          <input
            type="text"
            placeholder="Search by name, ID, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6b5e4c] focus:border-transparent"
          />
        </motion.div>

        {/* Room Types Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {filteredRoomTypes.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-[#ebe3d7] p-12 text-center">
              <FaBed className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No room types found</p>
              <p className="text-gray-400 text-sm mt-2">
                {roomTypes.length === 0
                  ? "Get started by creating your first room type"
                  : "Try adjusting your search"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {paginatedRoomTypes.map((roomType) => (
                <RoomTypeCard
                  key={roomType.roomTypeID}
                  roomType={roomType}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {filteredRoomTypes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredRoomTypes.length}
            />
          </motion.div>
        )}
      </div>

      {/* Modals */}
      <RoomTypeFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleSubmit}
        submitting={submitting}
      />

      <RoomTypeFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleSubmit}
        roomType={selectedRoomType}
        submitting={submitting}
      />

      <RoomTypeDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        roomType={selectedRoomType}
        onEdit={handleEdit}
      />

      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setRoomTypeToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Room Type"
        message={`Are you sure you want to delete "${roomTypeToDelete?.typeName}"? This action cannot be undone.`}
        type="danger"
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  );
};

// Room Type Card Component
interface RoomTypeCardProps {
  roomType: RoomType;
  onView: (roomType: RoomType) => void;
  onEdit: (roomType: RoomType) => void;
  onDelete: (roomType: RoomType) => void;
}

const RoomTypeCard: React.FC<RoomTypeCardProps> = ({
  roomType,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}
      className="bg-white rounded-xl shadow-sm border border-[#ebe3d7] overflow-hidden cursor-pointer"
      onClick={() => onView(roomType)}
    >
      <div className="bg-gradient-to-r from-[#6b5e4c] to-[#8b7355] p-6 text-white">
        <div className="flex items-center justify-between">
          <FaBed className="text-3xl" />
          <span className="text-sm font-mono bg-white/20 px-3 py-1 rounded">
            {roomType.roomTypeID}
          </span>
        </div>
        <h3 className="text-xl font-bold mt-4">{roomType.typeName}</h3>
      </div>

      <div className="p-6 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Base Price:</span>
          <span className="font-semibold text-[#6b5e4c]">
            {roomType.basePrice?.toLocaleString("vi-VN")}đ
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Capacity:</span>
          <span className="font-semibold">{roomType.maxOccupancy} guests</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Area:</span>
          <span className="font-semibold">{roomType.area}m²</span>
        </div>

        {roomType.description && (
          <p className="text-sm text-gray-600 line-clamp-2 pt-2 border-t">
            {roomType.description}
          </p>
        )}

        <div className="flex gap-2 pt-4 border-t">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(roomType);
            }}
            className="flex-1 px-3 py-2 bg-[#e3f2fd] text-[#1976d2] rounded-lg hover:bg-[#bbdefb] transition-colors text-sm font-medium cursor-pointer"
          >
            <FaEye className="inline mr-1" /> View
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(roomType);
            }}
            className="flex-1 px-3 py-2 bg-[#fff8e1] text-[#f57c00] rounded-lg hover:bg-[#ffecb3] transition-colors text-sm font-medium cursor-pointer"
          >
            <FaEdit className="inline mr-1" /> Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(roomType);
            }}
            className="px-3 py-2 bg-[#ffebee] text-[#c62828] rounded-lg hover:bg-[#ffcdd2] transition-colors text-sm font-medium cursor-pointer"
          >
            <FaTrash />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Room Type Form Modal Component
interface RoomTypeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<RoomType>) => Promise<void>;
  roomType?: RoomType | null;
  submitting?: boolean;
}

const RoomTypeFormModal: React.FC<RoomTypeFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  roomType,
  submitting = false,
}) => {
  const [formData, setFormData] = useState<Partial<RoomType>>({
    roomTypeID: "",
    typeName: "",
    description: "",
    area: 0,
    maxOccupancy: 1,
    amenties: [],
    basePrice: 0,
  });
  const [amenityInput, setAmenityInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (roomType) {
        setFormData({
          roomTypeID: roomType.roomTypeID || "",
          typeName: roomType.typeName || "",
          description: roomType.description || "",
          area: roomType.area || 0,
          maxOccupancy: roomType.maxOccupancy || 1,
          amenties: roomType.amenties || [],
          basePrice: roomType.basePrice || 0,
        });
      } else {
        setFormData({
          roomTypeID: "",
          typeName: "",
          description: "",
          area: 0,
          maxOccupancy: 1,
          amenties: [],
          basePrice: 0,
        });
      }
      setErrors({});
    }
  }, [isOpen, roomType]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.roomTypeID?.trim()) {
      newErrors.roomTypeID = "Room Type ID is required";
    }
    if (!formData.typeName?.trim()) {
      newErrors.typeName = "Type name is required";
    }
    if (!formData.basePrice || formData.basePrice <= 0) {
      newErrors.basePrice = "Base price must be greater than 0";
    }
    if (!formData.area || formData.area <= 0) {
      newErrors.area = "Area must be greater than 0";
    }
    if (!formData.maxOccupancy || formData.maxOccupancy < 1) {
      newErrors.maxOccupancy = "Max occupancy must be at least 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const addAmenity = () => {
    if (amenityInput.trim()) {
      setFormData({
        ...formData,
        amenties: [...(formData.amenties || []), amenityInput.trim()],
      });
      setAmenityInput("");
    }
  };

  const removeAmenity = (index: number) => {
    setFormData({
      ...formData,
      amenties: formData.amenties?.filter((_, i) => i !== index),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {roomType ? "Edit Room Type" : "Add Room Type"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room Type ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.roomTypeID}
                onChange={(e) =>
                  setFormData({ ...formData, roomTypeID: e.target.value })
                }
                disabled={!!roomType}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6b5e4c] ${
                  errors.roomTypeID ? "border-red-500" : "border-gray-300"
                } ${roomType ? "bg-gray-100" : ""}`}
                placeholder="e.g., DLX, STE"
              />
              {errors.roomTypeID && (
                <p className="text-red-500 text-xs mt-1">{errors.roomTypeID}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.typeName}
                onChange={(e) =>
                  setFormData({ ...formData, typeName: e.target.value })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6b5e4c] ${
                  errors.typeName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g., Deluxe Room"
              />
              {errors.typeName && (
                <p className="text-red-500 text-xs mt-1">{errors.typeName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6b5e4c]"
              placeholder="Room type description..."
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Area (m²) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.area}
                onChange={(e) =>
                  setFormData({ ...formData, area: parseFloat(e.target.value) })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6b5e4c] ${
                  errors.area ? "border-red-500" : "border-gray-300"
                }`}
                min="0"
                step="0.1"
              />
              {errors.area && (
                <p className="text-red-500 text-xs mt-1">{errors.area}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Occupancy <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.maxOccupancy}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxOccupancy: parseInt(e.target.value),
                  })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6b5e4c] ${
                  errors.maxOccupancy ? "border-red-500" : "border-gray-300"
                }`}
                min="1"
              />
              {errors.maxOccupancy && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.maxOccupancy}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Base Price (VND) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.basePrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    basePrice: parseFloat(e.target.value),
                  })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6b5e4c] ${
                  errors.basePrice ? "border-red-500" : "border-gray-300"
                }`}
                min="0"
                step="1000"
              />
              {errors.basePrice && (
                <p className="text-red-500 text-xs mt-1">{errors.basePrice}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amenities
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addAmenity())
                }
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6b5e4c]"
                placeholder="Add amenity..."
              />
              <button
                type="button"
                onClick={addAmenity}
                className="px-4 py-2 bg-[#6b5e4c] text-white rounded-lg hover:bg-[#5a4d3e] transition-colors cursor-pointer"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.amenties?.map((amenity, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-[#f5f0eb] text-gray-700 rounded-full text-sm"
                >
                  {amenity}
                  <button
                    type="button"
                    onClick={() => removeAmenity(index)}
                    className="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex gap-3 justify-end -mx-6 -mb-6 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-[#6b5e4c] text-white rounded-lg hover:bg-[#5a4d3e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting ? "Saving..." : roomType ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Room Type Detail Modal Component
interface RoomTypeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomType: RoomType | null;
  onEdit: (roomType: RoomType) => void;
}

const RoomTypeDetailModal: React.FC<RoomTypeDetailModalProps> = ({
  isOpen,
  onClose,
  roomType,
  onEdit,
}) => {
  if (!isOpen || !roomType) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-gradient-to-r from-[#6b5e4c] to-[#8b7355] text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{roomType.typeName}</h2>
            <p className="text-sm text-white/80 mt-1">{roomType.roomTypeID}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-[#f5f0eb] rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Base Price</p>
              <p className="text-2xl font-bold text-[#6b5e4c]">
                {roomType.basePrice?.toLocaleString("vi-VN")}đ
              </p>
            </div>
            <div className="bg-[#f5f0eb] rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Area</p>
              <p className="text-2xl font-bold text-[#6b5e4c]">
                {roomType.area}m²
              </p>
            </div>
          </div>

          <div className="bg-[#f5f0eb] rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Max Occupancy</p>
            <p className="text-xl font-bold text-[#6b5e4c]">
              {roomType.maxOccupancy} guests
            </p>
          </div>

          {roomType.description && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600">{roomType.description}</p>
            </div>
          )}

          {roomType.amenties && roomType.amenties.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {roomType.amenties.map((amenity, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-[#f5f0eb] text-gray-700 rounded-full text-sm"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                onEdit(roomType);
                onClose();
              }}
              className="flex-1 px-6 py-3 bg-[#6b5e4c] text-white rounded-lg hover:bg-[#5a4d3e] transition-colors font-semibold cursor-pointer"
            >
              <FaEdit className="inline mr-2" />
              Edit Room Type
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RoomTypeManagement;
