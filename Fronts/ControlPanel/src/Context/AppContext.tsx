import { createContext, useContext, useMemo } from "react";
import WidthUtil from "./ContextUtils/WidthUtil";
import type { AppContextTypes } from "./ContextTypes";
import useAuth from "./ContextHooks/useAuth";
import useModal from "./ContextHooks/useModal";
import useBusiness from "./ContextHooks/useBusiness";
import useCategories from "./ContextHooks/useCategories";
import { useQuery } from "@tanstack/react-query";
import "./css/context.css"

import BallsIcon from "../components/Icons/BallsLoader.svg"
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
    
    const useModalHook = useModal()

    const businessHooks = useBusiness()

    const categoriesHooks = useCategories({business_id: businessHooks.businessData?.business_id || ""})
    
    const ContextValues = useMemo(() => ({
        width, 
        useAuthHook,
        useModalHook, 
        businessHooks,
        categoriesHooks
    }),[
        width, 
        useAuthHook,
        useModalHook, 
        businessHooks,
        categoriesHooks
    ])
    
    
    const { isLoading: loadingApp } = useQuery({
        queryKey: ['initApp'],
        queryFn: async () => {

            if (useAuthHook.loginData.isAuth) {
                await businessHooks.retrieveBusinessData()
            }
            return true
        },
        enabled: useAuthHook.loginData.isAuth , 
        staleTime: Infinity,
        gcTime: Infinity,
        retry: 0, 
        refetchOnWindowFocus: false, 
        refetchOnReconnect:true
    })
    
    if (loadingApp) {
        return <div className="loading-app">
                <div className="dot-spinner">
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                    <div className="dot-spinner__dot"></div>
                </div>
        </div>
    }
    
    return <AppContext.Provider value={ContextValues}>{children}</AppContext.Provider>;
};