import React, { useState, useEffect, useMemo, useCallback } from 'react';
import SEO from '../components/common/SEO';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import {
  MapPin,
  ChevronDown,
  Search,
  Grid3X3,
  List,
  SlidersHorizontal,
  ArrowUpDown,
  Home,
  Building,
  X,
  Map as MapIcon,
  LayoutList
} from 'lucide-react';

// Import components and services
import PropertyCard from '../components/properties/PropertyCard';
import GoogleMaps from '../components/common/GoogleMaps';
import propertyService from '../services/propertyService';

// Kenya locations data for search autocomplete
const kenyanLocations = [
  // Nairobi Areas
  { name: 'Nairobi', coordinates: { lat: -1.2921, lng: 36.8219 } },
  { name: 'Westlands', coordinates: { lat: -1.2676, lng: 36.8108 } },
  { name: 'Karen', coordinates: { lat: -1.3197, lng: 36.6917 } },
  { name: 'Kilimani', coordinates: { lat: -1.3032, lng: 36.7856 } },
  { name: 'Kileleshwa', coordinates: { lat: -1.2696, lng: 36.7809 } },
  { name: 'Lavington', coordinates: { lat: -1.2833, lng: 36.7667 } },
  { name: 'Runda', coordinates: { lat: -1.2167, lng: 36.8167 } },
  { name: 'Muthaiga', coordinates: { lat: -1.2500, lng: 36.8167 } },
  { name: 'Parklands', coordinates: { lat: -1.2500, lng: 36.8500 } },
  { name: 'South B', coordinates: { lat: -1.3167, lng: 36.8333 } },
  { name: 'South C', coordinates: { lat: -1.3333, lng: 36.8333 } },
  { name: 'Donholm', coordinates: { lat: -1.2833, lng: 36.9000 } },
  { name: 'Kasarani', coordinates: { lat: -1.2167, lng: 36.9000 } },
  { name: 'Thika Road', coordinates: { lat: -1.2000, lng: 36.8833 } },
  { name: 'Ngong Road', coordinates: { lat: -1.3167, lng: 36.7667 } },
  { name: 'Langata', coordinates: { lat: -1.3667, lng: 36.7667 } },

  // Mombasa Areas
  { name: 'Mombasa', coordinates: { lat: -4.0435, lng: 39.6682 } },
  { name: 'Nyali', coordinates: { lat: -4.0167, lng: 39.7000 } },
  { name: 'Bamburi', coordinates: { lat: -3.9833, lng: 39.7167 } },
  { name: 'Diani', coordinates: { lat: -4.3167, lng: 39.5833 } },
  { name: 'Malindi', coordinates: { lat: -3.2167, lng: 40.1167 } },

  // Other Major Towns
  { name: 'Kisumu', coordinates: { lat: -0.1022, lng: 34.7617 } },
  { name: 'Nakuru', coordinates: { lat: -0.3031, lng: 36.0800 } },
  { name: 'Eldoret', coordinates: { lat: 0.5143, lng: 35.2698 } },
  { name: 'Kapsoya, Eldoret', coordinates: { lat: 0.5143, lng: 35.2698 } },
  { name: 'Thika', coordinates: { lat: -1.0333, lng: 37.0833 } },
  { name: 'Machakos', coordinates: { lat: -1.5167, lng: 37.2667 } },
  { name: 'Meru', coordinates: { lat: 0.0500, lng: 37.6500 } },
  { name: 'Embu', coordinates: { lat: -0.5333, lng: 37.4500 } },
  { name: 'Kitale', coordinates: { lat: 1.0167, lng: 35.0000 } },
  { name: 'Garissa', coordinates: { lat: -0.4536, lng: 39.6401 } },
  { name: 'Kakamega', coordinates: { lat: 0.2833, lng: 34.7500 } },
  { name: 'Kericho', coordinates: { lat: -0.3667, lng: 35.2833 } },
  { name: 'Nyeri', coordinates: { lat: -0.4167, lng: 36.9500 } }
];

// Format price helper
const formatPrice = (price, type) => {
  if (type === 'Rent') {
    if (price >= 1000000) {
      return `KES ${(price / 1000000).toFixed(1)}M`.replace('.0M', 'M') + '/month';
    } else if (price >= 1000) {
      return `KES ${(price / 1000).toFixed(0)}K/month`;
    }
    return `KES ${price.toLocaleString()}/month`;
  } else {
    if (price >= 1000000) {
      return `KES ${(price / 1000000).toFixed(1)}M`.replace('.0M', 'M');
    } else if (price >= 1000) {
      return `KES ${(price / 1000).toFixed(0)}K`;
    }
    return `KES ${price.toLocaleString()}`;
  }
};

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');
  const [priceRange, setPriceRange] = useState([0, 100000000]);
  const [selectedCategories, setSelectedCategories] = useState({
    houses: false,
    apartments: false,
    land: false,
    commercial: false
  });
  const [bedroomFilter, setBedroomFilter] = useState('');
  const [bathroomFilter, setBathroomFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // UI states
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState('split'); // 'split', 'list', 'map'
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: -1.2921, lng: 36.8219 });

  // Fetch properties from API
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await propertyService.searchProperties({});
      setProperties(response.data || []);
      setFilteredProperties(response.data || []);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update location suggestions based on search
  useEffect(() => {
    if (searchQuery.trim() && searchQuery.length > 1) {
      const filtered = kenyanLocations.filter(location =>
        location.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      setLocationSuggestions(filtered);
      setShowLocationSuggestions(filtered.length > 0);
    } else {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
    }
  }, [searchQuery]);

  // Apply all filters
  const applyFilters = useCallback(() => {
    let filtered = [...properties];

    // Search query filter (title, location)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(property =>
        property.title?.toLowerCase().includes(query) ||
        property.location?.city?.toLowerCase().includes(query) ||
        property.location?.address?.toLowerCase().includes(query) ||
        property.location?.county?.toLowerCase().includes(query)
      );
    }

    // Type filter
    if (selectedType && selectedType !== 'All') {
      filtered = filtered.filter(property => property.type === selectedType);
    }

    // Category filter
    const activeCategoryKeys = Object.keys(selectedCategories).filter(
      key => selectedCategories[key]
    );
    if (activeCategoryKeys.length > 0) {
      filtered = filtered.filter(property =>
        activeCategoryKeys.includes(property.category)
      );
    }

    // Price range filter
    filtered = filtered.filter(property =>
      property.price >= priceRange[0] && property.price <= priceRange[1]
    );

    // Bedroom filter
    if (bedroomFilter) {
      const bedCount = parseInt(bedroomFilter);
      filtered = filtered.filter(property => {
        if (bedroomFilter === '5+') {
          return property.beds >= 5;
        }
        return property.beds === bedCount;
      });
    }

    // Bathroom filter
    if (bathroomFilter) {
      const bathCount = parseInt(bathroomFilter);
      filtered = filtered.filter(property => {
        if (bathroomFilter === '3+') {
          return property.baths >= 3;
        }
        return property.baths === bathCount;
      });
    }

    // Sort properties
    filtered = sortProperties(filtered, sortBy);

    setFilteredProperties(filtered);
  }, [properties, selectedType, selectedCategories, priceRange, bedroomFilter, bathroomFilter, sortBy, searchQuery]);

  // Sort properties
  const sortProperties = (props, sortType) => {
    const sorted = [...props];
    switch (sortType) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'beds':
        return sorted.sort((a, b) => b.beds - a.beds);
      case 'newest':
      default:
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };

  // Apply filters when any filter changes
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Handle search
  const handleSearch = () => {
    applyFilters();
    setShowLocationSuggestions(false);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedType('');
    setPriceRange([0, 100000000]);
    setSelectedCategories({
      houses: false,
      apartments: false,
      land: false,
      commercial: false
    });
    setBedroomFilter('');
    setBathroomFilter('');
    setSortBy('newest');
    setSearchParams({});
  };

  // Handle location suggestion click
  const handleLocationSelect = (location) => {
    setSearchQuery(location.name);
    setShowLocationSuggestions(false);
    setMapCenter(location.coordinates);
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedType) count++;
    if (Object.values(selectedCategories).some(v => v)) count++;
    if (priceRange[0] > 0 || priceRange[1] < 100000000) count++;
    if (bedroomFilter) count++;
    if (bathroomFilter) count++;
    return count;
  };

  // Handle property card hover/click for map sync
  const handlePropertyHover = (propertyId) => {
    setSelectedPropertyId(propertyId);
  };

  // Handle marker click on map
  const handleMarkerClick = (markerData) => {
    setSelectedPropertyId(markerData.id);
    // Scroll to property card
    const element = document.getElementById(`property-${markerData.id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Generate map markers from filtered properties
  // Coordinates can be at property.coordinates OR property.location.coordinates
  const mapMarkers = useMemo(() => {
    return filteredProperties
      .filter(property => {
        const coords = property.coordinates || property.location?.coordinates;
        return coords?.lat && coords?.lng;
      })
      .map(property => {
        const coords = property.coordinates || property.location?.coordinates;
        return {
          id: property._id || property.id,
          lat: coords.lat,
          lng: coords.lng,
          title: property.title,
          price: property.price,
          infoWindow: `
            <div style="padding: 12px; max-width: 240px;">
              <h4 style="margin: 0 0 8px; font-weight: 600; color: #1e3a5f; font-size: 14px;">${property.title}</h4>
              <p style="margin: 0 0 4px; color: #6b7280; font-size: 12px;">${property.location?.address || property.location?.city || ''}</p>
              <p style="margin: 0; color: #1e3a5f; font-weight: 700; font-size: 16px;">KES ${property.price?.toLocaleString()}</p>
              <p style="margin: 4px 0 0; color: #6b7280; font-size: 11px;">${property.beds || 0} beds · ${property.baths || 0} baths</p>
            </div>
          `
        };
      });
  }, [filteredProperties]);

  // Dynamic SEO based on filters
  const seoTitle = useMemo(() => {
    const parts = ['Properties'];
    if (selectedType) parts.unshift(selectedType === 'Rent' ? 'Rent' : 'Buy');
    const activeCategories = Object.entries(selectedCategories)
      .filter(([_, isActive]) => isActive)
      .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1));
    if (activeCategories.length > 0) parts.push(activeCategories.join(', '));
    if (searchQuery) parts.push(`in ${searchQuery}`);
    return parts.join(' ') + ' | KejaMatch Kenya';
  }, [selectedType, selectedCategories, searchQuery]);

  const seoDescription = useMemo(() => {
    const count = filteredProperties.length;
    return `Browse ${count} ${selectedType === 'Rent' ? 'rental' : ''} properties ${searchQuery ? `in ${searchQuery}` : 'across Kenya'}. Find houses, apartments, land, and commercial properties with KejaMatch.`;
  }, [filteredProperties.length, selectedType, searchQuery]);

  // Filters Sidebar Component
  const FiltersSidebar = ({ isMobile = false }) => (
    <div className={`bg-white ${isMobile ? 'p-4' : 'rounded-xl border border-gray-200 p-6'}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <SlidersHorizontal size={18} />
          Filters
        </h3>
        {getActiveFilterCount() > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-secondary hover:text-secondary/80 text-sm font-medium"
          >
            Clear All
          </button>
        )}
        {isMobile && (
          <button onClick={() => setShowMobileFilters(false)}>
            <X size={20} className="text-gray-500" />
          </button>
        )}
      </div>

      {/* Property Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Listing Type
        </label>
        <div className="flex gap-2">
          {['All', 'Buy', 'Rent'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type === 'All' ? '' : type)}
              className={`flex-1 py-2 px-3 text-sm rounded-lg border transition-all ${
                (selectedType === type) || (type === 'All' && !selectedType)
                  ? 'bg-secondary text-white border-secondary'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-secondary'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Property Category
        </label>
        <div className="space-y-2">
          {[
            { key: 'apartments', label: 'Apartments', icon: Building },
            { key: 'houses', label: 'Houses', icon: Home },
            { key: 'land', label: 'Land', icon: Home },
            { key: 'commercial', label: 'Commercial', icon: Building }
          ].map(({ key, label, icon: Icon }) => (
            <label key={key} className="flex items-center group cursor-pointer p-2 rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                className="sr-only"
                checked={selectedCategories[key]}
                onChange={(e) => setSelectedCategories({
                  ...selectedCategories,
                  [key]: e.target.checked
                })}
              />
              <div className={`w-5 h-5 border-2 rounded transition-all flex items-center justify-center ${
                selectedCategories[key]
                  ? 'bg-secondary border-secondary'
                  : 'border-gray-300 group-hover:border-secondary'
              }`}>
                {selectedCategories[key] && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3 flex items-center gap-2">
                <Icon size={16} className="text-gray-400" />
                <span className="text-gray-700 text-sm">{label}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Price Range
        </label>
        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="100000000"
            step="1000000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-secondary"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>KES 0</span>
            <span className="font-medium text-secondary">
              {formatPrice(priceRange[1], 'Buy')}
            </span>
          </div>
        </div>
      </div>

      {/* Bedrooms */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Bedrooms
        </label>
        <div className="flex flex-wrap gap-2">
          {['Any', '1', '2', '3', '4', '5+'].map((bed) => (
            <button
              key={bed}
              onClick={() => setBedroomFilter(bed === 'Any' ? '' : bed)}
              className={`py-2 px-4 text-sm rounded-lg border transition-all ${
                (bedroomFilter === bed) || (bed === 'Any' && !bedroomFilter)
                  ? 'bg-secondary text-white border-secondary'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-secondary'
              }`}
            >
              {bed}
            </button>
          ))}
        </div>
      </div>

      {/* Bathrooms */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Bathrooms
        </label>
        <div className="flex flex-wrap gap-2">
          {['Any', '1', '2', '3+'].map((bath) => (
            <button
              key={bath}
              onClick={() => setBathroomFilter(bath === 'Any' ? '' : bath)}
              className={`py-2 px-4 text-sm rounded-lg border transition-all ${
                (bathroomFilter === bath) || (bath === 'Any' && !bathroomFilter)
                  ? 'bg-secondary text-white border-secondary'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-secondary'
              }`}
            >
              {bath}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords="properties Kenya, houses for sale, apartments for rent, land for sale Kenya, commercial property Kenya, real estate listings"
        canonicalUrl="/properties"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Properties', url: '/properties' }
        ]}
      />

      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Search Header */}
        <div className="bg-white border-b border-gray-200 sticky top-20 z-30">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search Input */}
              <div className="flex-1 relative w-full">
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-secondary focus-within:border-transparent">
                  <Search className="ml-4 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by location, property name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => locationSuggestions.length > 0 && setShowLocationSuggestions(true)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full px-4 py-3 bg-transparent outline-none text-gray-900 placeholder-gray-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="px-3 text-gray-400 hover:text-gray-600"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>

                {/* Location Suggestions Dropdown */}
                {showLocationSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                    {locationSuggestions.map((location, index) => (
                      <button
                        key={index}
                        onClick={() => handleLocationSelect(location)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-3"
                      >
                        <MapPin size={16} className="text-secondary" />
                        <span className="text-gray-700">{location.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* View Mode & Controls */}
              <div className="flex items-center gap-3">
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="pl-4 pr-10 py-3 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary appearance-none cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="beds">Most Bedrooms</option>
                  </select>
                  <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* View Mode Toggle */}
                <div className="hidden md:flex border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setViewMode('split')}
                    className={`p-3 ${viewMode === 'split' ? 'bg-secondary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
                    title="Split View"
                  >
                    <LayoutList size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 ${viewMode === 'list' ? 'bg-secondary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
                    title="List View"
                  >
                    <Grid3X3 size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`p-3 ${viewMode === 'map' ? 'bg-secondary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
                    title="Map View"
                  >
                    <MapIcon size={18} />
                  </button>
                </div>

                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <SlidersHorizontal size={18} />
                  {getActiveFilterCount() > 0 && (
                    <span className="bg-secondary text-white px-2 py-0.5 rounded-full text-xs font-medium">
                      {getActiveFilterCount()}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex h-[calc(100vh-160px)]">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-80 border-r border-gray-200 bg-white overflow-y-auto">
            <div className="p-4">
              <FiltersSidebar />
            </div>
          </div>

          {/* Mobile Filters Modal */}
          <AnimatePresence>
            {showMobileFilters && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                onClick={() => setShowMobileFilters(false)}
              >
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'tween' }}
                  className="absolute left-0 top-0 bottom-0 w-80 bg-white overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FiltersSidebar isMobile />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Properties List */}
          <div className={`flex-1 overflow-y-auto ${viewMode === 'map' ? 'hidden md:hidden' : ''} ${viewMode === 'split' ? 'lg:w-1/2' : 'w-full'}`}>
            <div className="p-4">
              {/* Results Count */}
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {loading ? 'Loading...' : `${filteredProperties.length} properties`}
                </h2>
                {searchQuery && (
                  <p className="text-sm text-gray-500">Showing results for "{searchQuery}"</p>
                )}
              </div>

              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center py-20"
                  >
                    <div className="text-center">
                      <div className="w-10 h-10 border-2 border-gray-200 border-t-secondary rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-500">Loading properties...</p>
                    </div>
                  </motion.div>
                ) : error ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-20"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
                      <Home className="w-8 h-8 text-red-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Properties</h3>
                    <p className="text-gray-500 mb-4">{error}</p>
                    <button
                      onClick={fetchProperties}
                      className="bg-secondary text-white px-6 py-2 rounded-lg hover:bg-secondary/90 transition-colors"
                    >
                      Try Again
                    </button>
                  </motion.div>
                ) : filteredProperties.length > 0 ? (
                  <motion.div
                    key="properties"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`grid gap-4 ${
                      viewMode === 'list' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
                    }`}
                  >
                    {filteredProperties.map((property, index) => (
                      <motion.div
                        key={property._id || property.id}
                        id={`property-${property._id || property.id}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        onMouseEnter={() => handlePropertyHover(property._id || property.id)}
                        onMouseLeave={() => handlePropertyHover(null)}
                        className={`transition-all ${
                          selectedPropertyId === (property._id || property.id)
                            ? 'ring-2 ring-secondary rounded-xl'
                            : ''
                        }`}
                      >
                        <PropertyCard
                          property={property}
                          viewMode={viewMode === 'split' ? 'list' : 'grid'}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-20"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <Home className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Properties Found</h3>
                    <p className="text-gray-500 mb-4">
                      {properties.length === 0
                        ? "No properties are currently listed."
                        : "Try adjusting your filters."}
                    </p>
                    {getActiveFilterCount() > 0 && (
                      <button
                        onClick={clearAllFilters}
                        className="bg-secondary text-white px-6 py-2 rounded-lg hover:bg-secondary/90 transition-colors"
                      >
                        Clear All Filters
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Map Panel */}
          {(viewMode === 'split' || viewMode === 'map') && (
            <div className={`hidden md:block ${viewMode === 'map' ? 'w-full' : 'lg:w-1/2'} bg-gray-100 sticky top-0`}>
              <GoogleMaps
                center={mapCenter}
                zoom={12}
                markers={mapMarkers}
                height="100%"
                className="h-full"
                showControls={true}
                onMarkerClick={handleMarkerClick}
                selectedMarkerId={selectedPropertyId}
                fitBounds={mapMarkers.length > 0}
              />
            </div>
          )}
        </div>

        {/* Mobile Map Toggle */}
        <div className="md:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
          <button
            onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
            className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
          >
            {viewMode === 'map' ? (
              <>
                <List size={18} />
                Show List
              </>
            ) : (
              <>
                <MapIcon size={18} />
                Show Map
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Properties;
