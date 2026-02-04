import React, { useState, useMemo } from 'react';
import SEO from '../components/common/SEO';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import Brian from '../assets/Brian.jpeg';
import gasper from '../assets/gasper.jpeg';
import faith from '../assets/kucher.jpeg';

// Import Services component for preview
import Services from '../components/home/Services';

const About = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const stats = [
    { value: '500+', label: 'Properties Listed' },
    { value: '1,200+', label: 'Happy Clients' },
    { value: '10+', label: 'Years Experience' },
    { value: '98%', label: 'Satisfaction Rate' }
  ];

  const values = [
    {
      title: 'Integrity',
      description: 'We conduct business with honesty, transparency, and ethical standards in every transaction.',
    },
    {
      title: 'Customer First',
      description: 'Our clients\' needs and satisfaction are at the center of everything we do.',
    },
    {
      title: 'Excellence',
      description: 'We strive for excellence in service delivery and continuous improvement.',
    },
    {
      title: 'Collaboration',
      description: 'We work together as a team and with our clients to achieve mutual success.',
    }
  ];

  const team = [
    {
      name: 'Gasper Barmao',
      position: 'Director, Founder, CEO',
      image: Brian,
      bio: 'Gasper leads Kejamatch with strategic vision and expertise in transforming Kenya\'s real estate landscape.',
    },
    {
      name: 'Brian Kitainge Kisilu',
      position: 'Director, Co-Founder',
      subtitle: 'Head of Data and Analytics',
      image: gasper,
      bio: 'Brian leverages data-driven insights to revolutionize property transactions and investment decisions.',
    },
    {
      name: 'Faith Kucher',
      position: 'Director, Co-Founder',
      subtitle: 'Head of Sales and Client-Customer Outreach',
      image: faith,
      bio: 'Faith drives client success through exceptional sales strategies and personalized customer engagement.',
    },
    {
      name: 'Maryanne Mureithi',
      position: 'Director, Co-Founder',
      subtitle: 'Head of Legal',
      image: '',
      bio: 'Maryanne ensures legal compliance and protects client interests in every transaction.',
    }
  ];

  const milestones = [
    { year: '2014', title: 'Founded', description: 'Kejamatch was born with a vision to transform real estate in Kenya' },
    { year: '2017', title: '100+ Properties', description: 'Reached our first major milestone of 100 listed properties' },
    { year: '2020', title: 'Digital Platform', description: 'Launched our innovative online platform for seamless property search' },
    { year: '2023', title: '1000+ Clients', description: 'Celebrated helping over 1000 clients find their dream homes' },
  ];

  const faqs = [
    {
      question: 'What services does Kejamatch Properties offer?',
      answer: 'We offer comprehensive real estate services including residential and commercial property sales, rentals, property management, investment consulting, and land sourcing. Our platform also provides BNB booking services for short-term stays.'
    },
    {
      question: 'How do I get started with buying a property?',
      answer: 'Getting started is easy! Browse our extensive property listings online, use our advanced search filters to find properties that match your criteria, schedule viewings through our platform, or contact our experienced agents directly. We\'ll guide you through every step from initial search to final ownership transfer.'
    },
    {
      question: 'Do you offer financing assistance?',
      answer: 'Yes, we have partnerships with leading financial institutions across Kenya to help our clients secure competitive mortgage financing. Our team can connect you with the right lenders, help you understand your financing options, and assist with the application process.'
    },
    {
      question: 'What areas do you serve in Kenya?',
      answer: 'We primarily serve Nairobi and its surrounding counties including Kiambu, Machakos, and Kajiado. We also have properties in other major towns like Mombasa, Kisumu, Nakuru, and Eldoret. We\'re continuously expanding our coverage across Kenya.'
    },
    {
      question: 'How do you ensure property listings are genuine?',
      answer: 'All our property listings go through a rigorous verification process. Our team physically inspects properties, verifies ownership documents, and ensures all legal requirements are met before listing. We also work only with licensed and verified property owners and agents.'
    },
    {
      question: 'What makes Kejamatch different from other real estate companies?',
      answer: 'Kejamatch combines cutting-edge technology with personalized service. Our platform offers advanced search capabilities, virtual tours, real-time market insights, and transparent pricing. We focus on creating lasting relationships with our clients rather than just completing transactions.'
    }
  ];

  // Transform FAQs for schema
  const faqSchemaData = useMemo(() =>
    faqs.map(faq => ({
      question: faq.question,
      answer: faq.answer
    })),
    [faqs]
  );

  return (
    <>
      <SEO
        title="About Us - Kenya's Trusted Real Estate Platform"
        description="Learn about KejaMatch, Kenya's premier real estate company. We help you find your dream home with expert agents, verified listings, and personalized service across Nairobi, Mombasa, and beyond."
        keywords="about KejaMatch, real estate Kenya, property company Nairobi, trusted real estate agents Kenya"
        canonicalUrl="/about"
        faqData={faqSchemaData}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'About Us', url: '/about' }
        ]}
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex items-center justify-center">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&h=1080&auto=format&fit=crop&q=80"
              alt="Professional team"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-dark/70" />
          </div>

          {/* Content */}
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-block bg-white/10 backdrop-blur-sm text-white px-5 py-2 rounded-full text-sm font-medium mb-8 border border-white/20"
              >
                Our Story
              </motion.span>

              <motion.h1
                className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                About <span className="text-secondary">Kejamatch</span>
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                Your trusted partner in finding the perfect home and making smart real estate investments in Kenya
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <Link
                  to="/properties"
                  className="group bg-secondary text-white px-8 py-4 rounded-full font-medium hover:bg-secondary/90 transition-colors inline-flex items-center gap-2"
                >
                  Browse Properties
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/contact"
                  className="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-full font-medium hover:bg-white hover:text-primary transition-all"
                >
                  Contact Us
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        

        {/* Who We Are Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <span className="text-secondary font-semibold text-sm uppercase tracking-wider mb-4 block">
                  Who We Are
                </span>
                <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
                  Building Dreams,<br />
                  <span className="text-secondary">One Home at a Time</span>
                </h2>
                <div className="space-y-5 text-gray-600 leading-relaxed text-lg">
                  <p>
                    Welcome to Kejamatch, your trusted partner in finding the perfect home. Whether you're searching for a cozy rental, looking to buy your dream property, or ready to sell, Kejamatch is here to simplify your journey.
                  </p>
                  <p>
                    At Kejamatch, we understand that a home is more than just a place—it's where memories are made, dreams are realized, and futures are built. That's why we're dedicated to providing personalized, user-friendly tools and resources to match you with properties that fit your lifestyle, budget, and aspirations.
                  </p>
                  <p>
                    Backed by a passionate team and cutting-edge technology, Kejamatch is committed to transforming the housing market in Kenya.
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <span className="bg-cream text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
                    Licensed & Certified
                  </span>
                  <span className="bg-cream text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
                    Local Expertise
                  </span>
                  <span className="bg-cream text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
                    24/7 Support
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&auto=format&fit=crop&q=80"
                    alt="Modern home"
                    className="rounded-2xl w-full"
                  />
                  
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission and Vision Section */}
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
                Our Purpose
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Mission & Vision</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Driven by our mission to transform real estate experiences
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="bg-white rounded-2xl p-10 h-full border border-gray-100 hover:border-secondary/30 hover:shadow-soft transition-all duration-300">
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-6">
                    <span className="text-secondary font-bold text-xl">M</span>
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-4">Our Mission</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    To provide exceptional real estate services that exceed client expectations while building sustainable communities and creating lasting value for all stakeholders through innovation, integrity, and excellence. We simplify the property journey, making it transparent, efficient, and rewarding for everyone involved.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="bg-white rounded-2xl p-10 h-full border border-gray-100 hover:border-secondary/30 hover:shadow-soft transition-all duration-300">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                    <span className="text-primary font-bold text-xl">V</span>
                  </div>
                  <h3 className="text-2xl font-bold text-primary mb-4">Our Vision</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    To be East Africa's most trusted and innovative real estate company, transforming how people buy, sell, and invest in property while contributing to sustainable urban development. We envision a future where finding your perfect home is simple, transparent, and accessible to all.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-secondary font-semibold text-sm uppercase tracking-wider mb-3 block">
                What Guides Us
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Our Core Values</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
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
                    <h3 className="text-xl font-bold text-primary mb-3">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Preview Section */}
        <section className="py-24 bg-sand">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-secondary font-semibold text-sm uppercase tracking-wider mb-3 block">
                What We Offer
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Our Services</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Comprehensive real estate solutions tailored to your needs
              </p>
            </motion.div>

            <Services variant="preview" showHeader={false} />
          </div>
        </section>

        {/* Team Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="text-secondary font-semibold text-sm uppercase tracking-wider mb-3 block">
                Our Team
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Meet Our Leadership</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                The visionary leaders driving innovation and excellence
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-soft transition-all duration-300">
                    {/* Image */}
                    <div className="relative h-72 overflow-hidden bg-cream">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover object-center"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-4xl font-bold text-gray-400">
                            {member.name.charAt(0)}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-primary mb-1">{member.name}</h3>
                      <p className="text-secondary font-medium text-sm mb-1">{member.position}</p>
                      {member.subtitle && (
                        <p className="text-gray-500 text-sm mb-3">{member.subtitle}</p>
                      )}
                      <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Journey/Timeline Section */}
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
                Our Journey
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Key Milestones</h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                A decade of growth, innovation, and helping Kenyans find their homes
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 h-full border border-white/10">
                    <div className="text-secondary font-bold text-3xl mb-3">{milestone.year}</div>
                    <h3 className="text-white font-bold text-xl mb-2">{milestone.title}</h3>
                    <p className="text-white/70">{milestone.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
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
                FAQ
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-600 text-lg">Got questions? We've got answers</p>
            </motion.div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-primary pr-4">{faq.question}</h3>
                    <motion.div
                      animate={{ rotate: openFAQ === index ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown className="w-5 h-5 text-secondary" />
                    </motion.div>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{
                      height: openFAQ === index ? 'auto' : 0,
                      opacity: openFAQ === index ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-6">
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

       
      </div>
    </>
  );
};

export default About;
