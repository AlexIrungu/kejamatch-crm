// src/components/common/GoogleMaps.jsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MapPin, Navigation, ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react';
import loadGoogleMapsAPI from '../../utils/googleMapsLoader';

const GoogleMaps = ({
  center = { lat: -1.286389, lng: 36.817223 },
  zoom = 13,
  markers = [],
  height = "400px",
  className = "",
  showControls = true,
  onMapClick = null,
  onMarkerClick = null,
  selectedMarkerId = null,
  fitBounds = false,
  style = "roadmap"
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Custom map styles - clean, modern look
  const mapStyles = [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "transit",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#e9e9e9" }]
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9e9e9e" }]
    }
  ];

  // Initialize map
  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      try {
        await loadGoogleMapsAPI();

        if (!isMounted || !mapRef.current) return;

        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center,
          zoom,
          mapTypeId: style,
          disableDefaultUI: true,
          zoomControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: mapStyles,
          gestureHandling: 'greedy'
        });

        if (onMapClick) {
          mapInstance.addListener('click', (event) => {
            onMapClick({
              lat: event.latLng.lat(),
              lng: event.latLng.lng()
            });
          });
        }

        mapInstanceRef.current = mapInstance;
        setIsLoaded(true);
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load map');
        }
      }
    };

    initMap();

    return () => {
      isMounted = false;
    };
  }, []);

  // Update center when prop changes
  useEffect(() => {
    if (mapInstanceRef.current && isLoaded) {
      mapInstanceRef.current.setCenter(center);
    }
  }, [center.lat, center.lng, isLoaded]);

  // Update markers
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      if (marker.setMap) marker.setMap(null);
    });
    markersRef.current = [];

    if (markers.length === 0) return;

    const bounds = new window.google.maps.LatLngBounds();

    markers.forEach((markerData) => {
      const isSelected = selectedMarkerId && markerData.id === selectedMarkerId;

      // Create custom marker icon - use encodeURIComponent for Unicode support
      const svgIcon = `
        <svg width="36" height="48" viewBox="0 0 36 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 30 18 30s18-16.5 18-30c0-9.94-8.06-18-18-18z" fill="${isSelected ? '#ff6b35' : '#1e3a5f'}"/>
          <circle cx="18" cy="18" r="8" fill="white"/>
          <circle cx="18" cy="18" r="3" fill="${isSelected ? '#ff6b35' : '#1e3a5f'}"/>
        </svg>
      `;
      const markerIcon = {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgIcon)}`,
        scaledSize: new window.google.maps.Size(36, 48),
        anchor: new window.google.maps.Point(18, 48)
      };

      const marker = new window.google.maps.Marker({
        position: { lat: markerData.lat, lng: markerData.lng },
        map: mapInstanceRef.current,
        title: markerData.title || '',
        icon: markerIcon,
        animation: isSelected ? window.google.maps.Animation.BOUNCE : null,
        zIndex: isSelected ? 1000 : 1
      });

      // Stop bouncing after 2 bounces
      if (isSelected) {
        setTimeout(() => marker.setAnimation(null), 1400);
      }

      bounds.extend(marker.getPosition());

      // Info window
      if (markerData.infoWindow || markerData.title) {
        const infoContent = markerData.infoWindow || `
          <div style="padding: 8px; max-width: 200px;">
            <h4 style="margin: 0 0 4px; font-weight: 600; color: #1e3a5f;">${markerData.title}</h4>
            ${markerData.price ? `<p style="margin: 0; color: #ff6b35; font-weight: 600;">KES ${markerData.price.toLocaleString()}</p>` : ''}
          </div>
        `;

        const infoWindow = new window.google.maps.InfoWindow({
          content: infoContent
        });

        marker.addListener('click', () => {
          // Close all other info windows
          markersRef.current.forEach(m => {
            if (m.infoWindow) m.infoWindow.close();
          });

          infoWindow.open(mapInstanceRef.current, marker);

          if (onMarkerClick) {
            onMarkerClick(markerData);
          }
        });

        marker.infoWindow = infoWindow;

        // Auto-open selected marker info
        if (isSelected) {
          infoWindow.open(mapInstanceRef.current, marker);
        }
      }

      markersRef.current.push(marker);
    });

    // Fit bounds if requested and multiple markers
    if (fitBounds && markers.length > 1) {
      mapInstanceRef.current.fitBounds(bounds, { padding: 50 });
    } else if (fitBounds && markers.length === 1) {
      mapInstanceRef.current.setCenter({ lat: markers[0].lat, lng: markers[0].lng });
      mapInstanceRef.current.setZoom(15);
    }
  }, [markers, selectedMarkerId, isLoaded, fitBounds, onMarkerClick]);

  const handleZoomIn = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() + 1);
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() - 1);
    }
  }, []);

  const handleRecenter = useCallback(() => {
    if (mapInstanceRef.current && markers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      markers.forEach(m => bounds.extend({ lat: m.lat, lng: m.lng }));
      mapInstanceRef.current.fitBounds(bounds, { padding: 50 });
    } else if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter(center);
      mapInstanceRef.current.setZoom(zoom);
    }
  }, [center, zoom, markers]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}
        style={{ height }}
      >
        <div className="text-center p-8">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 font-medium mb-2">Map couldn't load</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-lg overflow-hidden bg-gray-100 ${className} ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`}
      style={isFullscreen ? {} : { height }}
    >
      <div
        ref={mapRef}
        className="w-full h-full"
        style={isFullscreen ? { height: '100vh' } : { height }}
      />

      {/* Loading state */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-primary rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm text-gray-500">Loading map...</p>
          </div>
        </div>
      )}

      {/* Controls */}
      {showControls && isLoaded && (
        <>
          {/* Zoom controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-1">
            <button
              onClick={handleZoomIn}
              className="w-8 h-8 bg-white shadow-md rounded flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="Zoom in"
            >
              <ZoomIn size={16} className="text-gray-700" />
            </button>
            <button
              onClick={handleZoomOut}
              className="w-8 h-8 bg-white shadow-md rounded flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="Zoom out"
            >
              <ZoomOut size={16} className="text-gray-700" />
            </button>
          </div>

          {/* Other controls */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              onClick={handleRecenter}
              className="w-8 h-8 bg-white shadow-md rounded flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label="Recenter map"
            >
              <Navigation size={16} className="text-gray-700" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="w-8 h-8 bg-white shadow-md rounded flex items-center justify-center hover:bg-gray-50 transition-colors"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 size={16} className="text-gray-700" />
              ) : (
                <Maximize2 size={16} className="text-gray-700" />
              )}
            </button>
          </div>

          {/* Marker count badge */}
          {markers.length > 0 && (
            <div className="absolute top-4 left-4 bg-white shadow-md rounded-full px-3 py-1">
              <span className="text-sm font-medium text-gray-700">
                {markers.length} {markers.length === 1 ? 'property' : 'properties'}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GoogleMaps;
