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
  persist: boolean;
  setCredentials: (accessToken: string) => void;
  logOut: () => void;
  setPersist: (value: boolean) => void;
  getLoginUser: () => UserInfo;
}

const useLoginStore = create<LoginState>()(
  persist(
    (set, get) => ({
      token: null,
      persist: false,
      setCredentials: (accessToken: string) => set({ token: accessToken }),
      logOut: () => set({ token: null }),
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
    }
  )
);

export default useLoginStore;
