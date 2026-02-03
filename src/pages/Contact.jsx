import React, { useState } from 'react';
import SEO from '../components/common/SEO';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Building2,
  Twitter,
  Facebook,
  Instagram,
  Linkedin
} from 'lucide-react';
import GoogleMaps from '../components/common/GoogleMaps';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  // Backend API URL - Update this with your Render URL after deployment
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://kejamatch-backend.onrender.com';

  // Office locations for map markers
  const officeLocations = [
    {
      lat: -1.286389,
      lng: 36.817223,
      title: "Kejamatch Nairobi Office",
      infoWindow: `
        <div style="padding: 12px; max-width: 250px;">
          <h3 style="font-weight: bold; font-size: 16px; margin-bottom: 8px; color: #1e3a5f;">Kejamatch Properties</h3>
          <p style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">Nairobi CBD, Kenya</p>
          <p style="color: #6b7280; font-size: 13px; margin-bottom: 8px;">Mon - Fri: 9AM - 6PM</p>
          <a href="tel:+254721860371" style="color: #ff6b35; font-weight: 600; font-size: 13px; text-decoration: none;">+254 721 860 371</a>
        </div>
      `
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message');
      }

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        subject: '',
        message: ''
      });
      
      // Auto-clear success message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);

    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');
      
      // Auto-clear error message after 5 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'info@kejamatch.com',
      link: 'mailto:info@kejamatch.com',
      description: 'Send us an email anytime'
    },
    {
      icon: Phone,
      title: 'Phone',
      content: '+254 721 860 371',
      link: 'tel:+254721860371',
      description: 'Mon-Fri from 9am to 6pm'
    },
    {
      icon: MapPin,
      title: 'Office',
      content: 'Nairobi CBD, Kenya',
      link: '#map',
      description: 'Visit our main office'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      content: 'Mon - Fri: 9AM - 6PM',
      link: '#',
      description: 'Weekend by appointment'
    }
  ];

  const socialLinks = [
    { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:bg-blue-400' },
    { name: 'Facebook', icon: Facebook, href: '#', color: 'hover:bg-blue-600' },
    { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:bg-pink-500' },
    { name: 'LinkedIn', icon: Linkedin, href: '#', color: 'hover:bg-blue-700' }
  ];

  return (
    <>
      <SEO
        title="Contact Us - Get in Touch"
        description="Contact KejaMatch for all your real estate needs in Kenya. Reach our friendly team for property inquiries, viewings, or investment advice. Visit our Nairobi office or call us today."
        keywords="contact KejaMatch, real estate inquiry Kenya, property consultation Nairobi, reach us Kenya"
        canonicalUrl="/contact"
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Contact', url: '/contact' }
        ]}
      />
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-primary">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 border-4 border-white rotate-45"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-secondary rounded-full blur-xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-medium mb-6"
            >
              <MessageSquare size={16} />
              We're Here to Help
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Get In <span className="text-accent">Touch</span>
            </h1>
            
            <p className="text-xl text-white/90 leading-relaxed">
              Have questions about properties or investments? Our team is ready to assist you in finding your perfect home.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-32 relative z-20">
            {contactInfo.map((item, index) => (
              <motion.a
                key={index}
                href={item.link}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 group border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-300 flex-shrink-0">
                    <item.icon size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-primary mb-1 text-sm uppercase tracking-wide">
                      {item.title}
                    </h3>
                    <p className="text-gray-900 font-semibold mb-1 truncate">
                      {item.content}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content - Form and Sidebar */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            
            {/* Contact Form */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl border-2 border-gray-100 p-8 md:p-10"
              >
                <div className="mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-primary mb-3">
                    Send Us a Message
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Fill out the form below and we'll get back to you within 24 hours.
                  </p>
                </div>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-green-800">Message sent successfully!</p>
                        <p className="text-sm text-green-700 mt-1">We'll get back to you as soon as possible.</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-red-800">Something went wrong</p>
                        <p className="text-sm text-red-700 mt-1">Please try again or contact us directly.</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name Field */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Full Name <span className="text-secondary">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all ${
                          errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}
                        placeholder="John Doe"
                      />
                      {errors.name && <p className="mt-2 text-sm text-red-600 flex items-center gap-1"><AlertCircle size={14} />{errors.name}</p>}
                    </div>

                    {/* Email Field */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Email Address <span className="text-secondary">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all ${
                          errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}
                        placeholder="john@example.com"
                      />
                      {errors.email && <p className="mt-2 text-sm text-red-600 flex items-center gap-1"><AlertCircle size={14} />{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Phone Field */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Phone Number <span className="text-secondary">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all ${
                          errors.phoneNumber ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}
                        placeholder="+254 712 345 678"
                      />
                      {errors.phoneNumber && <p className="mt-2 text-sm text-red-600 flex items-center gap-1"><AlertCircle size={14} />{errors.phoneNumber}</p>}
                    </div>

                    {/* Subject Field */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Subject <span className="text-secondary">*</span>
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all bg-white ${
                          errors.subject ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}
                      >
                        <option value="">Select a subject</option>
                        <option value="Property Inquiry">Property Inquiry</option>
                        <option value="Investment Consultation">Investment Consultation</option>
                        <option value="Property Valuation">Property Valuation</option>
                        <option value="BNB Booking">BNB Booking</option>
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Partnership">Partnership</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.subject && <p className="mt-2 text-sm text-red-600 flex items-center gap-1"><AlertCircle size={14} />{errors.subject}</p>}
                    </div>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">
                      Your Message <span className="text-secondary">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all resize-none ${
                        errors.message ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                      placeholder="Tell us about your property requirements, investment goals, or any questions you have..."
                    />
                    {errors.message && <p className="mt-2 text-sm text-red-600 flex items-center gap-1"><AlertCircle size={14} />{errors.message}</p>}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 space-y-6">
                {/* Why Contact Us */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bg-primary/5 rounded-2xl p-8 border border-primary/10"
                >
                  <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                    <Building2 size={24} className="text-secondary" />
                    Why Contact Us?
                  </h3>
                  <ul className="space-y-3 text-gray-700">
                    {[
                      'Expert property guidance',
                      'Free consultations',
                      '24/7 customer support',
                      'Verified property listings',
                      'Investment advice',
                      'Legal assistance'
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle size={20} className="text-secondary flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Social Media */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-2xl p-8 border-2 border-gray-100"
                >
                  <h3 className="text-xl font-bold text-primary mb-4">Connect With Us</h3>
                  <p className="text-gray-600 mb-6">Follow us on social media for updates and tips</p>
                  <div className="grid grid-cols-2 gap-3">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        className={`flex items-center justify-center gap-2 p-4 bg-gray-50 ${social.color} hover:text-white rounded-xl transition-all duration-200 font-medium group`}
                      >
                        <social.icon size={20} />
                        <span className="text-sm">{social.name}</span>
                      </a>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section id="map" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Visit Our Office
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Located in the heart of Nairobi. Drop by or schedule an appointment.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white"
          >
            <GoogleMaps
              center={{ lat: -1.286389, lng: 36.817223 }}
              zoom={15}
              markers={officeLocations}
              height="500px"
              showControls={true}
              style="roadmap"
            />
          </motion.div>

          {/* Directions Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-8"
          >
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=-1.286389,36.817223`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              <MapPin size={20} />
              Get Directions
            </a>
          </motion.div>
        </div>
      </section>
      </div>
    </>
  );
};

export default Contact;