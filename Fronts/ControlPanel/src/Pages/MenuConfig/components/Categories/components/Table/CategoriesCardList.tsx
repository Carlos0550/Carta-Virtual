import React, { useState } from 'react';
import { Box, Card, Image, Text, Button, Group, Flex } from '@mantine/core';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useAppContext } from '../../../../../../Context/AppContext';

function CategoriesCardList() {

  const {
    categoriesHooks:{
      categories
    }
  } = useAppContext()
 
  return (
    <Flex wrap="wrap" gap="md" pt={10} justify={categories && categories.length > 1 ? "center" : "flex-start"}>
      { categories.length > 0 && categories.map((cat) => (
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
            >
              Editar
            </Button>

            <Button
              variant="light"
              color="red"
              leftSection={<FaTrash size={16} />}
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
