export interface Location {
  lat: number
  lng: number
  address?: string
}

export interface Route {
  distance: {
    text: string
    value: number
  }
  duration: {
    text: string
    value: number
  }
  steps: Array<{
    instruction: string
    distance: string
    duration: string
  }>
}

export async function calculateRoute(
  origin: Location,
  destination: Location
): Promise<Route> {
  const directionsService = new (window as any).google.maps.DirectionsService()
  
  return new Promise((resolve, reject) => {
    directionsService.route(
      {
        origin: new (window as any).google.maps.LatLng(origin.lat, origin.lng),
        destination: new (window as any).google.maps.LatLng(destination.lat, destination.lng),
        travelMode: (window as any).google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === (window as any).google.maps.DirectionsStatus.OK && result) {
          const route = result.routes[0]
          const leg = route.legs[0]
          
          const steps = leg.steps.map(step => ({
            instruction: step.instructions,
            distance: step.distance?.text || '',
            duration: step.duration?.text || ''
          }))

          resolve({
            distance: leg.distance,
            duration: leg.duration,
            steps
          })
        } else {
          reject(new Error(`Directions request failed: ${status}`))
        }
      }
    )
  })
}

export async function geocodeAddress(address: string): Promise<Location> {
  const geocoder = new (window as any).google.maps.Geocoder()
  
  return new Promise((resolve, reject) => {
    geocoder.geocode({ address }, (results, status) => {
      if (status === (window as any).google.maps.GeocoderStatus.OK && results[0]) {
        const location = results[0].geometry.location
        resolve({
          lat: location.lat(),
          lng: location.lng(),
          address: results[0].formatted_address
        })
      } else {
        reject(new Error(`Geocoding failed: ${status}`))
      }
    })
  })
}

export async function reverseGeocode(location: Location): Promise<string> {
  const geocoder = new (window as any).google.maps.Geocoder()
  
  return new Promise((resolve, reject) => {
    geocoder.geocode(
      { location: new (window as any).google.maps.LatLng(location.lat, location.lng) },
      (results, status) => {
        if (status === (window as any).google.maps.GeocoderStatus.OK && results[0]) {
          resolve(results[0].formatted_address)
        } else {
          reject(new Error(`Reverse geocoding failed: ${status}`))
        }
      }
    )
  })
}

export function getCurrentLocation(): Promise<Location> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`))
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  })
}

export function calculateDistance(
  point1: Location,
  point2: Location
): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (point2.lat - point1.lat) * Math.PI / 180
  const dLng = (point2.lng - point1.lng) * Math.PI / 180
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c
  
  return distance
}

export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`
  } else {
    return `${distance.toFixed(1)} km`
  }
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else {
    return `${minutes}m`
  }
}
