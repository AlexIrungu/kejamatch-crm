import { useState, useEffect } from 'react';
import { Heart, MapPin, Bed, Bath, Maximize, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import clientService from '../../services/clientService';

const SavedProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  useEffect(() => {
    fetchSaved();
  }, []);

  const fetchSaved = async () => {
    try {
      const res = await clientService.getSavedProperties();
      setProperties(res.data || []);
    } catch (err) {
      console.error('Failed to load saved properties:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (propertyId) => {
    setRemoving(propertyId);
    try {
      await clientService.unsaveProperty(propertyId);
      setProperties((prev) => prev.filter((p) => p._id !== propertyId));
    } catch (err) {
      console.error('Failed to unsave:', err);
    } finally {
      setRemoving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Saved Properties</h3>
        <p className="text-gray-500 mb-6">Browse properties and click the heart icon to save them here.</p>
        <Link
          to="/properties"
          className="inline-block px-6 py-3 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition-colors"
        >
          Browse Properties
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Saved Properties ({properties.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div key={property._id} className="bg-white rounded-lg shadow-md overflow-hidden group">
            {/* Image */}
            <div className="relative h-48 bg-gray-200">
              {property.images?.[0] ? (
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              <button
                onClick={() => handleUnsave(property._id)}
                disabled={removing === property._id}
                className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
              >
                {removing === property._id ? (
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                ) : (
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                )}
              </button>
              {property.listingType && (
                <span className="absolute top-3 left-3 px-2 py-1 text-xs font-semibold bg-secondary text-white rounded">
                  {property.listingType}
                </span>
              )}
            </div>

            {/* Details */}
            <Link to={`/properties/${property._id}`} className="block p-4">
              <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-secondary transition-colors">
                {property.title}
              </h4>
              {property.location && (
                <p className="text-sm text-gray-500 flex items-center mb-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  {property.location.area || property.location.city}
                </p>
              )}
              <p className="text-lg font-bold text-secondary mb-3">
                KES {(property.price || 0).toLocaleString()}
                {property.listingType === 'Rent' ? '/mo' : ''}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                {property.bedrooms != null && (
                  <span className="flex items-center gap-1">
                    <Bed className="w-4 h-4" /> {property.bedrooms}
                  </span>
                )}
                {property.bathrooms != null && (
                  <span className="flex items-center gap-1">
                    <Bath className="w-4 h-4" /> {property.bathrooms}
                  </span>
                )}
                {property.size != null && (
                  <span className="flex items-center gap-1">
                    <Maximize className="w-4 h-4" /> {property.size} sq ft
                  </span>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedProperties;
