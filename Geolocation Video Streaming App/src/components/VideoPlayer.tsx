import React, { useState } from 'react';
import { Play, ExternalLink } from 'lucide-react';
import { UserPreferences } from '../App';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  location?: {
    lat: number;
    lng: number;
  };
}

interface VideoPlayerProps {
  videos: Video[];
  isLoading: boolean;
  preferences: UserPreferences;
}

export function VideoPlayer({ videos, isLoading, preferences }: VideoPlayerProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const isEnglish = preferences.language === 'English';

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">
          {isEnglish ? 'Loading Videos...' : 'Cargando Videos...'}
        </h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex space-x-4">
                <div className="bg-gray-300 rounded-lg w-32 h-20"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-lg font-semibold mb-4">
        {isEnglish ? 'Local Videos' : 'Videos Locales'}
      </h2>
      
      {selectedVideo && (
        <div className="mb-6">
          <div className="aspect-w-16 aspect-h-9 bg-gray-900 rounded-lg overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${selectedVideo.id}`}
              title={selectedVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold">{selectedVideo.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{selectedVideo.channelTitle}</p>
            <p className="text-gray-700 mt-2">{selectedVideo.description}</p>
          </div>
        </div>
      )}

      {videos.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 text-lg mb-2">🎥</div>
          <p className="text-gray-600">
            {isEnglish ? 'No videos found for this location' : 'No se encontraron videos para esta ubicación'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {videos.map((video) => (
            <div
              key={video.id}
              className={`flex space-x-4 p-3 rounded-lg cursor-pointer transition-colors ${
                selectedVideo?.id === video.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedVideo(video)}
            >
              <div className="relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-32 h-20 object-cover rounded-lg"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-lg opacity-0 hover:opacity-100 transition-opacity">
                  <Play className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-600 mb-1">{video.channelTitle}</p>
                <p className="text-xs text-gray-500">
                  {new Date(video.publishedAt).toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank');
                }}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title={isEnglish ? 'Open in YouTube' : 'Abrir en YouTube'}
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}