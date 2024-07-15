import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";

type Role = "Admin" | "Editor" | "User";
type Status = "active" | "inActive";

interface UserInfo {
  username: string;
  roles: Role;
  status: Status;
}

interface LoginState {
  token: string | null;
  refreshToken: string | null;
  persist: boolean;
  setCredentials: (accessToken: string, refreshToken: string) => void;
  logOut: () => void;
  setPersist: (value: boolean) => void;
  getLoginUser: () => UserInfo;
}

const useLoginStore = create<LoginState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      persist: false,
      setCredentials: (accessToken: string, refreshToken: string) =>
        set({ token: accessToken, refreshToken: refreshToken }),
      logOut: () => set({ token: null, refreshToken: null }),
      setPersist: (value: boolean) => set({ persist: value }),
      getLoginUser: () => {
        const token = get().token;
        if (token) {
          try {
            const decoded = jwtDecode<{ UserInfo: UserInfo }>(token);
            const { username, roles, status } = decoded.UserInfo;
            return {
              username,
              roles,
              status,
            };
          } catch (error) {
            console.error("Failed to decode token:", error);
          }
        }
        return {
          username: "",
          roles: "User",
          status: "inActive",
        };
      },
    }),
    {
      name: "login-storage",
      storage: {
        getItem: (name) => {
          const token = localStorage.getItem(`${name}_token`);
          const refreshToken = sessionStorage.getItem(`${name}_refreshToken`);
          return { state: { token, refreshToken } };
        },
        setItem: (name, value) => {
          if (value.state.token) {
            localStorage.setItem(`${name}_token`, value.state.token);
          }
          if (value.state.refreshToken) {
            sessionStorage.setItem(
              `${name}_refreshToken`,
              value.state.refreshToken
            );
          }
        },
        removeItem: (name) => {
          localStorage.removeItem(`${name}_token`);
          sessionStorage.removeItem(`${name}_refreshToken`);
        },
      },
    }
  )
);

export default useLoginStore;
