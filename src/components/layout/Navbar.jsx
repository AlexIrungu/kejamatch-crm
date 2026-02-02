import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronRight, User, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../auth/AuthContext';
import logoClear from '../../assets/clearbg.svg';
import logoBlack from '../../assets/clearblackbg.svg';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

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
    setShowUserMenu(false);
  }, [location.pathname]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/properties', label: 'Properties' },
    { path: '/bnbs', label: 'BNBs' },
    { path: '/blogs', label: 'Blogs' },
    { path: '/contact', label: 'Contact' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
  if (user?.role === 'admin') return '/admin/dashboard';
  if (user?.role === 'agent') return '/agent/dashboard';
  if (user?.role === 'client') return '/client/portal';  // ADD THIS
  return '/';
};

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
              
              {/* Authentication Section */}
              <div className="ml-6 pl-6 border-l border-gray-200">
                {isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    {/* Dashboard Link */}
                    <Link 
                      to={getDashboardLink()}
                      className={`inline-flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                        isScrolled
                          ? 'text-gray-700 hover:text-primary hover:bg-gray-50'
                          : 'text-white/90 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <LayoutDashboard size={18} className="mr-2" />
                      Dashboard
                    </Link>

                    {/* User Menu */}
                    <div className="relative">
                      <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                          isScrolled
                            ? 'text-gray-700 hover:bg-gray-50'
                            : 'text-white/90 hover:bg-white/10'
                        }`}
                      >
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {user?.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="hidden xl:inline">{user?.name}</span>
                      </button>

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {showUserMenu && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2"
                          >
                            <div className="px-4 py-3 border-b border-gray-100">
                              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                              <p className="text-xs text-gray-500">{user?.email}</p>
                              <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded">
                                {user?.role}
                              </span>
                            </div>
                            <Link
                              to={getDashboardLink()}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              onClick={() => setShowUserMenu(false)}
                            >
                              <LayoutDashboard size={16} className="mr-2" />
                              Dashboard
                            </Link>
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              <LogOut size={16} className="mr-2" />
                              Logout
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Link 
                      to="/login"
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                        isScrolled
                          ? 'text-gray-700 hover:text-primary hover:bg-gray-50'
                          : 'text-white/90 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      Login
                    </Link>
                    <Link 
                      to="/register"
                      className="inline-flex items-center px-5 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transform hover:scale-[1.02] transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      Get Started
                      <ChevronRight size={16} className="ml-1" />
                    </Link>
                  </div>
                )}
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
              className="fixed top-20 left-4 right-4 z-50 lg:hidden max-h-[calc(100vh-6rem)] overflow-y-auto"
            >
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="py-6">
                  {/* User Info (Mobile) */}
                  {isAuthenticated && (
                    <div className="px-6 pb-4 mb-4 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-white text-lg font-semibold">
                            {user?.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user?.name}</p>
                          <p className="text-sm text-gray-500">{user?.email}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded">
                            {user?.role}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Links */}
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
                  
                  {/* Mobile Auth Section */}
                  <div className="px-6 mt-4 pt-4 border-t border-gray-100 space-y-2">
                    {isAuthenticated ? (
                      <>
                        <Link 
                          to={getDashboardLink()}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-center w-full bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200"
                        >
                          <LayoutDashboard size={18} className="mr-2" />
                          Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center justify-center w-full border-2 border-red-600 text-red-600 px-6 py-3 rounded-xl font-semibold hover:bg-red-50 transition-all duration-200"
                        >
                          <LogOut size={18} className="mr-2" />
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link 
                          to="/login"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-center w-full border-2 border-primary text-primary px-6 py-3 rounded-xl font-semibold hover:bg-primary/5 transition-all duration-200"
                        >
                          Login
                        </Link>
                        <Link 
                          to="/register"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-center w-full bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200"
                        >
                          Get Started
                          <ChevronRight size={16} className="ml-2" />
                        </Link>
                      </>
                    )}
                  </div>
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