/* eslint-disable */
import { api } from "./apiClient";

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
  refreshToken?: string;
}

export const handleLogin = async (
  payload: LoginData
): Promise<AuthResponse> => {
  try {
    const { data } = await api.post("/auth/login", payload);

    // Kiểm tra response từ backend
    if (data.success === false) {
      return {
        success: false,
        message: data.message || "Đăng nhập thất bại",
      };
    }

    // Lưu tokens vào localStorage
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    if (data.refreshToken) {
      localStorage.setItem("refreshToken", data.refreshToken);
    }
    if (data.data) {
      localStorage.setItem("user", JSON.stringify(data.data));
    }

    return {
      success: true,
      message: data.message || "Đăng nhập thành công!",
      data: data.data,
      token: data.token,
      refreshToken: data.refreshToken,
    };
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } };
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Đăng nhập thất bại. Vui lòng thử lại.",
    };
  }
};

export const handleRegister = async (
  payload: RegisterData
): Promise<AuthResponse> => {
  try {
    const { data } = await api.post("/auth/register", payload);

    // Kiểm tra response từ backend
    if (data.success === false) {
      return {
        success: false,
        message: data.message || "Đăng ký thất bại",
      };
    }

    return {
      success: true,
      message: data.message || "Đăng ký thành công!",
      data: data.data ?? data,
    };
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } };
    return {
      success: false,
      message:
        error.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.",
    };
  }
};

export const handleLogout = (): AuthResponse => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  return {
    success: true,
    message: "Đăng xuất thành công!",
  };
};

export const validateToken = async (): Promise<AuthResponse> => {
  try {
    const { data } = await api.get("/auth/validate");
    return data;
  } catch (err: unknown) {
    return {
      success: false,
      message: "Token không hợp lệ hoặc đã hết hạn",
    };
  }
};

export const refreshToken = async (): Promise<AuthResponse> => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      return {
        success: false,
        message: "Không tìm thấy refresh token",
      };
    }

    const { data } = await api.post(
      "/auth/refresh-token",
      {},
      {
        headers: { Authorization: `Bearer ${refreshToken}` },
      }
    );

    if (data.success && data.token) {
      localStorage.setItem("token", data.token);
    }

    return data;
  } catch (err: unknown) {
    return {
      success: false,
      message: "Không thể làm mới token",
    };
  }
};
