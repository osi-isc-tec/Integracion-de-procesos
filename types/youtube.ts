export interface YouTubeVideo {
  id: {
    videoId: string
  }
  snippet: {
    title: string
    description: string
    channelTitle: string
    thumbnails: {
      default: { url: string }
      medium: { url: string }
      high: { url: string }
    }
    publishedAt: string
  }
  recordingDetails?: {
    location: {
      latitude: number
      longitude: number
    }
  }
}

export interface LocationData {
  city: string
  state: string
  country: string
  latitude: number
  longitude: number
}
