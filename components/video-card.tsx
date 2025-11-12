"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Play } from "lucide-react"
import type { YouTubeVideo } from "@/types/youtube"
import { VideoPlayer } from "./video-player"

interface VideoCardProps {
  video: YouTubeVideo
}

export function VideoCard({ video }: VideoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoId = video.id?.videoId || (video as any).id
  const thumbnail = video.snippet?.thumbnails?.medium?.url || video.snippet?.thumbnails?.high?.url

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
        <div onClick={() => setIsPlaying(true)} className="block">
          <div className="relative aspect-video">
            <img
              src={thumbnail || "/placeholder.svg"}
              alt={video.snippet?.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="bg-red-600 rounded-full p-4">
                <Play className="w-8 h-8 text-white fill-white" />
              </div>
            </div>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm line-clamp-2 mb-2">{video.snippet?.title}</h3>
            <p className="text-xs text-muted-foreground mb-1">{video.snippet?.channelTitle}</p>
            {video.recordingDetails?.location && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                <MapPin className="w-3 h-3" />
                <span>
                  {video.recordingDetails.location.latitude.toFixed(4)},{" "}
                  {video.recordingDetails.location.longitude.toFixed(4)}
                </span>
              </div>
            )}
          </CardContent>
        </div>
      </Card>

      {isPlaying && <VideoPlayer videoId={videoId} onClose={() => setIsPlaying(false)} />}
    </>
  )
}
