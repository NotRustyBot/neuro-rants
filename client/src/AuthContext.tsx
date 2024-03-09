import { createContext, useContext, useState } from "react";

interface AuthContextData {
    authToken: string | undefined;
    moderator: boolean;
    updateAuthToken: (newData: string | undefined) => void;
    updateModerator: (newData: boolean | undefined) => void;
}

export const MyContext = createContext<AuthContextData | undefined>(undefined);

export const useAuthContext = () => {
    const context = useContext(MyContext);
    if (!context) {
        throw new Error("useMyContext must be used within a MyContextProvider");
    }
    return context;
};


interface MyContextProviderProps {
    children: React.ReactNode;
}
export let updateAuthToken = (newToken: string | undefined) => {};
export let updateModerator = (newToken: boolean | undefined) => {};
export const AuthContext: React.FC<MyContextProviderProps> = ({ children }) => {
    const [authToken, setAuthToken] = useState(window.localStorage.getItem("ds-token") as undefined | string);
    const [moderator, setModerator] = useState(false);

    updateAuthToken = (newToken: string | undefined) => {
        window.localStorage.setItem("ds-token", newToken ?? "");
        setAuthToken(newToken);
    };

    updateModerator = (newToken: boolean | undefined) => {
        setModerator(newToken ?? false);
    };

    const contextValue: AuthContextData = {
        authToken,
        moderator,
        updateModerator,
        updateAuthToken,
    };

    return <MyContext.Provider value={contextValue}>{children}</MyContext.Provider>;
};
