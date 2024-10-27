import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../components/login/Login";
import Register from "../components/register/Register";
import Layout from "../components/layout/Layout";
import Error from "../pages/Error";
import Statistics from "../pages/Statistics";
import Members from "../pages/members/Members";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/overview",
        element: <div>overview</div>,
      },
      {
        path: "/setting",
        element: <div>setting</div>,
      },
      {
        path: "/reward",
        element: <div>reward</div>,
      },
      {
        path: "/statistics",
        element: <Statistics />,
      },
      {
        path: "/members",
        element: <Members />,
      },
    ],
  },
]);

export const Route = () => {
  return <RouterProvider router={router} />;
};
