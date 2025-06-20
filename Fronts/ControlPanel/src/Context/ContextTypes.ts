import type React from "react"
import type { LoginData, UserInfo } from "./HookTypes/AuthTypes"
import type { BusinessModal } from "./HookTypes/ModalTypes"
import type { BusinessData, BusinessFormData } from "./HookTypes/BusinessTypes"
import type { CategoriesForm, CategoriesModal, Category } from "./HookTypes/Categories"
import type { SetStateAction } from "react"

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
    setBusinessModal: React.Dispatch<React.SetStateAction<BusinessModal>>
    closeBusinessModal: () => void,

    closeCategoriesModal: () => void, 
    categoriesModal: CategoriesModal | null, 
    setCategoriesModal: React.Dispatch<SetStateAction<CategoriesModal>>
}

interface BusinessHooks{
    businessData: BusinessData | null,
    setBusinessData: React.Dispatch<React.SetStateAction<BusinessData | null>>,
    clearBusinessData: () => void,
    saveBusiness: (formData: BusinessFormData, fileData: File) => Promise<boolean>,
    retrieveBusinessData: () => Promise<boolean | string>,
    updateBusinessInfo: (formData: BusinessFormData, fileData: File) => Promise<boolean>
}

interface CategoriesHooks{
    categories: Category[],
    saveCategory: (formData: CategoriesForm, fileData: File) => Promise<boolean>
    retrieveCategories: (bsd_id: string) => Promise<boolean>,
    updateCategory: (formData: CategoriesForm, fileData: File, category_id: string) => Promise<boolean>,
    deleteCategory: (category_id: string) => Promise<boolean>
}

export interface AppContextTypes{
    useAuthHook: AuthHooks,
    width: number
    useModalHook: ModalHooks,
    businessHooks: BusinessHooks,
    categoriesHooks: CategoriesHooks
}