import { Box, Button, Flex, Group, Text } from '@mantine/core'
import { BiPlus } from 'react-icons/bi'
import FoodModal from './FoodModal'
import { useAppContext } from '@/Context/AppContext'

function Foods() {
    const {
        useModalHook:{
            setFoodModal
        }
    } = useAppContext()
    const handleOpenModal = () => setFoodModal({opened: true, formType:"create"})
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
                            Lista de comidas
                        </Text>
                        <Text
                            c={"#2c2c2c"}
                            fw={500}
                            size="md"
                        >
                            Administrá acá todas las comidas que aparecerán en tu menú
                        </Text>
                    </Flex>
                    <Button
                        onClick={handleOpenModal}
                        leftSection={<BiPlus size={18} />}
                    >Nueva comida</Button>
                </Group>
            </Box>
            <FoodModal/>
        </Flex>
  )
}

export default Foods