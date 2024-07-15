export const routePaths = ["/", "/NotFound", "/Error"] as const;
export type ROUTE_PATH = (typeof routePaths)[number];
import useLoginStore from "@/store/loginStore";
import { Navigate, useLocation, Outlet } from "react-router-dom";

import { createBrowserRouter } from "react-router-dom";
import HomePage from "@/pages/Home";
import AdminPage from "@/pages/Admin";
import SignUpPage from "@/pages/SignUp";
import SignInPage from "@/pages/SignIn";
import SignOutPage from "@/pages/SignOut";
import BlogPage from "@/pages/Blog";
import NotFound from "@/pages/default/NotFound";
interface ProtectedRouteProps {
  children: React.ReactNode;
  rolesArray: string[];
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  rolesArray,
}) => {
  const hasToken = useLoginStore((state) => state.token);
  const getLoginUser = useLoginStore((state) => state.getLoginUser);
  const user = getLoginUser();
  const location = useLocation();
  if (hasToken && rolesArray.includes(user.roles)) {
    return (
      <>
        {children}
        <Outlet />
      </>
    );
  } else {
    alert("접근할 수 없습니다. 관리자 권한이 필요합니다. ");
    return <Navigate to="/blog" state={{ from: location }} />;
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
    path: "/blog",
    element: (
      <ProtectedRoute
        children={<BlogPage />}
        rolesArray={["Admin", "Editor", "User"]}
      />
    ),
    children: [
      {
        path: "sign-out",
        element: <SignOutPage />,
      },
    ],
  },
  {
    path: "/admin",
    element: <ProtectedRoute children={<AdminPage />} rolesArray={["Admin"]} />,
  },

  { path: "/*", element: <NotFound /> },
];

export let router = createBrowserRouter(routes);
