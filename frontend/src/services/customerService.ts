/* eslint-disable */
import { axiosInstance } from "../config/api";
import type { Customer } from "../types/Customer";
const ENDPOINT = "/customers";

export const getAll = async () => {
  try {
    const response = await axiosInstance.get(ENDPOINT);
    return response.data;
  } catch (error) {
    console.error("Error fetching customers:", error);
    throw error;
  }
};

export const getById = async (id: string | number) => {
  try {
    const response = await axiosInstance.get(`${ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching booking ${id}:`, error);
    throw error;
  }
};

export const saveCustomer = async (customer: Customer) => {
  try {
    const response = await axiosInstance.post(`${ENDPOINT}/save`, customer);

    if (response.data && Object.keys(response.data).length > 0) {
      return response.data;
    }

    return null;
  } catch (error) {
    console.error("Error saving customer:", error);

    // có phản hồi từ server
    if (error && typeof error === "object" && "response" in error) {
      const err = error as any;
      console.error("Response error:", err.response?.data);
      throw new Error(
        err.response?.data?.message ||
          `Lỗi ${err.response?.status}: Không thể lưu khách hàng`
      );
    }

    // không có phản hồi
    throw new Error("Không thể kết nối đến server");
  }
};

export const searchByName = async (name: string) => {
  try {
    const response = await axiosInstance.get(`${ENDPOINT}/search`, {
      params: { name },
    });
    return response.data;
  } catch (error) {
    console.error("Error searching customers:", error);
    throw error;
  }
};
