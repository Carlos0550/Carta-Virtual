// CategoryForm.tsx
import { useState } from 'react';
import { Flex, Button, Paper, Text, Group } from '@mantine/core';
import Step1Fields from './components/Step1Fields';
import Step2Fields from './components/Step2Fields';
import Step3Fields from './components/Step3Fields';
import useFoodForm from './Hooks/useFoodForm';
import { useAppContext } from '@/Context/AppContext';
import { onTagsChange, onDescriptionChange, onCautionsChange, onClearImage } from './services/fieldHandlers';
import { uploadFile } from './services/fileUploadService';
import { selectPexelsImage, handleUsePexelsImage, downloadPexelsImage } from './services/pexelsService';
import type { FoodForm } from '@/Context/HookTypes/FoodTypes';

const steps = [
  { label: 'Primero y principal' },
  { label: 'Ingredientes y multimedia' },
  { label: 'Descripción y precauciones' },
];

function FoodForm() {
  const {
    formData,
    setFormData,
    formErrors,
    setFormErrors,
    formLoading,
    formSuccess,
    setFormSuccess,
    fileData,
    setFileData,
    currentStep,
    handleNext,
    handlePrev
  } = useFoodForm();
  const { useModalHook:{ categoriesModal, closeCategoriesModal } } = useAppContext();

  const [processingFile, setProcessingFile] = useState(false);
  const [pexelsImages, setPexelsImages] = useState<any[]>([]);
  const [showPexelsGallery, setShowPexelsGallery] = useState(false);
  const [pexelsSearchTerm, setPexelsSearchTerm] = useState('');
  const [searchingPexels, setSearchingPexels] = useState(false);

  const handleCancel = () => {
    setFormData({
      food_name: '',
      food_price: '',
      food_category: '',
      food_description: '',
      food_tags: [],
      food_ingredients: [],
      food_cautions: ''
    });
    setFormErrors({});
    setFileData(null);
    setPexelsImages([]);
    setShowPexelsGallery(false);
    setPexelsSearchTerm('');
    setFormSuccess(false);
    closeCategoriesModal();
  };

  // Handlers delegados a servicios
  const tagsChange = onTagsChange(setFormData);
  const descriptionChange = onDescriptionChange(setFormData);
  const cautionsChange = onCautionsChange(setFormData);
  const clearImageHandler = onClearImage(setFileData);

  // Subida de archivo
  const handleUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setProcessingFile(true);
    try {
      const { url: imageUrl, compressedFile } = await uploadFile(file, (progress) => {
        console.log(`Progreso de compresión: ${progress}%`);
      });
      
      // Guardar el archivo comprimido en fileData
      setFileData(compressedFile);
      
    } catch (error) {
      console.error('Error procesando imagen:', error);
      // Aquí podrías mostrar una notificación de error
    } finally {
      setProcessingFile(false);
    }
  };

  // Pexels
  const onHandleUsePexelsImage = async () => {
    console.log('🔍 Iniciando búsqueda en Pexels:', pexelsSearchTerm);
    console.log('🔑 API Key:', import.meta.env.VITE_PEXELS_SECRET ? 'Configurada' : 'NO CONFIGURADA');
    
    if (!import.meta.env.VITE_PEXELS_SECRET) {
      console.error('❌ VITE_PEXELS_SECRET no está configurada');
      return;
    }
    
    try {
      await handleUsePexelsImage({
        setSearchingPexels,
        setShowPexelsGallery,
        setPexelsImages,
        setFormData,
        setFileData,
        pexelsSearchTerm,
        formData,
        VITE_PEXELS_SECRET: import.meta.env.VITE_PEXELS_SECRET
      });
    } catch (error) {
      console.error('❌ Error con Pexels:', error);
      alert(`Error con Pexels: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };
  
  const onSelectPexelsImage = async (indexOrImage: any) => {
    console.log('🖼️ Seleccionando imagen de Pexels:', indexOrImage);
    console.log('📸 Imágenes disponibles:', pexelsImages.length);
    
    let image: any;
    let index: number;
    
    // Verificar si es un índice numérico o un objeto de imagen
    if (typeof indexOrImage === 'number') {
      index = indexOrImage;
      image = selectPexelsImage(pexelsImages, index);
    } else if (indexOrImage && typeof indexOrImage === 'object' && indexOrImage.src) {
      // Es un objeto de imagen, buscarlo en el array
      image = indexOrImage;
      index = pexelsImages.findIndex(img => img.id === image.id);
    } else {
      console.error('❌ Formato inválido para selección de imagen:', indexOrImage);
      return;
    }
    
    console.log('🖼️ Imagen seleccionada:', image);
    console.log('📊 Índice encontrado:', index);
    
    if (image) {
      try {
        console.log('⬇️ Descargando imagen...');
        const file = await downloadPexelsImage(image, formData.food_name || 'food');
        console.log('✅ Imagen descargada:', file);
        
        setFileData(file);
        setShowPexelsGallery(false);
        console.log('✅ Imagen configurada correctamente');
      } catch (error) {
        console.error('❌ Error descargando imagen:', error);
        alert(`Error descargando imagen: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      }
    } else {
      console.error('❌ No se encontró imagen válida');
    }
  };

  if (formSuccess) {
    return (
      <Paper withBorder p="md" radius="md" style={{ maxWidth: 600, margin: '0 auto' }}>
        <Flex direction="column" align="center" justify="center" gap="md">
          <Text size="lg" fw={500}>🎉 {categoriesModal?.formType === 'create' ? 'Comída guardada exitosamente.' : 'Comída actualizada exitosamente.'}</Text>
        </Flex>
      </Paper>
    );
  }

  return (
    <form>
      <Flex direction="column" gap="md">
        <Text size="lg" fw={700} mb="md">{steps[currentStep].label}</Text>
        {currentStep === 0 && (
          <Step1Fields
            formData={formData}
            formErrors={formErrors as any}
            onInputChange={(e: any) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          />
        )}
        {currentStep === 1 && (
          <Step2Fields
            formData={formData}
            formErrors={formErrors as any}
            onTagsChange={tagsChange}
            fileData={fileData}
            handleUpload={handleUpload}
            processingFile={processingFile}
            usePexelsImage={true}
            searchingPexels={searchingPexels}
            handleUsePexelsImage={onHandleUsePexelsImage}
            pexelsImages={pexelsImages}
            showPexelsGallery={showPexelsGallery}
            selectPexelsImage={onSelectPexelsImage}
            retryPexelsSearch={onHandleUsePexelsImage}
            pexelsSearchTerm={pexelsSearchTerm}
            setPexelsSearchTerm={setPexelsSearchTerm}
            clearImage={clearImageHandler}
            fetchingImageToEdit={false}
          />
        )}
        {currentStep === 2 && (
          <Step3Fields
            formData={formData}
            formErrors={formErrors as any}
            onDescriptionChange={descriptionChange}
            onCautionsChange={cautionsChange}
          />
        )}
        <Group mt="md">
          <Button variant="outline" color="red" onClick={handleCancel}>Cancelar</Button>
          <Group>
            {currentStep > 0 && <Button variant="default" onClick={handlePrev}>Anterior</Button>}
            {currentStep < steps.length - 1 && <Button onClick={handleNext}>Siguiente</Button>}
            {currentStep === steps.length - 1 && <Button type="button" loading={formLoading}>Finalizar</Button>}
          </Group>
        </Group>
      </Flex>
    </form>
  );
}

export default FoodForm;
