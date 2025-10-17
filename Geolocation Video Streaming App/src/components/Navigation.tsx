import React from 'react';
import { Home, MapPin, Settings, Search } from 'lucide-react';
import { UserPreferences } from '../App';
import { useTranslations } from '../hooks/useTranslations';

interface NavigationProps {
  currentView: 'home' | 'location' | 'preferences' | 'search';
  onViewChange: (view: 'home' | 'location' | 'preferences' | 'search') => void;
  preferences: UserPreferences;
}

export function Navigation({ currentView, onViewChange, preferences }: NavigationProps) {
  const t = useTranslations(preferences.languageCode);
  
  const navItems = [
    { id: 'home' as const, icon: Home, label: t('nav_home') },
    { id: 'location' as const, icon: MapPin, label: t('nav_location') },
    { id: 'search' as const, icon: Search, label: t('nav_search') },
    { id: 'preferences' as const, icon: Settings, label: t('nav_preferences') }
  ];

  return (
    <nav className="flex space-x-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:block">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}