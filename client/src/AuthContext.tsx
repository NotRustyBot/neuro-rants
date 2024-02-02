import { createContext, useContext, useState } from "react";

interface AuthContextData {
    authToken: string | undefined;
    updateAuthToken: (newData: string | undefined) => void;
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
export const AuthContext: React.FC<MyContextProviderProps> = ({ children }) => {
    const [authToken, setAuthToken] = useState(window.localStorage.getItem("ds-token") as undefined | string);

    updateAuthToken = (newToken: string | undefined) => {
        window.localStorage.setItem("ds-token", newToken ?? "");
        setAuthToken(newToken);
    };

    const contextValue: AuthContextData = {
        authToken,
        updateAuthToken,
    };

    return <MyContext.Provider value={contextValue}>{children}</MyContext.Provider>;
};
