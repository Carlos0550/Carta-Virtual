import { Flex, Text, Badge, InputWrapper } from '@mantine/core';
import type { FoodForm } from '@/Context/HookTypes/FoodTypes';
import RichTextField from './RichTextField';

interface Step3FieldsProps {
  formData: FoodForm;
  formErrors: Partial<FoodForm>;
  onDescriptionChange: (value: string) => void;
  onCautionsChange: (value: string) => void;
}

const Step3Fields = ({ formData, formErrors, onDescriptionChange, onCautionsChange }: Step3FieldsProps) => {
  return (
    <Flex direction="column" gap="md">
      <InputWrapper
        label={<Flex gap={5} align="center" justify="center"><Text>Descripción</Text><Badge color="red" variant="light" size="xs">Requerido</Badge></Flex>}
        error={formErrors.food_description}
        description="Descripción detallada del producto"
      >
        <RichTextField
          value={formData.food_description}
          onChange={onDescriptionChange}
        />
      </InputWrapper>
      <InputWrapper
        label={<Flex gap={5} align="center" justify="center"><Text>Precauciones</Text><Badge color="blue" variant="light" size="xs">Opcional</Badge></Flex>}
        error={formErrors.food_cautions}
        description="Advertencias o precauciones alimentarias"
      >
        <RichTextField
          value={formData.food_cautions}
          onChange={onCautionsChange}
        />
      </InputWrapper>
    </Flex>
  );
};

export default Step3Fields; 