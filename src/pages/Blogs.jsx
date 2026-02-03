import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/common/SEO';
import { 
  Search, 
  Calendar, 
  Clock, 
  User, 
  ArrowRight, 
  BookOpen, 
  TrendingUp,
  Filter,
  ChevronDown,
  Share2,
  Bookmark,
  Eye,
  MessageCircle,
  ThumbsUp
} from 'lucide-react';
import LazyImage from '../components/common/LazyImage';
import { blogPosts, blogCategories, searchPosts } from '../data/blogs';

const Blogs = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState(new Set());

  const categories = ["All", "Buying Guide", "Market Insights", "Legal Guide", "Investment", "Finance", "Trends"];

  // Enhanced filtering and sorting
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = selectedCategory === "All" 
      ? blogPosts 
      : blogPosts.filter(post => post.category === selectedCategory);

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort posts
    switch (sortBy) {
      case 'popular':
        return filtered.sort((a, b) => b.views - a.views);
      case 'liked':
        return filtered.sort((a, b) => b.likes - a.likes);
      case 'oldest':
        return filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
      case 'newest':
      default:
        return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  }, [selectedCategory, searchQuery, sortBy]);

  const toggleFavorite = (postId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(postId)) {
        newFavorites.delete(postId);
      } else {
        newFavorites.add(postId);
      }
      return newFavorites;
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Dynamic SEO based on selected category
  const seoTitle = useMemo(() => {
    if (selectedCategory === 'All') {
      return 'Real Estate Blog - Expert Insights & Market Trends Kenya';
    }
    return `${selectedCategory} - Real Estate Blog Kenya | KejaMatch`;
  }, [selectedCategory]);

  const seoDescription = useMemo(() => {
    if (selectedCategory === 'All') {
      return 'Expert real estate advice, market insights, buying guides, and investment tips for Kenya property market. Stay informed with KejaMatch blog articles.';
    }
    return `Read our ${selectedCategory.toLowerCase()} articles for Kenya real estate. Expert advice and actionable insights to help you navigate the property market.`;
  }, [selectedCategory]);

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords="real estate blog Kenya, property market insights, buying guide Kenya, real estate investment tips, Kenya housing market, property trends Nairobi"
        canonicalUrl={selectedCategory === 'All' ? '/blogs' : `/blogs?category=${encodeURIComponent(selectedCategory)}`}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Blog', url: '/blogs' },
          ...(selectedCategory !== 'All' ? [{ name: selectedCategory, url: `/blogs?category=${encodeURIComponent(selectedCategory)}` }] : [])
        ]}
      />
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[1000px] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1638342863994-ae4eee256688?w=1920&h=1080&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YmxvZ3N8ZW58MHx8MHx8fDA%3D"
            alt="Real Estate Insights" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="container mx-auto px-4 relative z-30">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Real Estate <span className="text-accent">Insights</span>
            </h1>
            <p className="text-xl text-white/90 mb-8">
              Expert advice, market trends, and actionable insights for Kenya's property market
            </p>
            
            {/* Search Bar */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search articles, topics, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent outline-none"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Filters and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4"
        >
          <div>
            <h2 className="text-2xl font-bold text-primary mb-2">
              {filteredAndSortedPosts.length} Articles Found
            </h2>
            <p className="text-gray-600">
              {searchQuery && `Results for "${searchQuery}"`}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-secondary appearance-none pr-10"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
                <option value="liked">Most Liked</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Filter size={18} />
              Categories
            </button>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-8 ${showFilters ? 'block' : 'hidden lg:block'}`}
        >
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
              <BookOpen size={20} />
              Categories
            </h3>
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-secondary to-accent text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                  {category !== "All" && (
                    <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                      {blogPosts.filter(post => post.category === category).length}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Featured Articles */}
        {selectedCategory === "All" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
              <TrendingUp className="text-secondary" size={24} />
              Featured Articles
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {blogPosts.filter(post => post.featured).slice(0, 2).map((post) => (
                <motion.article
                  key={post.id}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  <Link to={`/blog/${post.id}`}>
                    <div className="relative h-64">
                      <LazyImage
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                      <div className="absolute top-4 left-4">
                        <span className="bg-accent text-primary px-3 py-1 rounded-full text-xs font-bold">
                          FEATURED
                        </span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleFavorite(post.id);
                          }}
                          className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                        >
                          <Bookmark 
                            size={16} 
                            className={`transition-colors ${
                              favorites.has(post.id) ? 'fill-secondary text-secondary' : 'text-gray-600'
                            }`}
                          />
                        </button>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white text-xl font-bold mb-2">{post.title}</h3>
                        <div className="flex items-center gap-4 text-white/80 text-sm">
                          <span className="flex items-center gap-1">
                            <Eye size={14} />
                            {post.views.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {post.readTime} min
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </motion.div>
        )}

        {/* Blog Posts Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredAndSortedPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                <div className="relative h-48">
                  <LazyImage
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-secondary text-white px-2 py-1 rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(post.difficulty)}`}>
                      {post.difficulty}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(post.id);
                      }}
                      className="bg-white/90 backdrop-blur-sm p-1.5 rounded-full hover:bg-white transition-colors"
                    >
                      <Bookmark 
                        size={14} 
                        className={`transition-colors ${
                          favorites.has(post.id) ? 'fill-secondary text-secondary' : 'text-gray-600'
                        }`}
                      />
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Calendar size={14} className="mr-1" />
                    <span>{formatDate(post.date)}</span>
                    <span className="mx-2">•</span>
                    <Clock size={14} className="mr-1" />
                    <span>{post.readTime} min read</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-primary mb-3 line-clamp-2 group-hover:text-secondary transition-colors duration-200">
                    <Link to={`/blog/${post.id}`} className="cursor-pointer">
                      {post.title}
                    </Link>
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span 
                        key={tagIndex} 
                        className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img 
                        src={post.author.avatar} 
                        alt={post.author.name}
                        className="w-8 h-8 rounded-full mr-2 border-2 border-gray-100"
                      />
                      <div>
                        <span className="text-sm font-medium text-primary">{post.author.name}</span>
                        <p className="text-xs text-gray-500">{post.author.role}</p>
                      </div>
                    </div>

                    {/* Engagement Stats */}
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye size={12} />
                        {post.views > 1000 ? `${(post.views/1000).toFixed(1)}k` : post.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp size={12} />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle size={12} />
                        {post.comments}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <Link 
                      to={`/blog/${post.id}`}
                      className="text-secondary hover:text-secondary/80 font-medium text-sm transition-colors duration-200 flex items-center gap-2"
                    >
                      Read More
                      <ArrowRight size={14} />
                    </Link>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Share2 size={14} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* No Results */}
        {filteredAndSortedPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-4">No articles found</h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search or browse different categories.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="bg-secondary text-white px-6 py-3 rounded-lg hover:bg-secondary/90 transition-colors"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>


    </div>
    </>
  );
};

export default Blogs;