export interface UserInfo{
    user_id: string,
    user_name:string,
    user_email:string,
    otp_code?: string
}

export interface LoginData{
    isAuth: boolean,
    user_info: UserInfo,
    
}