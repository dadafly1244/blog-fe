import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "@/hook/api";

export interface RegisterCredentials {
  user: string;
  pwd: string;
  roles: "Admin" | "Editor" | "User";
  status: string;
  profile?: {
    avatar: string;
    firstName: string;
    lastName?: string;
    gender?: "male" | "female" | "other" | "prefer not to say";
    birthDate?: string;
    bio: string;
    location?: string;
    website: string;
    socialLinks?: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      linkedin?: string;
    };
  };
}

interface ApiError {
  message: string;
}

interface RegisterResponse {
  message: string;
}

export const useRegister = () => {
  return useMutation<
    RegisterResponse,
    AxiosError<ApiError>,
    RegisterCredentials
  >({
    mutationFn: (credentials) => api.post("/register", credentials),
  });
};
