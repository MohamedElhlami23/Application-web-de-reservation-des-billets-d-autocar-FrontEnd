import React from 'react';
import { Bus, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-orange-500 p-2 rounded-lg">
                <Bus className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">MarocBus</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Votre compagnon de voyage de confiance à travers le Maroc. 
              Confort, sécurité et ponctualité garantis.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Nos Destinations</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Horaires</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Tarifs</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Conditions</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Réservation en ligne</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Service clientèle</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Bagages</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Groupe & Entreprises</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-orange-500" />
                <span className="text-gray-400">+212 69 48 79 65</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-orange-500" />
                <span className="text-gray-400">contact@marocbus.ma</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-orange-500 mt-1" />
                <span className="text-gray-400">123 Avenue Mohammed V<br />Tétouan, Maroc</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 MarocBus. Tous droits réservés. | Développé  au Maroc
          </p>
        </div>
      </div>
    </footer>
  );
};