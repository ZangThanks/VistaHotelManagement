import {api} from "./apiClient";
import type { Promotion } from "../types/Promotion";
// import type { RoomTypePromotion } from "../types/RoomTypePromotion";

const ENDPOINT = "/promotions";

export const getAllPromotions = async () => {
    try {
        const response = await api.get(`${ENDPOINT}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching promotions:", error);
        throw error;
    }
}

export const savePromotion = async (
    promotionData: Partial<Promotion> & {promotionID? : string}
) => {
    try {
        const response = await api.post(`${ENDPOINT}/save`, promotionData);
        return response.data;
    } catch (error) {
        console.error("Error saving promotion:", error);
        throw error;
    }
}