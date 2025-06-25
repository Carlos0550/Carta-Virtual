// useCategoryForm.tsx
import { useEffect, useState } from "react";
import type { FoodForm } from "@/Context/HookTypes/FoodTypes";

type FoodErrors = {
  food_name?: string;
  food_price?: string;
  food_category?: string;
  food_description?: string;
  food_tags?: string;
  food_ingredients?: string;
  food_cautions?: string;
};

const initialFormData: FoodForm = {
    food_name: "",
    food_price: "",
    food_category: "",
    food_description: "",
    food_tags: [],
    food_ingredients: [],
    food_cautions: ""
};

function useFoodForm() {
  const [formData, setFormData] = useState<FoodForm>(initialFormData);
  const [formErrors, setFormErrors] = useState<FoodErrors>({});
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [fileData, setFileData] = useState<File | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const handleValidateFields = (): boolean => {
    const errors: FoodErrors = {};
    for(const key in formData){
      const value = formData[key as keyof FoodForm];
      if (
        value === "" ||
        value === undefined ||
        (Array.isArray(value) && value.length === 0)
      ) {
        errors[key as keyof FoodForm] = "Este campo es requerido";
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep = () => {
    const errors: any = {};
    if (currentStep === 0) {
      if (!formData.food_name) errors.food_name = 'Este campo es requerido';
      if (!formData.food_price) errors.food_price = 'Este campo es requerido';
      if (!formData.food_category) errors.food_category = 'Este campo es requerido';
    }
    if (currentStep === 1) {
      if (!formData.food_ingredients || formData.food_ingredients.length === 0) errors.food_ingredients = 'Este campo es requerido';
    }
    if (currentStep === 2) {
      if (!formData.food_description) errors.food_description = 'Este campo es requerido';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setCurrentStep((s) => s + 1);
  };
  const handlePrev = () => setCurrentStep((s) => s - 1);

  useEffect(() => {
    console.log("FormData:", formData)
    {fileData && console.log("Filedata:", fileData)}
  },[formData, fileData])

  return {
    formData,
    setFormData,
    formErrors,
    setFormErrors,
    formLoading,
    setFormLoading,
    formSuccess,
    setFormSuccess,
    fileData,
    setFileData,
    handleValidateFields,
    currentStep,
    setCurrentStep,
    validateStep,
    handleNext,
    handlePrev
  };
}

export default useFoodForm;
