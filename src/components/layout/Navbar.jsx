import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logoClear from '../../assets/clearbg.svg';
import logoBlack from '../../assets/clearblackbg.svg';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/properties', label: 'Properties' },
    { path: '/bnbs', label: 'BNBs' },
    { path: '/blogs', label: 'Blogs' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <Link to="/" className="flex items-center group relative">
              <div className="relative">
                {/* Logo background with subtle shadow */}
                <div className="absolute inset-0 bg-white rounded-2xl shadow-sm border border-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-95 group-hover:scale-100"></div>
                
                {/* Logo container */}
                <div className="relative px-3 py-2">
                  <img 
                    src={isScrolled ? logoClear : logoBlack} 
                    alt="Kejamatch Logo" 
                    className="h-24 w-auto object-contain transition-all duration-300 group-hover:scale-105"
                  />
                </div>
                
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-primary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                      isActive
                        ? 'text-primary bg-primary/8 shadow-sm'
                        : isScrolled
                          ? 'text-gray-700 hover:text-primary hover:bg-gray-50'
                          : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="relative z-10">{link.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-active"
                        className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/20"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
              
              {/* CTA Button */}
              <div className="ml-6 pl-6 border-l border-gray-200">
                <Link 
                  to="/properties"
                  className="inline-flex items-center px-5 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transform hover:scale-[1.02] transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Browse Properties
                  <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden relative p-2 rounded-xl transition-all duration-200 ${
                isScrolled
                  ? 'text-gray-700 hover:bg-gray-100' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.div>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Mobile Menu */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed top-20 left-4 right-4 z-50 lg:hidden"
            >
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="py-6">
                  {navLinks.map((link, index) => {
                    const isActive = location.pathname === link.path;
                    return (
                      <motion.div
                        key={link.path}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          to={link.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center px-6 py-3 text-base font-medium transition-all duration-200 ${
                            isActive
                              ? 'text-primary bg-primary/5 border-r-2 border-primary'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                          }`}
                        >
                          {link.label}
                          {isActive && <ChevronRight size={16} className="ml-auto" />}
                        </Link>
                      </motion.div>
                    );
                  })}
                  
                  {/* Mobile CTA */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navLinks.length * 0.1 }}
                    className="px-6 mt-4 pt-4 border-t border-gray-100"
                  >
                    <Link 
                      to="/properties"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center w-full bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200"
                    >
                      Browse Properties
                      <ChevronRight size={16} className="ml-2" />
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;