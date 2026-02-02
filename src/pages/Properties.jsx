import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';

// Import components and services
import PropertyCard from '../components/properties/PropertyCard';
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
  const [viewMode, setViewMode] = useState('grid');
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);

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
  const applyFilters = () => {
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
  };

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
  }, [properties, selectedType, selectedCategories, priceRange, bedroomFilter, bathroomFilter, sortBy, searchQuery]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&h=1080&auto=format&fit=crop&q=60" 
            alt="Modern Properties" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="container mx-auto px-4 relative z-30">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Find Your Perfect <span className="text-accent">Property</span>
            </h1>
            <p className="text-lg text-white/90 mb-8">
              Discover amazing properties across Kenya with our advanced search tools
            </p>
            
            <div className="bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-2xl max-w-3xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex gap-2">
                  {['All', 'Buy', 'Rent'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type === 'All' ? '' : type)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                        (selectedType === type) || (type === 'All' && !selectedType)
                          ? 'bg-secondary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search location, property type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => locationSuggestions.length > 0 && setShowLocationSuggestions(true)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full px-4 py-2 pr-12 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white"
                  />
                  <MapPin className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  
                  {showLocationSuggestions && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                      {locationSuggestions.map((location, index) => (
                        <button
                          key={index}
                          onClick={() => handleLocationSelect(location)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-3"
                        >
                          <MapPin size={16} className="text-secondary" />
                          <span>{location.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <button
                  onClick={handleSearch}
                  className="bg-secondary text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                >
                  <Search size={18} />
                  Search
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Properties Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Results Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
          >
            <div>
              <h2 className="text-2xl font-bold text-primary mb-2">
                {loading ? 'Loading...' : `${filteredProperties.length} Properties Found`}
              </h2>
              <p className="text-gray-600">
                {searchQuery && `Showing results for "${searchQuery}"`}
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-secondary appearance-none pr-10"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="beds">Most Bedrooms</option>
                </select>
                <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-secondary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-secondary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
                >
                  <List size={18} />
                </button>
              </div>
              
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <SlidersHorizontal size={18} />
                Filters
                {getActiveFilterCount() > 0 && (
                  <span className="bg-accent text-primary px-2 py-1 rounded-full text-xs font-bold">
                    {getActiveFilterCount()}
                  </span>
                )}
              </button>
            </div>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className={`lg:w-1/4 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}
            >
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                    <SlidersHorizontal size={20} />
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
                </div>

                {/* Property Type */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Property Type
                  </label>
                  <div className="relative">
                    <select 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-secondary bg-white"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                    >
                      <option value="">All Types</option>
                      <option value="Buy">For Sale</option>
                      <option value="Rent">For Rent</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Property Categories
                  </label>
                  <div className="space-y-3">
                    {[
                      { key: 'apartments', label: 'Apartments', icon: Building },
                      { key: 'houses', label: 'Houses', icon: Home },
                      { key: 'land', label: 'Land', icon: Home },
                      { key: 'commercial', label: 'Commercial', icon: Building }
                    ].map(({ key, label, icon: Icon }) => (
                      <label key={key} className="flex items-center group cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only"
                          checked={selectedCategories[key]}
                          onChange={(e) => setSelectedCategories({
                            ...selectedCategories,
                            [key]: e.target.checked
                          })}
                        />
                        <div className={`w-5 h-5 border-2 rounded transition-all ${
                          selectedCategories[key] 
                            ? 'bg-secondary border-secondary' 
                            : 'border-gray-300 group-hover:border-secondary'
                        }`}>
                          {selectedCategories[key] && (
                            <svg className="w-3 h-3 text-white mx-auto mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div className="ml-3 flex items-center gap-2">
                          <Icon size={16} className="text-gray-500" />
                          <span className="text-gray-700 group-hover:text-primary transition-colors">{label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Price Range
                  </label>
                  <div className="space-y-3">
                    <input 
                      type="range" 
                      min="0" 
                      max="100000000" 
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none slider"
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
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Bedrooms
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['1', '2', '3', '4', '5+'].map((bed) => (
                      <button
                        key={bed}
                        onClick={() => setBedroomFilter(bedroomFilter === bed ? '' : bed)}
                        className={`py-2 px-3 text-sm rounded-lg border transition-all ${
                          bedroomFilter === bed
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
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Bathrooms
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['1', '2', '3+'].map((bath) => (
                      <button
                        key={bath}
                        onClick={() => setBathroomFilter(bathroomFilter === bath ? '' : bath)}
                        className={`py-2 px-3 text-sm rounded-lg border transition-all ${
                          bathroomFilter === bath
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
            </motion.div>

            {/* Properties Grid/List */}
            <div className="lg:w-3/4">
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
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading properties...</p>
                    </div>
                  </motion.div>
                ) : error ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-20"
                  >
                    <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                      <Home className="w-12 h-12 text-red-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-4">Error Loading Properties</h3>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <button
                      onClick={fetchProperties}
                      className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors"
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
                    className={`grid gap-6 ${
                      viewMode === 'grid' 
                        ? 'grid-cols-1 md:grid-cols-2' 
                        : 'grid-cols-1'
                    }`}
                  >
                    {filteredProperties.map((property, index) => (
                      <motion.div
                        key={property._id || property.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={viewMode === 'list' ? 'w-full' : ''}
                      >
                        <PropertyCard 
                          property={property} 
                          viewMode={viewMode}
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
                    <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
                      <Home className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-4">No Properties Found</h3>
                    <p className="text-gray-500 mb-6">
                      {properties.length === 0 
                        ? "No properties are currently listed. Check back soon!"
                        : "Try adjusting your filters or search criteria to find more properties."}
                    </p>
                    {getActiveFilterCount() > 0 && (
                      <button
                        onClick={clearAllFilters}
                        className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors"
                      >
                        Clear All Filters
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Properties;