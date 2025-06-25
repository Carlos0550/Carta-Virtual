import { translateToEnglish } from './translateToEnglish';

export async function searchPexelsImages(query: string, apiKey: string) {
  console.log('🔍 PexelsService: Buscando imágenes para:', query);
  console.log('🔑 PexelsService: API Key configurada:', !!apiKey);
  
  if (!query.trim()) {
    throw new Error('Término de búsqueda requerido');
  }

  // Traducir a inglés para mejores resultados
  console.log('🌐 PexelsService: Traduciendo término...');
  const translatedQuery = await translateToEnglish(query.trim());
  console.log('🌐 PexelsService: Término traducido:', translatedQuery);
  
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(translatedQuery)}&per_page=20`;
  console.log('🔗 PexelsService: URL de búsqueda:', url);
  
  const response = await fetch(url, {
    headers: {
      Authorization: apiKey
    }
  });
  
  console.log('📡 PexelsService: Status de respuesta:', response.status);
  
  if (!response.ok) {
    throw new Error(`Error buscando imágenes en Pexels: ${response.status}`);
  }
  
  const data = await response.json();
  console.log('📸 PexelsService: Imágenes encontradas:', data.photos?.length || 0);
  return data.photos || [];
}

export function selectPexelsImage(images: any[], index: number) {
  console.log('🖼️ PexelsService: Seleccionando imagen, índice:', index, 'de', images.length);
  return images[index] || null;
}

// Función para descargar imagen de Pexels y convertirla a File
export async function downloadPexelsImage(photo: any, fileName: string): Promise<File> {
  console.log('⬇️ PexelsService: Descargando imagen:', photo.src?.large2x);
  
  const imageUrl = photo.src.large2x || photo.src.original || photo.src.large;
  
  try {
    const response = await fetch(imageUrl);
    console.log('📡 PexelsService: Status de descarga:', response.status);
    
    if (!response.ok) {
      throw new Error('Error descargando imagen');
    }
    
    const blob = await response.blob();
    console.log('📦 PexelsService: Blob descargado, tamaño:', blob.size);
    
    const file = new File([blob], `${fileName.toLowerCase().replace(/\s+/g, '-')}.jpg`, { 
      type: 'image/jpeg' 
    });
    
    console.log('✅ PexelsService: Archivo creado:', file.name, 'tamaño:', file.size);
    return file;
  } catch (error) {
    console.error('❌ PexelsService: Error en descarga:', error);
    throw new Error('No se pudo descargar la imagen de Pexels');
  }
}

export async function handleUsePexelsImage({
  setSearchingPexels,
  setShowPexelsGallery,
  setPexelsImages,
  setFormData,
  setFileData,
  pexelsSearchTerm,
  formData,
  VITE_PEXELS_SECRET
}: {
  setSearchingPexels: (v: boolean) => void,
  setShowPexelsGallery: (v: boolean) => void,
  setPexelsImages: (v: any[]) => void,
  setFormData: (data: any) => void,
  setFileData: (file: any) => void,
  pexelsSearchTerm: string,
  formData: any,
  VITE_PEXELS_SECRET: string
}) {
  console.log('🚀 PexelsService: Iniciando handleUsePexelsImage');
  
  if (!pexelsSearchTerm.trim()) {
    throw new Error('Ingresa un término para buscar imágenes');
  }

  setSearchingPexels(true);
  setShowPexelsGallery(false);
  setPexelsImages([]);
  
  try {
    const images = await searchPexelsImages(pexelsSearchTerm, VITE_PEXELS_SECRET);
    
    if (images.length === 0) {
      throw new Error('No se encontraron imágenes para tu búsqueda');
    }
    
    console.log('📸 PexelsService: Procesando', images.length, 'imágenes');
    
    if (images.length === 1) {
      // Descargar y convertir a File
      console.log('📸 PexelsService: Una imagen encontrada, descargando...');
      const file = await downloadPexelsImage(images[0], formData.food_name || 'food');
      setFormData({ ...formData, food_primary_image: images[0].src.large2x });
      setFileData(file);
      console.log('✅ PexelsService: Imagen única configurada');
    } else if (images.length > 1) {
      console.log('📸 PexelsService: Múltiples imágenes, mostrando galería');
      setPexelsImages(images);
      setShowPexelsGallery(true);
    }
  } catch (error) {
    console.error('❌ PexelsService: Error en handleUsePexelsImage:', error);
    throw error;
  } finally {
    setSearchingPexels(false);
  }
} 