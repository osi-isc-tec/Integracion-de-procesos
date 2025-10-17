import React from 'react';
import { Globe, Check } from 'lucide-react';
import { UserPreferences } from '../App';
import { useTranslations } from '../hooks/useTranslations';

interface PreferencesViewProps {
  preferences: UserPreferences;
  onPreferencesChange: (preferences: UserPreferences) => void;
}

const languages = [
  { name: 'Español', code: 'es' }, { name: 'English', code: 'en' },
  { name: 'Français', code: 'fr' }, { name: 'Deutsch', code: 'de' },
  { name: 'Italiano', code: 'it' }, { name: 'Português', code: 'pt' },
  { name: '中文', code: 'zh' }, { name: '日本語', code: 'ja' },
  { name: '한국어', code: 'ko' }, { name: 'العربية', code: 'ar' }
];

export function PreferencesView({ preferences, onPreferencesChange }: PreferencesViewProps) {
  const t = useTranslations(preferences.languageCode);

  const handleLanguageChange = (language: string, languageCode: string) => {
    const newPreferences: UserPreferences = { language, languageCode };
    onPreferencesChange(newPreferences);
    localStorage.setItem('geoTubePreferences', JSON.stringify(newPreferences));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">{t('pref_title')}</h2>
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Globe className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium text-gray-900">{t('pref_language_label')}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {languages.map((lang) => (
              <button key={lang.code} onClick={() => handleLanguageChange(lang.name, lang.code)} className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${preferences.languageCode === lang.code ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                <span className="font-medium">{lang.name}</span>
                {preferences.languageCode === lang.code && <Check className="w-4 h-4 text-blue-600" />}
              </button>
            ))}
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">{t('pref_current_settings')}</h4>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>{t('pref_interface_language')}</span>
              <span className="font-medium">{preferences.language}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('pref_language_code')}</span>
              <span className="font-medium">{preferences.languageCode}</span>
            </div>
          </div>
        </div>
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2">{t('pref_about_translation')}</h4>
          <p className="text-sm text-yellow-700">{t('pref_translation_info')}</p>
        </div>
      </div>
    </div>
  );
}