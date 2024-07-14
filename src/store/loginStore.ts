import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";

interface UserInfo {
  username: string;
  roles: string[];
}

interface LoginState {
  token: string | null;
  persist: boolean;
  setCredentials: (accessToken: string) => void;
  logOut: () => void;
  setPersist: (value: boolean) => void;
  getLoginUser: () => {
    username: string;
    roles: string[];
    status: string;
    isEditor: boolean;
    isAdmin: boolean;
  };
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
          const decoded = jwtDecode<{ UserInfo: UserInfo }>(token);
          const { username, roles } = decoded.UserInfo;
          const isEditor = roles.includes("Editor") || false;
          const isAdmin = roles.includes("Admin") || false;
          const status = isAdmin ? "Admin" : isEditor ? "Editor" : "User";
          return { username, roles, isEditor, isAdmin, status };
        }
        return {
          username: "",
          roles: [],
          status: "User",
          isEditor: false,
          isAdmin: false,
        };
      },
    }),
    {
      name: "login-storage",
    }
  )
);

export default useLoginStore;
