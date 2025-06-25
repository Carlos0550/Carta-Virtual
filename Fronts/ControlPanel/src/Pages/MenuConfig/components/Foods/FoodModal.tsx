import { Modal, Text } from '@mantine/core'
import { useAppContext } from '@/Context/AppContext'
import FoodForm from './components/Form/FoodForm'


function FoodModal() {
    const {
        useModalHook:{
            foodModal,
            closeFoodModal
        }
    } = useAppContext()
  return (
    <Modal
        opened={foodModal?.opened!}
        onClose={closeFoodModal}
        title={foodModal?.formType === "create" ? (
            <Text
                c={"#2c2c2c"}
                fw={700}
                size='lg'
            >
                Nueva Comída
            </Text>
        ) : (
            <Text
                c={"#2c2c2c"}
                fw={700}
                size='lg'
            >
                Editando comída
            </Text>
        )}
    >
        <FoodForm/>
  </Modal>
  )
}

export default FoodModal