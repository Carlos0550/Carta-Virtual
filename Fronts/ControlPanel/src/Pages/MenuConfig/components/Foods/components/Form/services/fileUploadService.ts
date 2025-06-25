import imageCompression from 'browser-image-compression';

export async function uploadFile(file: File, onProgress?: (percent: number) => void): Promise<{ url: string; compressedFile: File }> {
  // Validar tipo de archivo
  if (!file.type.startsWith('image/')) {
    throw new Error('Solo se permiten archivos de imagen');
  }

  // Validar tamaño (máximo 10MB antes de comprimir)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('El archivo es demasiado grande. Máximo 10MB');
  }

  try {
    // Opciones de compresión
    const options = {
      maxSizeMB: 1, // Máximo 1MB después de comprimir
      maxWidthOrHeight: 1920, // Máximo ancho/alto
      useWebWorker: true,
      onProgress: onProgress
    };

    // Comprimir imagen
    const compressedFile = await imageCompression(file, options);
    
    // Crear URL para preview
    const imageUrl = URL.createObjectURL(compressedFile);
    
    return { url: imageUrl, compressedFile };
  } catch (error) {
    throw new Error('Error comprimiendo imagen');
  }
}

export function clearImage(setFileData: (file: File | null) => void) {
  setFileData(null);
} 