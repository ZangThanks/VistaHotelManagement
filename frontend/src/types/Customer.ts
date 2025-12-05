export type Gender = 'MALE' | 'FEMALE' | 'OTHER' | string;
export type MemberShipLevel =
    | 'BRONZE'
    | 'SILVER'
    | 'GOLD'
    | 'PLATINUM'
    | string;
export type UserRole = 'CUSTOMER' | 'EMPLOYEE' | 'ADMIN' | string;

export interface Customer {
    id: string;
    userName: string;
    password: string;
    email: string;
    phone: string;
    avatarUrl: string | null;
    fullName?: string | null;
    address: string;
    userRole: UserRole;
    birthDate: string | null; // YYYY-MM-DD
    gender: Gender;
    joinedDate: string; // YYYY-MM-DD
    loyaltyPoints: number;
    memberShipLevel: MemberShipLevel;
    reputationPoint: number;
}
