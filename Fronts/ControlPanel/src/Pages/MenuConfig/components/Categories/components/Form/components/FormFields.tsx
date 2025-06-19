import { Flex, Text, Badge, Input, Textarea, InputWrapper } from '@mantine/core';
import type { ChangeEvent } from 'react';

interface FormFieldsProps {
  formData: {
    category_name: string;
    category_description: string;
  };
  formErrors: {
    category_name?: string;
    category_description?: string;
  };
  onInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

function FormFields({ formData, formErrors, onInputChange }: FormFieldsProps) {
  return (
    <Flex direction="column" gap="md">
      <InputWrapper
        label={
          <Flex gap={5} align="center" justify="center">
            <Text>Nombre</Text>
            <Badge color="red" variant="light" size="xs">
              Requerido
            </Badge>
          </Flex>
        }
        error={formErrors.category_name}
        description="El nombre de la categoría"
      >
        <Input
          type='text'
          name="category_name"
          placeholder='Ensaladas'
          onChange={onInputChange}
          value={formData.category_name}
          error={formErrors.category_name}
        />
        <Text c="red" size="sm" mt={5}>{formErrors.category_name}</Text>
      </InputWrapper>

      <InputWrapper
        label={
          <Flex gap={5} align="center" justify="center">
            <Text>Descripción</Text>
            <Badge color="blue" variant="light" size="xs">
              Opcional
            </Badge>
          </Flex>
        }
        description="Una breve descripción de lo que incluís en esta categoría"
      >
        <Textarea
          name="category_description"
          placeholder='Ensaladas frescas con vegetales de estación, opciones con pollo, atún o huevo. Ideal para quienes buscan algo liviano y saludable.'
          onChange={onInputChange}
          value={formData.category_description}
          rows={8}
          resize={"none"}
          autosize={false}
        />
      </InputWrapper>
    </Flex>
  );
}

export default FormFields; 