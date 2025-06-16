import { Flex, Notification, TextInput, Button, Select, Loader, Textarea, Paper, Text } from '@mantine/core';
import { useMemo } from 'react';
import useBusinessForm from './Hooks/useBusinessForm';

// Función debounce puede vivir fuera del componente para no ser redeclarada.
const debounce = (fn: (...args: any[]) => void, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

function BusinessForm() {
  const {
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
    setCountrySearch
  } = useBusinessForm();

  const debouncedCountrySearch = useMemo(() => debounce(setCountrySearch, 400), [setCountrySearch]);
    
  
  if (formSuccess) {
    return (
      <Paper
        withBorder
        p="md"
        radius="md"
        style={{ maxWidth: 600, margin: '0 auto'}}
        
      >
        <Flex
          direction="column"
          align="center"
          justify="center"
          gap="md"
        >
          <Text size="lg" fw={500} c={'#2c2c2c'}>
          🎉 Negocio guardado exitosamente.
        </Text>
        </Flex>
      </Paper>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Flex direction="column" gap="md">
        <Select
          label="País"
          placeholder="Busca y selecciona un país"
          data={countries}
          value={formData.countryCode || null}
          onChange={(value) => handleSelectChange('countryCode', value)}
          onSearchChange={debouncedCountrySearch}
          error={formErrors.countryCode}
          searchable
          required
          rightSection={isCountriesLoading ? <Loader size="xs" /> : null}
        />
        <Select
          label="Provincia / Estado"
          placeholder="Selecciona una provincia"
          data={regions}
          value={formData.regionCode || null}
          onChange={(value) => handleSelectChange('regionCode', value)}
          disabled={!formData.countryCode || isRegionsLoading}
          error={formErrors.regionCode}
          searchable
          required
          rightSection={isRegionsLoading ? <Loader size="xs" /> : null}
        />
        <Select
          label="Ciudad"
          placeholder="Selecciona una ciudad"
          data={cities}
          value={formData.city || null}
          onChange={(value) => handleSelectChange('city', value)}
          disabled={!formData.regionCode || isCitiesLoading}
          error={formErrors.city}
          searchable
          required
          rightSection={isCitiesLoading ? <Loader size="xs" /> : null}
        />
        <TextInput
          label="Nombre del Negocio"
          name="business_name"
          placeholder="Ej: Mi Tienda Increíble"
          value={formData.business_name}
          onChange={handleChange}
          error={formErrors.business_name}
          
        />
        <Textarea
          label="Descripción del Negocio"
          name="business_description"
          placeholder="Una breve descripción de lo que hace tu negocio"
          value={formData.business_description}
          onChange={handleChange}
          error={formErrors.business_description}
        />
        <TextInput
          label="Dirección (Calle y Número)"
          name="business_address1"
          placeholder="Ej: Av. Siempreviva 742"
          value={formData.business_address1}
          onChange={handleChange}
          error={formErrors.business_address1}
          
        />
        <TextInput
          label="Teléfono"
          name="business_phone"
          placeholder="Ej: +54 9 11 12345678"
          value={formData.business_phone}
          onChange={handleChange}
          error={formErrors.business_phone}
          
        />
        <TextInput
          label="Correo Electrónico"
          name="business_email"
          type="email"
          placeholder="contacto@negocio.com"
          value={formData.business_email}
          onChange={handleChange}
          error={formErrors.business_email}
          
        />

        <Button type="submit" loading={formLoading} fullWidth mt="md">
          Guardar Negocio
        </Button>
      </Flex>
    </form>
  );
}

export default BusinessForm;