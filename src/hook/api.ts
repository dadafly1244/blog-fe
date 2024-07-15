import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import useLoginStore from "@/store/loginStore";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": import.meta.env.VITE_BASE_URL,
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useLoginStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: number;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomInternalAxiosRequestConfig;
    if (
      error.response?.status === 401 &&
      (!originalRequest._retry || originalRequest._retry < 10)
    ) {
      originalRequest._retry = (originalRequest._retry || 0) + 1;
      try {
        const refreshToken = useLoginStore.getState().refreshToken;
        console.log(useLoginStore.getState());
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }
        const response = await api.post<{ accessToken: string }>("/refresh", {
          refreshToken,
        });
        const newAccessToken = response.data.accessToken;
        useLoginStore.getState().setCredentials(newAccessToken, refreshToken);
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        useLoginStore.getState().logOut();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
