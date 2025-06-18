import { useMemo, useState } from 'react'
import type { BusinessModal } from '../HookTypes/ModalTypes'
import { type CategoriesModal } from '../HookTypes/Categories'

function useModal() {
  const [businessModal, setBusinessModal] = useState<BusinessModal>({
    formType: "create",
    opened: false
  })
  const [categoriesModal, setCategoriesModal] = useState<CategoriesModal>({
    formType: "create",
    opened: false
  })

  const closeBusinessModal = () => {
    setBusinessModal({
      formType: "create",
      opened: false
    })
  }

  const closeCategoriesModal = () => {
    setCategoriesModal({
      formType: "create",
      opened: false
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