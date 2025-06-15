import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { LoginData, UserInfo } from '../HookTypes/AuthTypes'
import { endpoints } from '../ContextUtils/Apis'
import { useNavigate } from 'react-router-dom'
import { showNotification } from '@mantine/notifications'

function useAuth() {
  const navigate = useNavigate()

  const [loginData, setLoginData] = useState<LoginData>({
    isAuth: false,
    user_info: {
      user_email: "",
      user_id: "",
      user_name: ""
    }
  })

  const clearSessionData = () => {
    localStorage.removeItem("access_token")
    setLoginData({
      isAuth: false,
      user_info: {
        user_email: "",
        user_id: "",
        user_name: ""
      }
    })
  }

  const registerUser = useCallback(async (
    formValues: Partial<UserInfo>
  ): Promise<{ msg: string; err: boolean }> => {
    const url = new URL(`${endpoints.users}/create`)
    try {
      const result = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formValues)
      })

      const responseData = await result.json()

      if (!result.ok) throw new Error(responseData.msg || "Error desconocido")

      localStorage.setItem("restored_user", JSON.stringify(formValues))
      return {
        msg: responseData.msg,
        err: false
      }
    } catch (error: any) {
      console.log("ERROR EN registerUser:", error)

      return {
        msg: error.message || "Error al registrar",
        err: true
      }
    }
  }, [])

  const validateRegisterOtp = useCallback(async (
    formValues: Partial<UserInfo> & { otp_code: string }
  ): Promise<boolean> => {
    const url = new URL(`${endpoints.users}/validate`)
    try {
      const result = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formValues)
      })

      const responseData = await result.json()
      const { msg, access_token, user_data } = responseData
      if (!result.ok) throw new Error(msg || "Código incorrecto")

      localStorage.removeItem("restored_user")
      localStorage.setItem("access_token", access_token)
      setLoginData({
        isAuth: true,
        user_info: user_data
      })
      
      return true
    } catch (error: any) {
      console.log("ERROR EN validateOtp:", error)

      showNotification({
        title: "Error al verificar el código",
        message: error.message || "Error desconocido",
        autoClose: 4500,
        color: "red",
        position: "top-right"
      })

      return false
    }
  }, [navigate])

  const loginUser = useCallback(async (user_email: string): Promise<boolean> => {
    const url = new URL(`${endpoints.auth}/login`)
    try {
      const result = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ user_email })
      });

      const responseD = await result.json();
      const { msg } = responseD
      if ([404, 401].includes(result.status)) {
        showNotification({
          title: "Error al iniciar sesión",
          message: msg || "Error desconocido",
          autoClose: 3500,
          color: "orange",
          position: "top-right"
        })
        return false
      }

      if (!result.ok) throw new Error(msg || "Error desconocido.")
      return true
    } catch (error: any) {
      console.log(error)
      clearSessionData()
      if (error instanceof TypeError) {
        showNotification({
          title: "Error al iniciar sesión",
          message: error.message || "Error desconocido",
          autoClose: 4500,
          color: "darkorange",
          position: "top-right"
        })
        return false
      } else {
        showNotification({
          title: "Error al iniciar sesión",
          message: error.message || "Error desconocido",
          autoClose: 5000,
          color: "red",
          position: "top-right"
        })
        return false
      }
    }
  }, [clearSessionData])

  const validateOTP = useCallback(async (user_email: string, otp_code: string): Promise<boolean> => {
    const url = new URL(`${endpoints.auth}/validate-login`)
    url.searchParams.append("user_email", String(user_email))
    url.searchParams.append("otp_code", String(otp_code))

    try {
      const result = await fetch(url, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      const responseD = await result.json()
      const { access_token, user_data, msg } = responseD
      console.log(responseD)
      if (!result.ok) throw new Error(msg || "Error desconocido.")
      localStorage.setItem("access_token", access_token);

      setLoginData({
        isAuth: true,
        user_info: user_data
      });

      showNotification({
        title: "Bienvenido/a",
        message: `¡Hola ${user_data.user_name}!`,
        autoClose: 3000,
        color: "green",
        position: "top-right"
      });
      navigate("/dashboard")
      return true
    } catch (error: any) {
      console.log(error)
      clearSessionData()
      if (error instanceof TypeError) {
        showNotification({
          title: "Error al iniciar sesión",
          message: error.message || "Error desconocido",
          autoClose: 4500,
          color: "darkorange",
          position: "top-right"
        })
        return false
      } else {
        showNotification({
          title: "Error al iniciar sesión",
          message: error.message || "Error desconocido",
          autoClose: 5000,
          color: "red",
          position: "top-right"
        })
        return false
      }
    }
  }, [])

  const restoreSession = useCallback(async () => {
  const access_token = localStorage.getItem("access_token")
  if (!access_token) {
    navigate("/authentication")
    return
  }

  const restoreSessionUrl = new URL(`${endpoints.auth}/restore-session`)
  const refreshSessionUrl = new URL(`${endpoints.auth}/refresh-session`)

  try {
    const restoreRes = await fetch(restoreSessionUrl.toString(), {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    if (restoreRes.ok) {
      const data = await restoreRes.json()
      setLoginData({
        isAuth: true,
        user_info: {
          user_email: data.user_email,
          user_id: data.user_id,
          user_name: data.user_name,
        },
      })
      navigate("/")
      return
    }

    const refreshRes = await fetch(refreshSessionUrl.toString(), {
      method: "POST",
      credentials: "include", 
    })

    if (refreshRes.ok) {
      const data = await refreshRes.json()

      localStorage.setItem("access_token", data.access_token)

      setLoginData({
        isAuth: true,
        user_info: {
          user_email: data.user_data.user_email,
          user_id: data.user_data.user_id,
          user_name: data.user_data.user_name,
        },
      })
      navigate("/dashboard")
      return
    }

    localStorage.removeItem("access_token")
    navigate("/authentication")
  } catch (error) {
    console.error("Error restaurando sesión:", error)
    localStorage.removeItem("access_token")
    navigate("/authentication")
  }
}, [endpoints.auth, navigate, setLoginData])


  useEffect(() => {
    if (!loginData.isAuth) {
      navigate("/authentication")
      return
    }
  }, [loginData.isAuth])

  const alreadyRestored = useRef(false)

  useEffect(()=>{
    if(!alreadyRestored.current){
      alreadyRestored.current = true
      restoreSession()
    }
  },[])
  
  return useMemo(() => ({
    loginData,
    clearSessionData,
    registerUser,
    validateOTP,
    loginUser,
    validateRegisterOtp
  }), [
    loginData,
    registerUser,
    validateOTP,
    clearSessionData,
    loginUser,
    validateRegisterOtp
  ])
}

export default useAuth
