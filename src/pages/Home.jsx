import React, { useState } from "react";
import SEO from "../components/common/SEO";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// Import components
import EnhancedSearch from "../components/home/EnhancedSearch";
import PropertyCard from "../components/properties/PropertyCard";
import Services from "../components/home/Services";

// Import data
import { properties, formatPrice } from "../data/properties";
import { blogPosts } from "../data/blogs";
import { bnbListings, formatBnbPrice } from "../data/bnbs";

const Home = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchMetadata, setSearchMetadata] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Featured properties for display
  const featuredProperties = properties.slice(0, 3);

  // Featured BNBs for display
  const featuredBnbs = bnbListings.slice(0, 4);

  // Latest blog posts for display
  const latestBlogPosts = blogPosts.slice(0, 3);

  // Handle search results
  const handleSearchResults = (results, metadata) => {
    setSearchResults(results);
    setSearchMetadata(metadata);
    setShowSearchResults(results.length > 0 || metadata.query);
  };

  

  // Why choose us features
  const features = [
    {
      title: "Verified Listings",
      description: "Every property is physically inspected and documents verified before listing.",
    },
    {
      title: "Expert Agents",
      description: "Work with experienced agents who know the local market inside out.",
    },
    {
      title: "Market Insights",
      description: "Get real-time market data and investment advice to make smart decisions.",
    },
    {
      title: "End-to-End Support",
      description: "From search to settlement, we guide you through every step of the process.",
    },
  ];

  // Testimonials
  const testimonials = [
    {
      name: "Sarah Wanjiku",
      role: "Homeowner, Karen",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      text: "Kejamatch made finding our family home so easy. The agents were professional and the platform is incredibly user-friendly.",
    },
    {
      name: "James Ochieng",
      role: "Property Investor",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      text: "As an investor, I appreciate the detailed market insights and property analysis. Kejamatch has become my go-to platform.",
    },
    {
      name: "Grace Muthoni",
      role: "First-time Buyer",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      text: "The team walked me through every step of buying my first apartment. Their patience and expertise made all the difference.",
    },
  ];

  return (
    <>
      <SEO
        title="Find Your Dream Home in Kenya"
        description="Discover premium real estate properties, luxury homes, apartments, and top-rated BNBs across Kenya."
        keywords="real estate Kenya, properties for sale Kenya, houses for rent Nairobi"
        canonicalUrl="/"
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1080&auto=format&fit=crop&q=80"
              alt="Beautiful modern home"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-dark/60" />
          </div>

          {/* Content */}
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              {/* Badge */}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-block bg-white/10 backdrop-blur-sm text-white px-5 py-2 rounded-full text-sm font-medium mb-8 border border-white/20"
              >
                Kenya's Most Trusted Property Platform
              </motion.span>

              {/* Headline */}
              <motion.h1
                className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Find Your Perfect
                <span className="block mt-2 text-secondary">Place to Call Home</span>
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Whether you're buying, renting, or booking a getaway — we'll help you
                discover properties that match your dreams.
              </motion.p>

              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                <EnhancedSearch
                  onSearchResults={handleSearchResults}
                  showResults={true}
                  className="max-w-4xl mx-auto"
                />
              </motion.div>

              {/* Quick Links */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="flex flex-wrap justify-center gap-6 mt-10"
              >
                <Link
                  to="/properties?type=Buy"
                  className="text-white/80 hover:text-white transition-colors text-sm font-medium"
                >
                  Properties for Sale
                </Link>
                <span className="text-white/30">•</span>
                <Link
                  to="/properties?type=Rent"
                  className="text-white/80 hover:text-white transition-colors text-sm font-medium"
                >
                  Properties for Rent
                </Link>
                <span className="text-white/30">•</span>
                <Link
                  to="/bnbs"
                  className="text-white/80 hover:text-white transition-colors text-sm font-medium"
                >
                  BNB & Short Stays
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

       

        {/* Search Results Section */}
        <AnimatePresence>
          {showSearchResults && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="py-16 bg-sand"
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
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      No properties found
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Try adjusting your search criteria or browse our featured properties below.
                    </p>
                    <button
                      onClick={() => setShowSearchResults(false)}
                      className="bg-secondary text-white px-6 py-3 rounded-full hover:bg-secondary/90 transition-colors font-medium"
                    >
                      Browse Featured Properties
                    </button>
                  </div>
                ) : null}
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Services Section */}
        <div id="services">
          <Services variant="full" showHeader={true} />
        </div>

        {/* Featured Properties Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-4"
            >
              <div>
                <span className="text-secondary font-semibold text-sm uppercase tracking-wider mb-3 block">
                  Featured Listings
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-primary">
                  Handpicked Properties
                </h2>
              </div>
              <Link
                to="/properties"
                className="group flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-dark transition-colors"
              >
                View All
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link to={`/properties/${property.id}`} className="group block">
                    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-soft-lg transition-all duration-300">
                      {/* Image */}
                      <div className="relative overflow-hidden">
                        <img
                          src={property.image}
                          alt={property.title}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                            property.type === "Rent"
                              ? "bg-emerald-500 text-white"
                              : "bg-primary text-white"
                          }`}>
                            For {property.type}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="text-2xl font-bold text-primary mb-2">
                          {formatPrice(property.price, property.type)}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-secondary transition-colors mb-2">
                          {property.title}
                        </h3>
                        <p className="text-gray-500 text-sm mb-4">
                          {property.location}
                        </p>

                        {/* Features */}
                        <div className="flex items-center gap-4 text-sm text-gray-600 pt-4 border-t border-gray-100">
                          <span>{property.beds} Beds</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span>{property.baths} Baths</span>
                          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                          <span>{property.sqft} sqft</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-24 bg-cream">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-secondary font-semibold text-sm uppercase tracking-wider mb-3 block">
                Why Kejamatch
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
                Why Clients Choose Us
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                We're committed to making your property journey simple, transparent, and rewarding.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-white rounded-2xl p-8 h-full border border-gray-100 hover:border-secondary/30 hover:shadow-soft transition-all duration-300">
                    <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-6">
                      <span className="text-secondary font-bold text-xl">{index + 1}</span>
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured BNBs Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-4"
            >
              <div>
                <span className="text-secondary font-semibold text-sm uppercase tracking-wider mb-3 block">
                  Short Stays
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-primary">
                  Featured BNBs
                </h2>
              </div>
              <Link
                to="/bnbs"
                className="group flex items-center gap-2 bg-secondary text-white px-6 py-3 rounded-full font-medium hover:bg-secondary/90 transition-colors"
              >
                View All
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
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
                >
                  <Link to={`/bnbs/${bnb.id}`} className="group block">
                    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-soft transition-all duration-300">
                      <div className="relative overflow-hidden">
                        <img
                          src={bnb.images[0]}
                          alt={bnb.title}
                          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-white text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
                            {bnb.propertyType}
                          </span>
                        </div>
                        <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-xs font-semibold">
                          {bnb.rating} ★
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="font-semibold text-gray-900 group-hover:text-secondary transition-colors mb-1">
                          {bnb.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-3">
                          {bnb.location}
                        </p>

                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                          <span>{bnb.maxGuests} guests</span>
                          <span>•</span>
                          <span>{bnb.beds} beds</span>
                          <span>•</span>
                          <span>{bnb.baths} baths</span>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div>
                            <span className="text-lg font-bold text-primary">
                              {formatBnbPrice(bnb.price)}
                            </span>
                            <span className="text-sm text-gray-500">/night</span>
                          </div>
                          <span className="text-xs text-gray-400">
                            {bnb.reviews} reviews
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-primary">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-secondary font-semibold text-sm uppercase tracking-wider mb-3 block">
                Testimonials
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                What Our Clients Say
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                Real stories from real people who found their dream properties with us.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 h-full border border-white/10">
                    <p className="text-white/90 leading-relaxed mb-6 text-lg">
                      "{testimonial.text}"
                    </p>

                    <div className="flex items-center gap-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <div className="font-semibold text-white">
                          {testimonial.name}
                        </div>
                        <div className="text-white/60 text-sm">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Latest Property News */}
        <section className="py-24 bg-sand">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-4"
            >
              <div>
                <span className="text-secondary font-semibold text-sm uppercase tracking-wider mb-3 block">
                  Latest Insights
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-primary">
                  Property News & Tips
                </h2>
              </div>
              <Link
                to="/blogs"
                className="group flex items-center gap-2 text-secondary font-medium hover:gap-3 transition-all"
              >
                View All Articles
                <ArrowRight size={18} />
              </Link>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestBlogPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link to={`/blog/${post.id}`} className="group block">
                    <div className="bg-white rounded-2xl overflow-hidden h-full border border-gray-100 hover:border-gray-200 hover:shadow-soft transition-all duration-300">
                      <div className="overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs bg-secondary/10 text-secondary px-3 py-1 rounded-full font-medium">
                            {post.category}
                          </span>
                          <span className="text-xs text-gray-500">
                            {post.readTime} min read
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900 group-hover:text-secondary transition-colors mb-3 text-lg line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24">
          {/* Background */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&h=1080&auto=format&fit=crop&q=80"
              alt="Modern luxury property"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-primary/90" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center text-white"
            >
              <span className="text-secondary font-semibold text-sm uppercase tracking-wider mb-4 block">
                Start Your Journey
              </span>

              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Ready to Find Your Dream Property?
              </h2>

              <p className="text-xl text-white/80 mb-10 leading-relaxed">
                Join thousands of satisfied clients who found their perfect home through KejaMatch.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/properties"
                  className="group bg-secondary text-white px-8 py-4 rounded-full font-medium hover:bg-secondary/90 transition-colors inline-flex items-center justify-center gap-2"
                >
                  Browse Properties
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/contact"
                  className="bg-white/10 border border-white/30 text-white px-8 py-4 rounded-full font-medium hover:bg-white hover:text-primary transition-all inline-flex items-center justify-center gap-2"
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
