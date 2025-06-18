import { Modal, Text } from '@mantine/core'
import { useAppContext } from '../../../../../Context/AppContext'
import CategoryForm from './Form/CategoryForm'

function CategoryModal() {
    const {
        useModalHook:{
            categoriesModal,
            closeCategoriesModal
        }
    } = useAppContext()
  return (
    <Modal
        opened={categoriesModal?.opened!}
        onClose={closeCategoriesModal}
        title={categoriesModal?.formType === "create" ? (
            <Text
                c={"#2c2c2c"}
                fw={700}
                size='lg'
            >
                Nueva Categoría
            </Text>
        ) : (
            <Text
                c={"#2c2c2c"}
                fw={700}
                size='lg'
            >
                Editando Categoría
            </Text>
        )}
    >
        <CategoryForm/>
  </Modal>
  )
}

export default CategoryModal