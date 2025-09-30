# GeoTube - Location-Based Video Discovery Platform

GeoTube is a comprehensive web application that integrates YouTube's video content with geolocation services to provide location-based video discovery. Users can explore videos from their current location, search for content in specific areas worldwide, and discover popular nearby places.

## Features

### 🌍 Location-Based Video Discovery
- **Automatic Location Detection**: Uses browser geolocation to automatically detect your current position
- **Manual Location Selection**: Search and select any location worldwide for video discovery
- **Real-time Video Streaming**: Direct integration with YouTube for seamless video playback

### 🎯 Smart Search & Recommendations
- **Custom Video Search**: Search for specific content in any location globally
- **Popular Places Suggestions**: Discover trending locations within 100m-1km radius
- **Category Filtering**: Filter videos by travel, food, events, culture, and nature
- **Distance-Based Recommendations**: Get suggestions based on proximity to popular venues

### 🌐 Multi-Language Support
- **10+ Language Support**: Interface available in Spanish, English, French, German, Italian, Portuguese, Chinese, Japanese, Korean, and Arabic
- **Google Translate Integration**: Automatic translation of video titles and descriptions
- **Persistent Language Preferences**: Your language choice is saved for future sessions

### 📱 Responsive Design
- **Mobile-First Approach**: Optimized for mobile devices and tablets
- **Cross-Platform Compatibility**: Works seamlessly on all modern browsers
- **Intuitive Navigation**: Easy-to-use interface with clear navigation between features

## Technology Stack

### Frontend
- **React 18** with TypeScript for component architecture
- **Tailwind CSS** for responsive styling and theming
- **Lucide React** for consistent iconography
- **Browser Geolocation API** for location services

### Backend
- **Supabase Edge Functions** with Hono web framework
- **YouTube Data API v3** for video content and search
- **Google Maps Geocoding API** for location services
- **Google Places API** for popular location discovery
- **Google Translate API** for multi-language support

### Architecture
- **Three-tier architecture**: Frontend → Server → External APIs
- **Secure API key management** through Supabase environment variables
- **CORS-enabled endpoints** for cross-origin requests
- **Error handling and logging** for robust operation

## API Requirements

To run GeoTube, you need the following API keys:

### 1. YouTube Data API v3
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Enable YouTube Data API v3
- Create credentials and copy the API key
- **Required for**: Video search and content retrieval

### 2. Google Maps APIs
- Enable the following APIs in Google Cloud Console:
  - **Geocoding API**: For address to coordinates conversion
  - **Places API**: For popular location discovery
- **Required for**: Location search and place recommendations

### 3. Google Translate API
- Enable Cloud Translation API in Google Cloud Console
- **Required for**: Multi-language interface and content translation

## Setup Instructions

### 1. API Key Configuration
When you first run the application, you'll be prompted to enter your API keys:
- **YOUTUBE_API_KEY**: Your YouTube Data API v3 key
- **GOOGLE_MAPS_API_KEY**: Your Google Maps API key (with Geocoding and Places enabled)
- **GOOGLE_TRANSLATE_API_KEY**: Your Google Translate API key

### 2. Location Permissions
- Allow location access when prompted by your browser
- This enables automatic location detection for local video discovery

### 3. Language Selection
- Navigate to Preferences to select your preferred language
- The interface and video content will be translated accordingly

## Usage Guide

### Home View
1. **Automatic Setup**: App automatically detects your location and loads local videos
2. **Video Playback**: Click on any video thumbnail to start watching
3. **Popular Places**: Browse nearby attractions and locations with video content

### Location View
1. **Current Location**: View and manage your detected location
2. **Manual Search**: Search for any city, landmark, or address worldwide
3. **Location Switch**: Toggle between current and manually selected locations

### Search View
1. **Custom Queries**: Search for specific video content (e.g., "street food", "concerts")
2. **Global Search**: Combine keywords with any location worldwide
3. **Advanced Filters**: Adjust search radius (1-50km) and content categories
4. **Results Grid**: Browse search results in an organized grid layout

### Preferences View
1. **Language Selection**: Choose from 10+ supported languages
2. **Auto-Translation**: Enable translation of video titles and descriptions
3. **Settings Persistence**: Your preferences are saved automatically

## Features in Detail

### Smart Location Detection
- Uses high-accuracy GPS when available
- Fallback to network-based location
- Manual override for privacy-conscious users
- Address resolution for human-readable locations

### Intelligent Video Curation
- Location-aware search algorithms
- Category-based filtering system
- Popularity-based ranking
- Freshness and relevance scoring

### Popular Places Discovery
- Real-time Google Places integration
- Distance-based filtering (100m - 1km)
- Category diversity (restaurants, attractions, parks, shopping, entertainment)
- User rating and popularity metrics

### Advanced Search Capabilities
- Multi-keyword search support
- Location + content combination queries
- Radius-based geographic filtering
- Category-specific content discovery

## Privacy & Security

- **API Key Protection**: All keys stored securely in Supabase environment
- **No Personal Data Storage**: Location data is processed in real-time, not stored
- **Optional Location Sharing**: Users can choose manual location instead of GPS
- **Secure HTTPS Communication**: All API calls encrypted in transit

## Browser Compatibility

- **Chrome 60+**: Full feature support
- **Firefox 55+**: Full feature support  
- **Safari 12+**: Full feature support
- **Edge 79+**: Full feature support
- **Mobile Browsers**: Optimized for iOS Safari and Android Chrome

## Troubleshooting

### Location Not Detected
1. Ensure location permissions are enabled in browser
2. Try refreshing the page and allowing location access
3. Use manual location search as alternative

### Videos Not Loading
1. Verify YouTube API key is valid and active
2. Check if YouTube Data API v3 is enabled
3. Ensure sufficient API quota remaining

### Translation Not Working
1. Confirm Google Translate API is enabled
2. Verify API key has translation permissions
3. Check language code compatibility

### Popular Places Not Showing
1. Verify Google Places API is enabled
2. Confirm Maps API key has Places API access
3. Try expanding search radius

## Support

GeoTube is designed for educational and prototyping purposes. For production use, ensure proper API usage monitoring and implement additional security measures as needed.

## API Usage Notes

- **YouTube API**: 10,000 units per day (free tier)
- **Google Maps APIs**: $200 monthly credit (includes substantial free usage)
- **Google Translate**: 500,000 characters per month (free tier)

Monitor your API usage through respective Google Cloud Console dashboards to avoid unexpected charges.