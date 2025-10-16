import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js';
import * as kv from './kv_store.tsx';

const app = new Hono();

// CORS and logging middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

app.use('*', logger(console.log));

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Geocoding endpoint - reverse geocode coordinates to address
app.post('/make-server-328686db/api/geocode', async (c) => {
  try {
    const { lat, lng } = await c.req.json();
    const GOOGLE_MAPS_API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY');
    
    if (!GOOGLE_MAPS_API_KEY) {
      return c.json({ error: 'Google Maps API key not configured' }, 500);
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      return c.json({ address: data.results[0].formatted_address });
    } else {
      return c.json({ address: `${lat.toFixed(4)}, ${lng.toFixed(4)}` });
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    return c.json({ error: 'Failed to geocode location' }, 500);
  }
});

// Location search endpoint - geocode address to coordinates
app.post('/make-server-328686db/api/geocode/search', async (c) => {
  try {
    const { query } = await c.req.json();
    const GOOGLE_MAPS_API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY');
    
    if (!GOOGLE_MAPS_API_KEY) {
      return c.json({ error: 'Google Maps API key not configured' }, 500);
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      const results = data.results.slice(0, 5).map((result: any) => ({
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
        address: result.formatted_address
      }));
      return c.json({ results });
    } else {
      return c.json({ results: [] });
    }
  } catch (error) {
    console.error('Location search error:', error);
    return c.json({ error: 'Failed to search locations' }, 500);
  }
});

// YouTube search endpoint - search for videos by location
app.post('/make-server-328686db/api/youtube/search', async (c) => {
  try {
    const { location, language } = await c.req.json();
    const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY');
    
    if (!YOUTUBE_API_KEY) {
      return c.json({ error: 'YouTube API key not configured' }, 500);
    }

    // Get location name for search query
    const GOOGLE_MAPS_API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY');
    let searchQuery = 'local videos';
    
    if (GOOGLE_MAPS_API_KEY && location.lat && location.lng) {
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=${GOOGLE_MAPS_API_KEY}`;
      const geocodeResponse = await fetch(geocodeUrl);
      const geocodeData = await geocodeResponse.json();
      
      if (geocodeData.status === 'OK' && geocodeData.results.length > 0) {
        const address = geocodeData.results[0].formatted_address;
        const parts = address.split(',');
        searchQuery = parts[0].trim(); // Use first part as search query
      }
    }

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&type=video&maxResults=20&key=${YOUTUBE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.items) {
      const videos = data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        location: location
      }));
      
      return c.json({ videos });
    } else {
      return c.json({ videos: [] });
    }
  } catch (error) {
    console.error('YouTube search error:', error);
    return c.json({ error: 'Failed to search YouTube videos' }, 500);
  }
});

// Custom YouTube search endpoint
app.post('/make-server-328686db/api/youtube/custom-search', async (c) => {
  try {
    const { query, location, radius, category, language } = await c.req.json();
    const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY');
    
    if (!YOUTUBE_API_KEY) {
      return c.json({ error: 'YouTube API key not configured' }, 500);
    }

    // Enhance search query with location and category
    let enhancedQuery = query;
    if (location.address) {
      const locationParts = location.address.split(',');
      enhancedQuery += ` ${locationParts[0].trim()}`;
    }
    
    if (category !== 'all') {
      enhancedQuery += ` ${category}`;
    }

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(enhancedQuery)}&type=video&maxResults=25&key=${YOUTUBE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.items) {
      const videos = data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        location: location
      }));
      
      return c.json({ videos });
    } else {
      return c.json({ videos: [] });
    }
  } catch (error) {
    console.error('Custom YouTube search error:', error);
    return c.json({ error: 'Failed to search YouTube videos' }, 500);
  }
});

// Popular places endpoint
app.post('/make-server-328686db/api/places/popular', async (c) => {
  try {
    const { location, radius, language } = await c.req.json();
    const GOOGLE_MAPS_API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY');
    
    if (!GOOGLE_MAPS_API_KEY) {
      return c.json({ error: 'Google Maps API key not configured' }, 500);
    }

    // Search for nearby places using Google Places API
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=${radius}&type=point_of_interest&key=${GOOGLE_MAPS_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      const places = data.results.slice(0, 10).map((place: any, index: number) => {
        const distance = calculateDistance(
          location.lat,
          location.lng,
          place.geometry.location.lat,
          place.geometry.location.lng
        );

        return {
          id: place.place_id,
          name: place.name,
          location: {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
            address: place.vicinity
          },
          distance: Math.round(distance),
          type: place.types[0] || 'attraction',
          popularity: place.rating ? Math.round(place.rating * 20) : 50 + Math.random() * 50,
          description: `Popular ${place.types[0]?.replace('_', ' ') || 'place'} in the area`
        };
      }).filter((place: any) => place.distance >= 100 && place.distance <= radius);

      return c.json({ places });
    } else {
      return c.json({ places: [] });
    }
  } catch (error) {
    console.error('Popular places error:', error);
    return c.json({ error: 'Failed to fetch popular places' }, 500);
  }
});

// Translation endpoint
app.post('/make-server-328686db/api/translate', async (c) => {
  try {
    const { text, to, from } = await c.req.json();
    const GOOGLE_TRANSLATE_API_KEY = Deno.env.get('GOOGLE_TRANSLATE_API_KEY');
    
    if (!GOOGLE_TRANSLATE_API_KEY) {
      return c.json({ error: 'Google Translate API key not configured' }, 500);
    }

    const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_TRANSLATE_API_KEY}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        target: to,
        source: from,
        format: 'text'
      })
    });

    const data = await response.json();
    
    if (data.data && data.data.translations) {
      return c.json({ 
        translatedText: data.data.translations[0].translatedText,
        success: true 
      });
    } else {
      return c.json({ translatedText: text, success: false });
    }
  } catch (error) {
    console.error('Translation error:', error);
    return c.json({ error: 'Failed to translate text' }, 500);
  }
});

// Health check endpoint
app.get('/make-server-328686db/health', (c) => {
  return c.json({ status: 'OK', timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);