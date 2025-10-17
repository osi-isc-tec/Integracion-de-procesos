import React, { useState, useRef } from 'react';
import { Search, MapPin, Globe, Loader } from 'lucide-react';
import { Location, UserPreferences } from '../App';
import { useTranslations } from '../hooks/useTranslations';

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
}

export function CustomSearch({ onLocationSelect, preferences }: CustomSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [locationResults, setLocationResults] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [searchRadius, setSearchRadius] = useState<number>(10); // km
  const [videoCategory, setVideoCategory] = useState<string>('all');
  const locationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const t = useTranslations(preferences.languageCode);

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
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ query })
      });
      const data = await response.json();
      setLocationResults(data.results || []);
    } catch (error) {
      console.error('Error searching locations:', error);
    }
    setIsSearchingLocation(false);
  };

  const searchVideos = async () => {
    if (!searchQuery.trim() || !selectedLocation) return;
    setIsSearching(true);
    try {
      const { projectId, publicAnonKey } = await import('../utils/supabase/info');
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-328686db/api/youtube/custom-search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          query: searchQuery,
          location: selectedLocation,
          radius: searchRadius,
          category: videoCategory,
          language: preferences.languageCode
        })
      });
      const data = await response.json();
      setSearchResults(data.videos || []);
    } catch (error) {
      console.error('Error searching videos:', error);
    }
    setIsSearching(false);
  };

  const handleLocationQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setLocationQuery(query);
    if (locationTimeoutRef.current) clearTimeout(locationTimeoutRef.current);
    locationTimeoutRef.current = setTimeout(() => searchLocations(query), 300);
  };

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setLocationQuery(location.address || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`);
    setLocationResults([]);
    onLocationSelect(location);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchVideos();
  };

  const categories = [
    { value: 'all', label: t('cat_all') },
    { value: 'travel', label: t('cat_travel') },
    { value: 'food', label: t('cat_food') },
    { value: 'events', label: t('cat_events') },
    { value: 'culture', label: t('cat_culture') },
    { value: 'nature', label: t('cat_nature') }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">{t('search_custom_title')}</h2>
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('search_what_are_you_looking_for')}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-5 w-5 text-gray-400" /></div>
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t('search_query_placeholder')} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('search_where_in_the_world')}</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MapPin className="h-5 w-5 text-gray-400" /></div>
              <input type="text" value={locationQuery} onChange={handleLocationQueryChange} placeholder={t('search_location_placeholder')} className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" required />
              {(isSearchingLocation || locationResults.length > 0) && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {isSearchingLocation ? (
                    <div className="p-3 text-center">
                      <Loader className="animate-spin h-5 w-5 mx-auto text-blue-600" />
                      <p className="mt-2 text-sm text-gray-600">{t('search_searching_locations')}</p>
                    </div>
                  ) : (
                    <div className="py-1">
                      {locationResults.map((result, index) => (
                        <button key={index} type="button" onClick={() => handleLocationSelect(result)} className="w-full text-left px-3 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none">
                          <div className="flex items-center space-x-2">
                            <Globe className="w-4 h-4 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{result.address}</p>
                              <p className="text-xs text-gray-500">{result.lat.toFixed(4)}, {result.lng.toFixed(4)}</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('search_radius')}</label>
              <div className="flex items-center space-x-2">
                <input type="range" min="1" max="50" value={searchRadius} onChange={(e) => setSearchRadius(Number(e.target.value))} className="flex-1" />
                <span className="text-sm text-gray-600 w-12">{searchRadius}km</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('search_category')}</label>
              <select value={videoCategory} onChange={(e) => setVideoCategory(e.target.value)} className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500">
                {categories.map((category) => (<option key={category.value} value={category.value}>{category.label}</option>))}
              </select>
            </div>
          </div>
          <button type="submit" disabled={!searchQuery.trim() || !selectedLocation || isSearching} className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 flex items-center justify-center space-x-2">
            {isSearching ? <Loader className="animate-spin h-5 w-5" /> : <Search className="h-5 w-5" />}
            <span>{isSearching ? t('loc_searching') : t('search_search_videos')}</span>
          </button>
        </form>
        {selectedLocation && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">{selectedLocation.address || `${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`}</span>
              </div>
              <button onClick={() => onLocationSelect(selectedLocation)} className="text-sm text-blue-600 hover:text-blue-800 font-medium">{t('search_use_this_location')}</button>
            </div>
          </div>
        )}
      </div>
      {searchResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">{t('search_results')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((video) => (
              <div key={video.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative aspect-video">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 hover:opacity-100 flex items-center justify-center">
                    <button onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank')} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">{t('search_watch_video')}</button>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-gray-900 line-clamp-2 mb-2">{video.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{video.channelTitle}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
                    {video.viewCount && <span>{video.viewCount.toLocaleString()} views</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}