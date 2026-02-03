import React, { useState } from "react";
import SEO from "../components/common/SEO";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  ArrowRight,
  TrendingUp,
  Award,
  Users,
  Clock,
  Star,
  Wifi,
  Car,
  Shield,
  Building2,
  TreePine,
} from "lucide-react";

// Import components
import EnhancedSearch from "../components/home/EnhancedSearch";
import PropertyCard from "../components/properties/PropertyCard";

// Import data
import { properties, formatPrice } from "../data/properties";
import { blogPosts } from "../data/blogs"; // Import from blog data
import { bnbListings, formatBnbPrice } from "../data/bnbs"; // Import BNB data

const Home = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchMetadata, setSearchMetadata] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Featured properties for display
  const featuredProperties = properties.slice(0, 3);

  // Featured BNBs for display
  const featuredBnbs = bnbListings.slice(0, 4);

  // Latest blog posts for display
  const latestBlogPosts = blogPosts.slice(0, 4);

  // Handle search results
  const handleSearchResults = (results, metadata) => {
    setSearchResults(results);
    setSearchMetadata(metadata);
    setShowSearchResults(results.length > 0 || metadata.query);
  };

  return (
    <>
      <SEO
        title="Find Your Dream Home in Kenya"
        description="Discover premium real estate properties, luxury homes, apartments, and top-rated BNBs across Kenya. Browse properties for sale and rent in Nairobi, Mombasa, Kisumu, and beyond."
        keywords="real estate Kenya, properties for sale Kenya, houses for rent Nairobi, apartments Kenya, BNB Kenya, luxury homes Kenya, property investment Kenya"
        canonicalUrl="/"
      />
      <div className="min-h-screen">
      {/* Hero Section with Enhanced Search */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1444676632488-26a136c45b9b?w=1920&h=1080&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTA4fHxyZWFsJTIwZXN0YXRlfGVufDB8fDB8fHww"
            alt="Luxury Home"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-20">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.1, 1, 1.1],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"
          />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-30">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-6xl mx-auto"
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Turn Your Property <br />
              <span className="text-accent">Aspirations Into Reality</span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Find your ideal home, land, or investment property today with
              Kenya's most trusted real estate platform
            </motion.p>

            {/* Enhanced Search Bar */}
            <EnhancedSearch
              onSearchResults={handleSearchResults}
              showResults={true}
              className="max-w-4xl mx-auto"
            />
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white z-30"
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce"></div>
          </div>
        </motion.div>
      </section>

      {/* Search Results Section */}
      <AnimatePresence>
        {showSearchResults && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            className="py-16 bg-gray-50 border-t"
          >
            <div className="container mx-auto px-4">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-primary mb-2">
                  Search Results
                  {searchMetadata?.query && (
                    <span className="text-secondary ml-2">
                      for "{searchMetadata.query}"
                    </span>
                  )}
                </h2>
                <p className="text-gray-600">
                  Found {searchResults.length}{" "}
                  {searchResults.length === 1 ? "property" : "properties"}
                  {searchMetadata?.location && (
                    <span> in {searchMetadata.location.name}</span>
                  )}
                </p>
              </div>

              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {searchResults.map((property, index) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <PropertyCard property={property} />
                    </motion.div>
                  ))}
                </div>
              ) : searchMetadata?.query ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                    <MapPin className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No properties found
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Try adjusting your search criteria or browse our featured
                    properties below.
                  </p>
                  <button
                    onClick={() => setShowSearchResults(false)}
                    className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors"
                  >
                    Browse Featured Properties
                  </button>
                </div>
              ) : null}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Featured Properties Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="text-4xl font-bold text-primary mb-2">
                Featured Properties
              </h2>
              <p className="text-gray-600">Handpicked properties for you</p>
            </div>
            <Link
              to="/properties"
              className="hidden md:flex items-center gap-2 text-secondary hover:text-secondary/80 font-semibold transition-colors"
            >
              View All Properties
              <ArrowRight size={20} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                <Link to={`/properties/${property.id}`}>
                  <div className="relative overflow-hidden">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          property.type === "Rent"
                            ? "bg-green-500 text-white"
                            : "bg-blue-500 text-white"
                        }`}
                      >
                        For {property.type}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-full text-xs font-medium capitalize">
                        {property.category.replace("s", "")}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="text-white text-2xl font-bold">
                        {formatPrice(property.price, property.type)}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-secondary transition-colors mb-2 line-clamp-2">
                      {property.title}
                    </h3>

                    <p className="text-gray-500 mb-4 flex items-center">
                      <MapPin size={16} className="mr-2 text-secondary" />
                      {property.location}
                    </p>

                    <div className="flex items-center justify-between mb-4 text-gray-600">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Bed size={16} />
                          {property.beds}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath size={16} />
                          {property.baths}
                        </span>
                        <span className="flex items-center gap-1">
                          <Square size={16} />
                          {property.sqft} sqft
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      {property.features.slice(0, 3).map((feature, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          {feature}
                        </span>
                      ))}
                      {property.features.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{property.features.length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center">
                        <img
                          src={property.agent.avatar}
                          alt={property.agent.name}
                          className="w-8 h-8 rounded-full mr-2 border-2 border-gray-100"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-800">
                            {property.agent.name}
                          </span>
                          <div className="flex items-center">
                            <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                            <span className="text-xs text-gray-500">
                              {property.agent.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Built in</div>
                        <div className="text-sm font-medium text-gray-800">
                          {property.yearBuilt}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center md:hidden"
          >
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 font-semibold transition-colors"
            >
              View All Properties
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Why Choose Us
            </h2>
            <p className="text-gray-600 text-lg">
              We make finding your dream home easy
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: MapPin,
                title: "Find your future home",
                description:
                  "We help you find a new home by offering a smart real estate experience",
                color: "bg-blue-500",
              },
              {
                icon: Users,
                title: "Experienced agents",
                description:
                  "Find an experienced agent who knows your market best",
                color: "bg-purple-500",
              },
              {
                icon: TrendingUp,
                title: "Buy or rent homes",
                description:
                  "Millions of houses and apartments in your favourite cities",
                color: "bg-secondary",
              },
              {
                icon: Award,
                title: "List your own property",
                description: "Sign up now and sell or rent your own properties",
                color: "bg-green-500",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="text-center group"
              >
                <div
                  className={`w-20 h-20 mx-auto mb-4 ${feature.color} rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}
                >
                  <feature.icon className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured BNBs Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="text-4xl font-bold text-primary mb-2">
                Featured Short Stays
              </h2>
              <p className="text-gray-600">
                Discover unique places to stay for your next getaway
              </p>
            </div>
            <Link
              to="/bnbs"
              className="hidden md:flex items-center gap-2 text-secondary hover:text-secondary/80 font-semibold transition-colors"
            >
              View All BNBs
              <ArrowRight size={20} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredBnbs.map((bnb, index) => (
              <motion.div
                key={bnb.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                <Link to={`/bnbs/${bnb.id}`}>
                  <div className="relative overflow-hidden">
                    <img
                      src={bnb.images[0]}
                      alt={bnb.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                        {bnb.propertyType}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                      <Star
                        size={12}
                        className="text-yellow-400 fill-current"
                      />
                      <span className="text-xs font-medium text-gray-800">
                        {bnb.rating}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 group-hover:text-secondary transition-colors mb-1 line-clamp-1">
                      {bnb.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3 flex items-center">
                      <MapPin size={14} className="mr-1" />
                      {bnb.location}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users size={12} />
                          {bnb.maxGuests}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bed size={12} />
                          {bnb.beds}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath size={12} />
                          {bnb.baths}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      {bnb.amenities.slice(0, 3).map((amenity, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-primary">
                          {formatBnbPrice(bnb.price)}
                        </span>
                        <span className="text-sm text-gray-500">/night</span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {bnb.reviews} reviews
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-8 md:hidden"
          >
            <Link
              to="/bnbs"
              className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 font-semibold transition-colors"
            >
              View All BNBs
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Latest Property News */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="text-4xl font-bold text-primary mb-2">
                Latest Property News
              </h2>
              <p className="text-gray-600">
                Stay updated with the latest trends and insights in Kenyan real
                estate
              </p>
            </div>
            <Link
              to="/blogs"
              className="hidden md:flex items-center gap-2 text-secondary hover:text-secondary/80 font-semibold transition-colors"
            >
              View All Articles
              <ArrowRight size={20} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestBlogPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
              >
                <Link to={`/blog/${post.id}`}>
                  {" "}
                  {/* Fixed route - use /blog/ not /blogs/ */}
                  <div className="overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full font-medium">
                        {post.category}
                      </span>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock size={12} className="mr-1" />
                        {post.readTime} min read
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-800 group-hover:text-secondary transition-colors mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="text-secondary text-sm font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all">
                      READ MORE
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-8 md:hidden"
          >
            <Link
              to="/blogs"
              className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 font-semibold transition-colors"
            >
              View All Articles
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Call to Action */}
      <section className="relative py-24 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1080&auto=format&fit=crop&q=80"
            alt="Modern property"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-dark/90"></div>
        </div>

        {/* Geometric shapes */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 z-10">
          <svg
            className="absolute top-10 left-10 w-32 h-32 text-white"
            fill="currentColor"
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg
            className="absolute bottom-10 right-10 w-24 h-24 text-white"
            fill="currentColor"
            viewBox="0 0 100 100"
          >
            <polygon points="50,0 100,50 50,100 0,50" />
          </svg>
          <svg
            className="absolute top-1/2 left-1/4 w-16 h-16 text-white"
            fill="currentColor"
            viewBox="0 0 100 100"
          >
            <rect width="100" height="100" />
          </svg>
        </div>

        {/* Animated orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-20 right-20 w-64 h-64 bg-secondary/30 rounded-full blur-3xl z-10"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-20 left-20 w-80 h-80 bg-accent/20 rounded-full blur-3xl z-10"
        />

        <div className="container mx-auto px-4 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center text-white max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Star className="text-accent fill-current" size={16} />
                Kenya's Trusted Real Estate Platform
              </div>

              <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Ready to Find Your
                <span className="block text-accent">Dream Property?</span>
              </h2>

              <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
                Join thousands of satisfied customers who have found their
                perfect home through our platform. Your dream property is just a
                click away.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <Link
                to="/properties"
                className="group bg-secondary text-white px-8 py-4 rounded-full font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 inline-flex items-center justify-center gap-2 min-w-[200px]"
              >
                <Building2 size={20} />
                Browse Properties
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>

              <Link
                to="/bnbs"
                className="group bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-primary transition-all duration-300 inline-flex items-center justify-center gap-2 min-w-[200px]"
              >
                <TreePine size={20} />
                Explore BNBs
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
              className="mt-12 flex flex-wrap justify-center items-center gap-8 text-white/60"
            >
              <div className="flex items-center gap-2">
                <Shield size={16} />
                <span className="text-sm">Secure Transactions</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={16} />
                <span className="text-sm">Award Winning Service</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span className="text-sm">24/7 Customer Support</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
      </div>
    </>
  );
};

export default Home;
