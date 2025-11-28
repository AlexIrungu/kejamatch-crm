import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Eye, 
  Users, 
  Award, 
  Home, 
  TrendingUp, 
  Shield, 
  Heart,
  ChevronDown,
  CheckCircle,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

const About = () => {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const stats = [
    { icon: Home, value: '500+', label: 'Properties Sold' },
    { icon: Users, value: '1000+', label: 'Happy Clients' },
    { icon: Award, value: '10+', label: 'Years Experience' },
    { icon: TrendingUp, value: '98%', label: 'Customer Satisfaction' }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Integrity',
      description: 'We conduct business with honesty, transparency, and ethical standards in every transaction.'
    },
    {
      icon: Heart,
      title: 'Customer First',
      description: 'Our clients\' needs and satisfaction are at the center of everything we do.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We strive for excellence in service delivery and continuous improvement.'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'We work together as a team and with our clients to achieve mutual success.'
    }
  ];

  const team = [
    {
      name: 'Brian Kitainge',
      position: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
      bio: 'With over 15 years in real estate, Brian founded Kejamatch to revolutionize property transactions in Kenya.'
    },
    {
      name: 'Gasper Barmao',
      position: 'Head of Sales',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      bio: 'Gasper leads our sales team with expertise in luxury properties and commercial real estate.'
    },
    {
      name: 'Faith Kucher',
      position: 'Property Manager',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
      bio: 'Faith ensures our clients receive exceptional property management services with attention to detail.'
    },
    {
      name: 'Maryanne Mureithi',
      position: 'Investment Advisor',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face',
      bio: 'Maryanne helps clients make informed investment decisions in the Kenyan real estate market.'
    }
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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1585914641050-fa9883c4e21c?w=1920&h=1080&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTF8fHJlYWwlMjBlc3RhdGV8ZW58MHx8MHx8fDA%3D" 
            alt="Professional team meeting" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-20">
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ 
              scale: [1.1, 1, 1.1],
              opacity: [0.5, 0.3, 0.5]
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
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
            className="text-center max-w-4xl mx-auto"
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              About <span className="text-accent">Kejamatch</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Your trusted partner in finding the perfect home and making smart real estate investments in Kenya
            </motion.p>

            
          </motion.div>
        </div>
      </section>

      {/* Mission and Vision Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Our Purpose</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Driven by our mission to transform real estate experiences and guided by our vision for the future
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary rounded-full mb-6 mx-auto lg:mx-0">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-primary mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                To provide exceptional real estate services that exceed client expectations while building sustainable communities and creating lasting value for all stakeholders through innovation, integrity, and excellence. We simplify the property journey, making it transparent, efficient, and rewarding for everyone involved.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500 rounded-full mb-6 mx-auto lg:mx-0">
                <Eye className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-primary mb-4">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                To be East Africa's most trusted and innovative real estate company, transforming how people buy, sell, and invest in property while contributing to sustainable urban development. We envision a future where finding your perfect home is simple, transparent, and accessible to all.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">Who We Are</h2>
              <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
                <p>
                  Welcome to Kejamatch, your trusted partner in finding the perfect home. Whether you're searching for a cozy rental, looking to buy your dream property, or ready to sell, Kejamatch is here to simplify your journey. Our platform connects you with tailored housing solutions, offering a seamless experience for renters, buyers, and sellers alike.
                </p>
                <p>
                  At Kejamatch, we understand that a home is more than just a place—it's where memories are made, dreams are realized, and futures are built. That's why we're dedicated to providing personalized, user-friendly tools and resources to match you with properties that fit your lifestyle, budget, and aspirations.
                </p>
                <p>
                  Backed by a passionate team and cutting-edge technology, Kejamatch is committed to transforming the housing market in Kenya. We combine local expertise with innovative solutions to deliver exceptional value and service to our clients.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Licensed & Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Local Expertise</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">24/7 Support</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&auto=format&fit=crop&q=60" 
                  alt="Team collaboration"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-primary/20 rounded-2xl"></div>
              </div>
              
              {/* Floating stats card */}
              {/* <motion.div
                whileHover={{ scale: 1.05 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6 border"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">10+</div>
                    <div className="text-sm text-gray-600">Years of Excellence</div>
                  </div>
                </div>
              </motion.div> */}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-accent/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Our Core Values</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              The principles that guide everything we do and define who we are as a company
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-full mb-6">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Meet Our Team</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Experienced professionals dedicated to helping you achieve your real estate goals
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
                whileHover={{ scale: 1.05 }}
                className="bg-gray-50 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center"
              >
                <img 
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-lg"
                />
                <h3 className="text-xl font-bold text-primary mb-2">{member.name}</h3>
                <p className="text-secondary font-medium mb-3">{member.position}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 text-lg">Got questions? We've got answers</p>
          </motion.div>
          
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-primary pr-4">{faq.question}</h3>
                  <motion.div
                    animate={{ rotate: openFAQ === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-secondary flex-shrink-0" />
                  </motion.div>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: openFAQ === index ? 'auto' : 0 }}
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
  );
};

export default About;