import React, { useState } from 'react';
import { Box, Card, Image, Text, Button, Group, Flex } from '@mantine/core';
import { FaEdit, FaTrash } from 'react-icons/fa';

function CategoriesCardList() {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: 'Ensaladas',
      products: 15,
      image: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?q=80&w=778&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    {
      id: 2,
      name: 'Postres',
      products: 8,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587',
    },
    {
      id: 3,
      name: 'Bebidas',
      products: 10,
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZHJpbmtzfGVufDB8fDB8fHww',
    },
  ]);

  return (
    <Flex wrap="wrap" gap="md" pt={10} justify="center">
      {categories.map((cat) => (
        <Card 
            key={cat.id} 
            shadow="sm" 
            padding="lg" 
            radius="md" 
            style={{width: "100%"}}
            miw={260}
            maw={290}
          >
          <Card.Section>
            <Image
              src={cat.image}
              height={160}
              alt={cat.name}
              fit="cover"
            />
          </Card.Section>

          <Box mt="md" mb="xs">
            <Text fw={600} size="lg">{cat.name}</Text>
            <Text c="dimmed" size="sm">{cat.products} productos</Text>
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
