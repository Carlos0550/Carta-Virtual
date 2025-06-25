import { useMemo, useState } from 'react'
import type { BusinessModal } from '../HookTypes/ModalTypes'
import { type CategoriesModal } from '../HookTypes/Categories'
import type { FoodModal } from '../HookTypes/FoodTypes'

function useModal() {
  const [businessModal, setBusinessModal] = useState<BusinessModal>({
    formType: "create",
    opened: false,
    editBusinessData: {
      business_banner: "",
      business_id: "",
      business_description: "",
      business_email: "",
      business_geodata: {
        address1: "",
        city: {
          label: "",
          code: ""
        },
        country: {
          label: "",
          code: ""
        },
        region: {
          label: "",
          code: ""
        }
      },
      business_name: "",
      business_phone: ""
    }
  })
  const [categoriesModal, setCategoriesModal] = useState<CategoriesModal>({
    formType: "create",
    opened: false,
    editCategoryData: null
  })

  const [foodModal, setFoodModal] = useState<FoodModal>({
    formType: "create",
    opened: false,
  })


  const closeBusinessModal = () => {
    setBusinessModal({
      formType: "create",
      opened: false,
      editBusinessData: {
        business_banner: "",
        business_id: "",
        business_description: "",
        business_email: "",
        business_geodata: {
          address1: "",
          city: {
            label: "",
            code: ""
          },
          country: {
            label: "",
            code: ""
          },
          region: {
            label: "",
            code: ""
          }
        },
        business_name: "",
        business_phone: ""
      }
    })
  }

  const closeCategoriesModal = () => {
    setCategoriesModal({
      formType: "create",
      opened: false,
      editCategoryData: null
    })
  }

  const closeFoodModal = () => {
    setFoodModal({
      opened: false,
      formType: "create"
    })
  }
  return useMemo(() => ({
    businessModal, setBusinessModal, closeBusinessModal,
    closeCategoriesModal, categoriesModal, setCategoriesModal,
    closeFoodModal, foodModal, setFoodModal
  }),[
    businessModal, setBusinessModal, closeBusinessModal,
    closeCategoriesModal, categoriesModal, setCategoriesModal,
    closeFoodModal, foodModal, setFoodModal
  ])
}

export default useModal