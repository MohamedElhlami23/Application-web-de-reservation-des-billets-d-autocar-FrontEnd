import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bus, Menu, X, User } from 'lucide-react';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-lg border-b-4 border-orange-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-r from-blue-600 to-orange-500 p-2 rounded-lg group-hover:scale-105 transition-transform">
              <Bus className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              MarocBus
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-orange-500 ${
                isActive('/') ? 'text-orange-500' : 'text-gray-700'
              }`}
            >
              Accueil
            </Link>
           {/* <Link
              to="/search"
              className={`text-sm font-medium transition-colors hover:text-orange-500 ${
                isActive('/search') ? 'text-orange-500' : 'text-gray-700'
              }`}
            >
              Rechercher
            </Link>*/}
            <Link
              to="/dashboard"
              className={`text-sm font-medium transition-colors hover:text-orange-500 ${
                isActive('/dashboard') ? 'text-orange-500' : 'text-gray-700'
              }`}
            >
              Mes Voyages
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-orange-500 transition-colors"
            >
              <User className="h-4 w-4 mr-2" />
              Connexion
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-base font-medium text-gray-700 hover:text-orange-500"
                onClick={() => setIsMenuOpen(false)}
              >
                Accueil
              </Link>
              {/*<Link
                to="/search"
                className="text-base font-medium text-gray-700 hover:text-orange-500"
                onClick={() => setIsMenuOpen(false)}
              >
                Rechercher
              </Link>*/}
              <Link
                to="/dashboard"
                className="text-base font-medium text-gray-700 hover:text-orange-500"
                onClick={() => setIsMenuOpen(false)}
              >
                Mes Voyages
              </Link>
              <Link
                to="/login"
                className="text-base font-medium text-gray-700 hover:text-orange-500"
                onClick={() => setIsMenuOpen(false)}
              >
                Connexion
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};