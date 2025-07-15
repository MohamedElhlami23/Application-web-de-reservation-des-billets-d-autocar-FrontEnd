import React, { useState } from 'react';
import { Bus, Users, MapPin, Calendar, Plus, Edit, Trash2, Settings } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = {
    totalBuses: 12,
    totalRoutes: 25,
    todayBookings: 87,
    monthlyRevenue: 125000
  };

  const tabs = [
    { id: 'overview', name: 'Vue d\'ensemble', icon: Settings },
    { id: 'buses', name: 'Autocars', icon: Bus },
    { id: 'routes', name: 'Trajets', icon: MapPin },
    { id: 'bookings', name: 'Réservations', icon: Calendar },
    { id: 'clients', name: 'Clients', icon: Users }
  ];

  const mockBuses = [
    { id: 1, nom: 'Atlas Express', depart: 'Casablanca', arrivee: 'Rabat', sieges: 50, status: 'active' },
    { id: 2, nom: 'TransMaroc', depart: 'Rabat', arrivee: 'Fès', sieges: 45, status: 'active' },
    { id: 3, nom: 'Supratours', depart: 'Fès', arrivee: 'Marrakech', sieges: 48, status: 'maintenance' }
  ];

  const mockBookings = [
    { id: 1, client: 'Ahmed Alami', trajet: 'Casablanca → Rabat', date: '2025-01-20', montant: 120, status: 'confirmée' },
    { id: 2, client: 'Fatima Benali', trajet: 'Rabat → Fès', date: '2025-01-21', montant: 135, status: 'en_attente' },
    { id: 3, client: 'Omar Jamal', trajet: 'Fès → Marrakech', date: '2025-01-22', montant: 150, status: 'confirmée' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord administrateur</h1>
          <p className="text-gray-600 mt-2">Gérez votre flotte et vos réservations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="bg-blue-500 p-3 rounded-lg">
                <Bus className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Autocars</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBuses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="bg-green-500 p-3 rounded-lg">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Trajets actifs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRoutes}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="bg-orange-500 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Réservations aujourd'hui</p>
                <p className="text-2xl font-bold text-gray-900">{stats.todayBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="bg-purple-500 p-3 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Revenus ce mois</p>
                <p className="text-2xl font-bold text-gray-900">{stats.monthlyRevenue.toLocaleString()} DH</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Vue d'ensemble</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Réservations récentes</h3>
                    <div className="space-y-3">
                      {mockBookings.slice(0, 3).map((booking) => (
                        <div key={booking.id} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">{booking.client}</p>
                            <p className="text-sm text-gray-500">{booking.trajet}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">{booking.montant} DH</p>
                            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                              booking.status === 'confirmée' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {booking.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">État de la flotte</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Autocars actifs</span>
                        <span className="font-medium">10</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">En maintenance</span>
                        <span className="font-medium">2</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Taux d'occupation</span>
                        <span className="font-medium">78%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Buses Tab */}
            {activeTab === 'buses' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Gestion des autocars</h2>
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-orange-600 transition-colors">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un autocar
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nom
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trajet
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sièges
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockBuses.map((bus) => (
                        <tr key={bus.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="bg-gradient-to-r from-blue-500 to-orange-500 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-white font-bold text-sm">{bus.nom.charAt(0)}</span>
                              </div>
                              <div className="text-sm font-medium text-gray-900">{bus.nom}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {bus.depart} → {bus.arrivee}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {bus.sieges}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              bus.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {bus.status === 'active' ? 'Actif' : 'Maintenance'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-orange-600 hover:text-orange-900 mr-4">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Gestion des réservations</h2>
                  <div className="flex space-x-2">
                    <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                      <option>Toutes les réservations</option>
                      <option>Confirmées</option>
                      <option>En attente</option>
                      <option>Annulées</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trajet
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Montant
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mockBookings.map((booking) => (
                        <tr key={booking.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {booking.client}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {booking.trajet}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(booking.date).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {booking.montant} DH
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              booking.status === 'confirmée' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-orange-600 hover:text-orange-900 mr-4">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Other tabs would be implemented similarly */}
            {activeTab === 'routes' && (
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Gestion des trajets</h3>
                <p className="text-gray-500">Cette section sera bientôt disponible</p>
              </div>
            )}

            {activeTab === 'clients' && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Gestion des clients</h3>
                <p className="text-gray-500">Cette section sera bientôt disponible</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};