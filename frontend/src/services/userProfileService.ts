import { api } from "./apiClient";
import type {
  UserProfile,
  PasswordChangeRequest,
  ProfileUpdateRequest,
} from "../types/UserProfile";
import type { Customer } from "../types/Customer";
import type { Booking } from "../types/Booking";

const CUSTOMER_ENDPOINT = "/customers";
const AUTH_ENDPOINT = "/auth";

/**
 * Lấy thông tin khách hàng theo ID
 */
export const getCustomerProfile = async (
  customerId: string
): Promise<Customer> => {
  try {
    const response = await api.get(`${CUSTOMER_ENDPOINT}/${customerId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching customer profile:", error);
    throw error;
  }
};

/**
 * Cập nhật thông tin khách hàng
 */
export const updateCustomerProfile = async (
  customerId: string,
  data: ProfileUpdateRequest
): Promise<Customer> => {
  try {
    const response = await api.put(`${CUSTOMER_ENDPOINT}/${customerId}`, data);
    return response.data;
  } catch (error) {
    console.error("Error updating customer profile:", error);
    throw error;
  }
};

/**
 * Đổi mật khẩu người dùng
 * Backend endpoint: POST /auth/change-password
 * Request body: { userId, currentPassword, newPassword }
 */
export const changePassword = async (
  userId: string,
  data: PasswordChangeRequest
): Promise<{ success: boolean; message: string }> => {
  try {
const AUTH_ENDPOINT = "/auth";
    const response = await api.post(`${AUTH_ENDPOINT}/change-password`, {
      userId: userId,
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
    return {
      success: true,
      message: response.data.message || "Password changed successfully!",
    };
  } catch (error: unknown) {
    console.error("Error changing password:", error);
    const err = error as { response?: { data?: { message?: string } } };
    throw new Error(err.response?.data?.message || "Failed to change password");
  }
};

/**
 * Lấy danh sách đặt phòng của khách hàng
 */
export const getCustomerBookings = async (
  customerId: string
): Promise<Booking[]> => {
  try {
    const response = await api.get(`/bookings/customer/${customerId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching customer bookings:", error);
    throw error;
  }
};

/**
 * Lấy người dùng từ localStorage
 */
export const getCurrentUserFromStorage = (): UserProfile | null => {
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    return null;
  }
};

/**
 * Cập nhật người dùng trong localStorage
 */
export const updateUserInStorage = (user: UserProfile): void => {
  try {
    localStorage.setItem("user", JSON.stringify(user));
  } catch (error) {
    console.error("Error updating user in localStorage:", error);
  }
};

const userProfileService = {
  getCustomerProfile,
  updateCustomerProfile,
  changePassword,
  getCustomerBookings,
  getCurrentUserFromStorage,
  updateUserInStorage,
};

export default userProfileService;
