"use client"

import { useState, useEffect } from "react"
import { VideoCard } from "@/components/video-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Loader2, Youtube } from "lucide-react"
import { useLocale } from "@/lib/locale-context"
import { searchVideos, getTrendingVideos } from "./actions/youtube-actions"
import { WhatsAppButton } from "@/components/whatsapp-button"

export default function Home() {
  const { t } = useLocale()
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    loadTrendingVideos()
  }, [])

  const loadTrendingVideos = async () => {
    setLoading(true)
    const result = await getTrendingVideos()
    if (result.success) {
      setVideos(result.videos)
    }
    setLoading(false)
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadTrendingVideos()
      return
    }

    setLoading(true)
    const result = await searchVideos(searchQuery)
    if (result.success) {
      setVideos(result.videos)
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Youtube className="w-10 h-10 text-red-600" />
            <h1 className="text-4xl font-bold">{t.appTitle}</h1>
          </div>
          <p className="text-muted-foreground">{t.appDescription}</p>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex gap-2">
            <Input
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t.searching}
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  {t.search}
                </>
              )}
            </Button>
          </div>
        </div>

        {videos.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">
              {searchQuery ? `${videos.length} ${t.noVideos}` : t.trendingVideos}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {videos.map((video) => (
                <VideoCard key={video.id?.videoId || video.id} video={video} />
              ))}
            </div>
          </div>
        )}

        {!loading && videos.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Youtube className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>{t.noVideos}</p>
          </div>
        )}
      </div>
      <WhatsAppButton />
    </main>
  )
}
