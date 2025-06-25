import { Flex, Text, Badge, InputWrapper } from '@mantine/core';
import { TagsInput } from '@mantine/core';
import type { FoodForm } from '@/Context/HookTypes/FoodTypes';
import ImageSection from './ImageSection';
import PexelsGallery from './PexelsGallery';

interface Step2FieldsProps {
  formData: FoodForm;
  formErrors: Partial<FoodForm>;
  onTagsChange: (field: keyof Pick<FoodForm, 'food_tags' | 'food_ingredients'>, value: string[]) => void;
  fileData: File | null;
  handleUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  processingFile: boolean;
  usePexelsImage: boolean;
  searchingPexels: boolean;
  handleUsePexelsImage: () => void;
  pexelsImages: any[];
  showPexelsGallery: boolean;
  selectPexelsImage: (photo: any) => void;
  retryPexelsSearch: () => void;
  pexelsSearchTerm: string;
  setPexelsSearchTerm: (v: string) => void;
  clearImage: () => void;
  fetchingImageToEdit: boolean;
}

const Step2Fields = ({ formData, formErrors, onTagsChange, fileData, handleUpload, processingFile, usePexelsImage, searchingPexels, handleUsePexelsImage, pexelsImages, showPexelsGallery, selectPexelsImage, retryPexelsSearch, pexelsSearchTerm, setPexelsSearchTerm, clearImage, fetchingImageToEdit }: Step2FieldsProps) => {
  return (
    <Flex direction="column" gap="md">
      <InputWrapper
        label={<Flex gap={5} align="center" justify="center"><Text>Etiquetas</Text><Badge color="blue" variant="light" size="xs">Opcional</Badge></Flex>}
        error={formErrors.food_tags}
        description="Agrega etiquetas para el producto"
      >
        <TagsInput
          value={formData.food_tags}
          onChange={value => onTagsChange('food_tags', value)}
          placeholder="Agrega etiquetas y presiona Enter"
        />
      </InputWrapper>
      <InputWrapper
        label={<Flex gap={5} align="center" justify="center"><Text>Ingredientes</Text><Badge color="red" variant="light" size="xs">Requerido</Badge></Flex>}
        error={formErrors.food_ingredients}
        description="Lista de ingredientes"
      >
        <TagsInput
          value={formData.food_ingredients}
          name="food_ingredients"
          onChange={value => onTagsChange('food_ingredients', value)}
          placeholder="Agrega ingredientes y presiona Enter"
          error={formErrors.food_ingredients}
        />
      </InputWrapper>
      <ImageSection
        fileData={fileData}
        processingFile={processingFile}
        searchingPexels={searchingPexels}
        fetchingImage={fetchingImageToEdit}
        formData={formData}
        usePexelsImage={usePexelsImage}
        onFileUpload={handleUpload}
        onUsePexelsImage={handleUsePexelsImage}
        onRemoveImage={() => handleUpload({ target: { files: [] } } as any)}
        pexelsSearchTerm={pexelsSearchTerm}
        setPexelsSearchTerm={setPexelsSearchTerm}
        clearImage={clearImage}
      />
      <PexelsGallery
        pexelsImages={pexelsImages}
        showPexelsGallery={showPexelsGallery}
        onSelectImage={selectPexelsImage}
        onClose={retryPexelsSearch}
        onRetry={retryPexelsSearch}
      />
    </Flex>
  );
};

export default Step2Fields; 