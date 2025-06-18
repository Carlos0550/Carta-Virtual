import { Flex, TextInput, Button, Select, Loader, Textarea, Paper, Text, InputWrapper, Input } from '@mantine/core';

import useBusinessForm from './Hooks/useCategories';
import "./FormStyles.css"
import { RxCross1 } from "react-icons/rx";

function CategoryForm() {
  const {
    formData,
    formErrors,
    formLoading,
    formSuccess,
    handleSubmit,
    fileData,
    setFileData,
    handleUpload,
    processingFile,
    handleInputChange
  } = useBusinessForm();

  if (formSuccess) {
    return (
      <Paper
        withBorder
        p="md"
        radius="md"
        style={{ maxWidth: 600, margin: '0 auto' }}

      >
        <Flex
          direction="column"
          align="center"
          justify="center"
          gap="md"
        >
          <Text size="lg" fw={500} c={'#2c2c2c'}>
            🎉 Negocio guardado exitosamente.
          </Text>
        </Flex>
      </Paper>
    );
  }

  function createPreviewUrl(file: File | Blob): string {
    return URL.createObjectURL(file)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Flex direction="column" gap="md">
        <InputWrapper
          label="Nombre de la categoría"
        >
          <Input
            type='text'
            placeholder='Ensaladas'
            onChange={handleInputChange}
            value={formData.category_name}
          />
        </InputWrapper>

        <InputWrapper
          label="Descripción"
          description="Una breve descripción de lo que incluís en esta categoría"
        >
          <Textarea
            placeholder='Ensaladas frescas con vegetales de estación, opciones con pollo, atún o huevo. Ideal para quienes buscan algo liviano y saludable.'
            onChange={handleInputChange}
            value={formData.category_description}
            rows={8}
            resize={"none"}
            autosize={false}
          />
        </InputWrapper>

        {!fileData ? (
          !processingFile ? (
            <div
              className='file-uploader-container'
              onClick={() => document.getElementById('fileInput')!.click()}
            >
              <Flex mt={5} justify={"center"} align={"center"}>
                <span className="file-uploader-icon">📁</span>
                <p className="file-uploader-title">Añadir imagen</p>
              </Flex>
              <p className="file-uploader-subtext">Arrastrá o hacé click aquí</p>
              <input
                id="fileInput"
                type='file'
                accept='video/*, image/*'
                style={{ display: 'none' }}
                onChange={handleUpload}
              />
            </div>

          ) : (
            <div className='processing-file-container'>
              <div className="loader"></div>
              <div className="loader"></div>
              <div className="loader"></div>
            </div>
          )
        ) : (
          <div
            className='picture-preview-container'
          >
            <div className='delete-preview-btn'
              onClick={() => setFileData(null)}
            >
              <RxCross1 color='red' size={18} />
            </div>
            <picture
              className='image-preview'
            >
              <img src={createPreviewUrl(fileData)} alt="" />
            </picture>
          </div>
        )}


        <Button type="submit" loading={formLoading} disabled={formLoading || processingFile} fullWidth mt="md" >
          Guardar Negocio
        </Button>
      </Flex>
    </form>
  );
}

export default CategoryForm;