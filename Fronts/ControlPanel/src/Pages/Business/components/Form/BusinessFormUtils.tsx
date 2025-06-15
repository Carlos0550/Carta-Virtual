import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { GetCountries } from './utils/CountriesFetch';
import { GetRegions } from './utils/RegionsFetch';
import { GetCities } from './utils/GetCities';

// Tipos de datos
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

// 🔍 HOOKS usando React Query

export const useCountries = (countrySearch: string) => {
  return useQuery({
    queryKey: ['countries', countrySearch],
    queryFn: () => GetCountries({ countrySearch }).then(r => r.countries),
    enabled: countrySearch.length === 0 || countrySearch.length >= 2,
    staleTime: 1000 * 60 * 5,
    placeholderData: prev => prev
  });
};

// useRegions.ts
const useRegions = (countryCode: string, regionSearch: string) =>
  useQuery({
    queryKey: ['regions', countryCode, regionSearch],
    queryFn: () =>
      GetRegions({ countryCode, regionSearch }).then(r => r.regions),
    enabled:
      !!countryCode &&
      (regionSearch.length === 0 || regionSearch.length >= 2),
    staleTime: 1000 * 60 * 5,
    placeholderData: prev => prev,    // ← mantiene la data anterior
  });


 const useCities = (
  countryCode: string,
  regionCode: string,
  citySearch: string
) =>
  useQuery({
    queryKey: ['cities', countryCode, regionCode, citySearch],
    queryFn: () =>
      GetCities({ countryCode, regionCode, citySearch }).then(r => r.cities),
    enabled:
      !!countryCode &&
      !!regionCode &&
      (citySearch.length === 0 || citySearch.length >= 2),
    staleTime: 1000 * 60 * 5,
    placeholderData: prev => prev,
  });


// 🧠 Hook principal
function useBusinessForm() {
  const [formData, setFormData] = useState<BusinessFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<BusinessFormErrors>({});
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [regionSearch, setRegionSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');

  const {
    data: countries = [],
    isLoading: isCountriesLoading,
  } = useCountries(countrySearch);

  const {
    data: regions = [],
    isLoading: isRegionsLoading,
    
  } = useRegions(formData.countryCode, regionSearch);

  const {
    data: cities = [],
    isLoading: isCitiesLoading,
  } = useCities(formData.countryCode, formData.regionCode, citySearch);

  // --- MANEJADORES DE EVENTOS (sin cambios) ---
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

  const validateFields = () => { /* tu validación aquí */ };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // tu lógica de validación, posteo, etc.
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
    setRegionSearch,
    setCitySearch,
  };
}

export default useBusinessForm;
