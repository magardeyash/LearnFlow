import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, LayoutDashboard, User, ShieldAlert, Award, Menu, X, BookOpen } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items: cartItems } = useCartStore();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-xl font-black text-brand-500 tracking-wider">
              <BookOpen className="h-6 w-6 text-brand-500 animate-pulse" />
              <span>LEARN<span className="text-slate-100">FLOW</span></span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/browse" className="text-sm font-medium text-slate-300 hover:text-brand-500 transition-colors">
              Browse Courses
            </Link>
            
            {isAuthenticated && (
              <>
                {user?.role === 'STUDENT' && (
                  <Link to="/dashboard" className="text-sm font-medium text-slate-300 hover:text-brand-500 transition-colors">
                    My Learning
                  </Link>
                )}
                {user?.role === 'INSTRUCTOR' && (
                  <Link to="/instructor/dashboard" className="text-sm font-medium text-slate-300 hover:text-brand-500 transition-colors">
                    Instructor Console
                  </Link>
                )}
                {user?.role === 'ADMIN' && (
                  <Link to="/admin/dashboard" className="text-sm font-medium text-slate-300 hover:text-brand-500 transition-colors">
                    Admin Panel
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Right side items */}
          <div className="hidden md:flex items-center gap-4">
            {/* Cart */}
            {(!isAuthenticated || user?.role === 'STUDENT') && (
              <Link to="/cart" className="relative p-2 text-slate-400 hover:text-brand-500 transition-colors">
                <ShoppingCart className="h-6 w-6" />
                {cartItems.length > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-500 text-slate-950 transform translate-x-1/2 -translate-y-1/2">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            )}

            {/* Profile / Auth buttons */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center focus:outline-none"
                >
                  <Avatar src={user?.avatar} name={user?.name || 'User'} size="md" className="ring-2 ring-transparent hover:ring-brand-500 transition-all duration-200" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-700 bg-slate-900 shadow-2xl py-2 z-50">
                    <div className="px-4 py-2.5 border-b border-slate-800">
                      <p className="text-sm font-semibold text-slate-100 truncate">{user?.name}</p>
                      <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-black uppercase tracking-wider text-brand-500 px-1.5 py-0.5 rounded bg-brand-900/30 border border-brand-500/20">
                        {user?.role}
                      </span>
                    </div>

                    <div className="py-1">
                      {user?.role === 'STUDENT' && (
                        <Link
                          to="/instructor/register"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-brand-500 transition-colors"
                        >
                          <Award className="h-4 w-4" />
                          Become an Instructor
                        </Link>
                      )}
                      <Link
                        to={user?.role === 'INSTRUCTOR' ? '/instructor/dashboard' : user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-brand-500 transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </div>

                    <div className="border-t border-slate-800 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-rose-400 hover:bg-slate-800 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            {(!isAuthenticated || user?.role === 'STUDENT') && (
              <Link to="/cart" className="relative p-2 text-slate-400 hover:text-brand-500 transition-colors">
                <ShoppingCart className="h-6 w-6" />
                {cartItems.length > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-500 text-slate-950 transform translate-x-1/2 -translate-y-1/2">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-400 hover:text-slate-100 focus:outline-none p-1"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950 px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/browse"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-brand-500"
          >
            Browse Courses
          </Link>
          
          {isAuthenticated ? (
            <>
              {user?.role === 'STUDENT' && (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-brand-500"
                  >
                    My Learning
                  </Link>
                  <Link
                    to="/instructor/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-brand-500"
                  >
                    Become an Instructor
                  </Link>
                </>
              )}
              {user?.role === 'INSTRUCTOR' && (
                <Link
                  to="/instructor/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-brand-500"
                >
                  Instructor Console
                </Link>
              )}
              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-brand-500"
                >
                  Admin Panel
                </Link>
              )}
              
              <div className="border-t border-slate-850 pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2 px-3">
                  <Avatar src={user?.avatar} name={user?.name || 'User'} size="sm" />
                  <div>
                    <p className="text-sm font-semibold text-slate-100">{user?.name}</p>
                    <p className="text-xs text-slate-400">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-semibold text-rose-400 hover:bg-slate-800"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full">Sign In</Button>
              </Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" size="sm" className="w-full">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};
