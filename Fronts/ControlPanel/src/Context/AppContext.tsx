import { createContext, useContext, useMemo, useState } from "react";
import WidthUtil from "./ContextUtils/WidthUtil";
import type { AppContextTypes } from "./ContextTypes";
import useAuth from "./ContextHooks/useAuth";

const AppContext = createContext<AppContextTypes | null>(null);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within a AppContextProvider");
    }
    return context;
};

export const AppContextProvider = ({ children }: any) => {
    const width = WidthUtil().width
    const useAuthHook = useAuth()

    const ContextValues = useMemo(() => ({
        width, useAuthHook
    }),[
        width, useAuthHook
    ])
    return <AppContext.Provider value={ContextValues}>{children}</AppContext.Provider>;
};