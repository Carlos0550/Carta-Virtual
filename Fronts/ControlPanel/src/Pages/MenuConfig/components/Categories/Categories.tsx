import { Box, Button, Flex, Group, Text } from "@mantine/core"
import CategoriesCardList from "./components/Table/CategoriesCardList"
import { BiPlus } from "react-icons/bi"
import CategoryModal from "./components/CategoryModal"
import { useAppContext } from "../../../../Context/AppContext"

function Categories() {
    const {
        useModalHook:{
            setCategoriesModal
        }
    } = useAppContext()
    const handleOpenModal = () => setCategoriesModal({opened: true, formType:"create"})
    return (
        <Flex
            direction={"column"}
            gap={10}
        >
            <Box p={10} w={"100%"}>
                <Group justify="space-between" w={"100%"}>
                    <Flex
                        direction={"column"}
                        gap={5}

                    >
                        <Text
                            c={"#2c2c2c"}
                            fw={600}
                            size="lg"
                        >
                            Lista de categorías
                        </Text>
                        <Text
                            c={"#2c2c2c"}
                            fw={500}
                            size="md"
                        >
                            Administrá acá la variedad de tu menú
                        </Text>
                    </Flex>
                    <Button
                        onClick={handleOpenModal}
                        leftSection={<BiPlus size={18} />}
                    >Nueva Categoría</Button>
                </Group>
            </Box>
            <CategoriesCardList />
            <CategoryModal/>
        </Flex>
    )
}

export default Categories