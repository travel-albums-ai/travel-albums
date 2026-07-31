import { useFetch_TakeoutAirports } from '@/hooks/remote/useFetch_TakeoutAirports';
import { useMemo } from 'react';

export interface PhotoWithLatLong {
  latitude?: number
  longitude?: number
  [key: string]: any
}

export function getNearbyPlacesFromPhotos(
  photos: PhotoWithLatLong[],
  distanceThreshold = 2,
  airports: any
): string[] {
  const extractLatLong = photos.map(photo => ({
    latitude: photo.latitude,
    longitude: photo.longitude,
  }))

  const placesNearCities = extractLatLong.map(({ latitude, longitude }) => {
    if (typeof latitude !== 'number' || typeof longitude !== 'number') return null
    const nearbyAirport = airports?.find(airport => {
      const distance = Math.sqrt(
        Math.pow(airport.lat - latitude, 2) + Math.pow(airport.lon - longitude, 2)
      )
      return distance < distanceThreshold
    })
    return nearbyAirport ? `${nearbyAirport.name}, ${nearbyAirport.country}` : latitude && longitude ? `Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}` : null
  }).filter(Boolean)

  return Array.from(new Set(placesNearCities)) as string[]
}

export function useNearbyPlacesFromPhotos(
  photos: PhotoWithLatLong[],
  distanceThreshold = 1
): string[] {
  const { data: airports } = useFetch_TakeoutAirports()
  const allAirports = airports?.metadata?.data?.airports

  return useMemo(
    () => getNearbyPlacesFromPhotos(photos, distanceThreshold, allAirports),
    [photos, distanceThreshold, allAirports]
  )
}
