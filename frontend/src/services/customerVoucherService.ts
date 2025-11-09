import { api } from "./apiClient";

const ENDPOINT = "/customer-vouchers";

export const getAll = async () => {
  try {
    const response = await api.get(ENDPOINT);
    return response.data;
  } catch (error) {
    console.error("Error fetching customer voucher:", error);
    throw error;
  }
};

export const getByCustomerId = async (id) => {
  try {
    const response = await api.get(`${ENDPOINT}/customer/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching customer voucher ${id}:`, error);
    throw error;
  }
};
