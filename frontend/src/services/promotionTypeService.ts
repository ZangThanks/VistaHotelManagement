import {api} from "./apiClient";
import type { Promotion } from "../types/Promotion";
import type { RoomTypePromotion } from "../types/RoomTypePromotion";

export const getAllPromotions = async () => {
    try {
        const response = await api.get("/promotions");
        return response.data;
    } catch (error) {
        console.error("Error fetching promotions:", error);
        throw error;
    }
}