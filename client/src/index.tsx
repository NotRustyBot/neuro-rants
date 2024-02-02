import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import AppRouter from "./AppRouter";
import { loadDetails, saveToken } from "./util";
import { AuthContext } from "./AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
loadDetails().then((t) => {
    saveToken();
    root.render(
        <React.StrictMode>
            <AuthContext>
                <AppRouter />
            </AuthContext>
        </React.StrictMode>
    );
});
