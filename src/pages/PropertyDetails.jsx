import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Car,
  Heart,
  Share2,
  Phone,
  Mail,
  ArrowLeft,
  Calendar,
  Star,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  X,
  Maximize2,
  MessageCircle,
  UserCheck,
  Building,
  Home as HomeIcon,
} from "lucide-react";
import ViewingRequestModal from "../components/viewings/ViewingRequestModal";
import propertyService from "../services/propertyService";

// Format price helper
const formatPrice = (price, type) => {
  if (type === "Rent") {
    if (price >= 1000000) {
      return (
        `KES ${(price / 1000000).toFixed(1)}M`.replace(".0M", "M") + "/month"
      );
    } else if (price >= 1000) {
      return `KES ${(price / 1000).toFixed(0)}K/month`;
    }
    return `KES ${price.toLocaleString()}/month`;
  } else {
    if (price >= 1000000) {
      return `KES ${(price / 1000000).toFixed(1)}M`.replace(".0M", "M");
    } else if (price >= 1000) {
      return `KES ${(price / 1000).toFixed(0)}K`;
    }
    return `KES ${price.toLocaleString()}`;
  }
};

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [showViewingModal, setShowViewingModal] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await propertyService.getProperty(id);
        if (response.success && response.data) {
          setProperty(response.data);
          setContactForm((prev) => ({
            ...prev,
            message: `Hi, I'm interested in ${response.data.title}. Can you provide more details?`,
          }));
        } else {
          setError("Property not found");
        }
      } catch (err) {
        console.error("Error fetching property:", err);
        setError("Failed to load property details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Here you would typically send this to your leads API
      // For now, we'll just simulate the submission
      console.log("Contact form submitted:", {
        ...contactForm,
        propertyId: property._id,
        propertyTitle: property.title,
      });

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert(
        "Your message has been sent to the agent! They will get back to you shortly.",
      );

      setShowContactForm(false);
      setContactForm((prev) => ({
        ...prev,
        name: "",
        email: "",
        phone: "",
      }));
    } catch (err) {
      alert("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const nextImage = () => {
    if (property && images.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1,
      );
    }
  };

  const prevImage = () => {
    if (property && images.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? images.length - 1 : prev - 1,
      );
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `Check out this property: ${property.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Share failed:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Property link copied to clipboard!");
    }
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleBackClick = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/properties");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
            <HomeIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-600 mb-4">
            Property Not Found
          </h2>
          <p className="text-gray-500 mb-6">
            {error ||
              "The property you're looking for doesn't exist or has been removed."}
          </p>
          <Link
            to="/properties"
            className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors"
          >
            Browse Properties
          </Link>
        </motion.div>
      </div>
    );
  }

  // Prepare images array
  const images = property.images?.map((img) => img.url) || [];
  if (images.length === 0) {
    images.push("https://via.placeholder.com/800x600?text=No+Image+Available");
  }

  // Get full address
  const fullAddress = [
    property.location?.address,
    property.location?.city,
    property.location?.county,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border-b shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={handleBackClick}
            className="inline-flex items-center text-secondary hover:text-secondary/80 font-medium transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Properties
          </button>
        </div>
      </motion.div>

      {/* Image Gallery */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative h-96 md:h-[500px] lg:h-[600px]"
      >
        <img
          src={images[currentImageIndex]}
          alt={property.title}
          className="w-full h-full object-cover cursor-pointer"
          onClick={() => setShowImageModal(true)}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://via.placeholder.com/800x600?text=Image+Not+Available";
          }}
        />

        {/* Image Navigation */}
        {images.length > 1 && (
          <>
            <motion.button
              onClick={prevImage}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-colors shadow-lg"
            >
              <ChevronLeft size={24} />
            </motion.button>
            <motion.button
              onClick={nextImage}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-colors shadow-lg"
            >
              <ChevronRight size={24} />
            </motion.button>
          </>
        )}

        {/* Image Counter & Expand Button */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          {images.length > 1 && (
            <>
              <motion.button
                onClick={() => setShowImageModal(true)}
                whileHover={{ scale: 1.05 }}
                className="bg-black/70 text-white px-3 py-2 rounded-full text-sm flex items-center gap-2 hover:bg-black/80 transition-colors"
              >
                <Maximize2 size={16} />
                View All Photos
              </motion.button>
              <div className="bg-black/70 text-white px-3 py-2 rounded-full text-sm">
                {currentImageIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <motion.button
            onClick={toggleLike}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-colors shadow-lg"
          >
            <Heart
              size={20}
              className={
                isLiked ? "fill-red-500 text-red-500" : "text-gray-600"
              }
            />
          </motion.button>
          <motion.button
            onClick={handleShare}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-colors shadow-lg"
          >
            <Share2 size={20} className="text-gray-600" />
          </motion.button>
        </div>

        {/* Property Type Badge */}
        <div className="absolute top-4 left-4">
          <span
            className={`px-4 py-2 rounded-full text-white font-semibold shadow-lg ${
              property.type === "Rent" ? "bg-orange-500" : "bg-green-500"
            }`}
          >
            For {property.type}
          </span>
        </div>

        {/* Featured Badge */}
        {property.featured && (
          <div className="absolute top-4 left-32">
            <span className="px-4 py-2 rounded-full bg-yellow-400 text-white font-semibold shadow-lg flex items-center">
              <Star size={16} className="mr-1 fill-current" />
              Featured
            </span>
          </div>
        )}
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">
                    {property.title}
                  </h1>
                  <p className="text-gray-600 flex items-center text-lg">
                    <MapPin
                      size={20}
                      className="mr-2 text-secondary flex-shrink-0"
                    />
                    {fullAddress || "Location not specified"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl md:text-4xl font-bold text-secondary mb-2">
                    {formatPrice(property.price, property.type)}
                  </p>
                  {property.type === "Rent" && (
                    <span className="text-gray-600">/month</span>
                  )}
                </div>
              </div>

              {/* Property Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 mt-8">
                {[
                  { icon: Bed, value: property.beds || 0, label: "Bedrooms" },
                  {
                    icon: Bath,
                    value: property.baths || 0,
                    label: "Bathrooms",
                  },
                  {
                    icon: Square,
                    value: property.sqft ? `${property.sqft}` : "N/A",
                    label: "Sqft",
                  },
                  { icon: Car, value: property.parking || 0, label: "Parking" },
                  {
                    icon: Calendar,
                    value: property.yearBuilt || "N/A",
                    label: "Built",
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="text-center p-4 bg-gray-50 rounded-xl"
                  >
                    <stat.icon
                      size={24}
                      className="mx-auto mb-2 text-secondary"
                    />
                    <div className="text-xl md:text-2xl font-bold text-primary">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-primary mb-6">
                Property Description
              </h2>
              <div className="prose prose-gray max-w-none">
                {property.description ? (
                  property.description.split("\n").map(
                    (paragraph, index) =>
                      paragraph.trim() && (
                        <p
                          key={index}
                          className="text-gray-700 leading-relaxed mb-4 text-lg"
                        >
                          {paragraph.trim()}
                        </p>
                      ),
                  )
                ) : (
                  <p className="text-gray-500">
                    No description available for this property.
                  </p>
                )}
              </div>
            </motion.div>

            {/* Features & Amenities */}
            {((property.features && property.features.length > 0) ||
              (property.amenities && property.amenities.length > 0)) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-xl shadow-lg p-8"
              >
                <h2 className="text-2xl font-bold text-primary mb-8">
                  Features & Amenities
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {property.features && property.features.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-primary mb-4 flex items-center">
                        <CheckCircle
                          className="mr-2 text-green-500"
                          size={20}
                        />
                        Property Features
                      </h3>
                      <div className="space-y-3">
                        {property.features.map((feature, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className="flex items-center text-gray-700 hover:text-primary transition-colors"
                          >
                            <div className="w-2 h-2 bg-secondary rounded-full mr-3 flex-shrink-0"></div>
                            {feature}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {property.amenities && property.amenities.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-primary mb-4 flex items-center">
                        <Building className="mr-2 text-blue-500" size={20} />
                        Community Amenities
                      </h3>
                      <div className="space-y-3">
                        {property.amenities.map((amenity, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className="flex items-center text-gray-700 hover:text-primary transition-colors"
                          >
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                            {amenity}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-primary mb-6">
                Contact Agent
              </h3>

              {property.agent ? (
                <>
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mr-4">
                      <span className="text-2xl font-bold text-secondary">
                        {property.agent.name?.charAt(0) || "A"}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-primary text-lg">
                        {property.agent.name}
                      </h4>
                      <div className="flex items-center text-sm text-gray-600">
                        <UserCheck size={14} className="mr-1" />
                        Verified Agent
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <motion.a
                      href={`tel:${property.agent.phone}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-secondary to-accent text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                    >
                      <Phone size={18} className="mr-2" />
                      {property.agent.phone}
                    </motion.a>

                    <motion.a
                      href={`mailto:${property.agent.email}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-primary text-white py-3 px-4 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 flex items-center justify-center"
                    >
                      <Mail size={18} className="mr-2" />
                      Send Email
                    </motion.a>

                    <motion.button
                      onClick={() => setShowContactForm(true)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gray-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-300 flex items-center justify-center"
                    >
                      <MessageCircle size={18} className="mr-2" />
                      Send Message
                    </motion.button>
                    <motion.button
                      onClick={() => setShowViewingModal(true)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-700 transition-all duration-300 flex items-center justify-center mt-3"
                    >
                      <Calendar size={18} className="mr-2" />
                      Schedule Viewing
                    </motion.button>
                    <ViewingRequestModal
                      isOpen={showViewingModal}
                      onClose={() => setShowViewingModal(false)}
                      property={property}
                    />
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Agent information not available
                </p>
              )}
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-bold text-primary mb-4">
                Property Details
              </h3>
              <div className="space-y-4">
                {[
                  {
                    label: "Property ID",
                    value: `#${property._id?.slice(-6) || "N/A"}`,
                  },
                  { label: "Property Type", value: property.category || "N/A" },
                  { label: "Year Built", value: property.yearBuilt || "N/A" },
                  { label: "Listing Type", value: `For ${property.type}` },
                  { label: "Status", value: property.status || "Available" },
                  { label: "Views", value: property.views || 0 },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-semibold text-primary capitalize">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {showImageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-6xl max-h-full"
            >
              <img
                src={images[currentImageIndex]}
                alt={property.title}
                className="max-w-full max-h-[80vh] object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://via.placeholder.com/800x600?text=Image+Not+Available";
                }}
              />

              <button
                onClick={() => setShowImageModal(false)}
                className="absolute top-4 right-4 bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition-colors"
              >
                <X size={24} />
              </button>

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition-colors"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition-colors"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
                {currentImageIndex + 1} of {images.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Form Modal */}
      <AnimatePresence>
        {showContactForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl max-w-md w-full p-6"
            >
              <h3 className="text-xl font-bold text-primary mb-6">
                Contact Agent
              </h3>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={contactForm.name}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-colors"
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  value={contactForm.email}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-colors"
                  required
                />
                <input
                  type="tel"
                  placeholder="Your Phone Number"
                  value={contactForm.phone}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, phone: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-colors"
                  required
                />
                <textarea
                  placeholder="Your Message"
                  rows="4"
                  value={contactForm.message}
                  onChange={(e) =>
                    setContactForm({ ...contactForm, message: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none resize-none transition-colors"
                  required
                ></textarea>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="flex-1 px-4 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-secondary to-accent text-white rounded-lg hover:shadow-lg transition-all duration-300 font-semibold disabled:opacity-50"
                  >
                    {submitting ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PropertyDetails;
