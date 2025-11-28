import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, ZoomIn, ZoomOut } from 'lucide-react';

const GoogleMaps = ({ 
  center = { lat: -1.286389, lng: 36.817223 }, // Default to Nairobi
  zoom = 13,
  markers = [],
  height = "400px",
  className = "",
  showControls = true,
  onMapClick = null,
  style = "roadmap" // roadmap, satellite, hybrid, terrain
}) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const markersRef = useRef([]);

  // Initialize Google Maps
  useEffect(() => {
    const initializeMap = () => {
      if (!window.google) {
        setError("Google Maps API not loaded");
        return;
      }

      try {
        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center,
          zoom,
          mapTypeId: style,
          disableDefaultUI: !showControls,
          zoomControl: showControls,
          mapTypeControl: showControls,
          streetViewControl: showControls,
          fullscreenControl: showControls,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ]
        });

        if (onMapClick) {
          mapInstance.addListener('click', (event) => {
            onMapClick({
              lat: event.latLng.lat(),
              lng: event.latLng.lng()
            });
          });
        }

        setMap(mapInstance);
        setIsLoaded(true);
      } catch (err) {
        setError("Failed to initialize map");
        console.error("Map initialization error:", err);
      }
    };

    // Load Google Maps API if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCLimABKx5zogyMamZo-t1w8X4wlsM2m_8&libraries=places`;
      script.async = true;
      script.onload = initializeMap;
      script.onerror = () => setError("Failed to load Google Maps API");
      document.head.appendChild(script);
    } else {
      initializeMap();
    }

    return () => {
      // Cleanup markers
      markersRef.current.forEach(marker => {
        if (marker.setMap) marker.setMap(null);
      });
      markersRef.current = [];
    };
  }, [center.lat, center.lng, zoom, style, showControls]);

  // Update markers when markers prop changes
  useEffect(() => {
    if (!map || !isLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      if (marker.setMap) marker.setMap(null);
    });
    markersRef.current = [];

    // Add new markers
    markers.forEach((markerData, index) => {
      try {
        const marker = new window.google.maps.Marker({
          position: { lat: markerData.lat, lng: markerData.lng },
          map: map,
          title: markerData.title || `Marker ${index + 1}`,
          icon: markerData.icon || {
            url: 'data:image/svg+xml;base64,' + btoa(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#DC2626"/>
                <circle cx="12" cy="9" r="2.5" fill="white"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(24, 24)
          }
        });

        // Add info window if content is provided
        if (markerData.infoWindow) {
          const infoWindow = new window.google.maps.InfoWindow({
            content: markerData.infoWindow
          });

          marker.addListener('click', () => {
            // Close all other info windows
            markersRef.current.forEach(m => {
              if (m.infoWindow && m.infoWindow !== infoWindow) {
                m.infoWindow.close();
              }
            });
            infoWindow.open(map, marker);
          });

          marker.infoWindow = infoWindow;
        }

        // Add click handler if provided
        if (markerData.onClick) {
          marker.addListener('click', () => markerData.onClick(markerData));
        }

        markersRef.current.push(marker);
      } catch (err) {
        console.error("Error creating marker:", err);
      }
    });
  }, [map, markers, isLoaded]);

  const handleZoomIn = () => {
    if (map) map.setZoom(map.getZoom() + 1);
  };

  const handleZoomOut = () => {
    if (map) map.setZoom(map.getZoom() - 1);
  };

  const handleRecenter = () => {
    if (map) {
      map.setCenter(center);
      map.setZoom(zoom);
    }
  };

  if (error) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`}
        style={{ height }}
      >
        <div className="text-center p-8">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">Map couldn't load</p>
          <p className="text-sm text-gray-400">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`}>
      <div 
        ref={mapRef} 
        style={{ height }}
        className="w-full"
      />
      
      {!isLoaded && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-100"
          style={{ height }}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading map...</p>
          </div>
        </div>
      )}

      {/* Custom Controls */}
      {showControls && isLoaded && (
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button
            onClick={handleZoomIn}
            className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-md hover:bg-white transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={16} className="text-gray-700" />
          </button>
          <button
            onClick={handleZoomOut}
            className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-md hover:bg-white transition-colors"
            title="Zoom Out"
          >
            <ZoomOut size={16} className="text-gray-700" />
          </button>
          <button
            onClick={handleRecenter}
            className="bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-md hover:bg-white transition-colors"
            title="Recenter"
          >
            <Navigation size={16} className="text-gray-700" />
          </button>
        </div>
      )}

      {/* Map Type Selector */}
      {showControls && isLoaded && (
        <div className="absolute bottom-4 left-4">
          <select
            onChange={(e) => map?.setMapTypeId(e.target.value)}
            value={style}
            className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md text-sm border-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="roadmap">Road Map</option>
            <option value="satellite">Satellite</option>
            <option value="hybrid">Hybrid</option>
            <option value="terrain">Terrain</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default GoogleMaps;