"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { MapPin, Search, Loader2 } from "lucide-react"
import type { YouTubeVideo, LocationData } from "@/types/youtube"
import { searchYouTubeVideos } from "@/app/actions/youtube-actions"
import { useLocale } from "@/lib/locale-context"

interface LocationMapProps {
  onVideosFound: (videos: YouTubeVideo[]) => void
}

export function LocationMap({ onVideosFound }: LocationMapProps) {
  const { t } = useLocale()

  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const circleRef = useRef<any>(null)
  const videoMarkersRef = useRef<any[]>([])

  const [radius, setRadius] = useState([5000])
  const [keyword, setKeyword] = useState("")
  const [loading, setLoading] = useState(false)
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [locationData, setLocationData] = useState<LocationData | null>(null)
  const [status, setStatus] = useState("")
  const [L, setL] = useState<any>(null)

  useEffect(() => {
    import("leaflet").then((leaflet) => {
      setL(leaflet.default)

      delete (leaflet.default.Icon.Default.prototype as any)._getIconUrl
      leaflet.default.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      })
    })
  }, [])

  useEffect(() => {
    if (!L || !mapRef.current || mapInstance.current) return

    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css"
    document.head.appendChild(link)

    mapInstance.current = L.map(mapRef.current).setView([20, -99], 5)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(mapInstance.current)

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
      }
    }
  }, [L])

  const initMarker = (lat: number, lng: number) => {
    if (!L || !mapInstance.current) return

    const map = mapInstance.current

    if (markerRef.current) {
      map.removeLayer(markerRef.current)
    }

    const greenIcon = new L.Icon({
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    })

    markerRef.current = L.marker([lat, lng], { draggable: true, icon: greenIcon }).addTo(map)
    drawCircle(lat, lng, radius[0])

    markerRef.current.on("drag", (e: any) => {
      const newPos = e.target.getLatLng()
      setCoords({ lat: newPos.lat, lng: newPos.lng })
      drawCircle(newPos.lat, newPos.lng, radius[0])
    })

    map.setView([lat, lng], 11)
  }

  const drawCircle = (lat: number, lng: number, rad: number) => {
    if (!L || !mapInstance.current) return

    const map = mapInstance.current
    if (circleRef.current) map.removeLayer(circleRef.current)

    circleRef.current = L.circle([lat, lng], {
      color: "#3b82f6",
      fillColor: "#60a5fa",
      fillOpacity: 0.2,
      radius: rad,
    }).addTo(map)
  }

  const handleGetLocation = () => {
    const success = (position: GeolocationPosition) => {
      const latitude = position.coords.latitude
      const longitude = position.coords.longitude

      const geoApiUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=es`

      fetch(geoApiUrl)
        .then((res) => res.json())
        .then((data) => {
          setLocationData({
            city: data.locality || "Desconocido",
            state: data.principalSubdivision || "Desconocido",
            country: data.countryName || "Desconocido",
            latitude,
            longitude,
          })
          setCoords({ lat: latitude, lng: longitude })
          initMarker(latitude, longitude)
          setStatus("")
        })
        .catch(() => {
          setStatus(t.locationError)
        })
    }

    const error = () => {
      setStatus(t.locationError)
    }

    if (!navigator.geolocation) {
      setStatus(t.noGeolocation)
    } else {
      setStatus(t.locating)
      setLocationData(null)
      navigator.geolocation.getCurrentPosition(success, error)
    }
  }

  const searchVideos = async () => {
    if (!coords) {
      alert("Por favor, obtén tu ubicación primero.")
      return
    }

    const { lat, lng } = coords
    setLoading(true)
    onVideosFound([])

    videoMarkersRef.current.forEach((marker) => {
      if (mapInstance.current) {
        mapInstance.current.removeLayer(marker)
      }
    })
    videoMarkersRef.current = []

    const result = await searchYouTubeVideos({
      lat,
      lng,
      radius: radius[0],
      keyword,
    })

    if (!result.success) {
      alert(result.message)
      setLoading(false)
      return
    }

    const geoVideos = result.videos

    onVideosFound(geoVideos)

    if (L && mapInstance.current) {
      const redIcon = new L.Icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      })

      geoVideos.forEach((v: any) => {
        const { latitude, longitude } = v.recordingDetails.location
        const marker = L.marker([latitude, longitude], { icon: redIcon })
          .addTo(mapInstance.current)
          .bindPopup(`<strong>${v.snippet.title}</strong><br>${v.snippet.channelTitle}`)
        videoMarkersRef.current.push(marker)
      })
    }

    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          {t.locationSearch}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={handleGetLocation} variant="outline" className="flex-shrink-0 bg-transparent">
            <MapPin className="w-4 h-4 mr-2" />
            {t.getLocation}
          </Button>
          {status && <p className="text-sm text-muted-foreground self-center">{status}</p>}
        </div>

        {locationData && (
          <div className="p-3 bg-muted rounded-lg text-sm">
            <p className="font-semibold">
              {locationData.city}, {locationData.state}
            </p>
            <p className="text-muted-foreground">{locationData.country}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {locationData.latitude.toFixed(4)}, {locationData.longitude.toFixed(4)}
            </p>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">
            {t.searchRadius}: {(radius[0] / 1000).toFixed(1)} km
          </label>
          <Slider value={radius} onValueChange={setRadius} min={100} max={50000} step={100} className="w-full" />
        </div>

        <div className="flex gap-2">
          <Input
            placeholder={t.keywordOptional}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchVideos()}
          />
          <Button onClick={searchVideos} disabled={loading || !coords}>
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

        <div ref={mapRef} className="h-[400px] w-full rounded-lg overflow-hidden border" />
      </CardContent>
    </Card>
  )
}
