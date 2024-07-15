import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import useLoginStore from "@/store/loginStore";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
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

const MAX_RETRY_ATTEMPTS = 3;
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomInternalAxiosRequestConfig;
    if (
      error.response?.status === 401 &&
      (!originalRequest._retry || originalRequest._retry < MAX_RETRY_ATTEMPTS)
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (typeof token === "string") {
              originalRequest.headers["Authorization"] = "Bearer " + token;
              return api(originalRequest);
            }
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = (originalRequest._retry || 0) + 1;
      isRefreshing = true;

      try {
        const { data } = await api.post<{ accessToken: string }>("/refresh");
        const newAccessToken = data.accessToken;

        useLoginStore.getState().setCredentials(newAccessToken);
        api.defaults.headers.common["Authorization"] =
          "Bearer " + newAccessToken;
        originalRequest.headers["Authorization"] = "Bearer " + newAccessToken;

        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useLoginStore.getState().logOut();
        window.location.href = "/sign-in";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
