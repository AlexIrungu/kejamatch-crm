import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  ChevronDown, 
  Filter,
  Search,
  X,
  Grid3X3,
  List,
  SlidersHorizontal,
  ArrowUpDown,
  Home,
  Building,
  Car,
  Calendar
} from 'lucide-react';

// Import components and data
import PropertyCard from '../components/properties/PropertyCard';
import { properties, formatPrice, searchProperties, kenyanLocations } from '../data/properties';

const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredProperties, setFilteredProperties] = useState(properties);
  const [loading, setLoading] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');
  const [priceRange, setPriceRange] = useState([0, 100000000]);
  const [selectedCategories, setSelectedCategories] = useState({
    houses: false,
    apartments: false,
    offices: false,
    villas: false
  });
  const [bedroomFilter, setBedroomFilter] = useState('');
  const [bathroomFilter, setBathroomFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  
  // UI states
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);

  // Initialize filters from URL params
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    const urlType = searchParams.get('type');
    const urlLocation = searchParams.get('location');
    
    if (urlSearch) setSearchQuery(urlSearch);
    if (urlType) setSelectedType(urlType.charAt(0).toUpperCase() + urlType.slice(1));
    
    // Apply initial filters
    applyFilters();
  }, []);

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
    setLoading(true);
    
    let filtered = [...properties];

    // Search query filter
    if (searchQuery.trim()) {
      filtered = searchProperties(searchQuery, selectedType);
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

    setTimeout(() => {
      setFilteredProperties(filtered);
      setLoading(false);
    }, 300);
  };

  // Sort properties
  const sortProperties = (props, sortType) => {
    switch (sortType) {
      case 'price-low':
        return props.sort((a, b) => a.price - b.price);
      case 'price-high':
        return props.sort((a, b) => b.price - a.price);
      case 'beds':
        return props.sort((a, b) => b.beds - a.beds);
      case 'newest':
      default:
        return props.sort((a, b) => b.yearBuilt - a.yearBuilt);
    }
  };

  // Apply filters when any filter changes
  useEffect(() => {
    applyFilters();
  }, [selectedType, selectedCategories, priceRange, bedroomFilter, bathroomFilter, sortBy]);

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
      offices: false,
      villas: false
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
    applyFilters();
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
      {/* Hero Section - Simplified without background hue */}
      <section className="relative h-[900px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Simple Overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&h=1080&auto=format&fit=crop&q=60" 
            alt="Modern Properties" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
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
                  {['All', 'Buy', 'Rent', 'BNBs'].map((type) => (
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
                    className="w-full px-4 py-2 pr-12 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white"
                  />
                  <MapPin className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  
                  {/* Location Suggestions */}
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
                {filteredProperties.length} Properties Found
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
                <Filter size={18} />
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
            {/* Filters Sidebar - Removed all sticky positioning */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className={`lg:w-1/4 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}
            >
              {/* Removed all sticky positioning */}
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
                      { key: 'offices', label: 'Offices', icon: Building },
                      { key: 'villas', label: 'Villas', icon: Home }
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
              <AnimatePresence>
                {loading ? (
                  <motion.div
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
                ) : filteredProperties.length > 0 ? (
                  <motion.div
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
                        key={property.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-20"
                  >
                    <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
                      <Home className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-4">No Properties Found</h3>
                    <p className="text-gray-500 mb-6">
                      Try adjusting your filters or search criteria to find more properties.
                    </p>
                    <button
                      onClick={clearAllFilters}
                      className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors"
                    >
                      Clear All Filters
                    </button>
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