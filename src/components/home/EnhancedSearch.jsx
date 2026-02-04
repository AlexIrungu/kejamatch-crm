import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, X, Loader2, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { searchProperties } from '../../data/properties';
import { loadGoogleMapsAPI } from '../../utils/googleMapsLoader';

const EnhancedSearch = ({ onSearchResults, showResults = false, className = "" }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyType, setPropertyType] = useState('Buy');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [autocompleteService, setAutocompleteService] = useState(null);
  const [placesService, setPlacesService] = useState(null);
  
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Initialize Google Places services
  useEffect(() => {
    const initGoogleMaps = async () => {
      try {
        await loadGoogleMapsAPI();
        if (window.google && window.google.maps && window.google.maps.places) {
          setAutocompleteService(new window.google.maps.places.AutocompleteService());

          // Create a dummy map for PlacesService (required by Google)
          const dummyMap = document.createElement('div');
          setPlacesService(new window.google.maps.places.PlacesService(dummyMap));
        }
      } catch (error) {
        console.error('Failed to load Google Maps API:', error);
      }
    };

    initGoogleMaps();
  }, []);

  // Debounce function
  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  // Fetch Google Places predictions
  useEffect(() => {
    if (!autocompleteService || !searchQuery.trim() || searchQuery.length < 2) {
      setPredictions([]);
      setShowSuggestions(searchQuery.trim() === '' && recentSearches.length > 0);
      return;
    }

    autocompleteService.getPlacePredictions(
      {
        input: searchQuery,
        componentRestrictions: { country: 'ke' }, // Restrict to Kenya
        types: ['geocode'], // Focus on geographic locations
      },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          setPredictions(results.slice(0, 6)); // Limit to 6 suggestions
          setShowSuggestions(true);
        } else {
          setPredictions([]);
          setShowSuggestions(recentSearches.length > 0);
        }
      }
    );
  }, [debouncedSearchQuery, autocompleteService]);

  // Handle search execution with debouncing
  useEffect(() => {
    if (debouncedSearchQuery && showResults && onSearchResults) {
      setIsSearching(true);
      const results = searchProperties(debouncedSearchQuery, propertyType);
      setTimeout(() => {
        onSearchResults(results, {
          query: debouncedSearchQuery,
          type: propertyType,
          location: selectedLocation
        });
        setIsSearching(false);
      }, 300);
    }
  }, [debouncedSearchQuery, propertyType, selectedLocation, showResults, onSearchResults]);

  // Save search to recent searches
  const saveRecentSearch = (query, location) => {
    const searchItem = {
      query: query || location?.name || '',
      location: location,
      timestamp: Date.now()
    };

    const updated = [searchItem, ...recentSearches.filter(item => 
      item.query !== searchItem.query
    )].slice(0, 5); // Keep only 5 recent searches

    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Get place details from prediction
  const getPlaceDetails = (placeId, description) => {
    return new Promise((resolve) => {
      if (!placesService) {
        resolve({
          name: description,
          coordinates: null
        });
        return;
      }

      placesService.getDetails(
        {
          placeId: placeId,
          fields: ['geometry', 'formatted_address', 'name']
        },
        (place, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
            resolve({
              name: place.formatted_address || description,
              coordinates: {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
              }
            });
          } else {
            resolve({
              name: description,
              coordinates: null
            });
          }
        }
      );
    });
  };

  // Handle location selection from Google Places
  const handlePredictionSelect = async (prediction) => {
    const locationData = await getPlaceDetails(prediction.place_id, prediction.description);
    
    setSearchQuery(locationData.name);
    setSelectedLocation(locationData);
    setShowSuggestions(false);
    saveRecentSearch(locationData.name, locationData);
  };

  // Handle recent search selection
  const handleRecentSearchSelect = (recentSearch) => {
    setSearchQuery(recentSearch.query);
    setSelectedLocation(recentSearch.location);
    setShowSuggestions(false);
  };

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    
    if (!searchQuery.trim()) return;

    saveRecentSearch(searchQuery, selectedLocation);
    
    if (showResults && onSearchResults) {
      // If on home page, trigger search results
      setIsSearching(true);
      const results = searchProperties(searchQuery, propertyType);
      setTimeout(() => {
        onSearchResults(results, {
          query: searchQuery,
          type: propertyType,
          location: selectedLocation
        });
        setIsSearching(false);
      }, 300);
    } else {
      // Navigate to properties page with search params
      const params = new URLSearchParams({
        search: searchQuery,
        type: propertyType.toLowerCase()
      });
      if (selectedLocation) {
        params.set('location', selectedLocation.name);
        if (selectedLocation.coordinates) {
          params.set('lat', selectedLocation.coordinates.lat);
          params.set('lng', selectedLocation.coordinates.lng);
        }
      }
      navigate(`/properties?${params.toString()}`);
    }
  };

  // Clear search
  const handleClear = () => {
    setSearchQuery('');
    setSelectedLocation(null);
    setShowSuggestions(false);
    setPredictions([]);
    if (showResults && onSearchResults) {
      onSearchResults([], { query: '', type: propertyType, location: null });
    }
  };

  // Show suggestions when input is focused
  const handleInputFocus = () => {
    if (searchQuery.trim() && predictions.length > 0) {
      setShowSuggestions(true);
    } else if (!searchQuery.trim() && recentSearches.length > 0) {
      setShowSuggestions(true);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Popular locations (fallback when Google isn't loaded)
  const popularLocations = [
    { name: 'Nairobi, Kenya', coordinates: { lat: -1.2921, lng: 36.8219 } },
    { name: 'Westlands, Nairobi', coordinates: { lat: -1.2676, lng: 36.8108 } },
    { name: 'Karen, Nairobi', coordinates: { lat: -1.3197, lng: 36.6917 } },
    { name: 'Kilimani, Nairobi', coordinates: { lat: -1.3032, lng: 36.7856 } },
  ];

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl"
      >
        <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
          {/* Property Type Selector */}
          <div className="flex gap-2">
            {['Buy', 'Rent', 'BNBs'].map((type) => (
              <motion.button
                key={type}
                type="button"
                onClick={() => setPropertyType(type)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  propertyType === type
                    ? 'bg-gradient-to-r from-secondary to-accent text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type}
              </motion.button>
            ))}
          </div>

          {/* Search Input with Google Places Autocomplete */}
          <div className="flex-1 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by location (e.g., Westlands, Karen, Nairobi)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleInputFocus}
                className="w-full px-4 py-3 pr-12 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white transition-all duration-300"
              />
              
              {/* Clear button */}
              {searchQuery && (
                <motion.button
                  type="button"
                  onClick={handleClear}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={18} />
                </motion.button>
              )}

              {/* Location icon */}
              <MapPin className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>

            {/* Autocomplete Suggestions */}
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto"
                >
                  {/* Google Places predictions */}
                  {searchQuery.trim() && predictions.length > 0 && (
                    <div>
                      <div className="px-4 py-2 text-sm font-semibold text-gray-500 bg-gray-50 border-b flex items-center gap-2">
                        <MapPin size={14} />
                        Locations in Kenya
                      </div>
                      {predictions.map((prediction) => (
                        <motion.button
                          key={prediction.place_id}
                          type="button"
                          onClick={() => handlePredictionSelect(prediction)}
                          whileHover={{ backgroundColor: '#f3f4f6' }}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-3"
                        >
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <MapPin size={14} className="text-secondary" />
                          </div>
                          <div className="flex-1">
                            <span className="text-gray-800 font-medium block">
                              {prediction.structured_formatting.main_text}
                            </span>
                            <span className="text-xs text-gray-500">
                              {prediction.structured_formatting.secondary_text}
                            </span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {/* Recent searches when no query */}
                  {!searchQuery.trim() && recentSearches.length > 0 && (
                    <div>
                      <div className="px-4 py-2 text-sm font-semibold text-gray-500 bg-gray-50 border-b flex items-center gap-2">
                        <TrendingUp size={14} />
                        Recent Searches
                      </div>
                      {recentSearches.map((recentSearch, index) => (
                        <motion.button
                          key={`recent-${index}`}
                          type="button"
                          onClick={() => handleRecentSearchSelect(recentSearch)}
                          whileHover={{ backgroundColor: '#f3f4f6' }}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-3"
                        >
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                            <MapPin size={14} className="text-gray-500" />
                          </div>
                          <div className="flex-1">
                            <span className="text-gray-800 font-medium">{recentSearch.query}</span>
                            {recentSearch.location && recentSearch.location.coordinates && (
                              <div className="text-xs text-gray-500">
                                {recentSearch.location.coordinates.lat.toFixed(4)}, {recentSearch.location.coordinates.lng.toFixed(4)}
                              </div>
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {/* Popular locations when no query and no recent searches */}
                  {!searchQuery.trim() && recentSearches.length === 0 && (
                    <div>
                      <div className="px-4 py-2 text-sm font-semibold text-gray-500 bg-gray-50 border-b flex items-center gap-2">
                        <TrendingUp size={14} />
                        Popular Locations
                      </div>
                      {popularLocations.map((location, index) => (
                        <motion.button
                          key={`popular-${index}`}
                          type="button"
                          onClick={() => {
                            setSearchQuery(location.name);
                            setSelectedLocation(location);
                            setShowSuggestions(false);
                          }}
                          whileHover={{ backgroundColor: '#f3f4f6' }}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-3"
                        >
                          <div className="w-8 h-8 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                            <TrendingUp size={14} className="text-white" />
                          </div>
                          <span className="text-gray-800 font-medium">{location.name}</span>
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {/* No results message */}
                  {searchQuery.trim() && predictions.length === 0 && (
                    <div className="px-4 py-8 text-center text-gray-500">
                      <MapPin size={24} className="mx-auto mb-2 text-gray-400" />
                      <p className="text-sm">No locations found</p>
                      <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Search Button */}
          <motion.button
            type="submit"
            disabled={isSearching}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-secondary to-accent text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
          >
            {isSearching ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Search size={20} />
            )}
            {isSearching ? 'Searching...' : 'Search'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default EnhancedSearch;