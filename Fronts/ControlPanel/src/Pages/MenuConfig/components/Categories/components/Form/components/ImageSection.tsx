// ImageSection.tsx
import { Flex, Text, Badge, Button, TextInput } from '@mantine/core';
import { RxCross1 } from 'react-icons/rx';
import React from 'react';

interface ImageSectionProps {
  fileData: File | null;
  processingFile: boolean;
  searchingPexels: boolean;
  formData: { category_name: string };
  usePexelsImage: boolean;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUsePexelsImage: () => void;
  onRemoveImage: () => void;
  pexelsSearchTerm: string;
  setPexelsSearchTerm: (v: string) => void;
  clearImage: () => void;
}

function ImageSection({
  fileData,
  processingFile,
  searchingPexels,
  formData,
  onFileUpload,
  onUsePexelsImage,
  onRemoveImage,
  pexelsSearchTerm,
  setPexelsSearchTerm,
  clearImage
}: ImageSectionProps) {
  const createPreviewUrl = (file: File | Blob) => URL.createObjectURL(file);

  if (!fileData) {
    if (processingFile || searchingPexels) {
      return (
        <div className="processing-file-container">
          <div className="loader" />
          <div className="loader" />
          <div className="loader" />
          <Text size="sm" color="dimmed" ta="center" mt="xs">
            {searchingPexels ? "Buscando imagen en Pexels..." : "Procesando imagen..."}
          </Text>
        </div>
      );
    }

    return (
      <>
        <Flex w="100%" gap={5} align="center">
          <Text>Imagen principal</Text>
          <Badge color="red" variant="light" size="xs">Requerido</Badge>
        </Flex>
        <Flex direction="column" gap="sm">
          <div className="file-uploader-container" onClick={() => document.getElementById('fileInput')!.click()}>
            <Flex mt={5} justify="center" align="center">
              <span className="file-uploader-icon">📁</span>
              <p className="file-uploader-title">Añadir imagen</p>
            </Flex>
            <p className="file-uploader-subtext">Arrastrá o hacé click aquí</p>
            <input
              id="fileInput"
              type="file"
              accept="video/*, image/*"
              style={{ display: 'none' }}
              onChange={onFileUpload}
            />
          </div>
          <Flex align="center" justify="center" gap="xs">
            <Text size="sm" color="dimmed">o</Text>
          </Flex>
          <TextInput
            label="Buscar imagen en Pexels"
            placeholder="Ej: Carnes, Ensaladas..."
            value={pexelsSearchTerm}
            onChange={e => setPexelsSearchTerm(e.target.value)}
            mb={4}
          />
          <Button
            type="button"
            variant="outline"
            color="blue"
            onClick={onUsePexelsImage}
            disabled={!pexelsSearchTerm.trim()}
            fullWidth
          >
            🖼️ Buscar en Pexels
          </Button>
        </Flex>
      </>
    );
  }

  return (
    <div className="picture-preview-container">
      <div className="delete-preview-btn" onClick={clearImage}>
        <RxCross1 color="red" size={18} />
      </div>
      <picture className="image-preview">
        <img src={createPreviewUrl(fileData)} alt="Preview" />
      </picture>
      {!fileData &&<Badge color="blue" variant="light" size="xs" style={{ position: 'absolute', top: 8, left: 8 }}>📸 Pexels</Badge>}
    </div>
  );
}

export default ImageSection;
