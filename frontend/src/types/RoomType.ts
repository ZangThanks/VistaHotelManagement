export interface RoomType {
    roomTypeID?: string;
    typeName?: string;
    description?: string;
    area?: number;
    maxOccupancy?: number;
    amenities?: string[];
    basePrice?: number;
    [key: string]: unknown;
}
