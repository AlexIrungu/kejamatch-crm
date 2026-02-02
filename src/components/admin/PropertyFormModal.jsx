import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Upload, GripVertical } from 'lucide-react';

const PropertyFormModal = ({ isOpen, onClose, onSubmit, property = null, loading = false }) => {
  const initialFormState = {
    title: '',
    description: '',
    type: 'Rent',
    category: 'apartments',
    price: '',
    beds: '',
    baths: '',
    sqft: '',
    parking: '0',
    yearBuilt: '',
    location: {
      address: '',
      city: '',
      county: '',
      coordinates: { lat: null, lng: null }
    },
    images: [],
    features: [],
    amenities: [],
    agent: {
      name: '',
      phone: '',
      email: ''
    },
    featured: false
  };

  const [formData, setFormData] = useState(initialFormState);
  const [newFeature, setNewFeature] = useState('');
  const [newAmenity, setNewAmenity] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('basic');

  // Populate form when editing
  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || '',
        description: property.description || '',
        type: property.type || 'Rent',
        category: property.category || 'apartments',
        price: property.price?.toString() || '',
        beds: property.beds?.toString() || '',
        baths: property.baths?.toString() || '',
        sqft: property.sqft?.toString() || '',
        parking: property.parking?.toString() || '0',
        yearBuilt: property.yearBuilt?.toString() || '',
        location: {
          address: property.location?.address || '',
          city: property.location?.city || '',
          county: property.location?.county || '',
          coordinates: property.location?.coordinates || { lat: null, lng: null }
        },
        images: property.images || [],
        features: property.features || [],
        amenities: property.amenities || [],
        agent: {
          name: property.agent?.name || '',
          phone: property.agent?.phone || '',
          email: property.agent?.email || ''
        },
        featured: property.featured || false
      });
    } else {
      setFormData(initialFormState);
    }
    setErrors({});
    setActiveTab('basic');
  }, [property, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const addAmenity = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()]
      }));
      setNewAmenity('');
    }
  };

  const removeAmenity = (index) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      const newImage = {
        url: newImageUrl.trim(),
        caption: '',
        isPrimary: formData.images.length === 0,
        order: formData.images.length
      };
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage]
      }));
      setNewImageUrl('');
    }
  };

  const removeImage = (index) => {
    setFormData(prev => {
      const newImages = prev.images.filter((_, i) => i !== index);
      // If we removed the primary image, make the first one primary
      if (newImages.length > 0 && !newImages.some(img => img.isPrimary)) {
        newImages[0].isPrimary = true;
      }
      return { ...prev, images: newImages };
    });
  };

  const setPrimaryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isPrimary: i === index
      }))
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.beds || parseInt(formData.beds) < 0) newErrors.beds = 'Bedrooms is required';
    if (!formData.baths || parseInt(formData.baths) < 0) newErrors.baths = 'Bathrooms is required';
    if (!formData.location.address.trim()) newErrors['location.address'] = 'Address is required';
    if (!formData.location.city.trim()) newErrors['location.city'] = 'City is required';
    if (!formData.location.county.trim()) newErrors['location.county'] = 'County is required';
    if (!formData.agent.name.trim()) newErrors['agent.name'] = 'Agent name is required';
    if (!formData.agent.phone.trim()) newErrors['agent.phone'] = 'Agent phone is required';
    if (!formData.agent.email.trim()) newErrors['agent.email'] = 'Agent email is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Switch to tab with errors
      if (errors.title || errors.description || errors.price || errors.beds || errors.baths) {
        setActiveTab('basic');
      } else if (errors['location.address'] || errors['location.city'] || errors['location.county']) {
        setActiveTab('location');
      } else if (errors['agent.name'] || errors['agent.phone'] || errors['agent.email']) {
        setActiveTab('agent');
      }
      return;
    }

    // Prepare data for submission
    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      beds: parseInt(formData.beds),
      baths: parseInt(formData.baths),
      sqft: formData.sqft ? parseInt(formData.sqft) : null,
      parking: parseInt(formData.parking) || 0,
      yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt) : null
    };

    onSubmit(submitData);
  };

  if (!isOpen) return null;

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'location', label: 'Location' },
    { id: 'media', label: 'Images' },
    { id: 'features', label: 'Features' },
    { id: 'agent', label: 'Agent' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {property ? 'Edit Property' : 'Add New Property'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-gray-50 px-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium text-sm transition-colors relative ${
                activeTab === tab.id
                  ? 'text-secondary'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary" />
              )}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 3 Bedroom Apartment in Kilimani"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe the property..."
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Listing Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  >
                    <option value="Rent">For Rent</option>
                    <option value="Buy">For Sale</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                  >
                    <option value="apartments">Apartments</option>
                    <option value="houses">Houses</option>
                    <option value="land">Land</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (KES) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent ${
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="50000"
                  />
                  {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bedrooms *
                  </label>
                  <input
                    type="number"
                    name="beds"
                    value={formData.beds}
                    onChange={handleChange}
                    min="0"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent ${
                      errors.beds ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bathrooms *
                  </label>
                  <input
                    type="number"
                    name="baths"
                    value={formData.baths}
                    onChange={handleChange}
                    min="0"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent ${
                      errors.baths ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sqft
                  </label>
                  <input
                    type="number"
                    name="sqft"
                    value={formData.sqft}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    placeholder="1200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parking Spaces
                  </label>
                  <input
                    type="number"
                    name="parking"
                    value={formData.parking}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    placeholder="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year Built
                  </label>
                  <input
                    type="number"
                    name="yearBuilt"
                    value={formData.yearBuilt}
                    onChange={handleChange}
                    min="1900"
                    max={new Date().getFullYear()}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    placeholder="2020"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  id="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="w-4 h-4 text-secondary border-gray-300 rounded focus:ring-secondary"
                />
                <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                  Mark as Featured Property
                </label>
              </div>
            </div>
          )}

          {/* Location Tab */}
          {activeTab === 'location' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="location.address"
                  value={formData.location.address}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent ${
                    errors['location.address'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 123 Ngong Road, Kilimani"
                />
                {errors['location.address'] && <p className="text-red-500 text-sm mt-1">{errors['location.address']}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent ${
                      errors['location.city'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Nairobi"
                  />
                  {errors['location.city'] && <p className="text-red-500 text-sm mt-1">{errors['location.city']}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    County *
                  </label>
                  <input
                    type="text"
                    name="location.county"
                    value={formData.location.county}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent ${
                      errors['location.county'] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Nairobi County"
                  />
                  {errors['location.county'] && <p className="text-red-500 text-sm mt-1">{errors['location.county']}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude (optional)
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="location.coordinates.lat"
                    value={formData.location.coordinates?.lat || ''}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        location: {
                          ...prev.location,
                          coordinates: {
                            ...prev.location.coordinates,
                            lat: e.target.value ? parseFloat(e.target.value) : null
                          }
                        }
                      }));
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    placeholder="-1.2921"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude (optional)
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="location.coordinates.lng"
                    value={formData.location.coordinates?.lng || ''}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        location: {
                          ...prev.location,
                          coordinates: {
                            ...prev.location.coordinates,
                            lng: e.target.value ? parseFloat(e.target.value) : null
                          }
                        }
                      }));
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    placeholder="36.8219"
                  />
                </div>
              </div>

              <p className="text-sm text-gray-500">
                Tip: You can find coordinates by right-clicking on Google Maps and selecting the coordinates.
              </p>
            </div>
          )}

          {/* Images Tab */}
          {activeTab === 'media' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Add Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    placeholder="https://images.unsplash.com/..."
                  />
                  <button
                    type="button"
                    onClick={addImage}
                    className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-opacity-90"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Add image URLs from Unsplash or other image hosting services
                </p>
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image.url}
                        alt={`Property ${index + 1}`}
                        className={`w-full h-32 object-cover rounded-lg ${
                          image.isPrimary ? 'ring-2 ring-secondary' : ''
                        }`}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x200?text=Invalid+URL';
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                        {!image.isPrimary && (
                          <button
                            type="button"
                            onClick={() => setPrimaryImage(index)}
                            className="px-2 py-1 bg-white text-xs rounded hover:bg-gray-100"
                          >
                            Set Primary
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {image.isPrimary && (
                        <span className="absolute top-2 left-2 bg-secondary text-white text-xs px-2 py-1 rounded">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {formData.images.length === 0 && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No images added yet</p>
                  <p className="text-sm text-gray-400">Add image URLs above to display property photos</p>
                </div>
              )}
            </div>
          )}

          {/* Features Tab */}
          {activeTab === 'features' && (
            <div className="space-y-6">
              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Features
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    placeholder="e.g., Modern Kitchen, Balcony, WiFi"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-opacity-90"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
                {/* Quick add suggestions */}
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">Quick add:</p>
                  <div className="flex flex-wrap gap-2">
                    {['WiFi', 'Parking', 'Security', 'Garden', 'Balcony', 'Gym', 'Pool'].map(feature => (
                      !formData.features.includes(feature) && (
                        <button
                          key={feature}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              features: [...prev.features, feature]
                            }));
                          }}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                        >
                          + {feature}
                        </button>
                      )
                    ))}
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Community Amenities
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                    placeholder="e.g., Swimming Pool, 24/7 Security"
                  />
                  <button
                    type="button"
                    onClick={addAmenity}
                    className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-opacity-90"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {amenity}
                      <button
                        type="button"
                        onClick={() => removeAmenity(index)}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
                {/* Quick add suggestions */}
                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-2">Quick add:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Swimming Pool', '24/7 Security', 'Gym', 'Playground', 'CCTV', 'Generator'].map(amenity => (
                      !formData.amenities.includes(amenity) && (
                        <button
                          key={amenity}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              amenities: [...prev.amenities, amenity]
                            }));
                          }}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                        >
                          + {amenity}
                        </button>
                      )
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Agent Tab */}
          {activeTab === 'agent' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Enter the contact details of the agent managing this property.
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agent Name *
                </label>
                <input
                  type="text"
                  name="agent.name"
                  value={formData.agent.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent ${
                    errors['agent.name'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., John Kamau"
                />
                {errors['agent.name'] && <p className="text-red-500 text-sm mt-1">{errors['agent.name']}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agent Phone *
                </label>
                <input
                  type="tel"
                  name="agent.phone"
                  value={formData.agent.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent ${
                    errors['agent.phone'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., +254 721 123 456"
                />
                {errors['agent.phone'] && <p className="text-red-500 text-sm mt-1">{errors['agent.phone']}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agent Email *
                </label>
                <input
                  type="email"
                  name="agent.email"
                  value={formData.agent.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent ${
                    errors['agent.email'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., agent@kejamatch.com"
                />
                {errors['agent.email'] && <p className="text-red-500 text-sm mt-1">{errors['agent.email']}</p>}
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Saving...
              </>
            ) : (
              property ? 'Update Property' : 'Create Property'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyFormModal;