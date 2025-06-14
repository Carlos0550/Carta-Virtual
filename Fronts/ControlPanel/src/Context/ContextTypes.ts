import type { LoginData, UserInfo } from "./HookTypes/AuthTypes"

interface AuthHooks{
    loginData: LoginData, 
    validateRegisterOtp: (params: Partial<UserInfo> & { otp_code: string }) => Promise<boolean>
    clearSessionData: () => void, 
    registerUser: (formValues: Partial<UserInfo>) => Promise<{msg: string, err: boolean}>,
    loginUser: (user_email:string) => Promise<boolean>,
    validateOTP: (user_email: string, otp_code: string) => Promise<boolean>
}

export interface AppContextTypes{
    useAuthHook: AuthHooks,
    width: number
}