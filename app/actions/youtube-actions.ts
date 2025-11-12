"use server"

import { fetchFromAPI } from "@/lib/youtube-api"

export async function searchYouTubeVideos(params: {
  lat: number
  lng: number
  radius: number
  keyword?: string
}) {
  const { lat, lng, radius, keyword } = params

  try {
    const searchRes = await fetchFromAPI("search", {
      part: "snippet",
      type: "video",
      location: `${lat},${lng}`,
      locationRadius: `${radius / 1000}km`,
      q: keyword || "travel",
    })

    if (!searchRes.items || searchRes.items.length === 0) {
      return { success: false, videos: [], message: "No se encontraron videos en esta ubicación." }
    }

    const videoIds = searchRes.items.map((v: any) => v.id.videoId).join(",")

    const videosRes = await fetchFromAPI("videos", {
      part: "snippet,recordingDetails",
      id: videoIds,
    })

    const geoVideos = videosRes.items.filter((v: any) => v.recordingDetails?.location)

    return { success: true, videos: geoVideos, message: "" }
  } catch (error: any) {
    console.error("Error searching YouTube videos:", error)
    return { success: false, videos: [], message: "Error al buscar videos. Verifica tu API key o cuota." }
  }
}

export async function searchVideos(query: string) {
  try {
    const searchRes = await fetchFromAPI("search", {
      part: "snippet",
      type: "video",
      q: query || "trending",
      maxResults: 20,
    })

    if (!searchRes.items || searchRes.items.length === 0) {
      return { success: false, videos: [], message: "No videos found." }
    }

    return { success: true, videos: searchRes.items, message: "" }
  } catch (error: any) {
    console.error("Error searching videos:", error)
    return { success: false, videos: [], message: "Error searching videos." }
  }
}

export async function getTrendingVideos() {
  try {
    const videosRes = await fetchFromAPI("videos", {
      part: "snippet",
      chart: "mostPopular",
      regionCode: "US",
      maxResults: 20,
    })

    if (!videosRes.items || videosRes.items.length === 0) {
      return { success: false, videos: [], message: "No trending videos found." }
    }

    return { success: true, videos: videosRes.items, message: "" }
  } catch (error: any) {
    console.error("Error getting trending videos:", error)
    return { success: false, videos: [], message: "Error getting trending videos." }
  }
}
