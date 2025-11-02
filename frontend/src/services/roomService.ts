import type { Room } from '../types/Room';

export default class RoomService {
    private baseUrl: string;
    private getAuthToken: () => string | null;

    constructor(baseUrl: string, getAuthToken: () => string | null) {
        this.baseUrl = baseUrl || 'http://localhost:8081';
        this.getAuthToken = getAuthToken;
    }

    // Build a full URL; ensure baseUrl is present to avoid fetching the client index.html.
    private buildUrl(path: string) {
        if (!this.baseUrl) {
            throw new Error(
                'API baseUrl is not configured. Set VITE_API_URL (or REACT_APP_API_URL) to your backend URL.',
            );
        }
        // Avoid double slashes when joining
        return `${this.baseUrl.replace(/\/+$/, '')}/${path.replace(
            /^\/+/,
            '',
        )}`;
    }

    private async parseResponse<T>(response: Response): Promise<T> {
        const contentType = (
            response.headers.get('content-type') || ''
        ).toLowerCase();
        const text = await response.text();

        if (!response.ok) {
            // Try to include JSON message if available
            if (contentType.includes('application/json')) {
                try {
                    const json = JSON.parse(text);
                    throw new Error(
                        json?.message ||
                            `Request failed with status ${response.status}`,
                    );
                } catch {
                    throw new Error(
                        `Request failed with status ${response.status}: ${text}`,
                    );
                }
            }
            throw new Error(
                `Request failed with status ${response.status}: ${text}`,
            );
        }

        if (contentType.includes('application/json')) {
            try {
                return JSON.parse(text) as T;
            } catch (e) {
                throw new Error(
                    'Failed to parse JSON response: ' + (e as Error).message,
                );
            }
        }

      
        throw new Error(
            `Expected JSON response but received content-type "${contentType}". Response preview: ${text.slice(
                0,
                300,
            )}`,
        );
    }

    async getRooms(): Promise<Room[]> {
        const response = await fetch(this.buildUrl('/rooms'), {
            headers: {
                Authorization: `Bearer ${this.getAuthToken()}`,
            },
        });
        return this.parseResponse<Room[]>(response);
    }

    async getRoomById(id: string): Promise<Room | null> {
        const response = await fetch(this.buildUrl(`/rooms/${id}`), {
            headers: {
                Authorization: `Bearer ${this.getAuthToken()}`,
            },
        });
        return this.parseResponse<Room | null>(response);
    }

    async createRoom(room: Room): Promise<Room> {
        const response = await fetch(this.buildUrl('/rooms'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.getAuthToken()}`,
            },
            body: JSON.stringify(room),
        });
        return this.parseResponse<Room>(response);
    }

    async updateRoom(id: string, room: Partial<Room>): Promise<Room | null> {
        const response = await fetch(this.buildUrl(`/rooms/${id}`), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.getAuthToken()}`,
            },
            body: JSON.stringify(room),
        });
        return this.parseResponse<Room | null>(response);
    }

    async deleteRoom(id: string): Promise<void> {
        const response = await fetch(this.buildUrl(`/rooms/${id}`), {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${this.getAuthToken()}`,
            },
        });
        await this.parseResponse<void>(response);
    }
}
