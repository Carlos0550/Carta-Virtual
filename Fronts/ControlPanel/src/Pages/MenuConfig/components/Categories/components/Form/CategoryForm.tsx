// CategoryForm.tsx
import { Flex, Button, Paper, Text } from '@mantine/core';
import FormFields from './components/FormFields';
import ImageSection from './components/ImageSection';
import PexelsGallery from './components/PexelsGallery';
import useCategoryForm from './Hooks/useCategoryForm';

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
    clearImage
  } = useCategoryForm();

  if (formSuccess) {
    return (
      <Paper withBorder p="md" radius="md" style={{ maxWidth: 600, margin: '0 auto' }}>
        <Flex direction="column" align="center" justify="center" gap="md">
          <Text size="lg" fw={500}>🎉 Categoría guardada exitosamente.</Text>
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
          disabled={formLoading || processingFile || searchingPexels}
          fullWidth
          mt="md"
        >
          Guardar Categoría
        </Button>
      </Flex>
    </form>
  );
}

export default CategoryForm;
