import React, { useState, useRef } from 'react';
import { Search, MapPin, Globe, Loader } from 'lucide-react';
import { Location, UserPreferences } from '../App';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  location: Location;
  viewCount?: number;
  duration?: string;
}

interface CustomSearchProps {
  onLocationSelect: (location: Location) => void;
  preferences: UserPreferences;
  onSearchResults?: (videos: any[]) => void;
  setIsLoading?: (loading: boolean) => void;
}

export function CustomSearch({
  onLocationSelect,
  preferences,
  onSearchResults,
  setIsLoading,
}: CustomSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [locationResults, setLocationResults] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [searchRadius, setSearchRadius] = useState<number>(10); // km
  const [videoCategory, setVideoCategory] = useState<string>('all');
  const locationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isEnglish = preferences.language === 'English';

  // 🔹 Buscar ubicaciones (simulado)
  const searchLocations = async (query: string) => {
    if (!query.trim()) {
      setLocationResults([]);
      return;
    }

    setIsSearchingLocation(true);
    try {
      const { projectId, publicAnonKey } = await import('../utils/supabase/info');
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-328686db/api/geocode/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      setLocationResults(data.results || []);
    } catch (error) {
      console.error('Error searching locations:', error);
      setLocationResults([]);
    }
    setIsSearchingLocation(false);
  };

  // 🔹 Buscar videos desde la API de YouTube
  const searchVideos = async () => {
  if (!searchQuery.trim()) return; // solo requiere texto

  setIsSearching(true);
  if (setIsLoading) setIsLoading(true);

  try {
    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
    // 🔸 ignoramos si no hay locationQuery
    const query = locationQuery
      ? `${searchQuery} ${locationQuery}`
      : searchQuery;

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=9&q=${encodeURIComponent(
        query
      )}&key=${apiKey}`
    );

    const data = await response.json();

    if (data.error) {
      console.error('YouTube API Error:', data.error.message);
      return;
    }

    const formattedVideos = (data.items || []).map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
    }));

    if (onSearchResults) onSearchResults(formattedVideos);
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
  }

  setIsSearching(false);
  if (setIsLoading) setIsLoading(false);
};


  // 🔹 Manejadores de eventos
  const handleLocationQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setLocationQuery(query);

    if (locationTimeoutRef.current) clearTimeout(locationTimeoutRef.current);
    locationTimeoutRef.current = setTimeout(() => searchLocations(query), 400);
  };

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setLocationQuery(location.address || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`);
    setLocationResults([]);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchVideos();
  };

  const categories = [
    { value: 'all', label: isEnglish ? 'All Categories' : 'Todas las Categorías' },
    { value: 'travel', label: isEnglish ? 'Travel & Places' : 'Viajes y Lugares' },
    { value: 'food', label: isEnglish ? 'Food & Dining' : 'Comida y Restaurantes' },
    { value: 'events', label: isEnglish ? 'Events & Entertainment' : 'Eventos y Entretenimiento' },
    { value: 'culture', label: isEnglish ? 'Culture & History' : 'Cultura e Historia' },
    { value: 'nature', label: isEnglish ? 'Nature & Outdoors' : 'Naturaleza y Exterior' },
  ];

  return (
    <div className="space-y-6">
      {/* 🔍 Formulario de búsqueda */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">
          {isEnglish ? 'Custom Video Search' : 'Búsqueda Personalizada de Videos'}
        </h2>

        <form onSubmit={handleSearch} className="space-y-4">
          {/* Texto a buscar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isEnglish ? 'What are you looking for?' : '¿Qué estás buscando?'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isEnglish
                    ? 'e.g., concerts, street food, travel...'
                    : 'ej., conciertos, comida callejera, viajes...'
                }
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Búsqueda de ubicación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isEnglish ? 'Where in the world?' : '¿Dónde en el mundo?'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={locationQuery}
                onChange={handleLocationQueryChange}
                placeholder={
                  isEnglish
                    ? 'Search for a city, country, or landmark...'
                    : 'Buscar ciudad, país o monumento...'
                }
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                required
              />

              {/* Resultados de ubicación */}
              {(isSearchingLocation || locationResults.length > 0) && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {isSearchingLocation ? (
                    <div className="p-3 text-center">
                      <Loader className="animate-spin h-5 w-5 mx-auto text-blue-600" />
                      <p className="mt-2 text-sm text-gray-600">
                        {isEnglish ? 'Searching locations...' : 'Buscando ubicaciones...'}
                      </p>
                    </div>
                  ) : (
                    <div className="py-1">
                      {locationResults.map((result, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleLocationSelect(result)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                        >
                          <div className="flex items-center space-x-2">
                            <Globe className="w-4 h-4 text-gray-400" />
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
          </div>

          {/* Filtros de búsqueda */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isEnglish ? 'Search Radius' : 'Radio de Búsqueda'}
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={searchRadius}
                  onChange={(e) => setSearchRadius(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm text-gray-600 w-12">{searchRadius}km</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isEnglish ? 'Category' : 'Categoría'}
              </label>
              <select
                value={videoCategory}
                onChange={(e) => setVideoCategory(e.target.value)}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Botón principal */}
          <button
  type="submit"
  disabled={!searchQuery.trim() || isSearching} // ✅ ya no depende de selectedLocation
  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
>
  {isSearching ? (
    <>
      <Loader className="animate-spin h-5 w-5" />
      <span>{isEnglish ? 'Searching...' : 'Buscando...'}</span>
    </>
  ) : (
    <>
      <Search className="h-5 w-5" />
      <span>{isEnglish ? 'Search Videos' : 'Buscar Videos'}</span>
    </>
  )}
</button>

        </form>

        {/* Ubicación seleccionada */}
        {selectedLocation && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  {selectedLocation.address ||
                    `${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`}
                </span>
              </div>
              <button
                onClick={() => onLocationSelect(selectedLocation)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {isEnglish ? 'Use This Location' : 'Usar Esta Ubicación'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
