import { Flex, Text, Badge, Input, InputWrapper, Select } from '@mantine/core';
import type { FoodForm } from '@/Context/HookTypes/FoodTypes';
import type { ChangeEvent } from 'react';
import { useAppContext } from '@/Context/AppContext';

interface Step1FieldsProps {
  formData: FoodForm;
  formErrors: Partial<FoodForm>;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Step1Fields = ({ formData, formErrors, onInputChange }: Step1FieldsProps) => {
  const {
    categoriesHooks: { categories }
  } = useAppContext();
  return (
    <Flex direction="column" gap="md">
      <InputWrapper
        label={<Flex gap={5} align="center" justify="center"><Text>Nombre del producto</Text><Badge color="red" variant="light" size="xs">Requerido</Badge></Flex>}
        error={formErrors.food_name}
        description="El nombre del producto"
      >
        <Input
          type='text'
          name="food_name"
          placeholder='Arroz con pollo'
          onChange={onInputChange}
          value={formData.food_name}
          error={formErrors.food_name}
        />
      </InputWrapper>
      <InputWrapper
        label={<Flex gap={5} align="center" justify="center"><Text>Precio</Text><Badge color="red" variant="light" size="xs">Requerido</Badge></Flex>}
        error={formErrors.food_price}
        description="Precio del producto"
      >
        <Input
          type='text'
          name="food_price"
          placeholder='1200'
          onChange={onInputChange}
          value={formData.food_price}
          error={formErrors.food_price}
        />
      </InputWrapper>
      <InputWrapper
        label={<Flex gap={5} align="center" justify="center"><Text>Categoría</Text><Badge color="red" variant="light" size="xs">Requerido</Badge></Flex>}
        error={formErrors.food_category}
        description="¿A qué categoría pertenece?"
      >
        <Select
          name="food_category"
          placeholder="Selecciona una categoría"
          data={categories.map(cat => ({ value: String(cat.category_id), label: cat.category_name, image: cat.category_image }))}
          value={formData.food_category ? String(formData.food_category) : ''}
          onChange={value => {
            onInputChange({
              target: { name: 'food_category', value: value || '' }
            } as any);
          }}
          error={formErrors.food_category}
          searchable
          nothingFoundMessage="No hay categorías"
          renderOption={({ option }) => {
            const opt = option as typeof option & { image?: string };
            return (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {opt.image && <img src={opt.image} alt="" width={24} height={24} style={{ borderRadius: 4, objectFit: 'cover' }} />}
                <span>{opt.label}</span>
              </div>
            );
          }}
        />
      </InputWrapper>
    </Flex>
  );
};

export default Step1Fields; 