import { Flex, TextInput, Button, Select, Loader, Textarea, Paper, Text } from '@mantine/core';
import { useEffect, useMemo } from 'react';
import useBusinessForm from './Hooks/useBusinessForm';
import "./FormStyles.css"
import { RxCross1 } from "react-icons/rx";
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
    setCountrySearch,
    handleUpload,
    processingFile,
    fileData,
    setFileData
  } = useBusinessForm();

  const debouncedCountrySearch = useMemo(() => debounce(setCountrySearch, 400), [setCountrySearch]);
  
  useEffect(() => {
    console.log(fileData)
  },[fileData])
  if (formSuccess) {
    return (
      <Paper
        withBorder
        p="md"
        radius="md"
        style={{ maxWidth: 600, margin: '0 auto' }}

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

  function createPreviewUrl(file: File | Blob): string {
  return URL.createObjectURL(file)
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

        {!fileData ? (
          !processingFile? (
          <div
            className='file-uploader-container'
            onClick={() => document.getElementById('fileInput')!.click()}
          >
            <Flex mt={5} justify={"center"} align={"center"}>
              <span className="file-uploader-icon">📁</span>
              <p className="file-uploader-title">Añadir imagen</p>
            </Flex>
            <p className="file-uploader-subtext">Arrastrá o hacé click aquí</p>
            <input
              id="fileInput"
              type='file'
              accept='video/*, image/*'
              style={{ display: 'none' }}
              onChange={handleUpload}
            />
          </div>

        ) : (
          <div className='processing-file-container'>
            <div className="loader"></div>
            <div className="loader"></div>
            <div className="loader"></div>
          </div>
        )
        ) : (
          <div 
            className='picture-preview-container'
          >
            <div className='delete-preview-btn'
              onClick={() => setFileData(null)}
            >
              <RxCross1 color='red' size={18}/>
            </div>
            <picture
            className='image-preview'
          >
            <img src={createPreviewUrl(fileData)} alt="" />
          </picture>
          </div>
        )}


        <Button type="submit" loading={formLoading} disabled={formLoading || processingFile} fullWidth mt="md" >
          Guardar Negocio
        </Button>
      </Flex>
    </form>
  );
}

export default BusinessForm;