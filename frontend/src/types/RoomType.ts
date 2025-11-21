export interface RoomType {
    roomTypeID?: string;
    typeName?: string;
    description?: string;
    area?: number;
    maxOccupancy?: number;
    amenties?: string[]; // Backend uses 'amenties' (typo in Java model)
    basePrice?: number;
    [key: string]: unknown;
}
