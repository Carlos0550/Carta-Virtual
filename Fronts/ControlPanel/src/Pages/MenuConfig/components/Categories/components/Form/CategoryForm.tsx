// CategoryForm.tsx
import { Flex, Button, Paper, Text } from '@mantine/core';
import FormFields from './components/FormFields';
import ImageSection from './components/ImageSection';
import PexelsGallery from './components/PexelsGallery';
import useCategoryForm from './Hooks/useCategoryForm';
import { useAppContext } from '@/Context/AppContext';

function CategoryForm() {
  const {
    formData,
    formErrors,
    formLoading,
    formSuccess,
    handleSubmit,
    fileData,
    handleUpload,
    processingFile,
    handleInputChange,
    usePexelsImage,
    searchingPexels,
    handleUsePexelsImage,
    pexelsImages,
    showPexelsGallery,
    selectPexelsImage,
    retryPexelsSearch,
    pexelsSearchTerm,
    setPexelsSearchTerm,
    clearImage,
    fetchingImageToEdit
  } = useCategoryForm();
  const { useModalHook:{ categoriesModal } } = useAppContext()

  if (formSuccess) {
    return (
      <Paper withBorder p="md" radius="md" style={{ maxWidth: 600, margin: '0 auto' }}>
        <Flex direction="column" align="center" justify="center" gap="md">
          <Text size="lg" fw={500}>🎉 {categoriesModal?.formType === 'create' ? 'Categoría guardada exitosamente.' : 'Categoría actualizada exitosamente.'}</Text>
        </Flex>
      </Paper>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Flex direction="column" gap="md">
        <FormFields
          formData={formData}
          formErrors={formErrors}
          onInputChange={handleInputChange}
        />

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

        <Button
          type="submit"
          loading={formLoading}
          disabled={formLoading || processingFile || searchingPexels || fetchingImageToEdit}
          fullWidth
          mt="md"
        >
          {categoriesModal?.formType === 'create' ? 'Guardar Categoría' : 'Actualizar Categoría'}
        </Button>
      </Flex>
    </form>
  );
}

export default CategoryForm;
