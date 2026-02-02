import { Home, Bed, Bath, MapPin, Eye, Edit, Star, Trash2, MoreVertical } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const PropertyCardSimple = ({ 
  property, 
  onEdit, 
  onView, 
  onDelete, 
  onToggleFeatured,
  onStatusChange 
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `KES ${(price / 1000000).toFixed(1)}M`.replace('.0M', 'M');
    }
    return `KES ${(price / 1000).toFixed(0)}K`;
  };

  const statusColors = {
    available: 'bg-green-100 text-green-800',
    unavailable: 'bg-gray-100 text-gray-800',
    sold: 'bg-blue-100 text-blue-800',
    rented: 'bg-purple-100 text-purple-800',
  };

  const statusOptions = [
    { value: 'available', label: 'Available' },
    { value: 'unavailable', label: 'Unavailable' },
    { value: 'sold', label: 'Sold' },
    { value: 'rented', label: 'Rented' },
  ];

  // Get primary image or first image
  const primaryImage = property.images?.find(img => img.isPrimary) || property.images?.[0];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        {primaryImage?.url ? (
          <img
            src={primaryImage.url}
            alt={property.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Home className="w-12 h-12 text-gray-400" />
          </div>
        )}

        {/* Featured Badge */}
        {property.featured && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-white px-2 py-1 rounded-full text-xs flex items-center">
            <Star className="w-3 h-3 mr-1 fill-current" />
            Featured
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[property.status] || statusColors.available}`}>
            {property.status || 'available'}
          </span>
        </div>

        {/* Type Badge */}
        <div className="absolute bottom-2 left-2">
          <span className={`px-2 py-1 rounded text-xs font-medium text-white ${
            property.type === 'Rent' ? 'bg-orange-500' : 'bg-green-600'
          }`}>
            For {property.type}
          </span>
        </div>

        {/* More Options Menu */}
        <div className="absolute bottom-2 right-2" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>

          {showMenu && (
            <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
              <button
                onClick={() => {
                  onToggleFeatured?.();
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center"
              >
                <Star className={`w-4 h-4 mr-2 ${property.featured ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                {property.featured ? 'Remove Featured' : 'Mark as Featured'}
              </button>
              
              <div className="border-t border-gray-100 my-1"></div>
              
              <p className="px-4 py-1 text-xs text-gray-500 uppercase">Change Status</p>
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onStatusChange?.(option.value);
                    setShowMenu(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                    property.status === option.value ? 'bg-gray-100 font-medium' : ''
                  }`}
                >
                  {option.label}
                </button>
              ))}

              <div className="border-t border-gray-100 my-1"></div>

              <button
                onClick={() => {
                  onDelete?.();
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Property
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 truncate" title={property.title}>
          {property.title}
        </h3>
        <p className="text-sm text-gray-600 flex items-center mb-2">
          <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
          <span className="truncate">
            {property.location?.city || 'Unknown location'}
            {property.location?.county && `, ${property.location.county}`}
          </span>
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-secondary">
            {formatPrice(property.price)}
            {property.type === 'Rent' && <span className="text-sm font-normal">/mo</span>}
          </span>
          <span className="text-xs px-2 py-1 bg-gray-100 rounded capitalize">
            {property.category || 'property'}
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <span className="flex items-center" title="Bedrooms">
            <Bed className="w-4 h-4 mr-1" />
            {property.beds || 0}
          </span>
          <span className="flex items-center" title="Bathrooms">
            <Bath className="w-4 h-4 mr-1" />
            {property.baths || 0}
          </span>
          <span className="flex items-center" title="Views">
            <Eye className="w-4 h-4 mr-1" />
            {property.views || 0}
          </span>
        </div>

        <div className="flex gap-2 pt-3 border-t">
          <button 
            onClick={onEdit}
            className="flex-1 px-3 py-2 bg-primary text-white rounded hover:bg-opacity-90 text-sm flex items-center justify-center"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </button>
          <button 
            onClick={onView}
            className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCardSimple;