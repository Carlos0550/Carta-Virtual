import { Box, Card, Image, Text, Button, Group, Flex } from '@mantine/core';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useAppContext } from '../../../../../../Context/AppContext';
import { useQuery } from '@tanstack/react-query';
import BallsLoader from "@/components/Icons/BallsLoader.svg"
import { useState } from 'react';
function CategoriesCardList() {

  const {
    categoriesHooks:{
      categories,
      retrieveCategories,
      deleteCategory
    },
    businessHooks:{
      businessData
    },
    useModalHook:{
      setCategoriesModal
    }
  } = useAppContext()

  const [deleting, setDeleting] = useState<boolean>(false)
  const handleDeleteCategory = async(cat_id: string) => {
    setDeleting(true)
    await deleteCategory(cat_id)
    setDeleting(false)
  }
  const {isLoading} = useQuery({
    queryKey:["retrieveIfEnough"],
    queryFn: async () => {
      await retrieveCategories(businessData?.business_id!)
    },
    enabled: !!(businessData?.business_id) && (!categories || categories.length === 0),
    retry: 2,
    retryDelay: 1000
  })

  if(isLoading){
    return (
      <Flex justify="center" align="center" w={"100%"} h="30vh">
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
    <Flex wrap="wrap" gap="md" pt={10} justify={categories && categories.length > 1 ? "center" : "flex-start"}>
      {categories.length > 0 && categories.map((cat) => (
        <Card 
            key={cat.category_id} 
            shadow="sm" 
            padding="lg" 
            radius="md" 
            style={{width: "100%"}}
            miw={260}
            maw={290}
          >
          <Card.Section>
            <Image
              src={cat.category_image}
              height={160}
              alt={cat.category_name}
              fit="cover"
            />
          </Card.Section>

          <Box mt="md" mb="xs">
            <Text fw={600} size="lg">{cat.category_name}</Text>
            <Text c="dimmed" size="sm">{cat.category_products_count} productos</Text>
          </Box>

          <Group justify="space-between" mt="md">
            <Button
              variant="light"
              color="blue"
              leftSection={<FaEdit size={16} />}
              onClick={() => setCategoriesModal({opened: true, formType: 'edit', editCategoryData: cat})}
            >
              Editar
            </Button>

            <Button
              variant="light"
              color="red"
              loading={deleting}
              disabled={deleting}
              leftSection={<FaTrash size={16} />}
              onClick={() => handleDeleteCategory(cat.category_id)}
            >
              Eliminar
            </Button>
          </Group>
        </Card>
      ))}
    </Flex>
  );
}

export default CategoriesCardList;
