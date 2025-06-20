import { useMemo, useState } from 'react'
import type { BusinessModal } from '../HookTypes/ModalTypes'
import { type CategoriesModal } from '../HookTypes/Categories'

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
  return useMemo(() => ({
    businessModal, setBusinessModal, closeBusinessModal,
    closeCategoriesModal, categoriesModal, setCategoriesModal
  }), [
    businessModal, setBusinessModal, closeBusinessModal,
    closeCategoriesModal, categoriesModal, setCategoriesModal
  ])
}

export default useModal