// useCategoryForm.tsx
import { useState, useEffect, type ChangeEvent } from "react";
import useFileUploader from "./useFileUploader";
import type { CategoriesForm } from "../../../../../../../Context/HookTypes/Categories";
import { useAppContext } from "../../../../../../../Context/AppContext";
import { showNotification } from "@mantine/notifications";
import { IoAlertCircleOutline } from "react-icons/io5";
import { searchPexelsImages, downloadPexelsImage } from '@/services/pexelsService';

type CategoriesErrors = Partial<Record<keyof CategoriesForm, string>>;

const initialFormData: CategoriesForm = {
  category_name: "",
  category_description: ""
};


function useCategoryForm() {
  const {
    useModalHook: { closeCategoriesModal, categoriesModal },
    categoriesHooks: { saveCategory, updateCategory }
  } = useAppContext();

  const [formData, setFormData] = useState<CategoriesForm>(initialFormData);
  const [formErrors, setFormErrors] = useState<CategoriesErrors>({});
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [fetchingImageToEdit, setFetchingImageToEdit] = useState(false);

  const [usePexelsImage, setUsePexelsImage] = useState(false);
  const [searchingPexels, setSearchingPexels] = useState(false);
  const [pexelsImages, setPexelsImages] = useState<any[]>([]);
  const [showPexelsGallery, setShowPexelsGallery] = useState(false);
  const [pexelsSearchTerm, setPexelsSearchTerm] = useState("");

  const { fileData, setFileData, handleUpload: originalUpload, processingFile } = useFileUploader();

  useEffect(() => {
    if(categoriesModal?.formType === "edit" && categoriesModal.editCategoryData){
      const { category_name, category_description, category_image, category_id } = categoriesModal.editCategoryData
      setFormData({
        category_name,
        category_description: category_description || ""
      })
      const download_image = async () => {
        try {
          setFetchingImageToEdit(true)
          const response = await fetch(category_image)
          const blob = await response.blob()
          const file = new File([blob], `${category_id || 'image'}.jpg`, { type: blob.type })
          setFileData(file)
        } catch (error) {
          console.error('Error al descargar la imagen:', error)
        } finally {
          setFetchingImageToEdit(false)
        }
      }
      if(category_image){
        download_image()
      }
    }
  },[categoriesModal])

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
      const photos = await searchPexelsImages(
        pexelsSearchTerm.trim(),
        import.meta.env.VITE_PEXELS_SECRET || ''
      );
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
    const result = categoriesModal?.formType === "create"
      ? await saveCategory(formData, fileData!)
      : await updateCategory(formData, fileData!, categoriesModal?.editCategoryData?.category_id || categoriesModal?.editCategoryData?.category_name || "");
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
    clearImage,
    fetchingImageToEdit
  };
}

export default useCategoryForm;
