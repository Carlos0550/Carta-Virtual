import { Flex, Title, Text, Button, Card, Center } from "@mantine/core"
import { useAppContext } from "../../Context/AppContext"
import { useState } from "react"
import BusinessModal from "./components/BusinessModal"

function Business() {
  const { 
    width,
    useModalHook:{
        businessModal,
        setBusinessModal
    }
} = useAppContext()

  const [businessConfig, setBusinessConfig] = useState(null)

  return (
    <Flex direction="column" style={{ height: "100vh", width: "100vw", padding: 24 }} gap="md">
      <Title order={width > 600 ? 2 : 3}>Configuración de Negocio</Title>

      {businessConfig === null ? (
        <Card shadow="sm" padding="xl" radius="md" withBorder style={{ maxWidth: 500}}>
          <Flex direction="column" gap="sm">
            <Text size="lg" fw={500}>
              Aún no configuraste tu negocio
            </Text>
            <Text>
              Este es un paso importante, empezá haciendo click en el botón de abajo.
            </Text>
            <Center mt="md">
              <Button onClick={() => setBusinessModal({opened: true, formType: "create"})} size="md" color="blue">
                Configurar negocio
              </Button>
            </Center>
          </Flex>
        </Card>
      ) : (
        <Card shadow="sm" padding="xl" radius="md" withBorder style={{ maxWidth: 500 }}>
          <Text>⚙️ Configuración del negocio ya realizada.</Text>
        </Card>
      )}

      <BusinessModal/>
    </Flex>
  )
}

export default Business
