import { useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { endpoints } from "../ContextUtils/Apis"

function useSessionValidator() {
  const navigate = useNavigate()

  const ensureSessionIsValid = useCallback(async (): Promise<boolean> => {
    const access_token = localStorage.getItem("access_token")

    const restoreUrl = new URL(`${endpoints.auth}/restore-session`)
    const refreshUrl = new URL(`${endpoints.auth}/refresh-session`)

    try {
      const res = await fetch(restoreUrl.toString(), {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })

      if (res.ok) {
        return true
      }

      const refreshRes = await fetch(refreshUrl.toString(), {
        method: "POST",
        credentials: "include",
      })

      if (!refreshRes.ok) {
        localStorage.removeItem("access_token")
        navigate("/authentication")
        return false
      }

      const { access_token: newToken } = await refreshRes.json()
      localStorage.setItem("access_token", newToken)
      return true
    } catch (error) {
      console.error("Error validando la sesión:", error)
      localStorage.removeItem("access_token")
      navigate("/authentication")
      return false
    }
  }, [navigate])

  return { ensureSessionIsValid }
}

export default useSessionValidator
