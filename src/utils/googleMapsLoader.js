// src/utils/googleMapsLoader.js
/**
 * Google Maps API Loader Utility
 * Ensures the script loads only once with all required libraries
 */

let isLoading = false;
let isLoaded = false;
let loadPromise = null;

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY;

export const loadGoogleMapsAPI = () => {
  // Already loaded
  if (isLoaded && window.google?.maps) {
    return Promise.resolve(window.google.maps);
  }

  // Currently loading
  if (isLoading && loadPromise) {
    return loadPromise;
  }

  // Start loading
  isLoading = true;
  loadPromise = new Promise((resolve, reject) => {
    // Check if already loaded by another source
    if (window.google?.maps?.places) {
      isLoaded = true;
      isLoading = false;
      resolve(window.google.maps);
      return;
    }

    // Remove any existing Google Maps scripts to avoid conflicts
    const existingScripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
    existingScripts.forEach(script => script.remove());

    // Create callback function
    const callbackName = `googleMapsCallback_${Date.now()}`;
    window[callbackName] = () => {
      isLoaded = true;
      isLoading = false;
      delete window[callbackName];
      resolve(window.google.maps);
    };

    // Create and append script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry&callback=${callbackName}`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      isLoading = false;
      delete window[callbackName];
      reject(new Error('Failed to load Google Maps API'));
    };

    document.head.appendChild(script);
  });

  return loadPromise;
};

export const isGoogleMapsLoaded = () => isLoaded && window.google?.maps;

export default loadGoogleMapsAPI;
