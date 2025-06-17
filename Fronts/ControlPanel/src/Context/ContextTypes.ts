import type React from "react"
import type { LoginData, UserInfo } from "./HookTypes/AuthTypes"
import type { BusinessModal } from "./HookTypes/ModalTypes"
import type { BusinessData, BusinessFormData } from "./HookTypes/BusinessTypes"

interface AuthHooks{
    loginData: LoginData, 
    validateRegisterOtp: (params: Partial<UserInfo> & { otp_code: string }) => Promise<boolean>
    clearSessionData: () => void, 
    registerUser: (formValues: Partial<UserInfo>) => Promise<{msg: string, err: boolean}>,
    loginUser: (user_email:string) => Promise<boolean>,
    validateOTP: (user_email: string, otp_code: string) => Promise<boolean>
}

interface ModalHooks{
    businessModal: BusinessModal | null, 
    setBusinessModal: React.Dispatch<React.SetStateAction<BusinessModal | null>>
    closeBusinessModal: () => void
}

interface BusinessHooks{
    businessData: BusinessData | null,
    setBusinessData: React.Dispatch<React.SetStateAction<BusinessData | null>>,
    clearBusinessData: () => void,
    saveBusiness: (formData: BusinessFormData) => Promise<boolean>,
    retrieveBusinessData: () => Promise<boolean>
}

export interface AppContextTypes{
    useAuthHook: AuthHooks,
    width: number
    useModalHook: ModalHooks,
    businessHooks: BusinessHooks
}