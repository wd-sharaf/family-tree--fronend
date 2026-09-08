import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://d3moyfpvj6r1i2.cloudfront.net/api/v1",
  headers: { "Content-Type": "application/json" },
});


apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export interface RegisterPayload {
  email: string;
  password: string;
  full_name: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface UserResponse {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}
export const registerUser = async (data: RegisterPayload): Promise<UserResponse> => {
  const response = await apiClient.post<UserResponse>("/auth/register", data);
  return response.data;
};

export const loginUser = async (data: LoginPayload): Promise<TokenResponse> => {
  const response = await apiClient.post<TokenResponse>("/auth/login", data);
  const { access_token, refresh_token } = response.data;
  localStorage.setItem("accessToken", access_token);
  localStorage.setItem("refreshToken", refresh_token);
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login";
};

export default apiClient;
