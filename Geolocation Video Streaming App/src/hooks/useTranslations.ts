import { translations, TranslationKey } from '../lib/translations';

/**
 * Un hook personalizado de React para manejar las traducciones.
 * @param languageCode - El código del idioma actual (ej. 'es', 'en').
 * @returns Una función `t` que toma una clave de traducción y devuelve el string traducido.
 */
export const useTranslations = (languageCode: string) => {
  /**
   * La función de traducción.
   * @param key - La clave del texto a traducir.
   * @returns El string traducido. Vuelve al inglés si la traducción no existe.
   */
  const t = (key: TranslationKey): string => {
    // Encuentra las traducciones para el idioma actual o usa un objeto vacío si no existe
    const langTranslations = translations[languageCode] || {};
    // Obtiene el texto para la clave específica o usa el texto en inglés como fallback
    const text = langTranslations[key] || translations.en[key];
    // Devuelve el texto encontrado o la clave misma si no se encontró nada (como último recurso)
    return text || key;
  };

  return t;
};