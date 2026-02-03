// src/components/properties/PropertyCard.jsx
import { Bed, Bath, Square, MapPin, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import LazyImage from '../common/LazyImage';

const PropertyCard = ({ property, viewMode = 'grid' }) => {
  const [isLiked, setIsLiked] = useState(false);

  const formatPrice = (price, type) => {
    const typeNormalized = type?.toLowerCase();
    if (typeNormalized === 'rent') {
      if (price >= 1000000) {
        return `KES ${(price / 1000000).toFixed(1)}M`.replace('.0M', 'M') + '/mo';
      } else if (price >= 1000) {
        return `KES ${(price / 1000).toFixed(0)}K/mo`;
      }
      return `KES ${price.toLocaleString()}/mo`;
    }
    if (price >= 1000000) {
      return `KES ${(price / 1000000).toFixed(1)}M`.replace('.0M', 'M');
    } else if (price >= 1000) {
      return `KES ${(price / 1000).toFixed(0)}K`;
    }
    return `KES ${price.toLocaleString()}`;
  };

  // Get primary image - supports both old and new data structures
  const getPropertyImage = () => {
    // New MongoDB structure with images array
    if (property.images && property.images.length > 0) {
      const primaryImage = property.images.find(img => img.isPrimary);
      return primaryImage?.url || property.images[0]?.url;
    }
    // Old structure with single image
    if (property.image) {
      return property.image;
    }
    return 'https://via.placeholder.com/400x300?text=No+Image';
  };

  // Get location - supports both old and new data structures
  const getLocation = () => {
    // New MongoDB structure with location object
    if (property.location && typeof property.location === 'object') {
      return property.location.city || property.location.address || 'Unknown location';
    }
    // Old structure with location string
    if (typeof property.location === 'string') {
      return property.location;
    }
    return 'Unknown location';
  };

  // Get property type for display
  const getTypeDisplay = () => {
    const type = property.type?.toLowerCase();
    return type === 'rent' ? 'For Rent' : 'For Sale';
  };

  // Check if it's a rental
  const isRental = () => {
    const type = property.type?.toLowerCase();
    return type === 'rent';
  };

  // Get property ID for linking - supports both _id (MongoDB) and id
  const propertyId = property._id || property.id;

  // List view layout (horizontal card for split-screen)
  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 group"
      >
        <Link to={`/properties/${propertyId}`} className="block">
          <div className="flex">
            {/* Image Section */}
            <div className="relative w-48 h-40 flex-shrink-0 overflow-hidden">
              <LazyImage
                src={getPropertyImage()}
                alt={property.title}
                className="w-full h-full group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-2 left-2">
                <span className={`px-2 py-0.5 rounded text-white text-xs font-medium ${
                  isRental() ? 'bg-secondary' : 'bg-gray-900'
                }`}>
                  {getTypeDisplay()}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsLiked(!isLiked);
                }}
                className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full hover:bg-white transition-colors"
              >
                <Heart
                  size={14}
                  className={`transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
                />
              </button>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-secondary transition-colors truncate">
                  {property.title}
                </h3>

                <div className="flex items-center text-gray-500 mb-2">
                  <MapPin size={12} className="mr-1 flex-shrink-0" />
                  <span className="text-xs truncate">{getLocation()}</span>
                </div>

                <div className="flex items-center gap-3 text-gray-500 text-xs">
                  <div className="flex items-center">
                    <Bed size={12} className="mr-1" />
                    <span>{property.beds || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <Bath size={12} className="mr-1" />
                    <span>{property.baths || 0}</span>
                  </div>
                  {property.sqft && (
                    <div className="flex items-center">
                      <Square size={12} className="mr-1" />
                      <span>{property.sqft}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center mt-2">
                <p className="text-base font-bold text-gray-900">
                  {formatPrice(property.price, property.type)}
                </p>
                <span className="text-xs text-secondary font-medium">
                  View
                </span>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  // Grid view layout (default)
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 group"
    >
      <Link to={`/properties/${propertyId}`} className="block">
        <div className="relative overflow-hidden h-56">
          <LazyImage
            src={getPropertyImage()}
            alt={property.title}
            className="w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3">
            <span className={`px-2.5 py-1 rounded text-white text-xs font-medium ${
              isRental() ? 'bg-secondary' : 'bg-gray-900'
            }`}>
              {getTypeDisplay()}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors shadow-sm"
          >
            <Heart
              size={16}
              className={`transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
            />
          </button>
        </div>

        <div className="p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-secondary transition-colors line-clamp-1">
            {property.title}
          </h3>

          <div className="flex items-center text-gray-500 mb-3">
            <MapPin size={14} className="mr-1 flex-shrink-0" />
            <span className="text-sm truncate">{getLocation()}</span>
          </div>

          <div className="flex items-center gap-4 text-gray-500 text-sm mb-4">
            <div className="flex items-center">
              <Bed size={14} className="mr-1" />
              <span>{property.beds || 0}</span>
            </div>
            <div className="flex items-center">
              <Bath size={14} className="mr-1" />
              <span>{property.baths || 0}</span>
            </div>
            {property.sqft && (
              <div className="flex items-center">
                <Square size={14} className="mr-1" />
                <span>{property.sqft} sqft</span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <p className="text-lg font-bold text-gray-900">
              {formatPrice(property.price, property.type)}
            </p>
            <span className="bg-secondary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary/90 transition-colors">
              View
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;
