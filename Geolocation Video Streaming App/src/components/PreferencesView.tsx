import React, { useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { UserPreferences } from '../App';

interface PreferencesViewProps {
  preferences: UserPreferences;
  onPreferencesChange: (preferences: UserPreferences) => void;
}

const languages = [
  { name: 'Español', code: 'es' },
  { name: 'English', code: 'en' },
  { name: 'Français', code: 'fr' },
  { name: 'Deutsch', code: 'de' },
  { name: 'Italiano', code: 'it' },
  { name: 'Português', code: 'pt' },
  { name: '中文', code: 'zh' },
  { name: '日本語', code: 'ja' },
  { name: '한국어', code: 'ko' },
  { name: 'العربية', code: 'ar' }
];

export function PreferencesView({ preferences, onPreferencesChange }: PreferencesViewProps) {
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);
  const isEnglish = preferences.language === 'English';

  const handleLanguageChange = async (language: string, languageCode: string) => {
    setIsChangingLanguage(true);
    
    try {
      // Translate interface elements if needed
      const { projectId, publicAnonKey } = await import('../utils/supabase/info');
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-328686db/api/translate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          text: 'Interface updated successfully',
          to: languageCode,
          from: 'en'
        })
      });
      
      const newPreferences: UserPreferences = {
        language,
        languageCode
      };
      
      onPreferencesChange(newPreferences);
      
      // Store preferences in localStorage
      localStorage.setItem('geoTubePreferences', JSON.stringify(newPreferences));
      
    } catch (error) {
      console.error('Error changing language:', error);
    }
    
    setIsChangingLanguage(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">
          {isEnglish ? 'Preferences' : 'Preferencias'}
        </h2>

        {/* Language Selection */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Globe className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium text-gray-900">
              {isEnglish ? 'Language / Idioma' : 'Idioma / Language'}
            </h3>
          </div>

          {isChangingLanguage && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm text-blue-700">
                  {isEnglish ? 'Updating language...' : 'Actualizando idioma...'}
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.name, lang.code)}
                disabled={isChangingLanguage}
                className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  preferences.languageCode === lang.code
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                } ${isChangingLanguage ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span className="font-medium">{lang.name}</span>
                {preferences.languageCode === lang.code && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Current Settings Summary */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">
            {isEnglish ? 'Current Settings' : 'Configuración Actual'}
          </h4>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>{isEnglish ? 'Interface Language:' : 'Idioma de Interfaz:'}</span>
              <span className="font-medium">{preferences.language}</span>
            </div>
            <div className="flex justify-between">
              <span>{isEnglish ? 'Language Code:' : 'Código de Idioma:'}</span>
              <span className="font-medium">{preferences.languageCode}</span>
            </div>
          </div>
        </div>

        {/* About Translation */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2">
            {isEnglish ? 'About Translation' : 'Acerca de la Traducción'}
          </h4>
          <p className="text-sm text-yellow-700">
            {isEnglish 
              ? 'The interface will be translated to your selected language. Video titles and descriptions will also be translated when possible to improve your viewing experience.'
              : 'La interfaz será traducida al idioma seleccionado. Los títulos y descripciones de videos también serán traducidos cuando sea posible para mejorar tu experiencia de visualización.'
            }
          </p>
        </div>
      </div>
    </div>
  );
}