import { useEffect, useState } from "react";
import { useCountries } from "./useCountries";
import { useRegions } from "./useRegions";
import { useCities } from "./useCities";
import useSessionValidator from "../../../../../Context/ContextUtils/useSessionValidator";
import { useAppContext } from "../../../../../Context/AppContext";
import type { BusinessFormData } from "../../../../../Context/HookTypes/BusinessTypes";
import useFileUploader from "./useFileUploader";
import { showNotification } from "@mantine/notifications";


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
      closeBusinessModal,
      businessModal,
      
    },
    businessHooks: {
      saveBusiness,
      updateBusinessInfo
    }
  } = useAppContext()

  const { ensureSessionIsValid } = useSessionValidator()
  const [formData, setFormData] = useState<BusinessFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<BusinessFormErrors>({});
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [fetchingImageToEdit, setFetchingImageToEdit] = useState<boolean>(false)

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
    // if (!formData.business_phone) {
    //   errors.business_phone = 'El teléfono es obligatorio.';
    // }
    // if (!formData.business_email) {
    //   errors.business_email = 'El correo electrónico es obligatorio.';
    // }

    if(!fileData){
      showNotification({
        title:"La imagen de su negocio es requerida.",
        message: "Por favor inserte una imagen.",
        autoClose: 3000,
        color: "red",
        position: "top-right"
      })
      return
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = handleValidateFields()
    
    if (isValid) {
      setFormLoading(true);
      const result = businessModal?.formType === "create"
      ? await saveBusiness(formData, fileData!)
      : await updateBusinessInfo(formData, fileData!)
      setFormLoading(false);

      if (result) {
        setFormSuccess(true);
        setTimeout(() => {
          closeBusinessModal()
        }, 1000);
      }  
    }
  };

  useEffect(() => {
    if(businessModal?.formType === "edit" && businessModal.editBusinessData !== null){
      const {
        business_name,
        business_banner,
        business_description,
        business_geodata,
        business_email,
        business_phone,
        
      } = businessModal.editBusinessData!
      setFormData({
        business_email,
        business_address1: business_geodata.address1!,
        business_name,
        business_description,
        business_phone,
        countryCode: business_geodata.country?.code || '',
        regionCode: business_geodata.region?.code || '',
        city: business_geodata.city?.code || ''
      })
      const download_image = async () => {
        try {
          setFetchingImageToEdit(true)
          const response = await fetch(business_banner);
          const blob = await response.blob();     
          const file = new File([blob], 'business_banner.jpg', { type: blob.type });
          setFileData(file);
        } catch (error) {
          console.error('Error al descargar la imagen:', error);
        }finally{
          setFetchingImageToEdit(false)
        }
      }
      if (business_banner) {
        download_image();
      }
    }
  },[businessModal])

  // useEffect(() => {
  //   console.log(businessModal)
  // },[businessModal])
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
    processingFile,
    fetchingImageToEdit
  };
}

export default useBusinessForm;
