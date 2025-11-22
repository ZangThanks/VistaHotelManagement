import { useState, useEffect, useMemo, useContext } from "react";
import {
  FaPlus,
  FaTicketAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaGift,
  FaUsers,
  FaCalendarAlt,
  FaSearch,
  FaEdit,
  FaPowerOff,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { ToastContext } from "../../../context/ToastContext";
import Pagination from "../../../components/common/Pagination";
import VoucherFormModal from "../../../components/voucher/VoucherFormModal";
import DistributeVoucherModal from "../../../components/voucher/DistributeVoucherModal";
import DistributionTab from "../../../components/voucher/DistributionTab";
import AutoEventsTab from "../../../components/voucher/AutoEventsTab";
import voucherService from "../../../services/voucherService";
import type { Voucher } from "../../../types/Voucher";

const VoucherManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "management" | "distribution" | "events"
  >("management");
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive" | "expired"
  >("all");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDistributeModalOpen, setIsDistributeModalOpen] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const toast = useContext(ToastContext);

  useEffect(() => {
    loadVouchers();
  }, []);

  const loadVouchers = async () => {
    try {
      setLoading(true);
      const data = await voucherService.getAllVouchers();
      setVouchers(data);
    } catch (error) {
      console.error("Error loading vouchers:", error);
      toast?.error("Failed to load vouchers");
    } finally {
      setLoading(false);
    }
  };

  const filteredVouchers = useMemo(() => {
    const now = new Date();
    return vouchers.filter((voucher) => {
      const matchesSearch =
        voucher.voucherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        voucher.voucherID.toLowerCase().includes(searchQuery.toLowerCase());

      const endDate = new Date(voucher.endDate);
      const isExpired = endDate < now;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && voucher.isActive && !isExpired) ||
        (statusFilter === "inactive" && !voucher.isActive) ||
        (statusFilter === "expired" && isExpired);

      return matchesSearch && matchesStatus;
    });
  }, [vouchers, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredVouchers.length / itemsPerPage);
  const paginatedVouchers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredVouchers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredVouchers, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const now = new Date();
    const total = vouchers.length;
    const active = vouchers.filter(
      (v) => v.isActive && new Date(v.endDate) >= now
    ).length;
    const inactive = vouchers.filter((v) => !v.isActive).length;
    const expired = vouchers.filter((v) => new Date(v.endDate) < now).length;
    return { total, active, inactive, expired };
  }, [vouchers]);

  const handleToggleStatus = async (voucher: Voucher) => {
    try {
      await voucherService.toggleVoucherStatus(
        voucher.voucherID,
        !voucher.isActive
      );
      toast?.success(
        `Voucher ${
          voucher.isActive ? "deactivated" : "activated"
        } successfully!`
      );
      await loadVouchers();
    } catch (error) {
      console.error("Error toggling voucher status:", error);
      toast?.error("Failed to update voucher status");
    }
  };

  const handleSubmit = async (data: Partial<Voucher>) => {
    try {
      setSubmitting(true);
      await voucherService.saveVoucher(data);
      toast?.success(
        data.voucherID
          ? "Voucher updated successfully!"
          : "Voucher created successfully!"
      );
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      await loadVouchers();
    } catch (error) {
      console.error("Error saving voucher:", error);
      toast?.error("Failed to save voucher");
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDistributionSuccess = () => {
    toast?.success("Voucher distributed successfully!");
    loadVouchers();
  };

  const handleOpenDistributeModal = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setIsDistributeModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6b5e4c]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#6b5e4c]">
            Voucher Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage vouchers, distribution, and automated events
          </p>
        </div>
        {activeTab === "management" && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#6b5e4c] text-white px-6 py-3 rounded-lg hover:bg-[#5a4d3d] transition-colors flex items-center gap-2 font-semibold"
          >
            <FaPlus />
            Add Voucher
          </button>
        )}
      </div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <div className="bg-white p-6 rounded-lg shadow-sm border border-[#ebe3d7]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Vouchers</p>
              <p className="text-3xl font-bold text-[#6b5e4c] mt-2">
                {stats.total}
              </p>
            </div>
            <FaTicketAlt className="text-4xl text-[#6b5e4c] opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-[#ebe3d7]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {stats.active}
              </p>
            </div>
            <FaCheckCircle className="text-4xl text-green-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-[#ebe3d7]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Inactive</p>
              <p className="text-3xl font-bold text-gray-600 mt-2">
                {stats.inactive}
              </p>
            </div>
            <FaClock className="text-4xl text-gray-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-[#ebe3d7]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Expired</p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {stats.expired}
              </p>
            </div>
            <FaTimesCircle className="text-4xl text-red-600 opacity-20" />
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-lg shadow-sm border border-[#ebe3d7] p-2"
      >
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("management")}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
              activeTab === "management"
                ? "bg-[#6b5e4c] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FaGift />
            <span>Management</span>
          </button>
          <button
            onClick={() => setActiveTab("distribution")}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
              activeTab === "distribution"
                ? "bg-[#6b5e4c] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FaUsers />
            <span>Distribution</span>
          </button>
          <button
            onClick={() => setActiveTab("events")}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
              activeTab === "events"
                ? "bg-[#6b5e4c] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FaCalendarAlt />
            <span>Auto Events</span>
          </button>
        </div>
      </motion.div>

      {/* Tab Content */}
      {activeTab === "management" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {/* Search and Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-[#ebe3d7] flex gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search vouchers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#ebe3d7] rounded-lg focus:ring-2 focus:ring-[#6b5e4c] focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as typeof statusFilter)
              }
              className="px-4 py-2 border border-[#ebe3d7] rounded-lg focus:ring-2 focus:ring-[#6b5e4c] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          {/* Vouchers Table */}
          <div className="bg-white rounded-lg shadow-sm border border-[#ebe3d7] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#f5f0eb]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6b5e4c] uppercase tracking-wider">
                      Voucher
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6b5e4c] uppercase tracking-wider">
                      Discount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6b5e4c] uppercase tracking-wider">
                      Validity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6b5e4c] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6b5e4c] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#ebe3d7]">
                  {paginatedVouchers.map((voucher) => {
                    const now = new Date();
                    const endDate = new Date(voucher.endDate);
                    const isExpired = endDate < now;

                    return (
                      <tr
                        key={voucher.voucherID}
                        className="hover:bg-[#f5f0eb] transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {voucher.voucherName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {voucher.voucherID}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-[#6b5e4c]">
                            {voucher.discountType === "PERCENT"
                              ? `${voucher.discountValue}%`
                              : `${voucher.discountValue?.toLocaleString()}đ`}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(voucher.startDate).toLocaleDateString(
                              "vi-VN"
                            )}{" "}
                            -
                          </div>
                          <div className="text-sm text-gray-900">
                            {endDate.toLocaleDateString("vi-VN")}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isExpired ? (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                              Expired
                            </span>
                          ) : voucher.isActive ? (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          ) : (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button
                            onClick={() => {
                              setSelectedVoucher(voucher);
                              setIsEditModalOpen(true);
                            }}
                            className="text-[#6b5e4c] hover:text-[#5a4d3d] transition-colors"
                            title="Edit"
                          >
                            <FaEdit className="inline" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(voucher)}
                            className={`transition-colors ${
                              voucher.isActive
                                ? "text-red-600 hover:text-red-800"
                                : "text-green-600 hover:text-green-800"
                            }`}
                            title={voucher.isActive ? "Deactivate" : "Activate"}
                          >
                            <FaPowerOff className="inline" />
                          </button>
                          <button
                            onClick={() => handleOpenDistributeModal(voucher)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="Distribute"
                          >
                            <FaUsers className="inline" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {filteredVouchers.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredVouchers.length}
            />
          )}
        </motion.div>
      )}

      {activeTab === "distribution" && (
        <DistributionTab
          vouchers={vouchers}
          onDistribute={handleOpenDistributeModal}
        />
      )}

      {activeTab === "events" && <AutoEventsTab vouchers={vouchers} />}

      {/* Modals */}
      <VoucherFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleSubmit}
        submitting={submitting}
      />

      <VoucherFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleSubmit}
        voucher={selectedVoucher}
        submitting={submitting}
      />

      <DistributeVoucherModal
        isOpen={isDistributeModalOpen}
        onClose={() => setIsDistributeModalOpen(false)}
        voucher={selectedVoucher}
        onSuccess={handleDistributionSuccess}
      />
    </div>
  );
};

export default VoucherManagement;
