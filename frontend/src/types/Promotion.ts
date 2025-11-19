import type { PromotionType } from "./PromotionType";
import type { RoomTypePromotion } from "./RoomTypePromotion";

export type DiscountType = "PERCENT" | "FIXED";

export interface Promotion {
  promotionID: string;
  promotionName: string;
  description: string;
  discountType: DiscountType;
  active: boolean;
  promotionType: PromotionType;
  adminId?: string;
  roomTypePromotion?: RoomTypePromotion[];
}