// src/components/properties/PropertyCard.jsx
import { Bed, Bath, Square, MapPin, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import LazyImage from '../common/LazyImage';

const PropertyCard = ({ property, viewMode = 'grid' }) => {
  const [isLiked, setIsLiked] = useState(false);

  const formatPrice = (price, type) => {
    if (type === 'rent') {
      return `KES ${price.toLocaleString()}/mo`;
    }
    return `KES ${price.toLocaleString()}`;
  };

  // List view layout
  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
      >
        <Link to={`/properties/${property.id}`} className="block">
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="relative md:w-1/3 h-64 md:h-48 overflow-hidden">
              <LazyImage
                src={property.image || property.images?.[0]}
                alt={property.title}
                className="w-full h-full group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${
                  property.type === 'rent' ? 'bg-secondary' : 'bg-primary'
                }`}>
                  {property.type === 'rent' ? 'For Rent' : 'For Sale'}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsLiked(!isLiked);
                }}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-full hover:bg-white transition-colors"
              >
                <Heart 
                  size={20} 
                  className={`transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                />
              </button>
            </div>

            {/* Content Section */}
            <div className="flex-1 p-6">
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-primary mb-2 group-hover:text-secondary transition-colors">
                    {property.title}
                  </h3>
                  
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin size={16} className="mr-1 text-secondary" />
                    <span className="text-sm">{property.location}</span>
                  </div>

                  <div className="flex items-center space-x-4 text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Bed size={18} className="mr-1" />
                      <span className="text-sm">{property.beds}</span>
                    </div>
                    <div className="flex items-center">
                      <Bath size={18} className="mr-1" />
                      <span className="text-sm">{property.baths}</span>
                    </div>
                    <div className="flex items-center">
                      <Square size={18} className="mr-1" />
                      <span className="text-sm">{property.sqft}sqft</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {formatPrice(property.price, property.type)}
                  </p>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    className="bg-gradient-to-r from-secondary to-accent text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    View Details
                  </button>
                </div>
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
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
    >
      <Link to={`/properties/${property.id}`} className="block">
        <div className="relative overflow-hidden h-64">
          <LazyImage
            src={property.image || property.images?.[0]}
            alt={property.title}
            className="w-full h-full group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${
              property.type === 'rent' ? 'bg-secondary' : 'bg-primary'
            }`}>
              {property.type === 'rent' ? 'For Rent' : 'For Sale'}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-full hover:bg-white transition-colors"
          >
            <Heart 
              size={20} 
              className={`transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
            />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <h3 className="text-white text-xl font-semibold">{property.title}</h3>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center text-gray-600 mb-4">
            <MapPin size={16} className="mr-1 text-secondary" />
            <span className="text-sm">{property.location}</span>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4 text-gray-600">
              <div className="flex items-center">
                <Bed size={18} className="mr-1" />
                <span className="text-sm">{property.beds}</span>
              </div>
              <div className="flex items-center">
                <Bath size={18} className="mr-1" />
                <span className="text-sm">{property.baths}</span>
              </div>
              <div className="flex items-center">
                <Square size={18} className="mr-1" />
                <span className="text-sm">{property.sqft}sqft</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {formatPrice(property.price, property.type)}
              </p>
            </div>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // The link navigation will handle this
              }}
              className="bg-gradient-to-r from-secondary to-accent text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              View Details
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;