/* eslint-disable*/
import { api } from "./apiClient";
import type { Promotion } from "../types/Promotion";
import { saveRoomTypePromotion } from "./roomTypePromotionService";
// import type { RoomTypePromotion } from "../types/RoomTypePromotion";

const ENDPOINT = "/promotions";

interface AxiosError {
  response?: {
    data?: unknown;
    status?: number;
  };
}

export const getAllPromotions = async () => {
  try {
    const response = await api.get(`${ENDPOINT}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching promotions:", error);
    throw error;
  }
};

export const createPromotion = async (
  promotionData: Partial<Promotion> & {
    promotionID?: string;
    roomTypePromotions?: Array<{
      roomType: { roomTypeID: string };
      discountValue: number;
      startDate: string;
      endDate: string;
    }>;
  }
) => {
  try {
    console.log("Sending promotion data to backend:", promotionData);

    // Trích xuất roomTypePromotions trước khi gửi
    const { roomTypePromotions, ...promotionOnly } = promotionData;

    // Lấy admin từ localStorage
    const userString = localStorage.getItem("user");
    if (!userString) {
      throw new Error("User not authenticated. Please login first.");
    }

    const currentUser = JSON.parse(userString);

    // Kiểm tra quyền admin
    if (currentUser.userRole !== "ADMIN") {
      throw new Error("Only administrators can create promotions.");
    }

    // Tạo admin object từ thông tin trong localStorage
    const admin = {
      id: currentUser.id,
      userName: currentUser.userName,
      email: currentUser.email,
      phone: currentUser.phone,
      fullName: currentUser.fullName,
      address: currentUser.address,
      userRole: currentUser.userRole,
      adminLevel: currentUser.adminLevel || 1,
      permissions: currentUser.permissions || [],
    };

    // Thêm admin vào promotion
    const promotionWithAdmin = {
      ...promotionOnly,
      admin: admin,
    };

    // Tạo promotion trước
    const response = await api.post(`${ENDPOINT}/create`, promotionWithAdmin);
    console.log("Promotion created:", response.data);

    // Lưu các room type promotions riêng nếu có
    if (roomTypePromotions && roomTypePromotions.length > 0) {
      console.log("Saving room type promotions...");

      // Lấy tất cả các khuyến mãi và tìm khuyến mãi vừa tạo
      const allPromotions = await api.get(`${ENDPOINT}`);
      const fullPromotion = allPromotions.data.find(
        (p: Promotion) => p.promotionID === promotionData.promotionID
      );

      if (!fullPromotion) {
        console.error("Could not find created promotion!");
        throw new Error("Promotion created but not found in database");
      }

      console.log("Found full promotion:", fullPromotion);

      const savePromises = roomTypePromotions.map((rtp) => {
        const rtpData = {
          roomType: rtp.roomType,
          promotion: fullPromotion,
          discountValue: rtp.discountValue,
          startDate: rtp.startDate,
          endDate: rtp.endDate,
        };
        return saveRoomTypePromotion(rtpData).catch((error) => {
          console.error("Failed to save room type promotion:", error);
          return null;
        });
      });

      await Promise.all(savePromises);
    }

    return response.data;
  } catch (error: unknown) {
    console.error("Error saving promotion:", error);
    console.error("Error response:", (error as AxiosError).response?.data);
    console.error("Error status:", (error as AxiosError).response?.status);
    throw error;
  }
};

export const savePromotion = createPromotion;

// Cập nhật trạng thái kích hoạt của khuyến mãi
export const updatePromotionStatus = async (
  promotionID: string,
  active: boolean
) => {
  try {
    const response = await api.patch(
      `${ENDPOINT}/${promotionID}/status?active=${active}`
    );
    return response.data;
  } catch (error) {
    console.error("Error updating promotion status:", error);
    throw error;
  }
};

export const getPromotionById = async (promotionID: string) => {
  try {
    const response = await api.get(`${ENDPOINT}/find/${promotionID}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching promotion by ID:", error);
    throw error;
  }
};
