import React, { useState, useEffect } from 'react';
import { MapPin, TrendingUp, Clock, Users } from 'lucide-react';
import { Location, UserPreferences } from '../App';

interface PopularLocation {
  id: string;
  name: string;
  location: Location;
  distance: number;
  type: 'restaurant' | 'attraction' | 'park' | 'shopping' | 'entertainment';
  popularity: number;
  description: string;
}

interface PopularSuggestionsProps {
  currentLocation: Location;
  preferences: UserPreferences;
  onLocationSelect: (location: Location) => void;
}

export function PopularSuggestions({ currentLocation, preferences, onLocationSelect }: PopularSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<PopularLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [distanceFilter, setDistanceFilter] = useState<number>(500); // meters
  const isEnglish = preferences.language === 'English';

  useEffect(() => {
    loadPopularSuggestions();
  }, [currentLocation, distanceFilter]);

  const loadPopularSuggestions = async () => {
    setIsLoading(true);
    try {
      const { projectId, publicAnonKey } = await import('../utils/supabase/info');
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-328686db/api/places/popular`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          location: currentLocation,
          radius: distanceFilter,
          language: preferences.languageCode
        })
      });
      const data = await response.json();
      setSuggestions(data.places || []);
    } catch (error) {
      console.error('Error loading popular suggestions:', error);
    }
    setIsLoading(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'restaurant': return '🍽️';
      case 'attraction': return '🎭';
      case 'park': return '🌳';
      case 'shopping': return '🛍️';
      case 'entertainment': return '🎪';
      default: return '📍';
    }
  };

  const getTypeLabel = (type: string) => {
    if (isEnglish) {
      switch (type) {
        case 'restaurant': return 'Restaurant';
        case 'attraction': return 'Attraction';
        case 'park': return 'Park';
        case 'shopping': return 'Shopping';
        case 'entertainment': return 'Entertainment';
        default: return 'Place';
      }
    } else {
      switch (type) {
        case 'restaurant': return 'Restaurante';
        case 'attraction': return 'Atracción';
        case 'park': return 'Parque';
        case 'shopping': return 'Compras';
        case 'entertainment': return 'Entretenimiento';
        default: return 'Lugar';
      }
    }
  };

  const formatDistance = (distance: number) => {
    if (distance < 1000) {
      return `${Math.round(distance)}m`;
    } else {
      return `${(distance / 1000).toFixed(1)}km`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-semibold">
            {isEnglish ? 'Popular Nearby Places' : 'Lugares Populares Cercanos'}
          </h2>
        </div>
        
        {/* Distance Filter */}
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">
            {isEnglish ? 'Range:' : 'Rango:'}
          </label>
          <select
            value={distanceFilter}
            onChange={(e) => setDistanceFilter(Number(e.target.value))}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value={100}>100m</option>
            <option value={250}>250m</option>
            <option value={500}>500m</option>
            <option value={1000}>1km</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex space-x-4">
                <div className="w-12 h-12 bg-gray-300 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : suggestions.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 text-lg mb-2">📍</div>
          <p className="text-gray-600">
            {isEnglish 
              ? `No popular places found within ${formatDistance(distanceFilter)}`
              : `No se encontraron lugares populares dentro de ${formatDistance(distanceFilter)}`
            }
          </p>
          <button
            onClick={() => setDistanceFilter(1000)}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
          >
            {isEnglish ? 'Try expanding range to 1km' : 'Intenta expandir el rango a 1km'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {suggestions.map((place) => (
            <div
              key={place.id}
              className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors"
              onClick={() => onLocationSelect(place.location)}
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                  {getTypeIcon(place.type)}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 truncate">{place.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                        {getTypeLabel(place.type)}
                      </span>
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <MapPin className="w-3 h-3" />
                        <span>{formatDistance(place.distance)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-xs text-yellow-600">
                    <Users className="w-3 h-3" />
                    <span>{place.popularity}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {place.description}
                </p>
                
                <div className="flex items-center justify-between mt-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLocationSelect(place.location);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {isEnglish ? 'View Videos Here' : 'Ver Videos Aquí'}
                  </button>
                  
                  <div className="flex items-center space-x-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>{isEnglish ? 'Updated recently' : 'Actualizado recientemente'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Information Box */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">
          {isEnglish ? 'About Popular Places' : 'Acerca de Lugares Populares'}
        </h4>
        <p className="text-sm text-blue-700">
          {isEnglish
            ? 'These suggestions are based on popular locations near you where local videos are commonly filmed. Click on any place to discover videos from that specific location.'
            : 'Estas sugerencias se basan en ubicaciones populares cerca de ti donde comúnmente se filman videos locales. Haz clic en cualquier lugar para descubrir videos de esa ubicación específica.'
          }
        </p>
      </div>
    </div>
  );
}