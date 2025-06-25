export async function translateToEnglish(text: string): Promise<string> {
  console.log('🌐 TranslateService: Traduciendo:', text);
  console.log('🔑 TranslateService: API Key configurada:', !!import.meta.env.VITE_RAPIDAPI_KEY);
  
  if (!import.meta.env.VITE_RAPIDAPI_KEY) {
    console.warn('⚠️ TranslateService: VITE_RAPIDAPI_KEY no configurada, usando texto original');
    return text;
  }
  
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
    console.log('📡 TranslateService: Enviando petición de traducción...');
    const response = await fetch(url, options);
    console.log('📡 TranslateService: Status de respuesta:', response.status);
    
    if (!response.ok) {
      console.warn('⚠️ TranslateService: Error en traducción, usando texto original');
      return text;
    }
    
    const result = await response.json();
    const translated = result.translatedTexts?.[0] || text;
    console.log('✅ TranslateService: Traducción exitosa:', text, '→', translated);
    return translated;
  } catch (error) {
    console.warn('⚠️ TranslateService: Error en traducción, usando texto original:', error);
    return text;
  }
} 