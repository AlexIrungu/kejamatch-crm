import { Link } from 'react-router-dom';
import { Twitter, Instagram, Mail, Phone, MapPin, ArrowRight, Send } from 'lucide-react';
import logo from '../../assets/clearblackbg.svg';

const Footer = () => {
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Add newsletter submission logic here
    console.log('Newsletter subscription submitted');
  };

  const quickLinks = [
    { to: '/', label: 'Home' },
    { to: '/properties', label: 'Properties' },
    { to: '/bnbs', label: 'Short Stays' },
    { to: '/about', label: 'About Us' },
    { to: '/blogs', label: 'Blog' },
    { to: '/contact', label: 'Contact' }
  ];

  const propertyTypes = [
    { to: '/properties?type=houses', label: 'Houses' },
    { to: '/properties?type=apartments', label: 'Apartments' },
    { to: '/properties?type=land', label: 'Land' },
    { to: '/properties?type=commercial', label: 'Commercial' }
  ];

  return (
    <footer className="bg-primary text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div>
            <div className="mb-6">
              <img 
                src={logo} 
                alt="Kejamatch Logo" 
                className="h-16 w-auto object-contain"
              />
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Your trusted partner in finding the perfect property in Kenya. We connect dreams with reality.
            </p>
            <div className="flex space-x-3">
              <a
                href="https://x.com/KejaMatch"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-secondary flex items-center justify-center rounded-lg transition-all duration-300 hover:scale-110"
                aria-label="Follow us on X (Twitter)"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://www.instagram.com/kejamatch/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-secondary flex items-center justify-center rounded-lg transition-all duration-300 hover:scale-110"
                aria-label="Follow us on Instagram"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white flex items-center">
              <span className="w-1 h-6 bg-secondary mr-3"></span>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.to} 
                    className="text-gray-300 hover:text-accent transition-colors flex items-center group"
                  >
                    <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Property Types & Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white flex items-center">
              <span className="w-1 h-6 bg-secondary mr-3"></span>
              Property Types
            </h4>
            <ul className="space-y-3 mb-8">
              {propertyTypes.map((type, index) => (
                <li key={index}>
                  <Link 
                    to={type.to} 
                    className="text-gray-300 hover:text-accent transition-colors flex items-center group"
                  >
                    <ArrowRight size={14} className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {type.label}
                  </Link>
                </li>
              ))}
            </ul>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a href="tel:+254721860371" className="flex items-center space-x-3 text-gray-300 hover:text-accent transition-colors group">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-secondary transition-colors">
                  <Phone size={14} />
                </div>
                <span className="text-sm">+254 721 860 371</span>
              </a>
              <a href="mailto:info@kejamatch.com" className="flex items-center space-x-3 text-gray-300 hover:text-accent transition-colors group">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-secondary transition-colors">
                  <Mail size={14} />
                </div>
                <span className="text-sm">info@kejamatch.com</span>
              </a>
              <div className="flex items-center space-x-3 text-gray-300">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <MapPin size={14} />
                </div>
                <span className="text-sm">Nairobi, Kenya</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white flex items-center">
              <span className="w-1 h-6 bg-secondary mr-3"></span>
              Stay Updated
            </h4>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Subscribe to our newsletter for the latest property listings and market insights.
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent placeholder-gray-400 text-white transition-all"
              />
              <button 
                onClick={handleNewsletterSubmit}
                className="w-full bg-secondary hover:bg-secondary/90 text-white py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg"
              >
                <Send size={18} />
                Subscribe Now
              </button>
            </div>
            
            {/* Working Hours */}
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-sm font-semibold text-white mb-2">Working Hours</p>
              <p className="text-xs text-gray-400">Mon - Fri: 9:00 AM - 6:00 PM</p>
              <p className="text-xs text-gray-400">Sat: 10:00 AM - 4:00 PM</p>
              <p className="text-xs text-gray-400">Sun: By Appointment</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Kejamatch Properties. All Rights Reserved.
            </p>
            <div className="flex flex-wrap gap-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-accent transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-accent transition-colors">
                Terms of Service
              </Link>
              <Link to="/sitemap" className="text-gray-400 hover:text-accent transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;