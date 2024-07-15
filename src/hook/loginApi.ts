import useLoginStore from "@/store/loginStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "@/hook/api";

interface Credentials {
  user: string;
  pwd: string;
}

interface LoginResponse {
  data: {
    accessToken: string;
  };
}

export const useLogin = () => {
  const setCredentials = useLoginStore((state) => state.setCredentials);
  return useMutation<LoginResponse, AxiosError, Credentials>({
    mutationFn: (credentials) => api.post("/login", credentials),
    onSuccess: (data) => {
      const accessToken = data.data.accessToken;
      if (accessToken) {
        setCredentials(accessToken);
      } else {
        console.error("Login successful but no access token received");
      }
    },
  });
};

export const useLogout = () => {
  const logOut = useLoginStore((state) => state.logOut);
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError>({
    mutationFn: () => api.get("/logout"),
    onSuccess: () => {
      logOut();
      queryClient.clear();
    },
  });
};

export const useRefreshToken = () => {
  const setCredentials = useLoginStore((state) => state.setCredentials);
  return useMutation<LoginResponse, AxiosError>({
    mutationFn: () => api.get("/refresh"),
    onSuccess: (data) => {
      const accessToken = data.data.accessToken;
      setCredentials(accessToken);
    },
  });
};
