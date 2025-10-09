import React, { useState, useEffect } from 'react';
import { VideoPlayer } from './components/VideoPlayer';
import { LocationSelector } from './components/LocationSelector';
import { PreferencesView } from './components/PreferencesView';
import { PopularSuggestions } from './components/PopularSuggestions';
import { CustomSearch } from './components/CustomSearch';
import { Navigation } from './components/Navigation';
import { MapPin, Settings, Search, Video } from 'lucide-react';

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface UserPreferences {
  language: string;
  languageCode: string;
}

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'location' | 'preferences' | 'search'>('home');
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [preferences, setPreferences] = useState<UserPreferences>({
    language: 'Español',
    languageCode: 'es'
  });
  const [videos, setVideos] = useState<any[]>([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);

  // Get current location on app load
  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Load videos when location changes
  useEffect(() => {
    const locationToUse = selectedLocation || currentLocation;
    if (locationToUse) {
      loadVideosForLocation(locationToUse);
    }
  }, [currentLocation, selectedLocation]);

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location: Location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          // Get address for the location
          try {
            const { projectId, publicAnonKey } = await import('./utils/supabase/info');
            const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-328686db/api/geocode`, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${publicAnonKey}`
              },
              body: JSON.stringify({ lat: location.lat, lng: location.lng })
            });
            const data = await response.json();
            location.address = data.address;
          } catch (error) {
            console.error('Error getting address:', error);
          }
          
          setCurrentLocation(location);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoadingLocation(false);
        }
      );
    } else {
      setIsLoadingLocation(false);
    }
  };

  const loadVideosForLocation = async (location: Location) => {
    setIsLoadingVideos(true);
    try {
      const { projectId, publicAnonKey } = await import('./utils/supabase/info');
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-328686db/api/youtube/search`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ 
          location,
          language: preferences.languageCode 
        })
      });
      const data = await response.json();
      setVideos(data.videos || []);
    } catch (error) {
      console.error('Error loading videos:', error);
    }
    setIsLoadingVideos(false);
  };

  const handleLocationChange = (location: Location) => {
    setSelectedLocation(location);
  };

  const resetToCurrentLocation = () => {
    setSelectedLocation(null);
  };

  const activeLocation = selectedLocation || currentLocation;

  const renderView = () => {
    switch (currentView) {
      case 'location':
        return (
          <LocationSelector
            currentLocation={currentLocation}
            selectedLocation={selectedLocation}
            onLocationChange={handleLocationChange}
            onResetLocation={resetToCurrentLocation}
            preferences={preferences}
          />
        );
      case 'preferences':
        return (
          <PreferencesView
            preferences={preferences}
            onPreferencesChange={setPreferences}
          />
        );
      case 'search':
  case 'search':
  return (
    <div className="space-y-6">
      <CustomSearch
        onLocationSelect={handleLocationChange}
        preferences={preferences}
        onSearchResults={(results) => setVideos(results)}
        setIsLoading={setIsLoadingVideos}
      />
    </div>
  );


      default:
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold">
                    {preferences.language === 'English' ? 'Current Location' : 'Ubicación Actual'}
                  </h2>
                </div>
                {activeLocation && !isLoadingLocation && (
                  <span className="text-sm text-gray-600">
                    {activeLocation.address || `${activeLocation.lat.toFixed(4)}, ${activeLocation.lng.toFixed(4)}`}
                  </span>
                )}
              </div>
              
              {isLoadingLocation && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">
                    {preferences.language === 'English' ? 'Getting your location...' : 'Obteniendo tu ubicación...'}
                  </p>
                </div>
              )}
            </div>

            {activeLocation && (
              <>
                <VideoPlayer
                  videos={videos}
                  isLoading={isLoadingVideos}
                  preferences={preferences}
                />
                <PopularSuggestions
                  currentLocation={activeLocation}
                  preferences={preferences}
                  onLocationSelect={handleLocationChange}
                />
              </>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Video className="w-8 h-8 text-red-600" />
              <h1 className="text-xl font-bold text-gray-900">
                {preferences.language === 'English' ? 'GeoTube' : 'GeoTube'}
              </h1>
            </div>
            
            <Navigation
              currentView={currentView}
              onViewChange={setCurrentView}
              preferences={preferences}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderView()}
      </main>
    </div>
  );
}