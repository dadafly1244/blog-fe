import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

type Role = "Admin" | "Editor" | "User";
type Status = "active" | "inActive";

interface UserInfo {
  user: string;
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
      refreshToken: null,
      persist: false,
      setCredentials: (accessToken: string | undefined) => {
        // console.log("Setting credentials, token:", accessToken);
        if (accessToken) {
          Cookies.set("token", accessToken, {
            secure: true,
            sameSite: "strict",
          });
          set({ token: accessToken });
        } else {
          console.warn("Attempted to set undefined token");
        }
        // console.log("After setting, token in store:", get().token);
        // console.log("After setting, token in cookie:", Cookies.get("token"));
      },
      logOut: () => {
        Cookies.remove("token");
        set({ token: null });
      },
      setPersist: (value: boolean) => set({ persist: value }),
      getLoginUser: () => {
        const token = get().token || Cookies.get("token");
        if (token) {
          try {
            const decoded = jwtDecode<{ UserInfo: UserInfo }>(token);
            const { user, roles, status } = decoded.UserInfo;
            return { user, roles, status };
          } catch (error) {
            console.error("Failed to decode token:", error);
          }
        }
        return { user: "", roles: "User", status: "inActive" };
      },
    }),
    {
      name: "login-storage",
      storage: {
        getItem: () => {
          return {
            state: {
              token: Cookies.get("token") || null,
            },
          };
        },
        setItem: () => {},
        removeItem: () => {
          Cookies.remove("token");
        },
      },
    }
  )
);

export default useLoginStore;
