import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaPlus,
  FaChartLine,
  FaCheckCircle,
  FaTimesCircle,
  FaTag,
} from "react-icons/fa";
import PromotionFilters from "../../../components/promotion/PromotionFilters";
import PromotionTableView from "../../../components/promotion/view/PromotionTableView";
import AddPromotionModal from "../../../components/promotion/modal/AddPromotionModal";
import PromotionDetailModal from "../../../components/promotion/modal/PromotionDetailModal";
import type { Promotion } from "../../../types/Promotion";
import { useToast } from "../../../hooks/useToast";
import { getAllPromotions, savePromotion } from "../../../services/promotionService";

const PromotionManagement: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [discountTypeFilter, setDiscountTypeFilter] = useState("all");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editPromotion, setEditPromotion] = useState<Promotion | null>(null);
  const [detailPromotion, setDetailPromotion] = useState<Promotion | null>(
    null
  );

  const toast = useToast();

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const data = await getAllPromotions();
      setPromotions(data);
    } catch (error) {
      console.error("Error fetching promotions:", error);
      toast.showToast({
        message: "Failed to load promotions.",
        type: "error",
      });
    }
  };

  // Filter promotions
  const filteredPromotions = promotions.filter((promotion) => {
    const matchesSearch =
      promotion.promotionName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      promotion.promotionID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (promotion.description &&
        promotion.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && promotion.active) ||
      (statusFilter === "inactive" && !promotion.active);

    const matchesType =
      typeFilter === "all" ||
      (typeof promotion.promotionType === "string"
        ? promotion.promotionType === typeFilter
        : promotion.promotionType?.promotionTypeID === typeFilter);

    const matchesDiscountType =
      discountTypeFilter === "all" ||
      promotion.discountType === discountTypeFilter;

    return matchesSearch && matchesStatus && matchesType && matchesDiscountType;
  });

  // Stats
  const stats = {
    total: promotions.length,
    active: promotions.filter((p) => p.active).length,
    inactive: promotions.filter((p) => !p.active).length,
    types: new Set(
      promotions.map((p) =>
        typeof p.promotionType === "string"
          ? p.promotionType
          : p.promotionType?.promotionTypeID
      )
    ).size,
  };

  // Handlers
  const handleAddPromotion = async (promotionData: Partial<Promotion>) => {
    await savePromotion(promotionData);
    toast.showToast({
      message: "Promotion created successfully!",
      type: "success",
    });
    setIsAddModalOpen(false);
  };

  const handleEditPromotion = (promotionData: Partial<Promotion>) => {
    console.log("Edit promotion:", promotionData);
    toast.showToast({
      message: "Promotion updated successfully!",
      type: "success",
    });
    setEditPromotion(null);
  };

  const handleDeletePromotion = (id: string) => {
    console.log("Delete promotion:", id);
    toast.showToast({
      message: "Promotion deleted successfully!",
      type: "success",
    });
  };

  const handleToggleStatus = (id: string, isActive: boolean) => {
    console.log("Toggle status:", id, isActive);
    toast.showToast({
      message: `Promotion ${
        isActive ? "activated" : "deactivated"
      } successfully!`,
      type: "success",
    });
  };

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
            <h1 className="text-3xl font-bold text-gray-900">
              Promotion Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage hotel promotions and special offers
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#6b5e4c] hover:bg-[#5a4d3e] text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
          >
            <FaPlus />
            Add Promotion
          </button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <motion.div
            whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
            className="bg-white rounded-xl shadow-sm border border-[#ebe3d7] p-6 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-[#e3f2fd] flex items-center justify-center flex-shrink-0">
                <FaChartLine className="text-2xl text-[#1976d2]" />
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-gray-800">
                  {stats.total}
                </h3>
                <p className="text-sm text-gray-600 mt-1">Total Promotions</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
            className="bg-white rounded-xl shadow-sm border border-[#ebe3d7] p-6 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-[#e8f5e9] flex items-center justify-center flex-shrink-0">
                <FaCheckCircle className="text-2xl text-[#2e7d32]" />
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-gray-800">
                  {stats.active}
                </h3>
                <p className="text-sm text-gray-600 mt-1">Active</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
            className="bg-white rounded-xl shadow-sm border border-[#ebe3d7] p-6 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-[#ffebee] flex items-center justify-center flex-shrink-0">
                <FaTimesCircle className="text-2xl text-[#c62828]" />
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-gray-800">
                  {stats.inactive}
                </h3>
                <p className="text-sm text-gray-600 mt-1">Inactive</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
            className="bg-white rounded-xl shadow-sm border border-[#ebe3d7] p-6 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-[#fff8e1] flex items-center justify-center flex-shrink-0">
                <FaTag className="text-2xl text-[#f57c00]" />
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-gray-800">
                  {stats.types}
                </h3>
                <p className="text-sm text-gray-600 mt-1">Promotion Types</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <PromotionFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            discountTypeFilter={discountTypeFilter}
            onDiscountTypeFilterChange={setDiscountTypeFilter}
          />
        </motion.div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <PromotionTableView
            promotions={filteredPromotions}
            onEdit={setEditPromotion}
            onDelete={handleDeletePromotion}
            onToggleStatus={handleToggleStatus}
            onViewDetails={setDetailPromotion}
          />
        </motion.div>

        {/* Add/Edit Modal */}
        <AddPromotionModal
          isOpen={isAddModalOpen || !!editPromotion}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditPromotion(null);
          }}
          onSubmit={editPromotion ? handleEditPromotion : handleAddPromotion}
          editPromotion={editPromotion}
        />

        {/* Detail Modal */}
        <PromotionDetailModal
          isOpen={!!detailPromotion}
          onClose={() => setDetailPromotion(null)}
          promotion={detailPromotion}
        />
      </div>
    </div>
  );
};

export default PromotionManagement;
