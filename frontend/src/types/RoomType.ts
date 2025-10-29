
export interface RoomType {
    id?: string;
    name?: string;
    description?: string;
    area?: number;
    maxOccupancy?: number;
    amenities?: string[];
    basePrice?: number;
    images?: string[];
    [key: string]: unknown;
}