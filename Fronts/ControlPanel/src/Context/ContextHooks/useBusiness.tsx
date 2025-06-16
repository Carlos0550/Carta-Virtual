import React, { useCallback, useMemo, useState } from 'react'
import type { BusinessData, BusinessFormData } from '../HookTypes/BusinessTypes'
import { endpoints } from '../ContextUtils/Apis'
import useSessionValidator from '../ContextUtils/useSessionValidator'
import { showNotification } from '@mantine/notifications'

type respResponse  = {
    msg: string;
    status: number;
    newBusinessData: BusinessData
}
function useBusiness() {
    const { ensureSessionIsValid } = useSessionValidator()
    const [businessData, setBusinessData] = useState<BusinessData | null>(null)

    const clearBusinessData = useCallback(()=> {
        setBusinessData(null)
    },[businessData, setBusinessData])

    const saveBusiness = useCallback(async(formData:BusinessFormData): Promise<boolean> => {
        await ensureSessionIsValid()
        const access_token = localStorage.getItem('access_token')

        const url = new URL(`${endpoints.business}/save`)
        try {
            const response = await fetch(url.toString(),{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${access_token}`,
                },
                body: JSON.stringify(formData),
            });

            const respData: respResponse = await response.json();
            if(!response.ok) throw new Error(respData.msg || 'Error al guardar los datos del negocio')
            showNotification({
                title: "Configuración de negocio actualizada.",
                message: respData.msg,
                color: "green",
                position: "top-right",
                autoClose: 3000,
            })

            setBusinessData(respData.newBusinessData)
            return true
            
        } catch (error) {
            console.log(error)
            showNotification({
                title: "Error al guardar los datos del negocio",
                message: (error as Error).message || 'Ocurrió un error inesperado',
                color: "red",
                position: "top-right",
                autoClose: 3000,
            })
            return false
        }
    },[ensureSessionIsValid, setBusinessData])
  return useMemo(()=> ({
    businessData,
    setBusinessData,
    clearBusinessData,
    saveBusiness
  }),[
    businessData,
    setBusinessData,
    clearBusinessData,
    saveBusiness
  ])
}

export default useBusiness