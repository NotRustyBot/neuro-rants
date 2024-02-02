import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import NewRant from "./NewRant";
import AuthCallback from "./AuthCallback";
import Approve from "./Approve";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path: "/new",
        element: <NewRant />,
    },
    {
        path: "/callback",
        element: <AuthCallback />,
    },
    {
        path: "/approve",
        element: <Approve />,
    },
]);

const AppRouter: React.FC = () => {
    return <RouterProvider router={router} />;
};

export default AppRouter;
