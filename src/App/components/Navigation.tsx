import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, Home, Book, LayoutDashboard, Shield, User, MessageSquare, Menu, X, BookOpen, ChevronDown, Search, Award, Map } from 'lucide-react';
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

interface NavItem {
  icon: React.ReactNode;
  text: string;
  path: string;
  onClick: () => void;
  isDropdown?: boolean;
  dropdownName?: string;
  dropdownItems?: {
    text: string;
    description: string;
    path: string;
    onClick: () => void;
  }[];
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
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRefs = {
    overseas: useRef<HTMLDivElement>(null),
    resources: useRef<HTMLDivElement>(null)
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown) {
        const activeRef = dropdownRefs[activeDropdown as keyof typeof dropdownRefs];
        if (activeRef?.current && !activeRef.current.contains(event.target as Node)) {
          console.log("Click outside dropdown:", activeDropdown);
          setActiveDropdown(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);

  const handleNavClick = (action: () => void) => {
    action();
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const toggleDropdown = (dropdownName: string) => {
    console.log("Toggling dropdown:", dropdownName, "Current active:", activeDropdown);
    if (activeDropdown === dropdownName) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(dropdownName);
    }
  };

  const navItems: NavItem[] = [
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
      icon: <GraduationCap className="h-5 w-5" />,
      text: "Study Abroad",
      path: "/study-abroad",
      onClick: () => {
        console.log("Over Seas button clicked");
        toggleDropdown('study-abroad');
      },
      isDropdown: true,
      dropdownName: 'study-abroad',
      dropdownItems: [
        {
          text: "Course Finder",
          description: "Search international programs by country, field,...",
          path: "/course-finder",
          onClick: () => navigate('/course-finder')
        },
        {
          text: "Scholarship Finder",
          description: "Find scholarships based on eligibility and preferences",
          path: "/scholarship-finder",
          onClick: () => navigate('/scholarship-finder')
        },
        {
          text: "Consultancy Directory",
          description: "Connect with verified education consultants",
          path: "/agencies",
          onClick: () => navigate('/agencies')
        },
        {
          text: "Find a Buddy",
          description: "Connect with students heading to the same destination",
          path: "/find-buddy",
          onClick: () => navigate('/find-buddy')
        }
      ]
    },
    {
      icon: <Book className="h-5 w-5" />,
      text: "Blog",
      path: "/resources",
      onClick: () => {
        console.log("Resources button clicked");
        toggleDropdown('resources');
      },
      isDropdown: true,
      dropdownName: 'resources',
      dropdownItems: [
        {
          text: "Knowledge Hub",
          description: "Guides and tips for studying abroad",
          path: "/knowledge-hub",
          onClick: () => navigate('/knowledge-hub')
        },
        {
          text: "Exam Blog",
          description: "Resources for IELTS, Duolingo, and PTE...",
          path: "/language-prep",
          onClick: () => navigate('/language-prep')
        },
        {
          text: "Visa Information",
          description: "Study visa requirements and processes for different countries",
          path: "/visa-info",
          onClick: () => navigate('/visa-info')
        }
      ]
    },
    {
      icon: <User className="h-5 w-5" />,
      text: "About",
      path: "/about",
      onClick: () => {
        setShowDashboard(false);
        setShowProfile(false);
        navigate('/about');
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
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/55 border-b border-gray-200/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/">
                <span className="text-2xl font-bold text-primary cursor-pointer">
                  Admissions<span className="text-secondary">.app</span>
                </span>
              </Link>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              {navItems.map((item, index) => (
                <div key={index} className="relative">
                  {item.isDropdown ? (
                    <div ref={dropdownRefs[item.dropdownName as keyof typeof dropdownRefs]} className="relative">
                      <button
                        onClick={() => item.onClick()}
                        className={`inline-flex items-center px-2.5 py-1.5 text-sm font-medium transition-colors rounded-lg ${
                          activeDropdown === item.dropdownName
                            ? 'text-primary bg-primary/5'
                            : 'text-gray-500 hover:text-primary hover:bg-primary/5'
                        }`}
                      >
                        {item.icon}
                        <span className="ml-1.5">{item.text}</span>
                        <ChevronDown className={`ml-0.5 h-4 w-4 transform transition-transform ${
                          activeDropdown === item.dropdownName ? 'rotate-180' : ''
                        }`} />
                      </button>
                      {activeDropdown === item.dropdownName && (
                        <div className="absolute left-0 mt-1 w-[576px] rounded-lg shadow-lg bg-white ring-1 ring-black/5 z-[999] p-3">
                          <div className="grid grid-cols-2 gap-3">
                            {item.dropdownItems?.map((dropdownItem, idx) => (
                              <Link
                                key={idx}
                                to={dropdownItem.path}
                                onClick={() => {
                                  console.log("Dropdown item clicked:", dropdownItem.text);
                                  setActiveDropdown(null);
                                  dropdownItem.onClick();
                                }}
                                className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors block cursor-pointer"
                              >
                                <div className="text-sm font-medium text-gray-900 mb-0.5">{dropdownItem.text}</div>
                                <div className="text-xs text-gray-500">{dropdownItem.description}</div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={() => handleNavClick(item.onClick)}
                      className={`inline-flex items-center px-2.5 py-1.5 text-sm font-medium transition-colors rounded-lg ${
                        location.pathname === item.path
                          ? 'text-primary bg-primary/5'
                          : 'text-gray-500 hover:text-primary hover:bg-primary/5'
                      }`}
                    >
                      {item.icon}
                      <span className="ml-1.5">{item.text}</span>
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
          <div className="md:hidden bg-white">
            <div className="pt-2 pb-3 space-y-1">
              {navItems.map((item, index) => (
                <div key={index}>
                  <button
                    onClick={() => item.isDropdown ? item.onClick() : navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-left rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? 'text-primary bg-primary/5'
                        : 'text-gray-500 hover:text-primary hover:bg-primary/5'
                    }`}
                  >
                    {item.icon}
                    <span>{item.text}</span>
                    {item.isDropdown && (
                      <ChevronDown className={`ml-auto h-4 w-4 transform transition-transform ${
                        activeDropdown === item.dropdownName ? 'rotate-180' : ''
                      }`} />
                    )}
                  </button>
                  {item.isDropdown && activeDropdown === item.dropdownName && (
                    <div className="pl-4 py-2 space-y-2">
                      {item.dropdownItems?.map((dropdownItem, idx) => (
                        <Link
                          key={idx}
                          to={dropdownItem.path}
                          onClick={() => {
                            console.log("Mobile dropdown item clicked:", dropdownItem.text);
                            setActiveDropdown(null);
                            setIsMobileMenuOpen(false);
                            dropdownItem.onClick();
                          }}
                          className="w-full text-left p-3 rounded-lg hover:bg-gray-50 block"
                        >
                          <div className="text-sm font-medium text-gray-900">{dropdownItem.text}</div>
                          <div className="text-sm text-gray-500">{dropdownItem.description}</div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
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