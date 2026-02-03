import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronRight, User, LogOut, LayoutDashboard, ChevronDown, Shield, UserCircle, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../auth/AuthContext';
import logoClear from '../../assets/clearbg.svg';
import logoBlack from '../../assets/clearblackbg.svg';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLoginMenu, setShowLoginMenu] = useState(false);
  const [showRegisterMenu, setShowRegisterMenu] = useState(false);
  const loginRef = useRef(null);
  const registerRef = useRef(null);
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

  // Close mobile menu and dropdowns when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowUserMenu(false);
    setShowLoginMenu(false);
    setShowRegisterMenu(false);
  }, [location.pathname]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (loginRef.current && !loginRef.current.contains(e.target)) setShowLoginMenu(false);
      if (registerRef.current && !registerRef.current.contains(e.target)) setShowRegisterMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roleBadgeColor = {
    admin: 'bg-red-100 text-red-700',
    agent: 'bg-blue-100 text-blue-700',
    client: 'bg-green-100 text-green-700',
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/properties', label: 'Properties' },
    { path: '/bnbs', label: 'BNBs' },
    { path: '/blogs', label: 'Blogs' },
    { path: '/contact', label: 'Contact' },
  ];

  // Pages that need a solid navbar background (no dark hero section)
  const solidNavbarPages = ['/properties', '/bnbs', '/client', '/agent', '/admin'];
  const needsSolidNavbar = solidNavbarPages.some(page => location.pathname.startsWith(page));

  // Use solid styling if scrolled OR if on a page that needs it
  const useSolidStyle = isScrolled || needsSolidNavbar;

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
        useSolidStyle
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
                    src={useSolidStyle ? logoClear : logoBlack}
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
                        : useSolidStyle
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
                        useSolidStyle
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
                          useSolidStyle
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
                              <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded capitalize ${roleBadgeColor[user?.role] || 'bg-gray-100 text-gray-700'}`}>
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
                    {/* Login Dropdown */}
                    <div className="relative" ref={loginRef}>
                      <button
                        onClick={() => { setShowLoginMenu(!showLoginMenu); setShowRegisterMenu(false); }}
                        className={`inline-flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                          useSolidStyle
                            ? 'text-gray-700 hover:text-primary hover:bg-gray-50'
                            : 'text-white/90 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        Login
                        <ChevronDown size={14} className={`ml-1 transition-transform duration-200 ${showLoginMenu ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {showLoginMenu && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 overflow-hidden"
                          >
                            <Link to="/client/login" onClick={() => setShowLoginMenu(false)} className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                              <UserCircle size={18} className="mr-3 text-green-600" />
                              <div>
                                <p className="font-medium">Client Login</p>
                                <p className="text-xs text-gray-400">Buy, rent or inquire</p>
                              </div>
                            </Link>
                            <Link to="/login" onClick={() => setShowLoginMenu(false)} className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                              <Shield size={18} className="mr-3 text-blue-600" />
                              <div>
                                <p className="font-medium">Agent / Admin</p>
                                <p className="text-xs text-gray-400">Manage listings & leads</p>
                              </div>
                            </Link>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Register Dropdown */}
                    <div className="relative" ref={registerRef}>
                      <button
                        onClick={() => { setShowRegisterMenu(!showRegisterMenu); setShowLoginMenu(false); }}
                        className="inline-flex items-center px-5 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transform hover:scale-[1.02] transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        Get Started
                        <ChevronDown size={14} className={`ml-1 transition-transform duration-200 ${showRegisterMenu ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {showRegisterMenu && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 overflow-hidden"
                          >
                            <Link to="/client/register" onClick={() => setShowRegisterMenu(false)} className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                              <UserCircle size={18} className="mr-3 text-green-600" />
                              <div>
                                <p className="font-medium">Register as Client</p>
                                <p className="text-xs text-gray-400">Find your dream property</p>
                              </div>
                            </Link>
                            <Link to="/register" onClick={() => setShowRegisterMenu(false)} className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                              <Building2 size={18} className="mr-3 text-blue-600" />
                              <div>
                                <p className="font-medium">Register as Agent</p>
                                <p className="text-xs text-gray-400">List & manage properties</p>
                              </div>
                            </Link>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`lg:hidden relative p-2 rounded-xl transition-all duration-200 ${
                useSolidStyle
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
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Login</p>
                        <Link
                          to="/client/login"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center w-full border-2 border-green-600 text-green-700 px-6 py-3 rounded-xl font-semibold hover:bg-green-50 transition-all duration-200"
                        >
                          <UserCircle size={18} className="mr-2" />
                          Client Login
                        </Link>
                        <Link
                          to="/login"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center w-full border-2 border-blue-600 text-blue-700 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200"
                        >
                          <Shield size={18} className="mr-2" />
                          Agent / Admin Login
                        </Link>

                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-4">Register</p>
                        <Link
                          to="/client/register"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-center w-full bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200"
                        >
                          Register as Client
                          <ChevronRight size={16} className="ml-2" />
                        </Link>
                        <Link
                          to="/register"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-center w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200"
                        >
                          Register as Agent
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