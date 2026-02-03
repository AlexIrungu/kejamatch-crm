import React, { useState, useEffect, useMemo, useCallback } from 'react';
import SEO from '../components/common/SEO';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Bed,
  Bath,
  Users,
  Star,
  Heart,
  Wifi,
  Car,
  Coffee,
  Tv,
  Wind,
  Shield,
  Search,
  Filter,
  Grid3X3,
  List,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Share2,
  Award,
  Zap,
  Map as MapIcon,
  LayoutList,
  ArrowUpDown
} from 'lucide-react';
import GoogleMaps from '../components/common/GoogleMaps';
import BookingForm from '../components/bnbs/BookingForm';
import LazyImage from '../components/common/LazyImage';
import { bnbListings, searchBnbs } from '../data/bnbs';

const BNBs = () => {
  const [selectedBnb, setSelectedBnb] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [viewMode, setViewMode] = useState('split');
  const [showFilters, setShowFilters] = useState(false);
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});
  const [favorites, setFavorites] = useState(new Set());
  const [filteredBnbs, setFilteredBnbs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBnbId, setSelectedBnbId] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: -1.2921, lng: 36.8219 });
  const [sortBy, setSortBy] = useState('recommended');

  const [searchFilters, setSearchFilters] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    priceRange: [1000, 50000],
    propertyTypes: [],
    amenities: [],
    ratings: 0,
    instantBook: false
  });

  const amenityIcons = {
    'WiFi': Wifi,
    'Kitchen': Coffee,
    'AC': Wind,
    'Parking': Car,
    'Pool': null,
    'TV': Tv,
    'Security': Shield,
    'Gym': null,
    'Garden': null,
    'Beach Access': null,
    'BBQ': null
  };

  const amenityEmojis = {
    'Pool': '🏊‍♂️',
    'Gym': '🏋️‍♂️',
    'Garden': '🌺',
    'Beach Access': '🏖️',
    'BBQ': '🔥'
  };

  const propertyTypes = ['Studio', 'Apartment', 'House', 'Villa', 'Cottage'];

  // Initialize filtered BNBs
  useEffect(() => {
    setFilteredBnbs(bnbListings);
  }, []);

  // Apply filters
  const applyFilters = useCallback(() => {
    setLoading(true);
    const filtered = searchBnbs(searchFilters);

    // Apply sorting
    let sorted = [...filtered];
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        sorted.sort((a, b) => b.reviews - a.reviews);
        break;
      default:
        // Keep original order for 'recommended'
        break;
    }

    setTimeout(() => {
      setFilteredBnbs(sorted);
      setLoading(false);
    }, 200);
  }, [searchFilters, sortBy]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleImageNavigation = (bnbId, direction) => {
    const bnb = bnbListings.find(b => b.id === bnbId);
    if (!bnb) return;

    setCurrentImageIndexes(prev => {
      const currentIndex = prev[bnbId] || 0;
      let newIndex;

      if (direction === 'next') {
        newIndex = currentIndex === bnb.images.length - 1 ? 0 : currentIndex + 1;
      } else {
        newIndex = currentIndex === 0 ? bnb.images.length - 1 : currentIndex - 1;
      }

      return { ...prev, [bnbId]: newIndex };
    });
  };

  const toggleFavorite = (bnbId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(bnbId)) {
        newFavorites.delete(bnbId);
      } else {
        newFavorites.add(bnbId);
      }
      return newFavorites;
    });
  };

  const handleBooking = (bnb) => {
    setSelectedBnb(bnb);
    setShowBookingForm(true);
  };

  const clearAllFilters = () => {
    setSearchFilters({
      location: '',
      checkIn: '',
      checkOut: '',
      guests: 1,
      priceRange: [1000, 50000],
      propertyTypes: [],
      amenities: [],
      ratings: 0,
      instantBook: false
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (searchFilters.location) count++;
    if (searchFilters.propertyTypes.length > 0) count++;
    if (searchFilters.priceRange[0] > 1000 || searchFilters.priceRange[1] < 50000) count++;
    if (searchFilters.ratings > 0) count++;
    if (searchFilters.instantBook) count++;
    return count;
  };

  // Handle BNB card hover for map sync
  const handleBnbHover = (bnbId) => {
    setSelectedBnbId(bnbId);
  };

  // Handle marker click on map
  const handleMarkerClick = (markerData) => {
    setSelectedBnbId(markerData.id);
    const element = document.getElementById(`bnb-${markerData.id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Generate map markers
  const mapMarkers = useMemo(() => {
    return filteredBnbs
      .filter(bnb => bnb.coordinates?.lat && bnb.coordinates?.lng)
      .map(bnb => ({
        id: bnb.id,
        lat: bnb.coordinates.lat,
        lng: bnb.coordinates.lng,
        title: bnb.title,
        price: bnb.price,
        infoWindow: `
          <div style="padding: 12px; max-width: 240px;">
            <img src="${bnb.images[0]}" alt="${bnb.title}" style="width: 100%; height: 80px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;">
            <h4 style="margin: 0 0 4px; font-weight: 600; color: #1e3a5f; font-size: 14px;">${bnb.title}</h4>
            <p style="margin: 0 0 4px; color: #6b7280; font-size: 12px;">${bnb.location}</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 12px; color: #6b7280;">★ ${bnb.rating} (${bnb.reviews})</span>
              <span style="font-weight: 700; color: #1e3a5f; font-size: 14px;">KES ${bnb.price.toLocaleString()}/night</span>
            </div>
          </div>
        `
      }));
  }, [filteredBnbs]);

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
          <button onClick={() => setShowFilters(false)}>
            <X size={20} className="text-gray-500" />
          </button>
        )}
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Price per night
        </label>
        <input
          type="range"
          min="1000"
          max="50000"
          step="1000"
          value={searchFilters.priceRange[1]}
          onChange={(e) => setSearchFilters({
            ...searchFilters,
            priceRange: [searchFilters.priceRange[0], parseInt(e.target.value)]
          })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-secondary"
        />
        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <span>KES 1,000</span>
          <span className="font-medium text-secondary">KES {searchFilters.priceRange[1].toLocaleString()}</span>
        </div>
      </div>

      {/* Property Types */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Property Type
        </label>
        <div className="space-y-2">
          {propertyTypes.map(type => (
            <label key={type} className="flex items-center group cursor-pointer p-2 rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={searchFilters.propertyTypes.includes(type)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSearchFilters({
                      ...searchFilters,
                      propertyTypes: [...searchFilters.propertyTypes, type]
                    });
                  } else {
                    setSearchFilters({
                      ...searchFilters,
                      propertyTypes: searchFilters.propertyTypes.filter(t => t !== type)
                    });
                  }
                }}
                className="sr-only"
              />
              <div className={`w-5 h-5 border-2 rounded transition-all flex items-center justify-center ${
                searchFilters.propertyTypes.includes(type)
                  ? 'bg-secondary border-secondary'
                  : 'border-gray-300 group-hover:border-secondary'
              }`}>
                {searchFilters.propertyTypes.includes(type) && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className="ml-3 text-gray-700 text-sm">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Minimum Rating
        </label>
        <div className="space-y-2">
          {[4.5, 4.0, 3.5, 0].map(rating => (
            <label key={rating} className="flex items-center group cursor-pointer p-2 rounded-lg hover:bg-gray-50">
              <input
                type="radio"
                name="rating"
                checked={searchFilters.ratings === rating}
                onChange={() => setSearchFilters({...searchFilters, ratings: rating})}
                className="sr-only"
              />
              <div className={`w-5 h-5 border-2 rounded-full transition-all flex items-center justify-center ${
                searchFilters.ratings === rating
                  ? 'border-secondary'
                  : 'border-gray-300 group-hover:border-secondary'
              }`}>
                {searchFilters.ratings === rating && (
                  <div className="w-2.5 h-2.5 bg-secondary rounded-full"></div>
                )}
              </div>
              <span className="ml-3 text-gray-700 text-sm flex items-center">
                {rating > 0 ? (
                  <>
                    <Star size={14} className="text-yellow-500 fill-current mr-1" />
                    {rating}+
                  </>
                ) : 'Any rating'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Guests */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Guests
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, '5+'].map((num) => (
            <button
              key={num}
              onClick={() => setSearchFilters({
                ...searchFilters,
                guests: typeof num === 'number' ? num : 5
              })}
              className={`flex-1 py-2 text-sm rounded-lg border transition-all ${
                searchFilters.guests === (typeof num === 'number' ? num : 5)
                  ? 'bg-secondary text-white border-secondary'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-secondary'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Instant Book */}
      <div className="mb-6">
        <label className="flex items-center group cursor-pointer p-2 rounded-lg hover:bg-gray-50">
          <input
            type="checkbox"
            checked={searchFilters.instantBook}
            onChange={(e) => setSearchFilters({...searchFilters, instantBook: e.target.checked})}
            className="sr-only"
          />
          <div className={`w-5 h-5 border-2 rounded transition-all flex items-center justify-center ${
            searchFilters.instantBook
              ? 'bg-secondary border-secondary'
              : 'border-gray-300 group-hover:border-secondary'
          }`}>
            {searchFilters.instantBook && (
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="ml-3 flex items-center gap-2">
            <Zap size={16} className="text-yellow-500" />
            <span className="text-gray-700 text-sm">Instant Book only</span>
          </div>
        </label>
      </div>
    </div>
  );

  // BNB Card Component
  const BnbCard = ({ bnb, isCompact = false }) => (
    <motion.div
      id={`bnb-${bnb.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onMouseEnter={() => handleBnbHover(bnb.id)}
      onMouseLeave={() => handleBnbHover(null)}
      className={`bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 overflow-hidden ${
        selectedBnbId === bnb.id ? 'ring-2 ring-secondary' : ''
      }`}
    >
      <div className={isCompact ? 'flex' : ''}>
        {/* Image Section */}
        <div className={`relative ${isCompact ? 'w-48 flex-shrink-0' : ''}`}>
          <div className={`relative ${isCompact ? 'h-full min-h-[160px]' : 'h-56'} group`}>
            <LazyImage
              src={bnb.images[currentImageIndexes[bnb.id] || 0]}
              alt={bnb.title}
              className="w-full h-full object-cover"
            />

            {/* Image Navigation */}
            {bnb.images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); handleImageNavigation(bnb.id, 'prev'); }}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleImageNavigation(bnb.id, 'next'); }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}

            {/* Image Dots */}
            {bnb.images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                {bnb.images.slice(0, 5).map((_, imageIndex) => (
                  <div
                    key={imageIndex}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      imageIndex === (currentImageIndexes[bnb.id] || 0)
                        ? 'bg-white'
                        : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Favorite Button */}
            <button
              onClick={(e) => { e.stopPropagation(); toggleFavorite(bnb.id); }}
              className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors shadow-sm"
            >
              <Heart
                size={16}
                className={`transition-colors ${
                  favorites.has(bnb.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
                }`}
              />
            </button>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {bnb.instantBook && (
                <span className="bg-yellow-400 text-gray-900 px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1">
                  <Zap size={10} />
                  Instant
                </span>
              )}
              {bnb.host?.superhost && (
                <span className="bg-secondary text-white px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1">
                  <Award size={10} />
                  Superhost
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className={`p-4 ${isCompact ? 'flex-1 flex flex-col justify-between' : ''}`}>
          <div>
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-gray-900 truncate hover:text-secondary transition-colors cursor-pointer">
                  {bnb.title}
                </h3>
                <p className="text-sm text-gray-500 flex items-center mt-0.5">
                  <MapPin size={12} className="mr-1 flex-shrink-0" />
                  <span className="truncate">{bnb.location}</span>
                </p>
              </div>
              {!isCompact && (
                <div className="text-right ml-3 flex-shrink-0">
                  <p className="text-lg font-bold text-gray-900">
                    KES {bnb.price.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">per night</p>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
              <span className="flex items-center">
                <Users size={12} className="mr-1" />
                {bnb.maxGuests}
              </span>
              <span className="flex items-center">
                <Bed size={12} className="mr-1" />
                {bnb.beds}
              </span>
              <span className="flex items-center">
                <Bath size={12} className="mr-1" />
                {bnb.baths}
              </span>
              <span className="flex items-center text-gray-900 font-medium">
                <Star size={12} className="text-yellow-500 fill-current mr-1" />
                {bnb.rating} ({bnb.reviews})
              </span>
            </div>

            {/* Amenities */}
            {!isCompact && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {bnb.amenities.slice(0, 4).map((amenity, amenityIndex) => {
                  const IconComponent = amenityIcons[amenity];
                  const emoji = amenityEmojis[amenity];
                  return (
                    <div key={amenityIndex} className="flex items-center bg-gray-100 px-2 py-1 rounded text-xs text-gray-600">
                      {emoji ? (
                        <span className="mr-1 text-xs">{emoji}</span>
                      ) : IconComponent && (
                        <IconComponent size={10} className="mr-1" />
                      )}
                      {amenity}
                    </div>
                  );
                })}
                {bnb.amenities.length > 4 && (
                  <span className="text-xs text-gray-400 px-2 py-1">
                    +{bnb.amenities.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={`flex items-center justify-between ${isCompact ? 'mt-auto pt-2' : ''}`}>
            {isCompact ? (
              <p className="text-base font-bold text-gray-900">
                KES {bnb.price.toLocaleString()}<span className="text-xs font-normal text-gray-500">/night</span>
              </p>
            ) : (
              <div className="flex items-center">
                <img
                  src={bnb.host?.avatar}
                  alt={bnb.host?.name}
                  className="w-8 h-8 rounded-full mr-2 border border-gray-200"
                />
                <div>
                  <p className="text-xs font-medium text-gray-900 flex items-center gap-1">
                    {bnb.host?.name}
                    {bnb.host?.verified && <span className="text-green-500 text-xs">✓</span>}
                  </p>
                  <p className="text-xs text-gray-500">{bnb.host?.responseTime}</p>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              {!isCompact && (
                <>
                  <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Eye size={14} className="text-gray-500" />
                  </button>
                  <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Share2 size={14} className="text-gray-500" />
                  </button>
                </>
              )}
              <button
                onClick={() => handleBooking(bnb)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  bnb.instantBook
                    ? 'bg-secondary text-white hover:bg-secondary/90'
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {bnb.instantBook ? 'Book' : 'Request'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      <SEO
        title="BNBs & Short-Term Rentals in Kenya"
        description="Book top-rated BNBs and short-term rentals across Kenya. Find cozy apartments, luxury villas, and unique stays in Nairobi, Mombasa, Diani, and beyond. Instant booking available."
        keywords="BNB Kenya, short-term rentals Nairobi, vacation rentals Kenya, Airbnb alternative Kenya, holiday homes Mombasa, Diani beach rentals"
        canonicalUrl="/bnbs"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'BNBs', url: '/bnbs' }
        ]}
      />

      <div className="min-h-screen bg-gray-50 pt-20">
        {/* Search Header */}
        <div className="bg-white border-b border-gray-200 sticky top-20 z-30">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Location Search */}
              <div className="flex-1 relative w-full">
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-secondary focus-within:border-transparent">
                  <Search className="ml-4 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Where are you going?"
                    value={searchFilters.location}
                    onChange={(e) => setSearchFilters({...searchFilters, location: e.target.value})}
                    className="flex-1 px-4 py-3 bg-transparent outline-none text-gray-900 placeholder-gray-500"
                  />
                  {searchFilters.location && (
                    <button
                      onClick={() => setSearchFilters({...searchFilters, location: ''})}
                      className="px-3 text-gray-400 hover:text-gray-600"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>

              {/* Date Inputs */}
              <div className="flex gap-2">
                <input
                  type="date"
                  value={searchFilters.checkIn}
                  onChange={(e) => setSearchFilters({...searchFilters, checkIn: e.target.value})}
                  className="px-4 py-3 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="Check-in"
                />
                <input
                  type="date"
                  value={searchFilters.checkOut}
                  onChange={(e) => setSearchFilters({...searchFilters, checkOut: e.target.value})}
                  className="px-4 py-3 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                  placeholder="Check-out"
                />
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="pl-4 pr-10 py-3 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-secondary appearance-none cursor-pointer"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                    <option value="reviews">Most Reviews</option>
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
                    onClick={() => setViewMode('grid')}
                    className={`p-3 ${viewMode === 'grid' ? 'bg-secondary text-white' : 'bg-white text-gray-600 hover:bg-gray-50'} transition-colors`}
                    title="Grid View"
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
                  onClick={() => setShowFilters(!showFilters)}
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
            {showFilters && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                onClick={() => setShowFilters(false)}
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

          {/* BNB Listings */}
          <div className={`flex-1 overflow-y-auto ${viewMode === 'map' ? 'hidden md:hidden' : ''} ${viewMode === 'split' ? 'lg:w-1/2' : 'w-full'}`}>
            <div className="p-4">
              {/* Results Count */}
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {loading ? 'Loading...' : `${filteredBnbs.length} stays`}
                </h2>
                {searchFilters.location && (
                  <p className="text-sm text-gray-500">in {searchFilters.location}</p>
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
                      <p className="text-gray-500">Finding stays...</p>
                    </div>
                  </motion.div>
                ) : filteredBnbs.length > 0 ? (
                  <motion.div
                    key="bnbs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`grid gap-4 ${
                      viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'
                    }`}
                  >
                    {filteredBnbs.map((bnb, index) => (
                      <motion.div
                        key={bnb.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <BnbCard bnb={bnb} isCompact={viewMode === 'split'} />
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
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No stays found</h3>
                    <p className="text-gray-500 mb-4">Try adjusting your filters or search criteria.</p>
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
                zoom={11}
                markers={mapMarkers}
                height="100%"
                className="h-full"
                showControls={true}
                onMarkerClick={handleMarkerClick}
                selectedMarkerId={selectedBnbId}
                fitBounds={mapMarkers.length > 0}
              />
            </div>
          )}
        </div>

        {/* Mobile Map Toggle */}
        <div className="md:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
          <button
            onClick={() => setViewMode(viewMode === 'map' ? 'grid' : 'map')}
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

      {/* Booking Form */}
      <BookingForm
        isOpen={showBookingForm}
        onClose={() => setShowBookingForm(false)}
        bnb={selectedBnb}
        onSubmit={(bookingData) => {
          console.log('Booking submitted:', bookingData);
          const checkInDate = new Date(bookingData.checkIn);
          const checkOutDate = new Date(bookingData.checkOut);
          const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
          const totalCost = nights * selectedBnb.price;

          alert(`Booking request sent! Total: KES ${totalCost.toLocaleString()} for ${nights} nights`);
          setShowBookingForm(false);
        }}
      />
    </>
  );
};

export default BNBs;
