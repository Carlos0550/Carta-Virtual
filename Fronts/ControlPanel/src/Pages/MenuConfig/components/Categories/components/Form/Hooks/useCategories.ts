import { useState, type ChangeEvent } from "react";

import useFileUploader from "./useFileUploader";
import type { CategoriesForm } from "../../../../../../../Context/HookTypes/Categories";
import { useAppContext } from "../../../../../../../Context/AppContext";
import useSessionValidator from "../../../../../../../Context/ContextUtils/useSessionValidator";


type CategoriesErrors = Partial<Record<keyof CategoriesForm , string>>;

const initialFormData: CategoriesForm = {
  category_name: "",
  category_description: ""
};

function useBusinessForm() {
  const {
    useModalHook: {
      closeCategoriesModal
    }
  } = useAppContext()

  const { ensureSessionIsValid } = useSessionValidator()
  const [formData, setFormData] = useState<CategoriesForm>(initialFormData);
  const [formErrors, setFormErrors] = useState<CategoriesErrors>({});
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  const { fileData, setFileData, handleUpload, processingFile } = useFileUploader()

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleValidateFields = () => {
    const errors: CategoriesErrors = {};

    if(!formData.category_name){
      errors.category_name = "El nombre de la categoría es requerido."
    } 

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = handleValidateFields()
    
    if (isValid) {
      setFormLoading(true);
      //const result = await saveBusiness(formData, fileData!);
      setFormLoading(false);

      // if (result) {
      //   setFormSuccess(true);
      //   setTimeout(() => {
      //     closeBusinessModal()
      //   }, 1000);
      // }
    }
  };

  return {
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
  };
}

export default useBusinessForm;
