import { useCallback, useEffect, useMemo, useState } from 'react'
import type { BusinessData, BusinessFormData } from '../HookTypes/BusinessTypes'
import { endpoints } from '../ContextUtils/Apis'
import useSessionValidator from '../ContextUtils/useSessionValidator'
import { showNotification } from '@mantine/notifications'

type saveBusinessResp = {
    msg: string;
    newBusinessData: BusinessData
}

type retrieveBusinessResp = {
    msg: string;
    business: BusinessData
}

type UpdateBusinessResponde = {
    msg: string,
    business: BusinessData
}
function useBusiness() {
    const { ensureSessionIsValid } = useSessionValidator()
    const [businessData, setBusinessData] = useState<BusinessData | null>(null)

    const clearBusinessData = useCallback(() => {
        setBusinessData(null)
    }, [businessData, setBusinessData])

    const saveBusiness = useCallback(async (formData: BusinessFormData, fileData: File): Promise<boolean> => {
        await ensureSessionIsValid()
        const access_token = localStorage.getItem('access_token')

        const url = new URL(`${endpoints.business}/save`)
        const form = new FormData()

        Object.entries(formData).forEach(([key, value]) => {
            if(value !== undefined && value !== null){
                form.append(key, value)
            }
        })

        if(fileData){
            form.append("business_image", fileData)
        }
        try {
            const response = await fetch(url.toString(), {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${access_token}`,
                },
                body: form,
            });

            const respData: saveBusinessResp = await response.json();
            if (!response.ok) throw new Error(respData.msg || 'Error al guardar los datos del negocio')
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
    }, [ensureSessionIsValid, setBusinessData])

    const retrieveBusinessData = useCallback(async (): Promise<boolean | string> => {
        await ensureSessionIsValid()
        const access_token = localStorage.getItem('access_token')
        const url = new URL(`${endpoints.business}/retrieve-data`)
        try {
            const response = await fetch(url.toString(), {
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${access_token}`,
                },
            });

            if(response.status === 404){
                setBusinessData(null)
                return true
            }
            const respData: retrieveBusinessResp = await response.json();

            if (!response.ok) throw new Error(respData.msg || 'Error al recuperar los datos del negocio')
            setBusinessData(respData.business)
            return respData.business.business_id
        } catch (error) {
            console.log(error)
            showNotification({
                title: "Error al recuperar los datos del negocio",
                message: (error as Error).message || 'Ocurrió un error inesperado',
                color: "red",
                position: "top-right",
                autoClose: 3000,
            })
            return false
        }
            
    },[ensureSessionIsValid]) 

    const updateBusinessInfo = useCallback(async(formData: BusinessFormData, fileData: File): Promise<boolean> => {
        await ensureSessionIsValid()
        const at = localStorage.getItem("access_token")
        const url = new URL(`${endpoints.business}/update`)
        url.searchParams.append("business_id", businessData?.business_id || "")
        const form = new FormData()

        Object.entries(formData).forEach(([keys, value]) => {
            if(value !== undefined && value !== null){
                form.append(keys, value)
            }
        })

        form.append("business_image", fileData)

        try {
            const response = await fetch(url,{
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${at}`
                },
                body: form
            });

            const data: UpdateBusinessResponde = await response.json()
            if(!response.ok) throw new Error(data.msg || "Error desconocido.")

            showNotification({
                title: "Actualización exitosa.",
                message: "",
                autoClose: 2500,
                position: "top-right",
                color: "green"
            })
            setBusinessData(data.business)
            return true
        } catch (error) {
            console.log(error)
            showNotification({
                title: "Error al actualizar la información.",
                message: (error as Error).message,
                autoClose: 5000,
                position: "top-right",
                color: "red"
            })

            return false
        }
    },[businessData?.business_id, ensureSessionIsValid])

    return useMemo(() => ({
        businessData,
        setBusinessData,
        clearBusinessData,
        saveBusiness,
        retrieveBusinessData,
        updateBusinessInfo
    }), [
        businessData,
        setBusinessData,
        clearBusinessData,
        saveBusiness,
        retrieveBusinessData,
        updateBusinessInfo
    ])
}

export default useBusiness