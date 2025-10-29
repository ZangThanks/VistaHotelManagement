import { api } from './apiClient';

export interface LoginData {
    email?: string;
    phone?: string;
    password: string;
}

export interface RegisterData {
    userName: string;
    fullName: string;
    email?: string;
    phone?: string;
    password: string;
    address?: string;
    gender?: string;
    birthDate?: string;
}

export interface AuthResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    token?: string;
}

export const handleLogin = async (
    payload: LoginData,
): Promise<AuthResponse> => {
    try {
        const { data } = await api.post('/auth/login', payload);
        return {
            success: true,
            message: 'Đăng nhập thành công!',
            data: data.user ?? data, // fallback nếu backend chưa bọc trong 'user'
            token: data.token ?? '',
        };
    } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        return {
            success: false,
            message:
                error.response?.data?.message ||
                'Đăng nhập thất bại. Vui lòng thử lại.',
        };
    }
};

export const handleRegister = async (
    payload: RegisterData,
): Promise<AuthResponse> => {
    try {
        const { data } = await api.post('/auth/register', payload);
        return {
            success: true,
            message: 'Đăng ký thành công!',
            data,
        };
    } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        return {
            success: false,
            message:
                error.response?.data?.message ||
                'Đăng ký thất bại. Vui lòng thử lại.',
        };
    }
};

export const handleLogout = (): AuthResponse => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return {
        success: true,
        message: 'Đăng xuất thành công!',
    };
};
