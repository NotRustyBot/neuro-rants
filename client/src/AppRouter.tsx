import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import NewRant from "./NewRant";
import { Outlet } from "react-router-dom";
import AuthCallback from "./AuthCallback";
import Approve from "./Approve";
import { Navigation } from "./Navigation";

const RouterWrap: React.FC = () => (
    <>
        <Navigation />
        <Outlet />
    </>
);
const router = createBrowserRouter([
    {
        path: "/",
        element: <RouterWrap />,
        children: [
            {
                path: "/",
                element: <App />,
            },
            {
                path: "/new",
                element: <NewRant />,
            },
            {
                path: "/edit",
                element: <NewRant  />,
            },
            {
                path: "/callback",
                element: <AuthCallback />,
            },
            {
                path: "/approve",
                element: <Approve />,
            },
        ],
    },
]);

const AppRouter: React.FC = () => (
    <RouterProvider router={router}/>
);

export default AppRouter;
