import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Home,
  Key,
  Calendar,
  TrendingUp,
  Calculator,
  FileCheck,
  LayoutDashboard,
  Palmtree,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

// Service data
const allServices = [
  {
    id: 1,
    name: 'Property Sales',
    shortName: 'Sales',
    description: 'Buy your dream home or investment property in Kenya. We list verified houses, apartments, and land across Nairobi, Mombasa, Kisumu, Eldoret, and Nakuru with full title deed verification and agent support at every step.',
    shortDescription: 'Find verified properties for sale across Kenya with full documentation support.',
    icon: Home,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
    featured: true,
    link: '/properties?type=Buy',
  },
  {
    id: 2,
    name: 'Property Rentals',
    shortName: 'Rentals',
    description: 'Find a rental property that fits your lifestyle and budget. Browse houses and apartments for rent in Westlands, Karen, Kilimani, Kileleshwa, Riruta, and other prime Nairobi locations — with transparent pricing and no hidden fees.',
    shortDescription: 'Browse rental properties with transparent pricing and no hidden fees.',
    icon: Key,
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    featured: true,
    link: '/properties?type=Rent',
  },
  {
    id: 3,
    name: 'BNB & Short-Stay',
    shortName: 'Short Stays',
    description: 'Planning a getaway or need a short-term stay? Book studios, apartments, villas, cottages, and penthouses across Nairobi, Diani Beach, and Kenya\'s top destinations. Instant booking available on select properties.',
    shortDescription: 'Book unique stays for your getaway or short-term accommodation needs.',
    icon: Palmtree,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600',
    featured: true,
    link: '/bnbs',
  },
  {
    id: 4,
    name: 'Viewing Scheduling',
    shortName: 'Viewings',
    description: 'See properties in person before you commit. Our agents coordinate viewings at your convenience — weekdays or weekends. Schedule online through our platform or call us directly to arrange.',
    shortDescription: 'Schedule property viewings at your convenience.',
    icon: Calendar,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
    featured: false,
    link: '/contact',
  },
  {
    id: 5,
    name: 'Investment Consultation',
    shortName: 'Invest',
    description: 'Not sure where to invest in Kenyan real estate? Our team analyses market trends, rental yields, and location growth to help you make data-driven property investment decisions.',
    shortDescription: 'Get expert advice on real estate investment opportunities.',
    icon: TrendingUp,
    color: 'from-rose-500 to-rose-600',
    bgColor: 'bg-rose-50',
    iconColor: 'text-rose-600',
    featured: false,
    link: '/contact',
  },
  {
    id: 6,
    name: 'Property Valuation',
    shortName: 'Valuation',
    description: 'Get an accurate, professional valuation before you buy, sell, or refinance. We work with certified valuers to give you a clear picture of your property\'s true market worth.',
    shortDescription: 'Professional property valuations for buying, selling, or refinancing.',
    icon: Calculator,
    color: 'from-cyan-500 to-cyan-600',
    bgColor: 'bg-cyan-50',
    iconColor: 'text-cyan-600',
    featured: false,
    link: '/contact',
  },
  {
    id: 7,
    name: 'Legal & Document Verification',
    shortName: 'Legal',
    description: 'Title deed checks, ownership verification, and compliance reviews — we connect you with qualified legal professionals to ensure every property transaction is secure and legitimate.',
    shortDescription: 'Ensure secure transactions with our legal verification services.',
    icon: FileCheck,
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    featured: false,
    link: '/contact',
  },
  {
    id: 8,
    name: 'Client Portal',
    shortName: 'Portal',
    description: 'Manage your entire property journey in one place. Save listings, upload and track documents, monitor viewings, and message agents directly through your secure KejaMatch client portal.',
    shortDescription: 'Manage your property journey through our secure portal.',
    icon: LayoutDashboard,
    color: 'from-slate-500 to-slate-600',
    bgColor: 'bg-slate-50',
    iconColor: 'text-slate-600',
    featured: false,
    link: '/client/login',
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

// Featured Service Card (Large)
const FeaturedServiceCard = ({ service, index }) => {
  const IconComponent = service.icon;

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative"
    >
      <Link to={service.link}>
        <div className="relative bg-white rounded-3xl p-8 shadow-soft hover:shadow-warm-lg transition-all duration-500 border border-gray-100 overflow-hidden h-full">
          {/* Background gradient on hover */}
          <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

          {/* Icon */}
          <div className={`relative inline-flex items-center justify-center w-16 h-16 ${service.bgColor} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
            <IconComponent className={`w-8 h-8 ${service.iconColor}`} />
          </div>

          {/* Content */}
          <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-secondary transition-colors duration-300">
            {service.name}
          </h3>
          <p className="text-gray-600 leading-relaxed mb-6">
            {service.description}
          </p>

          {/* CTA */}
          <div className="flex items-center text-secondary font-semibold group-hover:gap-3 gap-2 transition-all duration-300">
            <span>Learn More</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </div>

          {/* Decorative corner */}
          <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br ${service.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-500`} />
        </div>
      </Link>
    </motion.div>
  );
};

// Supporting Service Card (Smaller)
const SupportingServiceCard = ({ service }) => {
  const IconComponent = service.icon;

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group"
    >
      <Link to={service.link}>
        <div className="relative bg-white rounded-2xl p-6 shadow-soft hover:shadow-warm transition-all duration-300 border border-gray-100 h-full">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className={`flex-shrink-0 inline-flex items-center justify-center w-12 h-12 ${service.bgColor} rounded-xl group-hover:scale-105 transition-transform duration-300`}>
              <IconComponent className={`w-6 h-6 ${service.iconColor}`} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-secondary transition-colors duration-300">
                {service.name}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {service.shortDescription}
              </p>
            </div>
          </div>

          {/* Arrow on hover */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ArrowRight className="w-5 h-5 text-secondary" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// Main Services Component
const Services = ({ variant = 'full', showHeader = true }) => {
  const featuredServices = allServices.filter(s => s.featured);
  const supportingServices = allServices.filter(s => !s.featured);

  // Preview variant shows only featured services
  const isPreview = variant === 'preview';

  return (
    <section className="py-20 bg-gradient-to-b from-cream to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        {showHeader && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              <span>What We Offer</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              Our Services
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Everything you need for your property journey — from search to settlement, we've got you covered.
            </p>
          </motion.div>
        )}

        {/* Featured Services - Large Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
        >
          {featuredServices.map((service, index) => (
            <FeaturedServiceCard key={service.id} service={service} index={index} />
          ))}
        </motion.div>

        {/* Supporting Services - Smaller Grid */}
        {!isPreview && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h3 className="text-2xl font-bold text-primary mb-2">
                Supporting Services
              </h3>
              <p className="text-gray-600">
                Additional services to ensure a smooth property experience
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
            >
              {supportingServices.map((service) => (
                <SupportingServiceCard key={service.id} service={service} />
              ))}
            </motion.div>
          </>
        )}

        {/* Preview CTA */}
        {isPreview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/#services"
              className="inline-flex items-center gap-2 bg-secondary text-white px-8 py-4 rounded-full font-semibold hover:bg-secondary/90 transition-all duration-300 shadow-warm hover:shadow-warm-lg hover:gap-3"
            >
              <span>View All Services</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Services;
export { allServices };
