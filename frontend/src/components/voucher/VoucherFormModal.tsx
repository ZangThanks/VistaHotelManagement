import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Voucher } from "../../types/Voucher";

interface VoucherFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Voucher>) => Promise<void>;
  voucher?: Voucher | null;
  submitting?: boolean;
}

const VoucherFormModal: React.FC<VoucherFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  voucher,
  submitting = false,
}) => {
  const [formData, setFormData] = useState<Partial<Voucher>>({
    voucherID: "",
    voucherName: "",
    discountType: "PERCENT",
    discountPercentage: 0,
    discountValue: 0,
    startDate: new Date(),
    endDate: new Date(),
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (voucher) {
        setFormData({
          voucherID: voucher.voucherID,
          voucherName: voucher.voucherName,
          discountType: voucher.discountType,
          discountPercentage: voucher.discountPercentage,
          discountValue: voucher.discountValue,
          startDate: voucher.startDate,
          endDate: voucher.endDate,
          isActive: voucher.isActive,
        });
      } else {
        setFormData({
          voucherID: "",
          voucherName: "",
          discountType: "PERCENT",
          discountPercentage: 0,
          discountValue: 0,
          startDate: new Date(),
          endDate: new Date(),
          isActive: true,
        });
      }
      setErrors({});
    }
  }, [isOpen, voucher]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.voucherID?.trim()) {
      newErrors.voucherID = "Voucher ID is required";
    }
    if (!formData.voucherName?.trim()) {
      newErrors.voucherName = "Voucher name is required";
    }
    if (
      formData.discountType === "PERCENT" &&
      (!formData.discountPercentage ||
        formData.discountPercentage <= 0 ||
        formData.discountPercentage > 100)
    ) {
      newErrors.discountPercentage =
        "Discount percentage must be between 1 and 100";
    }
    if (
      formData.discountType === "FIXED" &&
      (!formData.discountValue || formData.discountValue <= 0)
    ) {
      newErrors.discountValue = "Discount value must be greater than 0";
    }
    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }
    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }
    if (
      formData.startDate &&
      formData.endDate &&
      new Date(formData.endDate) <= new Date(formData.startDate)
    ) {
      newErrors.endDate = "End date must be after start date";
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
            {voucher ? "Edit Voucher" : "Create Voucher"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Voucher ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.voucherID}
                onChange={(e) =>
                  setFormData({ ...formData, voucherID: e.target.value })
                }
                disabled={!!voucher}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6b5e4c] ${
                  errors.voucherID ? "border-red-500" : "border-gray-300"
                } ${voucher ? "bg-gray-100" : ""}`}
                placeholder="e.g., SUMMER2024"
              />
              {errors.voucherID && (
                <p className="text-red-500 text-xs mt-1">{errors.voucherID}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Voucher Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.voucherName}
                onChange={(e) =>
                  setFormData({ ...formData, voucherName: e.target.value })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6b5e4c] ${
                  errors.voucherName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Summer Discount"
              />
              {errors.voucherName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.voucherName}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.discountType}
              onChange={(e) =>
                setFormData({ ...formData, discountType: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6b5e4c] cursor-pointer"
            >
              <option value="PERCENT">Percentage (%)</option>
              <option value="FIXED">Fixed Amount (VND)</option>
            </select>
          </div>

          {formData.discountType === "PERCENT" ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Percentage (%) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.discountPercentage}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discountPercentage: parseFloat(e.target.value),
                  })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6b5e4c] ${
                  errors.discountPercentage
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                min="0"
                max="100"
                step="0.1"
              />
              {errors.discountPercentage && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.discountPercentage}
                </p>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Value (VND) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.discountValue}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discountValue: parseFloat(e.target.value),
                  })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6b5e4c] ${
                  errors.discountValue ? "border-red-500" : "border-gray-300"
                }`}
                min="0"
                step="1000"
              />
              {errors.discountValue && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.discountValue}
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={
                  formData.startDate
                    ? new Date(formData.startDate).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    startDate: new Date(e.target.value),
                  })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6b5e4c] ${
                  errors.startDate ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.startDate && (
                <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={
                  formData.endDate
                    ? new Date(formData.endDate).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    endDate: new Date(e.target.value),
                  })
                }
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6b5e4c] ${
                  errors.endDate ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.endDate && (
                <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="w-4 h-4 text-[#6b5e4c] border-gray-300 rounded focus:ring-[#6b5e4c] cursor-pointer"
            />
            <label
              htmlFor="isActive"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              Active
            </label>
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
              {submitting ? "Saving..." : voucher ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default VoucherFormModal;
