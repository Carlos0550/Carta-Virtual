import { useMemo, useState } from 'react'
import type { BusinessModal } from '../HookTypes/ModalTypes'

function useModal() {
    const [businessModal, setBusinessModal] = useState<BusinessModal | null>(null)

    const closeBusinessModal = () => {
        setBusinessModal(null)
    }
  return useMemo(() => ({
    businessModal, setBusinessModal,
    closeBusinessModal
  }),[
    businessModal, setBusinessModal,
    closeBusinessModal
  ])
}

export default useModal