import React, { useState, useRef, useCallback } from 'react';
import { MapPin, Navigation as NavigationIcon, Search } from 'lucide-react';
import { Location, UserPreferences } from '../App';

interface LocationSelectorProps {
  currentLocation: Location | null;
  selectedLocation: Location | null;
  onLocationChange: (location: Location) => void;
  onResetLocation: () => void;
  preferences: UserPreferences;
}

export function LocationSelector({
  currentLocation,
  selectedLocation,
  onLocationChange,
  onResetLocation,
  preferences
}: LocationSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isEnglish = preferences.language === 'English';

  const searchLocation = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const { projectId, publicAnonKey } = await import('../utils/supabase/info');
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-328686db/api/geocode/search`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ query })
      });
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error('Error searching location:', error);
      setSearchResults([]);
    }
    setIsSearching(false);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchLocation(query);
    }, 300);
  };

  const handleLocationSelect = (location: Location) => {
    onLocationChange(location);
    setSearchQuery('');
    setSearchResults([]);
  };

  const activeLocation = selectedLocation || currentLocation;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">
          {isEnglish ? 'Location Settings' : 'Configuración de Ubicación'}
        </h2>

        {/* Current Location */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900">
              {isEnglish ? 'Current Location' : 'Ubicación Actual'}
            </h3>
            {selectedLocation && (
              <button
                onClick={onResetLocation}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {isEnglish ? 'Use Current Location' : 'Usar Ubicación Actual'}
              </button>
            )}
          </div>
          
          {currentLocation ? (
            <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <NavigationIcon className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-900">
                  {currentLocation.address || `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}`}
                </p>
                <p className="text-xs text-green-700">
                  {isEnglish ? 'GPS Location' : 'Ubicación GPS'}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600">
                {isEnglish ? 'Location not available' : 'Ubicación no disponible'}
              </p>
            </div>
          )}
        </div>

        {/* Manual Location Search */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-900 mb-2">
            {isEnglish ? 'Manual Location' : 'Ubicación Manual'}
          </h3>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={isEnglish ? 'Search for a location...' : 'Buscar una ubicación...'}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Search Results */}
          {(isSearching || searchResults.length > 0) && (
            <div className="mt-2 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {isSearching ? (
                <div className="p-3 text-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-600">
                    {isEnglish ? 'Searching...' : 'Buscando...'}
                  </p>
                </div>
              ) : (
                <div className="py-1">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => handleLocationSelect(result)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                    >
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{result.address}</p>
                          <p className="text-xs text-gray-500">
                            {result.lat.toFixed(4)}, {result.lng.toFixed(4)}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Selected Location */}
        {selectedLocation && (
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-2">
              {isEnglish ? 'Selected Location' : 'Ubicación Seleccionada'}
            </h3>
            <div className="flex items-center space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <MapPin className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">
                  {selectedLocation.address || `${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`}
                </p>
                <p className="text-xs text-blue-700">
                  {isEnglish ? 'Manual Selection' : 'Selección Manual'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Active Location Summary */}
        {activeLocation && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">
              {isEnglish ? 'Active Location for Videos' : 'Ubicación Activa para Videos'}
            </h4>
            <p className="text-sm text-gray-700">
              {activeLocation.address || `${activeLocation.lat.toFixed(4)}, ${activeLocation.lng.toFixed(4)}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}