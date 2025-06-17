import { useState } from "react";
import { useCountries } from "./useCountries";
import { useRegions } from "./useRegions";
import { useCities } from "./useCities";
import useSessionValidator from "../../../../../Context/ContextUtils/useSessionValidator";
import { useAppContext } from "../../../../../Context/AppContext";
import type { BusinessFormData } from "../../../../../Context/HookTypes/BusinessTypes";
import useFileUploader from "./useFileUploader";


type BusinessFormErrors = Partial<Record<keyof BusinessFormData | 'general', string>>;

const initialFormData: BusinessFormData = {
  business_name: '',
  business_description: '',
  business_address1: '',
  countryCode: '',
  regionCode: '',
  city: '',
  business_phone: '',
  business_email: '',
};

function useBusinessForm() {
  const {
    useModalHook: {
      closeBusinessModal
    },
    businessHooks: {
      saveBusiness
    }
  } = useAppContext()

  const { ensureSessionIsValid } = useSessionValidator()
  const [formData, setFormData] = useState<BusinessFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<BusinessFormErrors>({});
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  const { data: countries = [], isLoading: isCountriesLoading } = useCountries({ countrySearch, ensureSessionIsValid });
  const { data: regions = [], isLoading: isRegionsLoading } = useRegions(formData.countryCode);
  const { data: cities = [], isLoading: isCitiesLoading } = useCities(formData.countryCode, formData.regionCode);

  const { fileData, setFileData, handleUpload, processingFile } = useFileUploader()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof BusinessFormData, value: string | null) => {
    setFormData(prev => ({
      ...prev,
      [name]: value || '',
      ...(name === 'countryCode' && { regionCode: '', city: '' }),
      ...(name === 'regionCode' && { city: '' }),
    }));
  };

  const handleValidateFields = () => {
    const errors: BusinessFormErrors = {};

    if (!formData.business_name) {
      errors.business_name = 'El nombre del negocio es obligatorio.';
    }

    if (!formData.business_description) {
      errors.business_description = 'La descripción del negocio es obligatoria.';
    }
    if (!formData.business_address1) {
      errors.business_address1 = 'La dirección es obligatoria.';
    }
    if (!formData.countryCode) {
      errors.countryCode = 'Debes seleccionar un país.';
    }
    if (!formData.regionCode) {
      errors.regionCode = 'Debes seleccionar una provincia o estado.';
    }
    if (!formData.city) {
      errors.city = 'Debes seleccionar una ciudad.';
    }
    if (!formData.business_phone) {
      errors.business_phone = 'El teléfono es obligatorio.';
    }
    if (!formData.business_email) {
      errors.business_email = 'El correo electrónico es obligatorio.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = handleValidateFields()
    
    if (isValid) {
      setFormLoading(true);
      const result = await saveBusiness(formData, fileData!);
      setFormLoading(false);

      if (result) {
        setFormSuccess(true);
        setTimeout(() => {
          closeBusinessModal()
        }, 1000);
      }
    }
  };

  return {
    formData,
    formErrors,
    formLoading,
    formSuccess,
    isCountriesLoading,
    isRegionsLoading,
    isCitiesLoading,
    countries,
    regions,
    cities,
    handleSubmit,
    handleChange,
    handleSelectChange,
    setCountrySearch,
    fileData, 
    setFileData, 
    handleUpload,
    processingFile
  };
}

export default useBusinessForm;
