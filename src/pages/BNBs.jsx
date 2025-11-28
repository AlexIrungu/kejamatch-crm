import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Users, 
  Star, 
  Heart, 
  Calendar,
  Clock,
  Wifi,
  Car,
  Coffee,
  Tv,
  Wind,
  Shield,
  Search,
  Filter,
  ChevronDown,
  Grid3X3,
  List,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Share2,
  Award,
  Zap
} from 'lucide-react';
import GoogleMaps from '../components/common/GoogleMaps';
import BookingForm from '../components/bnbs/BookingForm';
import LazyImage from '../components/common/LazyImage';
import { bnbListings, searchBnbs, formatBnbPrice } from '../data/bnbs';

const BNBs = () => {
  const [selectedBnb, setSelectedBnb] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [currentImageIndexes, setCurrentImageIndexes] = useState({});
  const [favorites, setFavorites] = useState(new Set());
  const [filteredBnbs, setFilteredBnbs] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    priceRange: [1000, 15000],
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
    'Pool': '🏊‍♂️',
    'TV': Tv,
    'Security': Shield,
    'Gym': '🏋️‍♂️',
    'Garden': '🌺',
    'Beach Access': '🏖️',
    'BBQ': '🔥'
  };

  const propertyTypes = ['Studio', 'Apartment', 'House', 'Villa', 'Cottage'];
  const availableAmenities = ['WiFi', 'Kitchen', 'AC', 'Parking', 'Pool', 'Gym', 'Security', 'Garden', 'BBQ', 'Beach Access'];

  // Initialize filtered BNBs
  useEffect(() => {
    setFilteredBnbs(bnbListings);
  }, []);

  // Apply filters
  // Replace your applyFilters function with:
const applyFilters = () => {
  setLoading(true);
  
  const filtered = searchBnbs(searchFilters);
  
  setTimeout(() => {
    setFilteredBnbs(filtered);
    setLoading(false);
  }, 300);
};

  useEffect(() => {
    applyFilters();
  }, [searchFilters]);

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
      priceRange: [1000, 15000],
      propertyTypes: [],
      amenities: [],
      ratings: 0,
      instantBook: false
    });
  };

  const mapMarkers = filteredBnbs.map(bnb => ({
    lat: bnb.coordinates.lat,
    lng: bnb.coordinates.lng,
    title: bnb.title,
    infoWindow: `
      <div class="p-3 max-w-xs">
        <img src="${bnb.images[0]}" alt="${bnb.title}" class="w-full h-24 object-cover rounded mb-2">
        <h3 class="font-semibold text-sm mb-1">${bnb.title}</h3>
        <p class="text-xs text-gray-600 mb-2">${bnb.location}</p>
        <div class="flex justify-between items-center">
          <span class="text-xs">★ ${bnb.rating} (${bnb.reviews})</span>
          <span class="font-bold text-secondary text-sm">KES ${bnb.price}/night</span>
        </div>
      </div>
    `
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Search */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[1000px] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1736617936461-664d102e602c?w=1920&h=1080&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGJuYnxlbnwwfHwwfHx8MA%3D%3D"
            alt="Beautiful Accommodations" 
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
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Unique Stays & <span className="text-accent">Experiences</span>
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Discover amazing bed & breakfasts across Kenya
            </p>
            
            {/* Enhanced Search Bar */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Where are you going?"
                    value={searchFilters.location}
                    onChange={(e) => setSearchFilters({...searchFilters, location: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
                  />
                </div>
                
                <input
                  type="date"
                  value={searchFilters.checkIn}
                  onChange={(e) => setSearchFilters({...searchFilters, checkIn: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary outline-none"
                />
                
                <input
                  type="date"
                  value={searchFilters.checkOut}
                  onChange={(e) => setSearchFilters({...searchFilters, checkOut: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary outline-none"
                />
                
                <select
                  value={searchFilters.guests}
                  onChange={(e) => setSearchFilters({...searchFilters, guests: parseInt(e.target.value)})}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary outline-none"
                >
                  {[1,2,3,4,5,6,7,8].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <div className="container mx-auto px-4 py-8">
        {/* Results Header with View Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h2 className="text-2xl font-bold text-primary mb-2">
              {filteredBnbs.length} stays found
            </h2>
            <p className="text-gray-600">
              {searchFilters.location && `in ${searchFilters.location}`}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
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
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter size={16} />
              Filters
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {(showFilters || window.innerWidth >= 1024) && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}
              >
                <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-bold text-primary">Filters</h3>
                    <button
                      onClick={clearAllFilters}
                      className="text-secondary text-sm hover:text-secondary/80"
                    >
                      Clear All
                    </button>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range (per night)
                    </label>
                    <input
                      type="range"
                      min="1000"
                      max="15000"
                      step="500"
                      value={searchFilters.priceRange[1]}
                      onChange={(e) => setSearchFilters({
                        ...searchFilters,
                        priceRange: [searchFilters.priceRange[0], parseInt(e.target.value)]
                      })}
                      className="w-full slider"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>KES 1,000</span>
                      <span>KES {searchFilters.priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Property Types */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Property Type
                    </label>
                    <div className="space-y-2">
                      {propertyTypes.map(type => (
                        <label key={type} className="flex items-center">
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
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Minimum Rating
                    </label>
                    <div className="space-y-2">
                      {[4.5, 4.0, 3.5, 0].map(rating => (
                        <label key={rating} className="flex items-center">
                          <input
                            type="radio"
                            name="rating"
                            checked={searchFilters.ratings === rating}
                            onChange={() => setSearchFilters({...searchFilters, ratings: rating})}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700 flex items-center">
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

                  {/* Instant Book */}
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={searchFilters.instantBook}
                        onChange={(e) => setSearchFilters({...searchFilters, instantBook: e.target.checked})}
                        className="mr-2"
                      />
                      <Zap size={16} className="mr-1 text-yellow-500" />
                      <span className="text-sm text-gray-700">Instant Book only</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Listings */}
          <div className={`${showFilters || window.innerWidth >= 1024 ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            <AnimatePresence>
              {loading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center items-center py-20"
                >
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`grid gap-6 ${
                    viewMode === 'grid' ? 'grid-cols-1' : 'grid-cols-1'
                  }`}
                >
                  {filteredBnbs.map((bnb, index) => (
                    <motion.div
                      key={bnb.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                      <div className={viewMode === 'list' ? 'md:flex' : ''}>
                        {/* Image Section */}
                        <div className={`relative ${viewMode === 'list' ? 'md:w-1/3' : ''}`}>
                          <div className="relative h-64 group">
                            <LazyImage
                              src={bnb.images[currentImageIndexes[bnb.id] || 0]}
                              alt={bnb.title}
                              className="w-full h-full object-cover"
                            />
                            
                            {/* Image Navigation */}
                            {bnb.images.length > 1 && (
                              <>
                                <button
                                  onClick={() => handleImageNavigation(bnb.id, 'prev')}
                                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <ChevronLeft size={16} />
                                </button>
                                <button
                                  onClick={() => handleImageNavigation(bnb.id, 'next')}
                                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all"
                                >
                                  <ChevronRight size={16} />
                                </button>
                              </>
                            )}

                            {/* Image Dots */}
                            {bnb.images.length > 1 && (
                              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
                                {bnb.images.map((_, imageIndex) => (
                                  <div
                                    key={imageIndex}
                                    className={`w-2 h-2 rounded-full transition-colors ${
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
                              onClick={() => toggleFavorite(bnb.id)}
                              className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                            >
                              <Heart 
                                size={16} 
                                className={`transition-colors ${
                                  favorites.has(bnb.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
                                }`}
                              />
                            </button>

                            {/* Badges */}
                            <div className="absolute top-3 left-3 flex flex-col gap-2">
                              {bnb.instantBook && (
                                <span className="bg-accent text-primary px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                                  <Zap size={12} />
                                  Instant Book
                                </span>
                              )}
                              {bnb.host.superhost && (
                                <span className="bg-gradient-to-r from-secondary to-accent text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                                  <Award size={12} />
                                  Superhost
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className={`p-6 ${viewMode === 'list' ? 'md:w-2/3' : ''}`}>
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-primary mb-2 hover:text-secondary transition-colors cursor-pointer">
                                {bnb.title}
                              </h3>
                              <p className="text-gray-600 flex items-center mb-2">
                                <MapPin size={14} className="mr-1 text-secondary" />
                                {bnb.location}
                              </p>
                            </div>
                            <div className="text-right ml-4">
                              <p className="text-2xl font-bold text-secondary">
                                KES {bnb.price.toLocaleString()}
                              </p>
                              <p className="text-sm text-gray-600">per night</p>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <span className="flex items-center">
                              <Users size={14} className="mr-1" />
                              {bnb.maxGuests} guests
                            </span>
                            <span className="flex items-center">
                              <Bed size={14} className="mr-1" />
                              {bnb.beds} beds
                            </span>
                            <span className="flex items-center">
                              <Bath size={14} className="mr-1" />
                              {bnb.baths} baths
                            </span>
                            <div className="flex items-center">
                              <Star size={14} className="text-yellow-500 fill-current mr-1" />
                              <span>{bnb.rating} ({bnb.reviews})</span>
                            </div>
                          </div>

                          {/* Amenities */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {bnb.amenities.slice(0, 4).map((amenity, amenityIndex) => {
                              const IconComponent = amenityIcons[amenity];
                              return (
                                <div key={amenityIndex} className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-xs">
                                  {typeof IconComponent === 'string' ? (
                                    <span className="mr-1">{IconComponent}</span>
                                  ) : IconComponent && (
                                    <IconComponent size={12} className="mr-1" />
                                  )}
                                  {amenity}
                                </div>
                              );
                            })}
                            {bnb.amenities.length > 4 && (
                              <span className="text-xs text-gray-500 px-2 py-1">
                                +{bnb.amenities.length - 4} more
                              </span>
                            )}
                          </div>

                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {bnb.description}
                          </p>

                          {/* Host Info & Actions */}
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <img 
                                src={bnb.host.avatar} 
                                alt={bnb.host.name}
                                className="w-10 h-10 rounded-full mr-3 border-2 border-gray-100"
                              />
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium text-primary">{bnb.host.name}</p>
                                  {bnb.host.verified && (
                                    <span className="text-green-500 text-xs">✓</span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-600">
                                  Responds in {bnb.host.responseTime}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                <Eye size={16} />
                              </button>
                              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                <Share2 size={16} />
                              </button>
                              <button 
                                onClick={() => handleBooking(bnb)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                  bnb.instantBook
                                    ? 'bg-gradient-to-r from-secondary to-accent text-white hover:shadow-lg'
                                    : 'bg-primary text-white hover:bg-primary/90'
                                }`}
                              >
                                {bnb.instantBook ? 'Book Now' : 'Request'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* No Results */}
            {!loading && filteredBnbs.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-4">No stays found</h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your filters or search criteria.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors"
                >
                  Clear All Filters
                </button>
              </motion.div>
            )}
          </div>

          {/* Map */}
          <div className={`${showFilters || window.innerWidth >= 1024 ? 'lg:col-span-1' : 'lg:col-span-1'}`}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg p-4"
            >
              <h3 className="text-lg font-semibold text-primary mb-4">Map View</h3>
              <GoogleMaps
                center={{ lat: -1.2921, lng: 36.8219 }}
                zoom={11}
                markers={mapMarkers}
                height="600px"
                className="rounded-lg"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Enhanced Booking Form */}
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
    </div>
  );
};

export default BNBs;