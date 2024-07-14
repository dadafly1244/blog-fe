export const routePaths = ["/", "/NotFound", "/Error"] as const;
export type ROUTE_PATH = (typeof routePaths)[number];
import useLoginStore from "@/store/loginStore";
import { Navigate, useLocation, Outlet } from "react-router-dom";

import { createBrowserRouter } from "react-router-dom";
import HomePage from "@/pages/Home";
import AdminPage from "@/pages/Admin";
import SignUpPage from "@/pages/SignUp";
import SignInPage from "@/pages/SignIn";
import NotFound from "@/pages/default/NotFound";
interface ProtectedRouteProps {
  children: React.ReactNode;
  roles: string[];
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const hasToken = useLoginStore((state) => state.token);
  const getLoginUser = useLoginStore((state) => state.getLoginUser);
  const user = getLoginUser();
  const location = useLocation();

  if (hasToken && roles.includes(user.status)) {
    return (
      <>
        {children}
        <Outlet />
      </>
    );
  } else {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
};

export default ProtectedRoute;
const routes = [
  {
    path: "/",
    element: <HomePage />,
    children: [
      {
        path: "sign-up",
        element: <SignUpPage />,
      },
      {
        path: "sign-in",
        element: <SignInPage />,
      },
    ],
  },
  {
    path: "/admin",
    element: <ProtectedRoute children={<AdminPage />} roles={["admin"]} />,
  },
  { path: "/*", element: <NotFound /> },
];

export let router = createBrowserRouter(routes);
