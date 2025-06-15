import { Modal } from '@mantine/core'
import { useAppContext } from '../../../Context/AppContext'
import BusinessForm from './Form/BusinessForm'

function BusinessModal() {
    const {
        useModalHook:{
            businessModal,
            closeBusinessModal
        }
    } = useAppContext()

  
  return (
    <Modal
        opened={businessModal?.opened || false}
        onClose={closeBusinessModal}
        title={businessModal?.formType === "create" ? "Crear Negocio" : "Editar Negocio"}
        size="lg"
    >
       <BusinessForm/> 
    </Modal>
  )
}

export default BusinessModal