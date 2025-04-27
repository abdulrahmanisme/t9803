import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, Home, HelpCircle, LayoutDashboard, Shield, User, MessageSquare, Menu, X, BookOpen, ChevronDown, Info, Newspaper, FileText } from 'lucide-react';
import { useAuth } from '../../components/AuthContext';
import { supabase } from '../../lib/supabase';

interface NavigationProps {
  isSuperAdmin: boolean;
  isAdmin: boolean;
  showDashboard: boolean;
  showProfile: boolean;
  setShowDashboard: (show: boolean) => void;
  setShowProfile: (show: boolean) => void;
  setShowAuth: (show: boolean) => void;
}

export function Navigation({
  isSuperAdmin,
  isAdmin,
  showDashboard,
  showProfile,
  setShowDashboard,
  setShowProfile,
  setShowAuth
}: NavigationProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isInfoDropdownOpen, setIsInfoDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsInfoDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavClick = (action: () => void) => {
    action();
    setIsMobileMenuOpen(false);
  };

  const toggleInfoDropdown = () => {
    setIsInfoDropdownOpen(!isInfoDropdownOpen);
  };

  const navItems = [
    {
      icon: <Home className="h-5 w-5" />,
      text: "Home",
      path: "/",
      onClick: () => {
        setShowDashboard(false);
        setShowProfile(false);
        navigate('/');
      }
    },
    {
      icon: <Info className="h-5 w-5" />,
      text: "Info",
      path: "/info",
      onClick: toggleInfoDropdown,
      isDropdown: true,
      dropdownItems: [
        {
          text: "Scholarships",
          path: "/scholarships",
          onClick: () => {
            setShowDashboard(false);
            setShowProfile(false);
            navigate('/scholarships');
            setIsInfoDropdownOpen(false);
          }
        }
      ]
    },
    {
      icon: <Newspaper className="h-5 w-5" />,
      text: "About",
      path: "/about",
      onClick: () => {
        setShowDashboard(false);
        setShowProfile(false);
        navigate('/about');
      }
    },
    {
      icon: <FileText className="h-5 w-5" />,
      text: "Blog",
      path: "/blog",
      onClick: () => {
        setShowDashboard(false);
        setShowProfile(false);
        navigate('/blog');
      }
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      text: "Contact Us",
      path: "/contact",
      onClick: () => {
        setShowDashboard(false);
        setShowProfile(false);
        navigate('/contact');
      }
    }
  ];

  if (user) {
    if (isSuperAdmin) {
      navItems.push({
        icon: <Shield className="h-5 w-5" />,
        text: "Super Admin",
        path: "/dashboard",
        onClick: () => {
          setShowDashboard(true);
          setShowProfile(false);
        }
      });
    } else if (isAdmin) {
      navItems.push({
        icon: <LayoutDashboard className="h-5 w-5" />,
        text: "Dashboard",
        path: "/dashboard",
        onClick: () => {
          setShowDashboard(true);
          setShowProfile(false);
        }
      });
    } else {
      navItems.push({
        icon: <User className="h-5 w-5" />,
        text: "Profile",
        path: "/profile",
        onClick: () => {
          setShowDashboard(false);
          setShowProfile(true);
        }
      });
    }
  }

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/">
                <span className="text-2xl font-bold text-primary cursor-pointer">
                  Admissions<span className="text-secondary">.app</span>
                </span>
              </Link>
            </div>
            <div className="hidden md:ml-8 md:flex md:space-x-8">
              {navItems.map((item, index) => (
                <div key={index} className="relative">
                  {item.isDropdown ? (
                    <div ref={dropdownRef} className="relative">
                      <button
                        onClick={item.onClick}
                        className={`inline-flex items-center px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                          location.pathname === item.path
                            ? 'text-primary bg-primary/5'
                            : 'text-gray-500 hover:text-primary hover:bg-primary/5'
                        }`}
                      >
                        {item.icon}
                        <span className="ml-2">{item.text}</span>
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </button>
                      {isInfoDropdownOpen && (
                        <div 
                          className="absolute left-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                        >
                          <div className="py-1">
                            {item.dropdownItems?.map((dropdownItem, idx) => (
                              <button
                                key={idx}
                                onClick={dropdownItem.onClick}
                                className={`block w-full text-left px-4 py-2 text-sm ${
                                  location.pathname === dropdownItem.path
                                    ? 'text-primary bg-primary/5'
                                    : 'text-gray-700 hover:text-primary hover:bg-primary/5'
                                }`}
                              >
                                {dropdownItem.text}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={() => handleNavClick(item.onClick)}
                      className={`inline-flex items-center px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                        location.pathname === item.path
                          ? 'text-primary bg-primary/5'
                          : 'text-gray-500 hover:text-primary hover:bg-primary/5'
                      }`}
                    >
                      {item.icon}
                      <span className="ml-2">{item.text}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <div className="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center space-x-4">
              {user ? (
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 transition-colors"
                >
                  Sign Out
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setShowAuth(true)}
                    className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setShowAuth(true)}
                    className="inline-flex items-center px-6 py-2 border border-primary text-sm font-medium rounded-lg text-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 transition-colors"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
            <div className="flex items-center md:hidden">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-primary hover:bg-primary/5 focus:outline-none transition-colors"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleNavClick(item.onClick)}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-left rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'text-primary bg-primary/5'
                      : 'text-gray-500 hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  {item.icon}
                  <span>{item.text}</span>
                </button>
              ))}
              {user ? (
                <button
                  onClick={() => {
                    supabase.auth.signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-left text-primary hover:bg-primary/5 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setShowAuth(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-left text-primary hover:bg-primary/5 rounded-lg transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setShowAuth(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-left text-primary hover:bg-primary/5 rounded-lg transition-colors"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}