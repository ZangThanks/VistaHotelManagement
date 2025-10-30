import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaArrowRight,
  FaArrowLeft,
  FaCheck,
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
  FaExclamationCircle,
  FaSpinner
} from "react-icons/fa";
import TabNavigation, { type Tab } from "./TabNavigation";
import { validateTab } from "../../utils/roomValidators";
import type { ValidationError } from "../../utils/roomValidators";

export interface RoomFormData {
  roomNumber: string;
  floor: string;
  roomStatus: string;
  lastCleaned: string;
  notes: string;
  roomTypeId: string;
  typeName: string;
  description: string;
  area: string;
  maxOccupancy: string;
  basePrice: string;
  amenities: string[];
  imageUrls: string[];
  imageFiles: File[];
}

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (roomData: RoomFormData) => void;
}

/**
* Modal để thêm phòng mới với biểu mẫu nhiều bước
* Bao gồm 4 tab: Chi tiết phòng, Loại phòng, Tiện nghi, Hình ảnh
*/
const AddRoomModal: React.FC<AddRoomModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [activeTab, setActiveTab] = useState("details");
  const [completedTabs, setCompletedTabs] = useState<string[]>([]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data
  const [formData, setFormData] = useState<RoomFormData>({
    // Room Details
    roomNumber: "",
    floor: "",
    roomStatus: "AVAILABLE",
    lastCleaned: new Date().toISOString().slice(0, 16),
    notes: "",

    // Room Type
    roomTypeId: "",
    typeName: "",
    description: "",
    area: "",
    maxOccupancy: "",
    basePrice: "",

    // Amenities
    amenities: [] as string[],

    // Images
    imageUrls: [] as string[],
    imageFiles: [] as File[],
  });

  const tabs: Tab[] = [
    { id: "details", label: "Room Details" },
    { id: "type", label: "Room Type" },
    { id: "amenities", label: "Amenities" },
    { id: "images", label: "Images" },
  ];

  const availableAmenities = [
    { id: "wifi", label: "Wifi", icon: <FaWifi /> },
    { id: "tv", label: "TV", icon: <FaTv /> },
    { id: "coffee", label: "Coffee Marker", icon: <FaCoffee /> },
    { id: "ac", label: "AC", icon: <FaSnowflake /> },
    { id: "minibar", label: "Mini Bar", icon: <FaGlassMartiniAlt /> },
    { id: "balcony", label: "Balcony", icon: <FaDoorOpen /> },
    { id: "jacuzzi", label: "Jacuzzi", icon: <FaHotTub /> },
    { id: "kitchen", label: "Kitchen", icon: <FaUtensils /> },
    { id: "safe", label: "Safe", icon: <FaLock /> },
    { id: "dining", label: "Dining Area", icon: <FaConciergeBell /> },
    { id: "hairdryer", label: "Hair Dryer", icon: <FaWind /> },
    { id: "iron", label: "Iron", icon: <FaTshirt /> },
  ];

  const roomTypes = [
    { id: "STD", name: "Standard" },
    { id: "DLX", name: "Deluxe" },
    { id: "STE", name: "Suite" },
  ];

  const handleInputChange = (
    field: keyof RoomFormData,
    value: string | string[] | File[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => prev.filter((err) => err.field !== field));
  };

  const toggleAmenity = (amenityId: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((id) => id !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);

    // Store files for later upload
    setFormData((prev) => ({
      ...prev,
      imageFiles: [...prev.imageFiles, ...fileArray],
    }));

    // Clear errors
    setErrors((prev) => prev.filter((err) => err.field !== "images"));
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  const handleNext = () => {
    // Validate tab hiện tại
    const tabErrors = validateTab(activeTab, formData);

    if (tabErrors.length > 0) {
      setErrors(tabErrors);
      return;
    }

    // Đánh dấu tab hiện tại là đã hoàn thành
    if (!completedTabs.includes(activeTab)) {
      setCompletedTabs([...completedTabs, activeTab]);
    }

    // Clear errors
    setErrors([]);

    // Di chuyển tới tab tiếp theo
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };

  const handleSubmit = () => {
    // Validate tab cuối
    const tabErrors = validateTab(activeTab, formData);

    if (tabErrors.length > 0) {
      setErrors(tabErrors);
      return;
    }

    // Đánh dấu tab cuối cùng là đã hoàn thành
    if (!completedTabs.includes(activeTab)) {
      setCompletedTabs([...completedTabs, activeTab]);
    }

    setIsSubmitting(true);

    try {
      onSubmit(formData);
      handleClose();
    } catch (error) {
      console.error("Lỗi gửi form", error);
      setErrors([
        {
          field: "submit",
          message: "Lỗi tạo phòng. Vui lòng thử lại.",
        },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setActiveTab("details");
    setCompletedTabs([]);
    setErrors([]);
    setFormData({
      roomNumber: "",
      floor: "",
      roomStatus: "AVAILABLE",
      lastCleaned: new Date().toISOString().slice(0, 16),
      notes: "",
      roomTypeId: "",
      typeName: "",
      description: "",
      area: "",
      maxOccupancy: "",
      basePrice: "",
      amenities: [],
      imageUrls: [],
      imageFiles: [],
    });
    onClose();
  };

  const getFieldError = (field: string): string | undefined => {
    return errors.find((err) => err.field === field)?.message;
  }

  if (!isOpen) return null;

  const isLastTab = activeTab === tabs[tabs.length - 1].id;
  const isFirstTab = activeTab === tabs[0].id;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  Create New Room
                </h2>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  <FaTimes className="text-gray-500" />
                </button>
              </div>

              {/* Tab Navigation */}
              <TabNavigation
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={(tabId) => {
                  // Chỉ cho phép nhấp vào các tab đã hoàn thành hoặc tab hiện tại
                  const tabIndex = tabs.findIndex((t) => t.id === tabId);
                  const currentIndex = tabs.findIndex(
                    (t) => t.id === activeTab
                  );

                  if (
                    tabIndex <= currentIndex ||
                    completedTabs.includes(tabs[tabIndex - 1]?.id)
                  ) {
                    setErrors([]);
                    setActiveTab(tabId);
                  }
                }}
                completedTabs={completedTabs}
              />

              {/* Error Summary */}
              {errors.length > 0 && (
                <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <FaExclamationCircle className="text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-red-800 text-sm">
                        Please fix the following errors:
                      </p>
                      <ul className="mt-2 space-y-1">
                        {errors.map((error, index) => (
                          <li key={index} className="text-sm text-red-700">
                            • {error.message}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Room Details Tab */}
                    {activeTab === "details" && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Room Number{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={formData.roomNumber}
                              onChange={(e) =>
                                handleInputChange("roomNumber", e.target.value)
                              }
                              placeholder="e.g. 101, A-205, Suite-301"
                              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#6b5e4c] focus:border-transparent ${
                                getFieldError("roomNumber")
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            />
                            {getFieldError("roomNumber") && (
                              <p className="mt-1 text-sm text-red-600">
                                {getFieldError("roomNumber")}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Last Cleaned{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="datetime-local"
                              value={formData.lastCleaned}
                              onChange={(e) =>
                                handleInputChange("lastCleaned", e.target.value)
                              }
                              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#6b5e4c] focus:border-transparent ${
                                getFieldError("lastCleaned")
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Floor <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              value={formData.floor}
                              onChange={(e) =>
                                handleInputChange("floor", e.target.value)
                              }
                              placeholder="Floor number"
                              min="1"
                              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#6b5e4c] focus:border-transparent ${
                                getFieldError("floor")
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            />
                            {getFieldError("floor") && (
                              <p className="mt-1 text-sm text-red-600">
                                {getFieldError("floor")}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Room Status{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={formData.roomStatus}
                              onChange={(e) =>
                                handleInputChange("roomStatus", e.target.value)
                              }
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6b5e4c] focus:border-transparent cursor-pointer"
                            >
                              <option value="AVAILABLE">AVAILABLE</option>
                              <option value="BOOKED">BOOKED</option>
                              <option value="MAINTENANCE">MAINTENANCE</option>
                              <option value="CLEANING">CLEANING</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notes
                          </label>
                          <textarea
                            value={formData.notes}
                            onChange={(e) =>
                              handleInputChange("notes", e.target.value)
                            }
                            placeholder="Room-specific notes, maintenance history, special instructions..."
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6b5e4c] focus:border-transparent resize-none"
                          />
                        </div>
                      </div>
                    )}

                    {/* Room Type Tab */}
                    {activeTab === "type" && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Room Type ID{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={formData.roomTypeId}
                              onChange={(e) => {
                                const selectedType = roomTypes.find(
                                  (t) => t.id === e.target.value
                                );
                                handleInputChange("roomTypeId", e.target.value);
                                if (selectedType) {
                                  handleInputChange(
                                    "typeName",
                                    selectedType.name
                                  );
                                }
                              }}
                              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#6b5e4c] focus:border-transparent cursor-pointer ${
                                getFieldError("roomTypeId")
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            >
                              <option value="">Select room type</option>
                              {roomTypes.map((type) => (
                                <option key={type.id} value={type.id}>
                                  {type.id} - {type.name}
                                </option>
                              ))}
                            </select>
                            {getFieldError("roomTypeId") && (
                              <p className="mt-1 text-sm text-red-600">
                                {getFieldError("roomTypeId")}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Area (sq ft){" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              value={formData.area}
                              onChange={(e) =>
                                handleInputChange("area", e.target.value)
                              }
                              placeholder="1.1"
                              step="0.1"
                              min="0"
                              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#6b5e4c] focus:border-transparent ${
                                getFieldError("area")
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            />
                            {getFieldError("area") && (
                              <p className="mt-1 text-sm text-red-600">
                                {getFieldError("area")}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.typeName}
                            onChange={(e) =>
                              handleInputChange("typeName", e.target.value)
                            }
                            placeholder="Standard Queen"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#6b5e4c] focus:border-transparent ${
                              getFieldError("typeName")
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                          {getFieldError("typeName") && (
                            <p className="mt-1 text-sm text-red-600">
                              {getFieldError("typeName")}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Max Occupancy{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              value={formData.maxOccupancy}
                              onChange={(e) =>
                                handleInputChange(
                                  "maxOccupancy",
                                  e.target.value
                                )
                              }
                              placeholder="1"
                              min="1"
                              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#6b5e4c] focus:border-transparent ${
                                getFieldError("maxOccupancy")
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            />
                            {getFieldError("maxOccupancy") && (
                              <p className="mt-1 text-sm text-red-600">
                                {getFieldError("maxOccupancy")}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Base Price <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              value={formData.basePrice}
                              onChange={(e) =>
                                handleInputChange("basePrice", e.target.value)
                              }
                              placeholder="0.01"
                              step="0.01"
                              min="0"
                              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#6b5e4c] focus:border-transparent ${
                                getFieldError("basePrice")
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                            />
                            {getFieldError("basePrice") && (
                              <p className="mt-1 text-sm text-red-600">
                                {getFieldError("basePrice")}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            value={formData.description}
                            onChange={(e) =>
                              handleInputChange("description", e.target.value)
                            }
                            placeholder="Cozy queen bed room perfect for couples"
                            rows={3}
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#6b5e4c] focus:border-transparent resize-none ${
                              getFieldError("description")
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                          {getFieldError("description") && (
                            <p className="mt-1 text-sm text-red-600">
                              {getFieldError("description")}
                            </p>
                          )}
                        </div>

                        {/* Room Type Preview */}
                        {formData.roomTypeId && (
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h4 className="font-semibold text-gray-900 mb-2">
                              Room Type Preview{" "}
                              <span className="text-red-500">*</span>
                            </h4>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p>
                                <span className="font-medium">ID:</span>{" "}
                                {formData.roomTypeId}
                              </p>
                              <p>
                                <span className="font-medium">Name:</span>{" "}
                                {formData.typeName}
                              </p>
                              <p>
                                <span className="font-medium">Area:</span>{" "}
                                {formData.area} sq ft
                              </p>
                              <p>
                                <span className="font-medium">Occupancy:</span>{" "}
                                {formData.maxOccupancy} guests
                              </p>
                              <p>
                                <span className="font-medium">Base Price:</span>{" "}
                                {formData.basePrice} VND
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Amenities Tab */}
                    {activeTab === "amenities" && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Select Available Amenities
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {availableAmenities.map((amenity) => (
                              <label
                                key={amenity.id}
                                className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all hover:bg-gray-50"
                                style={{
                                  borderColor: formData.amenities.includes(
                                    amenity.id
                                  )
                                    ? "#6b5e4c"
                                    : "#e5e7eb",
                                  backgroundColor: formData.amenities.includes(
                                    amenity.id
                                  )
                                    ? "#f5f0eb"
                                    : "white",
                                }}
                              >
                                <input
                                  type="checkbox"
                                  checked={formData.amenities.includes(
                                    amenity.id
                                  )}
                                  onChange={() => toggleAmenity(amenity.id)}
                                  className="w-5 h-5 text-[#6b5e4c] border-gray-300 rounded focus:ring-[#6b5e4c] cursor-pointer"
                                />
                                <span className="text-xl text-gray-600">
                                  {amenity.icon}
                                </span>
                                <span className="font-medium text-gray-700">
                                  {amenity.label}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Selected Amenities */}
                        {formData.amenities.length > 0 && (
                          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <h4 className="font-semibold text-gray-900 mb-2">
                              Selected Amenities ({formData.amenities.length}):
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {formData.amenities.map((amenityId) => {
                                const amenity = availableAmenities.find(
                                  (a) => a.id === amenityId
                                );
                                return (
                                  <span
                                    key={amenityId}
                                    className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#6b5e4c] text-[#6b5e4c] rounded-full text-sm font-medium"
                                  >
                                    <span className="text-base">
                                      {amenity?.icon}
                                    </span>
                                    {amenity?.label}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Images Tab */}
                    {activeTab === "images" && (
                      <div className="space-y-4">
                        {/* Upload Area */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#6b5e4c] transition-colors">
                          <input
                            type="file"
                            id="image-upload"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <label
                            htmlFor="image-upload"
                            className="flex flex-col items-center gap-3 cursor-pointer"
                          >
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                              <svg
                                className="w-8 h-8 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                            </div>
                            <div>
                              <p className="text-lg font-medium text-gray-900">
                                Upload room images
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                Images will be stored as objects with metadata
                              </p>
                            </div>
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                              </svg>
                              Choose Files
                            </span>
                          </label>
                        </div>

                        {getFieldError("images") && (
                          <p className="text-sm text-red-600 text-center">
                            {getFieldError("images")}
                          </p>
                        )}

                        {/* Images Preview */}
                        {formData.imageFiles.length > 0 && (
                          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                            <h4 className="font-semibold text-gray-900 mb-2">
                              Images Selected ({formData.imageFiles.length})
                            </h4>
                            <div className="grid grid-cols-3 gap-2">
                              {formData.imageFiles.map((file, index) => (
                                <div
                                  key={index}
                                  className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden group"
                                >
                                  <img
                                    src={URL.createObjectURL(file)}
                                    alt={`Room ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                  {/* Remove button */}
                                  <button
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 cursor-pointer"
                                    title="Remove image"
                                  >
                                    <FaTimes className="w-3 h-3" />
                                  </button>
                                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                                    {file.name}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {formData.imageFiles.length === 0 && (
                          <div className="text-center py-4 text-sm text-gray-500 italic">
                            No images selected
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>

                <div className="flex gap-3">
                  {!isFirstTab && (
                    <button
                      onClick={handlePrevious}
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaArrowLeft />
                      Previous
                    </button>
                  )}

                  {!isLastTab ? (
                    <button
                      onClick={handleNext}
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 px-6 py-2 bg-[#6b5e4c] text-white rounded-lg hover:bg-[#5a4d3e] transition-colors cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                      <FaArrowRight />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 px-6 py-2 bg-[#6b5e4c] text-white rounded-lg hover:bg-[#5a4d3e] transition-colors cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
                    >
                      {isSubmitting ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <FaCheck />
                          Create Room
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddRoomModal;
