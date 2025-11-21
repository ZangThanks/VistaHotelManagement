import { api } from "./apiClient";
import type { PromotionType } from "../types/PromotionType";

const ENDPOINT = "/promotion-types";

export const getAllPromotionTypes = async (): Promise<PromotionType[]> => {
  try {
    const response = await api.get(`${ENDPOINT}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching promotion types:", error);
    throw error;
  }
};

export const getPromotionTypeById = async (
  id: string
): Promise<PromotionType> => {
  try {
    const response = await api.get(`${ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching promotion type:", error);
    throw error;
  }
};
