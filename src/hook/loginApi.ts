import useLoginStore from "@/store/loginStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "@/hook/api";

interface Credentials {
  username: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
}

export const useLogin = () => {
  const setCredentials = useLoginStore((state) => state.setCredentials);
  return useMutation<LoginResponse, AxiosError, Credentials>({
    mutationFn: (credentials) => api.post("/login", credentials),
    onSuccess: (data) => {
      setCredentials(data.accessToken);
    },
  });
};

export const useLogout = () => {
  const logOut = useLoginStore((state) => state.logOut);
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError>({
    mutationFn: () => api.post("/logout"),
    onSuccess: () => {
      logOut();
      queryClient.clear();
    },
  });
};

export const useRefreshToken = () => {
  const setCredentials = useLoginStore((state) => state.setCredentials);
  return useMutation<LoginResponse, AxiosError>({
    mutationFn: () => api.get("refresh"),
    onSuccess: (data) => {
      setCredentials(data.accessToken);
    },
  });
};
