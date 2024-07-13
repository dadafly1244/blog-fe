export const routePaths = ["/", "/NotFound", "/Error"] as const;
export type ROUTE_PATH = (typeof routePaths)[number];

import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/Home";

const routes = [
  {
    path: "/",
    element: <HomePage />,
  },
];

export let router = createBrowserRouter(routes);
