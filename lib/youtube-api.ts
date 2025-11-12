import axios from "axios"

export const BASE_URL = "https://www.googleapis.com/youtube/v3"

// Server-side only - no NEXT_PUBLIC_ prefix
const API_KEY = process.env.GOOGLE_YOUTUBE_API_KEY

export const isAPIKeyConfigured = () => {
  return !!API_KEY
}

export const fetchFromAPI = async (endpoint: string, extraParams: Record<string, any> = {}) => {
  if (!API_KEY) {
    console.error("YouTube API Key no configurada. Agrega GOOGLE_YOUTUBE_API_KEY en tu archivo .env.local")
    return { items: [] }
  }

  const options = {
    params: {
      maxResults: 40,
      key: API_KEY,
      ...extraParams,
    },
  }

  try {
    const { data } = await axios.get(`${BASE_URL}/${endpoint}`, options)
    return data
  } catch (error: any) {
    console.error("YouTube API Error:", error.response?.data || error.message)
    return { items: [] }
  }
}
