import React, { useState, useEffect, useRef } from "react";
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
  Grid3X3,
  Copy,
  Facebook,
  Twitter,
  ExternalLink,
  Sparkles,
  Shield,
  Clock,
  Eye,
  ArrowRight,
  MapPinned,
  Wifi,
  Wind,
  Dumbbell,
  TreePine,
  ParkingCircle,
  ShieldCheck,
  Waves,
  Tv,
  UtensilsCrossed,
  Shirt,
} from "lucide-react";
import ViewingRequestModal from "../components/viewings/ViewingRequestModal";
import propertyService from "../services/propertyService";
import clientService from "../services/clientService";
import SEO from "../components/common/SEO";
import GoogleMaps from "../components/common/GoogleMaps";

// Import property data for similar properties and fallback
import { properties, formatPrice as formatStaticPrice } from "../data/properties";

// Format price helper
const formatPrice = (price, type) => {
  if (type === "Rent") {
    if (price >= 1000000) {
      return `KES ${(price / 1000000).toFixed(1)}M`.replace(".0M", "M") + "/mo";
    } else if (price >= 1000) {
      return `KES ${(price / 1000).toFixed(0)}K/mo`;
    }
    return `KES ${price.toLocaleString()}/mo`;
  } else {
    if (price >= 1000000) {
      return `KES ${(price / 1000000).toFixed(1)}M`.replace(".0M", "M");
    } else if (price >= 1000) {
      return `KES ${(price / 1000).toFixed(0)}K`;
    }
    return `KES ${price.toLocaleString()}`;
  }
};

// Amenity icons mapping
const amenityIcons = {
  wifi: Wifi,
  "air conditioning": Wind,
  ac: Wind,
  gym: Dumbbell,
  pool: Waves,
  swimming: Waves,
  garden: TreePine,
  parking: ParkingCircle,
  security: ShieldCheck,
  tv: Tv,
  kitchen: UtensilsCrossed,
  laundry: Shirt,
};

const getAmenityIcon = (amenity) => {
  const lowerAmenity = amenity.toLowerCase();
  for (const [key, Icon] of Object.entries(amenityIcons)) {
    if (lowerAmenity.includes(key)) {
      return Icon;
    }
  }
  return CheckCircle;
};

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [showViewingModal, setShowViewingModal] = useState(false);
  const [similarProperties, setSimilarProperties] = useState([]);

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

          // Get similar properties from static data
          const similar = properties
            .filter(p => p.id !== id && p.category === response.data.category)
            .slice(0, 3);
          setSimilarProperties(similar);
        } else {
          // Fallback: Check static properties data
          const staticProperty = properties.find(p => String(p.id) === String(id));
          if (staticProperty) {
            // Transform static property to match API format
            const transformedProperty = {
              _id: String(staticProperty.id),
              title: staticProperty.title,
              description: staticProperty.description || `Beautiful ${staticProperty.category} property located in ${staticProperty.location}. This property features ${staticProperty.beds} bedrooms and ${staticProperty.baths} bathrooms with ${staticProperty.sqft} square feet of living space.`,
              price: staticProperty.price,
              type: staticProperty.type,
              category: staticProperty.category,
              beds: staticProperty.beds,
              baths: staticProperty.baths,
              sqft: staticProperty.sqft,
              parking: staticProperty.parking || 1,
              yearBuilt: staticProperty.yearBuilt,
              location: {
                address: staticProperty.location,
                city: staticProperty.location.split(',')[0],
                county: staticProperty.location.split(',')[1]?.trim() || 'Nairobi',
              },
              coordinates: staticProperty.coordinates,
              images: [{ url: staticProperty.image }],
              features: staticProperty.features || [],
              amenities: staticProperty.amenities || [],
              agent: staticProperty.agent,
              featured: staticProperty.featured,
              status: 'available',
              views: Math.floor(Math.random() * 500) + 50,
            };
            setProperty(transformedProperty);
            setContactForm((prev) => ({
              ...prev,
              message: `Hi, I'm interested in ${transformedProperty.title}. Can you provide more details?`,
            }));

            // Get similar properties
            const similar = properties
              .filter(p => String(p.id) !== String(staticProperty.id) && p.category === staticProperty.category)
              .slice(0, 3);
            setSimilarProperties(similar);
          } else {
            setError("Property not found");
          }
        }
      } catch (err) {
        console.error("Error fetching property:", err);
        // Fallback: Check static properties data on error
        const staticProperty = properties.find(p => String(p.id) === String(id));
        if (staticProperty) {
          const transformedProperty = {
            _id: String(staticProperty.id),
            title: staticProperty.title,
            description: staticProperty.description || `Beautiful ${staticProperty.category} property located in ${staticProperty.location}. This property features ${staticProperty.beds} bedrooms and ${staticProperty.baths} bathrooms with ${staticProperty.sqft} square feet of living space.`,
            price: staticProperty.price,
            type: staticProperty.type,
            category: staticProperty.category,
            beds: staticProperty.beds,
            baths: staticProperty.baths,
            sqft: staticProperty.sqft,
            parking: staticProperty.parking || 1,
            yearBuilt: staticProperty.yearBuilt,
            location: {
              address: staticProperty.location,
              city: staticProperty.location.split(',')[0],
              county: staticProperty.location.split(',')[1]?.trim() || 'Nairobi',
            },
            coordinates: staticProperty.coordinates,
            images: [{ url: staticProperty.image }],
            features: staticProperty.features || [],
            amenities: staticProperty.amenities || [],
            agent: staticProperty.agent,
            featured: staticProperty.featured,
            status: 'available',
            views: Math.floor(Math.random() * 500) + 50,
          };
          setProperty(transformedProperty);
          setContactForm((prev) => ({
            ...prev,
            message: `Hi, I'm interested in ${transformedProperty.title}. Can you provide more details?`,
          }));

          const similar = properties
            .filter(p => String(p.id) !== String(staticProperty.id) && p.category === staticProperty.category)
            .slice(0, 3);
          setSimilarProperties(similar);
        } else {
          setError("Failed to load property details");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
      window.scrollTo(0, 0);
    }
  }, [id]);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      console.log("Contact form submitted:", {
        ...contactForm,
        propertyId: property._id,
        propertyTitle: property.title,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert("Your message has been sent to the agent! They will get back to you shortly.");

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
      setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  const prevImage = () => {
    if (property && images.length > 1) {
      setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
  };

  const handleShare = async (platform) => {
    const shareUrl = window.location.href;
    const shareText = `Check out this property: ${property.title}`;

    switch (platform) {
      case "copy":
        navigator.clipboard.writeText(shareUrl);
        alert("Property link copied to clipboard!");
        break;
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
        break;
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, "_blank");
        break;
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`, "_blank");
        break;
      default:
        if (navigator.share) {
          try {
            await navigator.share({ title: property.title, text: shareText, url: shareUrl });
          } catch (error) {
            console.log("Share failed:", error);
          }
        }
    }
    setShowShareMenu(false);
  };

  // Check if property is saved on mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user?.role === "client" && id) {
      clientService
        .getSavedProperties()
        .then((res) => {
          const saved = (res.data || []).some((p) => p._id === id);
          setIsLiked(saved);
        })
        .catch(() => {});
    }
  }, [id]);

  const toggleLike = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user || user.role !== "client") {
      navigate("/client/login");
      return;
    }
    try {
      if (isLiked) {
        await clientService.unsaveProperty(id);
      } else {
        await clientService.saveProperty(id);
      }
      setIsLiked(!isLiked);
    } catch (err) {
      console.error("Failed to toggle save:", err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-secondary/30 border-t-secondary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading property details...</p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error || !property) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <HomeIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-4">Property Not Found</h2>
          <p className="text-gray-600 mb-8">
            {error || "The property you're looking for doesn't exist or has been removed."}
          </p>
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-full font-semibold hover:bg-secondary/90 transition-colors"
          >
            <ArrowLeft size={18} />
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
  const fullAddress = [property.location?.address, property.location?.city, property.location?.county]
    .filter(Boolean)
    .join(", ");

  // Build SEO description
  const seoDescription = property
    ? `${property.bedrooms || ""} bedroom ${property.category || "property"} ${property.listingType === "Rent" ? "for rent" : "for sale"} in ${property.location?.area || property.location?.city || "Kenya"}. ${property.bathrooms ? `${property.bathrooms} bathrooms.` : ""} ${property.size ? `${property.size} sq ft.` : ""} Price: KES ${property.price?.toLocaleString()}${property.listingType === "Rent" ? "/month" : ""}.`
    : "";

  // Property stats
  const propertyStats = [
    { icon: Bed, value: property.beds || 0, label: "Bedrooms", color: "bg-blue-500" },
    { icon: Bath, value: property.baths || 0, label: "Bathrooms", color: "bg-emerald-500" },
    { icon: Square, value: property.sqft ? `${property.sqft}` : "N/A", label: "Sq Ft", color: "bg-amber-500" },
    { icon: Car, value: property.parking || 0, label: "Parking", color: "bg-purple-500" },
    { icon: Calendar, value: property.yearBuilt || "N/A", label: "Year Built", color: "bg-rose-500" },
  ];

  return (
    <>
      {property && (
        <SEO
          title={`${property.title} - ${property.location?.area || property.location?.city || "Kenya"}`}
          description={seoDescription}
          keywords={`${property.category} ${property.location?.area || ""} ${property.location?.city || ""} Kenya, ${property.listingType === "Rent" ? "rent" : "buy"} property Kenya`}
          canonicalUrl={`/properties/${id}`}
          ogImage={property.images?.[0]}
          ogType="product"
          propertyData={{
            title: property.title,
            description: property.description,
            price: property.price,
            location: property.location,
            images: property.images,
            bedrooms: property.bedrooms,
            bathrooms: property.bathrooms,
            size: property.size,
            coordinates: property.coordinates,
            datePosted: property.createdAt,
          }}
          breadcrumbs={[
            { name: "Home", url: "/" },
            { name: "Properties", url: "/properties" },
            { name: property.title, url: `/properties/${id}` },
          ]}
        />
      )}

      <div className="min-h-screen bg-cream">
        {/* Breadcrumb Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-b"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center text-sm">
              <Link to="/" className="text-gray-500 hover:text-secondary transition-colors">
                Home
              </Link>
              <ChevronRight size={16} className="mx-2 text-gray-400" />
              <Link to="/properties" className="text-gray-500 hover:text-secondary transition-colors">
                Properties
              </Link>
              <ChevronRight size={16} className="mx-2 text-gray-400" />
              <span className="text-primary font-medium truncate max-w-[200px]">
                {property.title}
              </span>
            </nav>
          </div>
        </motion.div>

        {/* Image Gallery Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Main Image */}
              <div className="lg:col-span-3 relative rounded-3xl overflow-hidden">
                <div className="aspect-[16/10] relative group">
                  <img
                    src={images[currentImageIndex]}
                    alt={property.title}
                    className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-105"
                    onClick={() => setShowImageModal(true)}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/800x600?text=Image+Not+Available";
                    }}
                  />

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className={`px-4 py-2 rounded-full text-white font-semibold shadow-lg text-sm ${
                      property.type === "Rent" ? "bg-emerald-500" : "bg-blue-500"
                    }`}>
                      For {property.type}
                    </span>
                    {property.featured && (
                      <span className="px-4 py-2 rounded-full bg-accent text-primary font-semibold shadow-lg flex items-center text-sm">
                        <Star size={14} className="mr-1 fill-current" />
                        Featured
                      </span>
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
                        className={isLiked ? "fill-red-500 text-red-500" : "text-gray-600"}
                      />
                    </motion.button>
                    <div className="relative">
                      <motion.button
                        onClick={() => setShowShareMenu(!showShareMenu)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-colors shadow-lg"
                      >
                        <Share2 size={20} className="text-gray-600" />
                      </motion.button>

                      {/* Share Menu */}
                      <AnimatePresence>
                        {showShareMenu && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-warm-lg p-3 min-w-[180px] z-20"
                          >
                            <button
                              onClick={() => handleShare("copy")}
                              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                            >
                              <Copy size={16} />
                              Copy Link
                            </button>
                            <button
                              onClick={() => handleShare("whatsapp")}
                              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                            >
                              <MessageCircle size={16} />
                              WhatsApp
                            </button>
                            <button
                              onClick={() => handleShare("facebook")}
                              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                            >
                              <Facebook size={16} />
                              Facebook
                            </button>
                            <button
                              onClick={() => handleShare("twitter")}
                              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                            >
                              <Twitter size={16} />
                              Twitter
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <motion.button
                        onClick={prevImage}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-colors shadow-lg"
                      >
                        <ChevronLeft size={24} />
                      </motion.button>
                      <motion.button
                        onClick={nextImage}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-colors shadow-lg"
                      >
                        <ChevronRight size={24} />
                      </motion.button>
                    </>
                  )}

                  {/* View All Photos Button */}
                  <motion.button
                    onClick={() => setShowImageModal(true)}
                    whileHover={{ scale: 1.02 }}
                    className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-white transition-colors shadow-lg"
                  >
                    <Grid3X3 size={16} />
                    View All ({images.length})
                  </motion.button>
                </div>
              </div>

              {/* Thumbnail Grid */}
              <div className="hidden lg:grid grid-rows-4 gap-4">
                {images.slice(1, 5).map((img, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className={`relative rounded-2xl overflow-hidden cursor-pointer ${
                      index === 3 && images.length > 5 ? "relative" : ""
                    }`}
                    onClick={() => {
                      setCurrentImageIndex(index + 1);
                      if (index === 3 && images.length > 5) {
                        setShowImageModal(true);
                      }
                    }}
                  >
                    <img
                      src={img}
                      alt={`View ${index + 2}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/400x300?text=Image";
                      }}
                    />
                    {index === 3 && images.length > 5 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white font-bold text-xl">+{images.length - 5}</span>
                      </div>
                    )}
                  </motion.div>
                ))}
                {images.length === 1 && (
                  <div className="row-span-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <p className="text-gray-400 text-sm">No additional photos</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Property Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Property Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl shadow-soft p-8"
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium">
                        <Building size={14} />
                        {property.category || "Property"}
                      </span>
                      <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                        <Eye size={14} />
                        {property.views || 0} views
                      </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">
                      {property.title}
                    </h1>
                    <p className="text-gray-600 flex items-center text-lg">
                      <MapPin size={20} className="mr-2 text-secondary flex-shrink-0" />
                      {fullAddress || "Location not specified"}
                    </p>
                  </div>
                  <div className="md:text-right">
                    <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-2xl p-4 inline-block">
                      <p className="text-3xl md:text-4xl font-bold text-secondary">
                        {formatPrice(property.price, property.type)}
                      </p>
                      {property.type === "Rent" && (
                        <span className="text-gray-500 text-sm">per month</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Property Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-8">
                  {propertyStats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      whileHover={{ y: -4 }}
                      className="bg-gray-50 hover:bg-gray-100 rounded-2xl p-4 text-center transition-all duration-300"
                    >
                      <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                        <stat.icon size={20} className="text-white" />
                      </div>
                      <div className="text-xl font-bold text-primary">{stat.value}</div>
                      <div className="text-sm text-gray-500">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-3xl shadow-soft p-8"
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                    <Sparkles size={20} className="text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-primary">About This Property</h2>
                </div>
                <div className="prose prose-gray max-w-none">
                  {property.description ? (
                    property.description.split("\n").map(
                      (paragraph, index) =>
                        paragraph.trim() && (
                          <p key={index} className="text-gray-600 leading-relaxed mb-4 text-lg">
                            {paragraph.trim()}
                          </p>
                        )
                    )
                  ) : (
                    <p className="text-gray-500">No description available for this property.</p>
                  )}
                </div>
              </motion.div>

              {/* Features & Amenities */}
              {((property.features && property.features.length > 0) ||
                (property.amenities && property.amenities.length > 0)) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-3xl shadow-soft p-8"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                      <CheckCircle size={20} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-primary">Features & Amenities</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {property.features && property.features.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
                          <HomeIcon className="mr-2 text-secondary" size={18} />
                          Property Features
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {property.features.map((feature, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 * index }}
                              className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3"
                            >
                              <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
                              <span className="text-gray-700">{feature}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {property.amenities && property.amenities.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-primary mb-4 flex items-center">
                          <Building className="mr-2 text-blue-500" size={18} />
                          Community Amenities
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {property.amenities.map((amenity, index) => {
                            const AmenityIcon = getAmenityIcon(amenity);
                            return (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * index }}
                                className="flex items-center gap-3 bg-blue-50 rounded-xl px-4 py-3"
                              >
                                <AmenityIcon size={16} className="text-blue-500 flex-shrink-0" />
                                <span className="text-gray-700">{amenity}</span>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Location Map */}
              {property.coordinates && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white rounded-3xl shadow-soft p-8"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center">
                      <MapPinned size={20} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-primary">Location</h2>
                  </div>
                  <div className="rounded-2xl overflow-hidden h-[400px]">
                    <GoogleMaps
                      properties={[{
                        id: property._id,
                        title: property.title,
                        lat: property.coordinates.lat,
                        lng: property.coordinates.lng,
                        price: property.price,
                        type: property.type,
                      }]}
                      selectedPropertyId={property._id}
                      height="400px"
                    />
                  </div>
                  <p className="mt-4 text-gray-600 flex items-center">
                    <MapPin size={16} className="mr-2 text-secondary" />
                    {fullAddress}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Agent Card */}
              <motion.div
                ref={sidebarRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-3xl shadow-soft p-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <UserCheck size={16} className="text-secondary" />
                  </div>
                  <h3 className="text-lg font-bold text-primary">Contact Agent</h3>
                </div>

                {property.agent ? (
                  <>
                    <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-2xl">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl font-bold text-white">
                          {property.agent.name?.charAt(0) || "A"}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-primary text-lg">{property.agent.name}</h4>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Shield size={14} className="text-emerald-500" />
                          <span>Verified Agent</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <motion.a
                        href={`tel:${property.agent.phone}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-secondary to-orange-500 text-white py-4 px-4 rounded-2xl font-semibold hover:shadow-warm-lg transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Phone size={18} />
                        {property.agent.phone}
                      </motion.a>

                      <motion.a
                        href={`mailto:${property.agent.email}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-primary text-white py-4 px-4 rounded-2xl font-semibold hover:bg-primary/90 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Mail size={18} />
                        Send Email
                      </motion.a>

                      <motion.button
                        onClick={() => setShowContactForm(true)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gray-100 text-gray-700 py-4 px-4 rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <MessageCircle size={18} />
                        Send Message
                      </motion.button>

                      <motion.button
                        onClick={() => setShowViewingModal(true)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-emerald-500 text-white py-4 px-4 rounded-2xl font-semibold hover:bg-emerald-600 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Calendar size={18} />
                        Schedule Viewing
                      </motion.button>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Agent information not available
                  </p>
                )}

                <ViewingRequestModal
                  isOpen={showViewingModal}
                  onClose={() => setShowViewingModal(false)}
                  property={property}
                />
              </motion.div>

              {/* Property Details Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-3xl shadow-soft p-6"
              >
                <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                  <Building size={18} className="text-secondary" />
                  Property Details
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Property ID", value: `#${property._id?.slice(-6) || "N/A"}` },
                    { label: "Property Type", value: property.category || "N/A" },
                    { label: "Year Built", value: property.yearBuilt || "N/A" },
                    { label: "Listing Type", value: `For ${property.type}` },
                    { label: "Status", value: property.status || "Available" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
                    >
                      <span className="text-gray-500">{item.label}</span>
                      <span className="font-semibold text-primary capitalize">{item.value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Safety Tips */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-amber-50 rounded-3xl p-6 border border-amber-100"
              >
                <h3 className="text-lg font-bold text-amber-800 mb-3 flex items-center gap-2">
                  <Shield size={18} />
                  Safety Tips
                </h3>
                <ul className="text-sm text-amber-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle size={14} className="mt-0.5 flex-shrink-0" />
                    <span>Always meet in public places for initial meetings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={14} className="mt-0.5 flex-shrink-0" />
                    <span>Verify property ownership before making payments</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle size={14} className="mt-0.5 flex-shrink-0" />
                    <span>Never pay without viewing the property first</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>

          {/* Similar Properties */}
          {similarProperties.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-16"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-primary mb-2">Similar Properties</h2>
                  <p className="text-gray-600">You might also be interested in these properties</p>
                </div>
                <Link
                  to="/properties"
                  className="hidden md:flex items-center gap-2 text-secondary font-semibold hover:gap-3 transition-all"
                >
                  View All
                  <ArrowRight size={18} />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {similarProperties.map((prop, index) => (
                  <motion.div
                    key={prop.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    whileHover={{ y: -8 }}
                    className="group"
                  >
                    <Link to={`/properties/${prop.id}`}>
                      <div className="bg-white rounded-3xl shadow-soft hover:shadow-warm-lg transition-all duration-500 overflow-hidden">
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={prop.image}
                            alt={prop.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute top-3 left-3">
                            <span className={`px-3 py-1 rounded-full text-white text-xs font-bold ${
                              prop.type === "Rent" ? "bg-emerald-500" : "bg-blue-500"
                            }`}>
                              For {prop.type}
                            </span>
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="font-bold text-primary group-hover:text-secondary transition-colors mb-2 line-clamp-1">
                            {prop.title}
                          </h3>
                          <p className="text-gray-500 text-sm flex items-center mb-3">
                            <MapPin size={14} className="mr-1" />
                            {prop.location}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-bold text-secondary">
                              {formatPrice(prop.price, prop.type)}
                            </span>
                            <div className="flex items-center gap-3 text-gray-500 text-sm">
                              <span className="flex items-center gap-1">
                                <Bed size={14} />
                                {prop.beds}
                              </span>
                              <span className="flex items-center gap-1">
                                <Bath size={14} />
                                {prop.baths}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </div>

        {/* Image Modal */}
        <AnimatePresence>
          {showImageModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 flex items-center justify-center p-4 z-50"
              onClick={() => setShowImageModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-6xl max-h-full w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={images[currentImageIndex]}
                  alt={property.title}
                  className="max-w-full max-h-[85vh] object-contain mx-auto"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/800x600?text=Image+Not+Available";
                  }}
                />

                <button
                  onClick={() => setShowImageModal(false)}
                  className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
                >
                  <X size={24} />
                </button>

                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}

                {/* Thumbnail strip */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                        index === currentImageIndex ? "border-white" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
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
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setShowContactForm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-3xl max-w-md w-full p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-primary">Contact Agent</h3>
                  <button
                    onClick={() => setShowContactForm(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                      rows="4"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-secondary/50 focus:border-secondary outline-none resize-none transition-all"
                      required
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowContactForm(false)}
                      className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-secondary to-orange-500 text-white rounded-xl hover:shadow-warm-lg transition-all duration-300 font-semibold disabled:opacity-50"
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
    </>
  );
};

export default PropertyDetails;
