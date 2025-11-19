import React, { useState, useEffect } from "react";
import { FaTimes, FaPlus, FaTrash, FaInfoCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Dropdown from "../../Dropdown";
import type { Promotion } from "../../../types/Promotion";

interface AddPromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (promotion: Partial<Promotion>) => void;
  editPromotion?: Promotion | null;
}

interface RoomTypePromotionForm {
  roomTypeId: string;
  roomTypeName: string;
  discountValue: number;
  startDate: string;
  endDate: string;
}

const AddPromotionModal: React.FC<AddPromotionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editPromotion,
}) => {
  const [formData, setFormData] = useState<Partial<Promotion>>({
    promotionName: "",
    description: "",
    discountType: undefined,
    active: true,
    promotionType: undefined,
  });

  const [roomTypePromotions, setRoomTypePromotions] = useState<
    RoomTypePromotionForm[]
  >([]);

  // Mock data for dropdowns
  const promotionTypes = [
    { value: "seasonal", label: "Seasonal" },
    { value: "special", label: "Special Event" },
    { value: "member", label: "Member Only" },
    { value: "flash", label: "Flash Sale" },
  ];

  const roomTypes = [
    { value: "deluxe", label: "Deluxe Room" },
    { value: "suite", label: "Suite" },
    { value: "standard", label: "Standard Room" },
    { value: "presidential", label: "Presidential Suite" },
  ];

  useEffect(() => {
    if (editPromotion) {
      setFormData({
        promotionID: editPromotion.promotionID,
        promotionName: editPromotion.promotionName,
        description: editPromotion.description,
        discountType: editPromotion.discountType,
        active: editPromotion.active,
        promotionType: editPromotion.promotionType,
      });

      if (
        editPromotion.roomTypePromotion &&
        editPromotion.roomTypePromotion.length > 0
      ) {
        setRoomTypePromotions(
          editPromotion.roomTypePromotion.map((rtp) => ({
            roomTypeId:
              typeof rtp.roomType === "string"
                ? rtp.roomType
                : rtp.roomType.roomTypeID || "",
            roomTypeName:
              typeof rtp.roomType === "string"
                ? rtp.roomType
                : rtp.roomType.typeName || "",
            discountValue: rtp.discountValue,
            startDate: rtp.startDate,
            endDate: rtp.endDate,
          }))
        );
      }
    } else {
      setFormData({
        promotionName: "",
        description: "",
        discountType: undefined,
        active: true,
        promotionType: undefined,
      });
      setRoomTypePromotions([]);
    }
  }, [editPromotion, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (roomTypePromotions.length === 0) {
      alert("Please add at least one room type promotion");
      return;
    }

    for (const rtp of roomTypePromotions) {
      if (new Date(rtp.startDate) >= new Date(rtp.endDate)) {
        alert("End date must be after start date");
        return;
      }
    }

    onSubmit({
      ...formData,
      roomTypePromotion:
        roomTypePromotions as unknown as Promotion["roomTypePromotion"],
    });
  };

  const addRoomTypePromotion = () => {
    const today = new Date().toISOString().split("T")[0];
    const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    setRoomTypePromotions([
      ...roomTypePromotions,
      {
        roomTypeId: "",
        roomTypeName: "",
        discountValue: 0,
        startDate: today,
        endDate: nextMonth,
      },
    ]);
  };

  const removeRoomTypePromotion = (index: number) => {
    setRoomTypePromotions(roomTypePromotions.filter((_, i) => i !== index));
  };

  const updateRoomTypePromotion = (
    index: number,
    field: keyof RoomTypePromotionForm,
    value: string | number
  ) => {
    const updated = [...roomTypePromotions];
    updated[index] = { ...updated[index], [field]: value };

    // Update room type name when room type id changes
    if (field === "roomTypeId") {
      const selectedRoom = roomTypes.find((rt) => rt.value === value);
      if (selectedRoom) {
        updated[index].roomTypeName = selectedRoom.label;
      }
    }

    setRoomTypePromotions(updated);
  };

  const discountTypeOptions = [
    { value: "percentage", label: "Percentage (%)" },
    { value: "fixed", label: "Fixed Amount (VND)" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-200 bg-white rounded-t-xl">
              <h2 className="text-2xl font-bold text-gray-900">
                {editPromotion ? "Edit Promotion" : "Add New Promotion"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaTimes className="text-gray-600 text-xl" />
              </button>
            </div>

            {/* Form */}
            <div className="overflow-y-auto scrollbar-thin flex-1">
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Info Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                    <FaInfoCircle className="text-[#b27c1f]" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Basic Information
                    </h3>
                  </div>

                  {/* Promotion Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Promotion Name
                    </label>
                    <input
                      type="text"
                      value={formData.promotionName || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          promotionName: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6b5e4c] focus:border-[#6b5e4c] transition-colors text-gray-700"
                      placeholder="Enter promotion name..."
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6b5e4c] focus:border-[#6b5e4c] transition-colors resize-none text-gray-700"
                      placeholder="Enter promotion description..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Promotion Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Promotion Type
                      </label>
                      <Dropdown
                        options={promotionTypes}
                        value={
                          typeof formData.promotionType === "object"
                            ? formData.promotionType?.promotionTypeID || ""
                            : ""
                        }
                        onChange={(value) =>
                          setFormData({
                            ...formData,
                            promotionType: promotionTypes.find(
                              (t) => t.value === value
                            )
                              ? {
                                  promotionTypeID: value,
                                  promotionTypeName: promotionTypes.find(
                                    (t) => t.value === value
                                  )!.label,
                                }
                              : undefined,
                          })
                        }
                        placeholder="Select promotion type"
                      />
                    </div>

                    {/* Discount Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discount Type
                      </label>
                      <Dropdown
                        options={discountTypeOptions}
                        value={formData.discountType || ""}
                        onChange={(value) =>
                          setFormData({ ...formData, discountType: value })
                        }
                        placeholder="Select discount type"
                      />
                    </div>
                  </div>

                  {/* Active Status */}
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.active}
                      onChange={(e) =>
                        setFormData({ ...formData, active: e.target.checked })
                      }
                      className="w-5 h-5 text-[#6b5e4c] border-gray-300 rounded focus:ring-[#6b5e4c] accent-[#b27c1f]"
                    />
                    <label
                      htmlFor="isActive"
                      className="text-sm font-medium text-gray-700"
                    >
                      Active Promotion
                    </label>
                  </div>
                </div>

                {/* Room Type Promotions Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <FaInfoCircle className="text-[#b27c1f]" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        Room Type Promotions
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={addRoomTypePromotion}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#b27c1f] to-[#eab354] text-white rounded-lg hover:shadow-lg transition-all text-sm font-semibold"
                    >
                      <FaPlus className="text-xs" />
                      Add Room Type
                    </button>
                  </div>

                  {roomTypePromotions.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-200 mb-4">
                        <FaPlus className="text-2xl text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">
                        No room types added yet
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        Click "Add Room Type" to start
                      </p>
                    </div>
                  )}

                  {/* Room Type Promotion Items */}
                  <div className="space-y-4">
                    {roomTypePromotions.map((rtp, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-5 border-2 border-gray-200 rounded-xl bg-gradient-to-br from-white to-gray-50 hover:border-[#b27c1f] transition-all shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm font-bold text-gray-700 bg-[#f5f0eb] px-3 py-1 rounded-full">
                            Room Type #{index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeRoomTypePromotion(index)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <FaTrash />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Room Type */}
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-2">
                              Room Type
                            </label>
                            <Dropdown
                              options={roomTypes}
                              value={rtp.roomTypeId}
                              onChange={(value) =>
                                updateRoomTypePromotion(
                                  index,
                                  "roomTypeId",
                                  value
                                )
                              }
                              placeholder="Select room type"
                            />
                          </div>

                          {/* Discount Value */}
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-2">
                              Discount Value{" "}
                              {formData.discountType
                                ? "(%)"
                                : "(VND)"}
                            </label>
                            <input
                              type="number"
                              value={rtp.discountValue}
                              onChange={(e) =>
                                updateRoomTypePromotion(
                                  index,
                                  "discountValue",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              min="0"
                              max={
                                formData.discountType 
                                  ? 100
                                  : undefined
                              }
                              step={
                                formData.discountType
                                  ? 1
                                  : 1000
                              }
                              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6b5e4c] focus:border-[#6b5e4c] text-sm font-medium"
                              required
                            />
                          </div>

                          {/* Start Date */}
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-2">
                              Start Date
                            </label>
                            <input
                              type="date"
                              value={rtp.startDate}
                              onChange={(e) =>
                                updateRoomTypePromotion(
                                  index,
                                  "startDate",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6b5e4c] focus:border-[#6b5e4c] text-sm font-medium"
                              required
                            />
                          </div>

                          {/* End Date */}
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-2">
                              End Date
                            </label>
                            <input
                              type="date"
                              value={rtp.endDate}
                              onChange={(e) =>
                                updateRoomTypePromotion(
                                  index,
                                  "endDate",
                                  e.target.value
                                )
                              }
                              min={rtp.startDate}
                              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#6b5e4c] focus:border-[#6b5e4c] text-sm font-medium"
                              required
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#b27c1f] to-[#eab354] text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    {editPromotion ? "Update Promotion" : "Create Promotion"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddPromotionModal;
