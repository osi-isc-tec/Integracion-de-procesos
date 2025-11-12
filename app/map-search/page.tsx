"use client"

import { useState } from "react"
import { LocationMap } from "@/components/location-map"
import { VideoCard } from "@/components/video-card"
import type { YouTubeVideo } from "@/types/youtube"
import { Map } from "lucide-react"
import { useLocale } from "@/lib/locale-context"
import { WhatsAppButton } from "@/components/whatsapp-button"

export default function MapSearchPage() {
  const { t } = useLocale()
  const [videos, setVideos] = useState<YouTubeVideo[]>([])

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Map className="w-8 h-8" />
            <h1 className="text-3xl font-bold">{t.locationSearch}</h1>
          </div>
          <p className="text-muted-foreground">{t.appDescription}</p>
        </div>

        <div className="mb-8">
          <LocationMap onVideosFound={setVideos} />
        </div>

        {videos.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">
              {videos.length} {t.videosFound}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {videos.map((video) => (
                <VideoCard key={video.id?.videoId || (video as any).id} video={video} />
              ))}
            </div>
          </div>
        )}

        {videos.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Map className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>{t.useMapToSearch}</p>
          </div>
        )}
      </div>
      <WhatsAppButton />
    </main>
  )
}
