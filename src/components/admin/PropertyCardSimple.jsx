import { Home, Bed, Bath, MapPin, Eye, Edit, Star } from 'lucide-react';

const PropertyCardSimple = ({ property }) => {
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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        {property.images && property.images[0] ? (
          <img
            src={property.images[0].url}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Home className="w-12 h-12 text-gray-400" />
          </div>
        )}
        {property.featured && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-white px-2 py-1 rounded-full text-xs flex items-center">
            <Star className="w-3 h-3 mr-1" />
            Featured
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[property.status]}`}>
            {property.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 truncate">{property.title}</h3>
        <p className="text-sm text-gray-600 flex items-center mb-2">
          <MapPin className="w-3 h-3 mr-1" />
          {property.location.city}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-secondary">
            {formatPrice(property.price)}
            {property.type === 'Rent' && '/mo'}
          </span>
          <span className="text-xs px-2 py-1 bg-gray-100 rounded">
            {property.type}
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <span className="flex items-center">
            <Bed className="w-4 h-4 mr-1" />
            {property.beds}
          </span>
          <span className="flex items-center">
            <Bath className="w-4 h-4 mr-1" />
            {property.baths}
          </span>
          <span className="flex items-center">
            <Eye className="w-4 h-4 mr-1" />
            {property.views || 0}
          </span>
        </div>

        <div className="flex gap-2 pt-3 border-t">
          <button className="flex-1 px-3 py-2 bg-primary text-white rounded hover:bg-opacity-90 text-sm">
            <Edit className="w-4 h-4 inline mr-1" />
            Edit
          </button>
          <button className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm">
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCardSimple;