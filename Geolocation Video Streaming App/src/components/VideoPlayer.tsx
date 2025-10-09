import React, { useState } from 'react';
import { Play, ExternalLink, Clock, User, X } from 'lucide-react';

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

interface UserPreferences {
  language: string;
}

interface VideoPlayerProps {
  videos: Video[];
  isLoading: boolean;
  preferences: UserPreferences;
}

export function VideoPlayer({ videos, isLoading, preferences }: VideoPlayerProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isEnglish = preferences.language === 'English';

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 🌀 Estado de carga con diseño mejorado
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {isEnglish ? 'Loading Videos...' : 'Cargando Videos...'}
        </h2>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex space-x-4">
                <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl w-40 h-24 shadow-md"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-3/4"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/2"></div>
                  <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 🎬 Mostrar lista de videos y modal
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-8 border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
        <span className="text-3xl">🎬</span>
        {isEnglish ? 'Local Videos' : 'Videos Locales'}
      </h2>

      {/* 🎥 Modal para reproductor de video */}
      {isModalOpen && selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl w-[95%] max-w-5xl max-h-[90vh] overflow-y-auto relative">
            {/* Header del modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 sticky top-0 bg-gradient-to-r from-gray-900 to-gray-800 z-10">
              <h2 className="text-xl font-semibold text-white truncate pr-4">{selectedVideo.title}</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg flex-shrink-0"
                title={isEnglish ? 'Close' : 'Cerrar'}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6">
              <div className="relative w-full bg-black rounded-xl overflow-hidden shadow-2xl" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.id}`}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
                ></iframe>
              </div>
              <div className="mt-6 text-white">
                <h3 className="text-2xl font-bold mb-3 leading-tight">{selectedVideo.title}</h3>
                <div className="flex items-center gap-4 text-gray-300 text-sm mb-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{selectedVideo.channelTitle}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(selectedVideo.publishedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <p className="text-gray-200 leading-relaxed mb-4">{selectedVideo.description}</p>
                <a
                  href={`https://www.youtube.com/watch?v=${selectedVideo.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🗂️ Lista de videos encontrados con diseño mejorado */}
      {videos.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
          <div className="text-6xl mb-4">🎥</div>
          <p className="text-gray-600 text-lg font-medium">
            {isEnglish
              ? 'No videos found for this location'
              : 'No se encontraron videos para esta búsqueda o ubicación'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {videos.map((video) => (
            <div
              key={video.id}
              className="flex space-x-4 p-4 rounded-xl cursor-pointer transition-all duration-300 border-2 bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 border-transparent hover:border-gray-200 hover:shadow-md"
              onClick={() => handleVideoSelect(video)}
            >
              <div className="relative group flex-shrink-0">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-40 h-24 object-cover rounded-lg shadow-md"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="bg-red-600 rounded-full p-3 shadow-xl transform group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-white fill-white" />
                  </div>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 text-lg leading-tight">
                  {video.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <User className="w-4 h-4" />
                  <p className="font-medium">{video.channelTitle}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <p>{new Date(video.publishedAt).toLocaleDateString()}</p>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank');
                }}
                className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 flex-shrink-0 hover:scale-110"
                title={isEnglish ? 'Open in YouTube' : 'Abrir en YouTube'}
              >
                <ExternalLink className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}