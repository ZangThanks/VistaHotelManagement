import type { Room } from '../types/Room';

export default class RoomService {
    private baseUrl: string;
    private getAuthToken: () => string | null;

    constructor(baseUrl: string, getAuthToken: () => string | null) {
        this.baseUrl = baseUrl;
        this.getAuthToken = getAuthToken;
    }

    async getRooms(): Promise<Room[]> {
        const response = await fetch(`${this.baseUrl}/rooms`, {
            headers: {
                Authorization: `Bearer ${this.getAuthToken()}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch rooms');
        }
        return response.json();
    }

    async getRoomById(id: string): Promise<Room | null> {
        const response = await fetch(`${this.baseUrl}/rooms/${id}`, {
            headers: {
                Authorization: `Bearer ${this.getAuthToken()}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch room');
        }
        return response.json();
    }

    async createRoom(room: Room): Promise<Room> {
        const response = await fetch(`${this.baseUrl}/rooms`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.getAuthToken()}`,
            },
            body: JSON.stringify(room),
        });
        if (!response.ok) {
            throw new Error('Failed to create room');
        }
        return response.json();
    }

    async updateRoom(id: string, room: Partial<Room>): Promise<Room | null> {
        const response = await fetch(`${this.baseUrl}/rooms/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.getAuthToken()}`,
            },
            body: JSON.stringify(room),
        });
        if (!response.ok) {
            throw new Error('Failed to update room');
        }
        return response.json();
    }

    async deleteRoom(id: string): Promise<void> {
        const response = await fetch(`${this.baseUrl}/rooms/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${this.getAuthToken()}`,
            },
        });
        if (!response.ok) {
            throw new Error('Failed to delete room');
        }
    }
}
