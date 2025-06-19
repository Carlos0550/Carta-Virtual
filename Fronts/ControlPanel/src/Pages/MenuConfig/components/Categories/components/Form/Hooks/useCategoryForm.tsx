// useCategoryForm.tsx
import { useState, type ChangeEvent } from "react";
import useFileUploader from "./useFileUploader";
import type { CategoriesForm } from "../../../../../../../Context/HookTypes/Categories";
import { useAppContext } from "../../../../../../../Context/AppContext";
import { showNotification } from "@mantine/notifications";
import { IoAlertCircleOutline } from "react-icons/io5";

type CategoriesErrors = Partial<Record<keyof CategoriesForm, string>>;

const initialFormData: CategoriesForm = {
  category_name: "",
  category_description: ""
};

async function translateToEnglish(text: string): Promise<string> {
  const url = 'https://openl-translate.p.rapidapi.com/translate/bulk';
  const options = {
    method: 'POST',
    headers: {
      'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
      'x-rapidapi-host': 'openl-translate.p.rapidapi.com',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ target_lang: 'en', text: [text] })
  };
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result.translatedTexts?.[0] || text;
  } catch {
    return text;
  }
}

async function downloadPexelsImage(photo: any, searchTerm: string): Promise<File> {
  const imageUrl = photo.src.large2x || photo.src.original || photo.src.large;
  const blob = await (await fetch(imageUrl)).blob();
  const fileName = `${searchTerm.toLowerCase().replace(/\s+/g, '-')}.jpg`;
  return new File([blob], fileName, { type: 'image/jpeg' });
}

async function searchPexelsPhotos(searchTerm: string): Promise<any[]> {
  const translated = await translateToEnglish(searchTerm);
  // 1) petición ligera para total
  const head = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(translated)}&per_page=1`,
    { headers: { Authorization: import.meta.env.VITE_PEXELS_SECRET } }
  );
  const headData = await head.json();
  const total = headData.total_results || 0;
  if (!total) return [];

  const perPage = 4;
  const maxPage = Math.ceil(total / perPage);
  const page = Math.floor(Math.random() * maxPage) + 1;

  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(translated)}&per_page=${perPage}&page=${page}`,
    { headers: { Authorization: import.meta.env.VITE_PEXELS_SECRET } }
  );
  if (!res.ok) throw new Error();
  const data = await res.json();
  return data.photos || [];
}

function useCategoryForm() {
  const {
    useModalHook: { closeCategoriesModal },
    categoriesHooks: { saveCategory }
  } = useAppContext();

  const [formData, setFormData] = useState<CategoriesForm>(initialFormData);
  const [formErrors, setFormErrors] = useState<CategoriesErrors>({});
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  const [usePexelsImage, setUsePexelsImage] = useState(false);
  const [searchingPexels, setSearchingPexels] = useState(false);
  const [pexelsImages, setPexelsImages] = useState<any[]>([]);
  const [showPexelsGallery, setShowPexelsGallery] = useState(false);
  const [pexelsSearchTerm, setPexelsSearchTerm] = useState("");

  const { fileData, setFileData, handleUpload: originalUpload, processingFile } = useFileUploader();

  // al subir manual, cancelar Pexels
  const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
    setUsePexelsImage(false);
    setShowPexelsGallery(false);
    setPexelsImages([]);
    originalUpload(e);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUsePexelsImage = async () => {
    setUsePexelsImage(true);
    setFormErrors(prev => ({ ...prev, category_name: "" }));
    setSearchingPexels(true);
    setShowPexelsGallery(false);
    setPexelsImages([]);

    try {
      const photos = await searchPexelsPhotos(pexelsSearchTerm.trim());
      if (photos.length === 1) {
        const file = await downloadPexelsImage(photos[0], formData.category_name);
        setFileData(file);
      } else if (photos.length > 1) {
        setPexelsImages(photos);
        setShowPexelsGallery(true);
      } else {
        showNotification({
          title: "Error",
          message: "No se encontró ninguna imagen.",
          color: "red",
          icon: <IoAlertCircleOutline />,
          position: "top-right",
          autoClose: 3000,
          withCloseButton: true
        });
      }
    } catch {
      showNotification({
        title: "Error",
        message: "Hubo un problema al buscar en Pexels.",
        color: "red",
        icon: <IoAlertCircleOutline />,
        position: "top-right",
        autoClose: 3000,
        withCloseButton: true
      });
    } finally {
      setSearchingPexels(false);
    }
  };

  const selectPexelsImage = async (photo: any) => {
    setSearchingPexels(true);
    try {
      const file = await downloadPexelsImage(photo, formData.category_name);
      setFileData(file);
      setShowPexelsGallery(false);
      setPexelsImages([]);
    } catch {
      showNotification({
        title: "Error",
        message: "No se pudo descargar la imagen.",
        color: "red",
        icon: <IoAlertCircleOutline />,
        position: "top-right",
        autoClose: 3000,
        withCloseButton: true
      });
    } finally {
      setSearchingPexels(false);
    }
  };

  const handleValidateFields = (): boolean => {
    const errors: CategoriesErrors = {};
    if (!formData.category_name.trim()) {
      errors.category_name = "El nombre es requerido.";
    }
    if (!fileData) {
      showNotification({
        title: "Error",
        message: "Seleccioná o buscá una imagen.",
        color: "red",
        icon: <IoAlertCircleOutline />,
        position: "top-right",
        autoClose: 3000,
        withCloseButton: true
      });
      return false;
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setFormErrors({});
    setFileData(null);
    setUsePexelsImage(false);
    setSearchingPexels(false);
    setPexelsImages([]);
    setShowPexelsGallery(false);
    setPexelsSearchTerm("");
    setFormSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleValidateFields()) return;

    setFormLoading(true);
    const result = await saveCategory(formData, fileData!);
    setFormLoading(false);

    if (result) {
      setFormSuccess(true);
      setTimeout(() => {
        resetForm();
        closeCategoriesModal();
      }, 1000);
    }
  };

  const retryPexelsSearch = () => handleUsePexelsImage();
  const clearImage = () => setFileData(null);

  return {
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
    setUsePexelsImage,
    searchingPexels,
    handleUsePexelsImage,
    pexelsImages,
    showPexelsGallery,
    selectPexelsImage,
    retryPexelsSearch,
    pexelsSearchTerm,
    setPexelsSearchTerm,
    clearImage
  };
}

export default useCategoryForm;
