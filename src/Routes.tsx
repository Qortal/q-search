import {
  createBrowserRouter,
  RouterProvider,

} from "react-router-dom";
import App from "./App";
import Layout from "./styles/Layout";
import { Search } from "./page/Search";


// Use a custom type if you need it
interface CustomWindow extends Window {
  _qdnBase: string;
}
const customWindow = window as unknown as CustomWindow;
const baseUrl = customWindow?._qdnBase || "";

export function Routes() {

  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: <Layout />,
        children: [
          {
            index: true,
            element: <App />,
          },
          {
            path: "search", 
            element: <Search />,
          },
        ],
      },
    ],
    {
      basename: baseUrl,
    }
  );

  return <RouterProvider router={router} />;
}
