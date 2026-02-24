'use client'

import { useEffect, useRef, useState } from 'react'

interface MapProps {
  center?: { lat: number; lng: number }
  zoom?: number
  markers?: Array<{
    position: { lat: number; lng: number }
    title?: string
    icon?: string
  }>
  onMapClick?: (event: any) => void
  className?: string
}

declare global {
  interface Window {
    google: any
  }
}

declare const google: any

export function GoogleMap({ 
  center = { lat: -6.2088, lng: 106.8456 }, // Jakarta coordinates
  zoom = 13,
  markers = [],
  onMapClick,
  className = "map-container"
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [mapMarkers, setMapMarkers] = useState<any[]>([])

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (!window.google) {
        const script = document.createElement('script')
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
        script.async = true
        script.defer = true
        script.onload = initializeMap
        document.head.appendChild(script)
      } else {
        initializeMap()
      }
    }

    const initializeMap = () => {
      if (!mapRef.current) return

      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      })

      setMap(mapInstance)

      if (onMapClick) {
        mapInstance.addListener('click', onMapClick)
      }
    }

    loadGoogleMaps()

    return () => {
      // Cleanup markers
      mapMarkers.forEach(marker => marker.setMap(null))
    }
  }, [])

  useEffect(() => {
    if (!map) return

    // Clear existing markers
    mapMarkers.forEach(marker => marker.setMap(null))

    // Add new markers
    const newMarkers = markers.map(markerData => {
      const marker = new window.google.maps.Marker({
        position: markerData.position,
        map: map,
        title: markerData.title,
        icon: markerData.icon || {
          url: '/icons/map-marker.png',
          scaledSize: new window.google.maps.Size(32, 32)
        }
      })

      if (markerData.title) {
        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div class="p-2"><strong>${markerData.title}</strong></div>`
        })

        marker.addListener('click', () => {
          infoWindow.open(map, marker)
        })
      }

      return marker
    })

    setMapMarkers(newMarkers)
  }, [map, markers])

  return <div ref={mapRef} className={className} />
}

export function GoogleMapAutocomplete({
  onPlaceSelect,
  placeholder = "Enter location",
  className = ""
}: {
  onPlaceSelect: (place: any) => void
  placeholder?: string
  className?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteRef = useRef<any>(null)

  useEffect(() => {
    const initializeAutocomplete = () => {
      if (!inputRef.current || !window.google) return

      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ['establishment', 'geocode'],
          fields: ['place_id', 'geometry', 'name', 'formatted_address']
        }
      )

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace()
        if (place) {
          onPlaceSelect(place)
        }
      })
    }

    if (!window.google) {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = initializeAutocomplete
      document.head.appendChild(script)
    } else {
      initializeAutocomplete()
    }
  }, [onPlaceSelect])

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder={placeholder}
      className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    />
  )
}
