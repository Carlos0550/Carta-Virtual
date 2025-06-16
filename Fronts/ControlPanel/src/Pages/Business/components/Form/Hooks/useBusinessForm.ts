import { useEffect, useState } from "react";
import { useCountries } from "./useCountries";
import { useRegions } from "./useRegions";
import { useCities } from "./useCities";

export interface BusinessFormData {
  business_name: string;
  business_description: string;
  business_address1: string;
  countryCode: string;
  regionCode: string;
  city: string;
  business_phone: string;
  business_email: string;
}

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
  const [formData, setFormData] = useState<BusinessFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<BusinessFormErrors>({});
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [regionSearch, setRegionSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');

  const { data: countries = [], isLoading: isCountriesLoading } = useCountries(countrySearch);
  const { data: regions = [], isLoading: isRegionsLoading } = useRegions(formData.countryCode);
  const { data: cities = [], isLoading: isCitiesLoading } = useCities(formData.countryCode, formData.regionCode);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    // Validación y envío pendiente...
    setTimeout(() => {
      setFormLoading(false);
      setFormSuccess(true);
    }, 1000);
  };

  useEffect(()=>{
    console.log(formData)
  },[formData])

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
    setRegionSearch,
    setCitySearch,
  };
}

export default useBusinessForm;
