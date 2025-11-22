import { api } from "./apiClient";
import type { Voucher } from "../types/Voucher";
import type {
  CustomerVoucher,
  DistributionCriteria,
} from "../types/CustomerVoucher";

const ENDPOINT = "/vouchers";

/**
 * Get all vouchers
 */
export const getAllVouchers = async (): Promise<Voucher[]> => {
  try {
    const response = await api.get(ENDPOINT);
    return response.data;
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    throw error;
  }
};

/**
 * Get voucher by ID
 */
export const getVoucherById = async (id: string): Promise<Voucher> => {
  try {
    const response = await api.get(`${ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching voucher by ID:", error);
    throw error;
  }
};

/**
 * Create or update voucher
 */
export const saveVoucher = async (
  voucherData: Partial<Voucher>
): Promise<Voucher> => {
  try {
    const response = await api.post(`${ENDPOINT}/save`, voucherData);
    return response.data;
  } catch (error) {
    console.error("Error saving voucher:", error);
    throw error;
  }
};

/**
 * Toggle voucher active status
 */
export const toggleVoucherStatus = async (
  id: string,
  isActive: boolean
): Promise<void> => {
  try {
    await api.patch(`${ENDPOINT}/${id}/status`, { isActive });
  } catch (error) {
    console.error("Error toggling voucher status:", error);
    throw error;
  }
};

/**
 * Delete voucher
 */
export const deleteVoucher = async (id: string): Promise<void> => {
  try {
    await api.delete(`${ENDPOINT}/delete/${id}`);
  } catch (error) {
    console.error("Error deleting voucher:", error);
    throw error;
  }
};

/**
 * Distribute voucher to customers based on criteria
 */
export const distributeVoucher = async (
  voucherId: string,
  criteria: DistributionCriteria
): Promise<{ count: number; customerVouchers: CustomerVoucher[] }> => {
  try {
    const response = await api.post(
      `${ENDPOINT}/${voucherId}/distribute`,
      criteria
    );
    return response.data;
  } catch (error) {
    console.error("Error distributing voucher:", error);
    throw error;
  }
};

/**
 * Preview customers who will receive voucher (without actually distributing)
 */
export const previewDistribution = async (
  criteria: DistributionCriteria
): Promise<{ count: number; customers: unknown[] }> => {
  try {
    const response = await api.post(
      `${ENDPOINT}/distribution/preview`,
      criteria
    );
    return response.data;
  } catch (error) {
    console.error("Error previewing distribution:", error);
    throw error;
  }
};

const voucherService = {
  getAllVouchers,
  getVoucherById,
  saveVoucher,
  toggleVoucherStatus,
  deleteVoucher,
  distributeVoucher,
  previewDistribution,
};

export default voucherService;
