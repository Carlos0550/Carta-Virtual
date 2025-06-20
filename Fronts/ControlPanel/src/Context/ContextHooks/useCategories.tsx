import { useCallback, useEffect, useMemo, useState } from 'react'
import type { CategoriesForm, Category } from '../HookTypes/Categories'
import { endpoints } from '../ContextUtils/Apis'
import { showNotification } from '@mantine/notifications'
import { TbAlertCircle, TbCheck } from 'react-icons/tb'
import useSessionValidator from '../ContextUtils/useSessionValidator'

interface Props{
    business_id: string,
}
function useCategories({business_id}: Props) {
    const [categories, setCategories] = useState<Category[]>([])
    const {ensureSessionIsValid} = useSessionValidator()

    const saveCategory = useCallback(async(formData: CategoriesForm, fileData: File) => {
        await ensureSessionIsValid()
        const url = new URL(`${endpoints.categories}/create`)
        console.log(business_id)
        url.searchParams.append("business_id", business_id)

        const form = new FormData()
        Object.entries(formData).forEach(([key, value]) => {
            if(value !== undefined && value !== null){
                form.append(key, value)
            }
        })

        form.append("category_image", fileData)
        try {
            const response = await fetch(url, {
                method: "POST",
                body: form
            })
    
            const data = await response.json()
            if(!response.ok) throw new Error(data.msg || "Error al crear la categoría")

            showNotification({
                title: "Categoría creada",
                message: data.msg,
                color: "green",
                autoClose: 3000,
                position: "top-right",
                withCloseButton: true,
                icon: <TbCheck size={18}/>
                
            })
            setCategories(prev => [...prev, data.category])
            return true

        } catch (error) {
            console.log(error)
            showNotification({
                title: "Error",
                message: (error as Error).message || "Error al crear la categoría",
                color: "red",
                autoClose: 3000,
                position: "top-right",
                withCloseButton: true,
                icon: <TbAlertCircle size={18}/>
            })
            return false
        }
    },[business_id, setCategories, ensureSessionIsValid])

    const updateCategory = useCallback(async(formData: CategoriesForm, fileData: File, category_id: string) => {
        await ensureSessionIsValid()
        const url = new URL(`${endpoints.categories}/update`)
        url.searchParams.append("business_id", business_id)
        url.searchParams.append("category_id", category_id)

        const form = new FormData()
        Object.entries(formData).forEach(([key, value]) => {
            if(value !== undefined && value !== null){
                form.append(key, value)
            }
        })
        form.append("category_image", fileData)

        try {
            const response = await fetch(url, {
                method: "PUT",
                body: form
            })
            const data = await response.json()
            if(!response.ok) throw new Error(data.msg || "Error al actualizar la categoría")

            showNotification({
                title: "Categoría actualizada",
                message: data.msg,
                color: "green",
                autoClose: 3000,
                position: "top-right",
                withCloseButton: true,
                icon: <TbCheck size={18}/>
            })

            setCategories(prev => prev.map(cat => (cat.category_id === category_id || cat.category_name === category_id ? data.category : cat)))
            return true
        } catch (error) {
            console.log(error)
            showNotification({
                title: "Error",
                message: (error as Error).message || "Error al actualizar la categoría",
                color: "red",
                autoClose: 3000,
                position: "top-right",
                withCloseButton: true,
                icon: <TbAlertCircle size={18}/>
            })
            return false
        }
    },[business_id, ensureSessionIsValid, setCategories])

    const deleteCategoryFn = useCallback(async(category_id: string) => {
        await ensureSessionIsValid()
        const url = new URL(`${endpoints.categories}/delete`)
        url.searchParams.append("business_id", business_id)
        url.searchParams.append("category_id", category_id)
        try {
            const response = await fetch(url, { method: "DELETE" })
            const data = await response.json()
            if(!response.ok) throw new Error(data.msg || "Error al eliminar la categoría")
            showNotification({
                title: "Categoría eliminada",
                message: data.msg,
                color: "green",
                autoClose: 3000,
                position: "top-right",
                withCloseButton: true,
                icon: <TbCheck size={18}/>
            })
            setCategories(prev => prev.filter(cat => !(cat.category_id === category_id || cat.category_name === category_id)))
            return true
        } catch (error) {
            console.log(error)
            showNotification({
                title: "Error",
                message: (error as Error).message || "Error al eliminar la categoría",
                color: "red",
                autoClose: 3000,
                position: "top-right",
                withCloseButton: true,
                icon: <TbAlertCircle size={18}/>
            })
            return false
        }
    },[business_id, ensureSessionIsValid, setCategories])


   const retrieveCategories = useCallback(async(bsd_id: string) => {
    await ensureSessionIsValid()
    const url = new URL(`${endpoints.categories}/retrieve-data`)
    url.searchParams.append("business_id", bsd_id || "")
    const access_token = localStorage.getItem("access_token")
    try {
        const response = await fetch(url, {
            headers: {
                "Authorization": `Bearer ${access_token}`
            }
        })
        if(!response.ok) throw new Error("Error al recuperar las categorías")
        const data = await response.json()
        setCategories(data.categories)
        return true
    } catch (error) {
        console.log(error)
        return false
    }
   },[ensureSessionIsValid])


  return useMemo(() => ({
    saveCategory,
    updateCategory,
    deleteCategory: deleteCategoryFn,
    categories,
    retrieveCategories
  }),[
    saveCategory,
    updateCategory,
    deleteCategoryFn,
    categories,
    retrieveCategories
  ])
}

export default useCategories
