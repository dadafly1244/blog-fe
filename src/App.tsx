import { RouterProvider } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { router } from "@/routes";
import "./App.css";

const App: React.FC = () => {
  return (
    <>
      <RouterProvider router={router} />
      <ReactQueryDevtools buttonPosition="bottom-right" />
    </>
  );
};

export default App;
