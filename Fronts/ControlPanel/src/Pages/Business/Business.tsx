import { Flex, Title, Text, Button, Card, Center, Stack, Divider, Group, Badge } from "@mantine/core"
import { useAppContext } from "../../Context/AppContext"
import { useMemo, } from "react"
import BusinessModal from "./components/BusinessModal"
import BallsLoader from "../../components/Icons/BallsLoader.svg"
import { useQuery } from "@tanstack/react-query"

function Business() {
  const {
    width,
    useModalHook: { setBusinessModal },
    businessHooks: { retrieveBusinessData, businessData }
  } = useAppContext()

  const {
    business_name,
    business_description,
    business_email,
    business_phone,
    business_geodata
  } = businessData || {}

  const { address1, country, region, city } = business_geodata || {}

  const {isLoading} = useQuery({
    queryKey:["business-data"],
    queryFn: retrieveBusinessData,
    refetchOnWindowFocus:false,
    refetchOnMount:false,
    staleTime: 60 * 60 * 1000,
    retry:false,
    enabled: !businessData || businessData === null
  })

  const placeholderImages = [
    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1597290282695-edc43d0e7129?q=80&w=875&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?auto=format&fit=crop&w=800&q=8",
    "https://plus.unsplash.com/premium_photo-1747932198124-f1f91b89b2f5?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?auto=format&fit=crop&w=800&q=80",
  ]

  const randomImage = useMemo(() => {
    return placeholderImages[Math.floor(Math.random() * placeholderImages.length)]
  }, [])


  if (isLoading) {
    return (
      <Flex justify="center" align="center" w={"100%"} h="100vh">
        <picture
          style={{
            width: "45px",
            height: "45px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <img
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block"
            }}
            src={BallsLoader} alt="Cargando" />
        </picture>
      </Flex>
    )
  }
  return (
    <Flex direction="column" style={{ height: "100vh", padding: 24 }} align="center" gap="md">
      <Title order={width > 600 ? 2 : 3} style={{ alignSelf: "flex-start" }}>
        Configuración de Negocio
      </Title>

      {businessData === null ? (
        <Card shadow="sm" padding="xl" radius="md" withBorder style={{ maxWidth: 500 }}>
          <Flex direction="column" gap="sm">
            <Text size="lg" fw={500}>
              Aún no configuraste tu negocio
            </Text>
            <Text>
              Este es un paso importante, empezá haciendo click en el botón de abajo.
            </Text>
            <Center mt="md">
              <Button onClick={() => setBusinessModal({ opened: true, formType: "create" })} size="md" color="blue">
                Configurar negocio
              </Button>
            </Center>
          </Flex>
        </Card>
      ) : (
        <Flex gap="xl" align="start" justify="center" w="100%" wrap="wrap">
          <Card
            shadow="md"
            padding="xl"
            radius="lg"
            withBorder
            style={{
              maxWidth: 600,
              width: "100%",
              backgroundColor: "#f9f9f9",
              overflow: "hidden"
            }}
          >
            <img
              src={businessData.business_banner !== null ? businessData.business_banner : randomImage}
              alt="Portada del negocio"
              style={{
                width: "100%",
                height: "120px",
                objectFit: "cover",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px"
              }}
            />

            <Stack mt="sm">
              <Center>
                <Title order={3}>{business_name}</Title>
              </Center>

              <Text size="sm" color="dimmed" ta="center">{business_description}</Text>

              <Divider label={<Text size="sm">📍 Ubicación</Text>} labelPosition="center" />

              <Group >
                <Text><Text span fw={600}>Dirección:</Text> {address1}</Text>
                <Text><Text span fw={600}>Ciudad:</Text> {city?.label}</Text>
                <Text><Text span fw={600}>Provincia / Estado:</Text> {region?.label}</Text>
                <Text><Text span fw={600}>País:</Text> {country?.label}</Text>
              </Group>

              <Divider label={<Text size="sm">📞 Contacto</Text>} labelPosition="center" />

              <Group>
                <Text><Text span fw={600}>Email:</Text> {business_email}</Text>
                <Text><Text span fw={600}>Teléfono:</Text> {business_phone}</Text>
              </Group>

              <Flex justify="end" mt="md">
                <Button variant="light" onClick={() => setBusinessModal({ opened: true, formType: "edit" })}>
                  ✏️ Editar información
                </Button>
              </Flex>
            </Stack>
          </Card>

          {/* Columna derecha: Info extra */}
          <Card
            shadow="xs"
            padding="lg"
            radius="md"
            withBorder
            style={{
              minWidth: 300,
              flex: 0.8,
              backgroundColor: "#ffffff"
            }}
          >
            <Stack gap="sm">
              <Title order={4}>📊 Detalles del negocio</Title>
              <Text><Text span fw={500}>Fecha de creación:</Text> {new Date().toLocaleDateString()}</Text>
              <Text><Text span fw={500}>Productos cargados:</Text> 0 (aún no hay productos)</Text>
              <Text><Text span fw={500}>Estado del QR:</Text> <Badge c={"white"} bg={"red"}>Inactivo</Badge></Text>
              <Group gap="xs">
                <Text fw={500}>Plan:</Text>
                <Badge color="blue" variant="light" radius="sm">
                  Gratuito
                </Badge>
              </Group>


              <Divider mt="sm" />

              <Button fullWidth variant="outline" color="blue">
                Ver menú
              </Button>
              <Button fullWidth variant="outline" color="grape">
                Personalizar carta
              </Button>
            </Stack>
          </Card>
        </Flex>

      )}

      <BusinessModal />
    </Flex>
  )
}

export default Business
