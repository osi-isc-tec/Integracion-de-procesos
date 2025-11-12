"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { VideoCard } from "@/components/video-card"
import { Search, Loader2, MapPin } from "lucide-react"
import { useLocale } from "@/lib/locale-context"
import { searchYouTubeVideos } from "../actions/youtube-actions"
import type { YouTubeVideo } from "@/types/youtube"
import { WhatsAppButton } from "@/components/whatsapp-button"

export default function CustomSearchPage() {
  const { t } = useLocale()
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [radius, setRadius] = useState([1000])
  const [keyword, setKeyword] = useState("")
  const [loading, setLoading] = useState(false)
  const [videos, setVideos] = useState<YouTubeVideo[]>([])

  const handleSearch = async () => {
    const lat = Number.parseFloat(latitude)
    const lng = Number.parseFloat(longitude)

    if (isNaN(lat) || isNaN(lng)) {
      alert("Por favor ingresa coordenadas válidas")
      return
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      alert("Coordenadas fuera de rango. Latitud: -90 a 90, Longitud: -180 a 180")
      return
    }

    setLoading(true)
    setVideos([])

    const result = await searchYouTubeVideos({
      lat,
      lng,
      radius: radius[0],
      keyword,
    })

    if (result.success) {
      setVideos(result.videos)
    } else {
      alert(result.message)
    }

    setLoading(false)
  }

  const formatRadius = () => {
    if (radius[0] < 1000) {
      return `${radius[0]} ${t.meters}`
    }
    return `${(radius[0] / 1000).toFixed(1)} ${t.kilometers}`
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-8 h-8" />
            <h1 className="text-3xl font-bold">{t.customCoordinateSearch}</h1>
          </div>
          <p className="text-muted-foreground">{t.enterCoordinates}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>{t.customCoordinateSearch}</CardTitle>
                <CardDescription>{t.enterCoordinates}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">{t.latitude}</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="0.000001"
                    placeholder="19.432608"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude">{t.longitude}</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="0.000001"
                    placeholder="-99.133209"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="radius">
                    {t.radius}: {formatRadius()}
                  </Label>
                  <Slider
                    id="radius"
                    value={radius}
                    onValueChange={setRadius}
                    min={100}
                    max={10000}
                    step={100}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">100m - 10km</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keyword">{t.keywordOptional}</Label>
                  <Input
                    id="keyword"
                    placeholder={t.keywordOptional}
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>

                <Button onClick={handleSearch} disabled={loading} className="w-full">
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
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            {videos.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  {videos.length} {t.videosFound}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {videos.map((video) => (
                    <VideoCard key={video.id?.videoId || (video as any).id} video={video} />
                  ))}
                </div>
              </div>
            )}

            {!loading && videos.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <MapPin className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>{t.noVideos}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <WhatsAppButton />
    </main>
  )
}
