import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Users, ArrowRight, Star, Shield, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { villeService, VilleDto } from '../services/villeService';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [cities, setCities] = useState<VilleDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchForm, setSearchForm] = useState({
    villeDepartId: '',
    villeArriveeId: '',
    dateDepart: '',
    nbrPassagers: 1,
    allerRetour: false,
    dateRetour: ''
  });

  const busCompanies = [
    {name:'Asfar Tissir',images:'/images/Asfar Tissir.webp'}, 
    {name:'Trans AL YAMAMA',images:'/images/Trans al yamama.webp'},
     {name:'Supratours',images:'/images/supratours.webp'},
      {name:'CTM Voyage',images:'/images/ctm.webp'},
    {name:'Ghazala Bus',images:'/images/ghazala.webp'}, 
    {name:'Voyages AL MAHABA',images:'/images/voyages al mahaba.webp'}, 
    {name:'Sotram',images:'/images/Sotram.webp'}, 
    {name:'Voyage Farah',images:'/images/Voyage Farah.webp'}
  ];

  // Charger les villes depuis l'API
  useEffect(() => {
    const loadCities = async () => {
      try {
        const citiesData = await villeService.getAllVilles();
        setCities(citiesData);
      } catch (error) {
        console.error('Failed to load cities:', error);
        // Fallback avec des villes par défaut
        setCities([
          { villeId: 1, nom: 'Casablanca' },
          { villeId: 2, nom: 'Rabat' },
          { villeId: 3, nom: 'Fès' },
          { villeId: 4, nom: 'Marrakech' },
          { villeId: 5, nom: 'Tanger' },
          { villeId: 6, nom: 'Agadir' },
          { villeId: 7, nom: 'Meknès' },
          { villeId: 8, nom: 'Oujda' },
          { villeId: 9, nom: 'Tétouan' },
          { villeId: 10, nom: 'El Jadida' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadCities();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchForm.villeDepartId || !searchForm.villeArriveeId || !searchForm.dateDepart) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    const searchParams = new URLSearchParams({
      villeDepartId: searchForm.villeDepartId,
      villeArriveeId: searchForm.villeArriveeId,
      dateDepart: searchForm.dateDepart,
      nbrPassagers: searchForm.nbrPassagers.toString(),
      allerRetour: searchForm.allerRetour.toString(),
      ...(searchForm.allerRetour && searchForm.dateRetour && { dateRetour: searchForm.dateRetour })
    });
    
    navigate(`/search?${searchParams.toString()}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-orange-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Voyagez à Travers le
              <span className="block bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                Royaume du Maroc
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Découvrez la beauté du Maroc avec nos services de transport confortables et fiables
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSearch} className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Chargement des villes...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {/* Departure City */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-orange-500" />
                        Ville de départ
                      </label>
                      <select
                        value={searchForm.villeDepartId}
                        onChange={(e) => setSearchForm({...searchForm, villeDepartId: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-900"
                        required
                      >
                        <option value="" className="text-gray-500">Choisir une ville</option>
                        {cities.map(city => (
                          <option key={city.villeId} value={city.villeId} className="text-gray-900">
                            {city.nom}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Arrival City */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-blue-500" />
                        Ville d'arrivée
                      </label>
                      <select
                        value={searchForm.villeArriveeId}
                        onChange={(e) => setSearchForm({...searchForm, villeArriveeId: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-900"
                        required
                      >
                        <option value="" className="text-gray-500">Choisir une ville</option>
                        {cities.filter(city => city.villeId.toString() !== searchForm.villeDepartId).map(city => (
                          <option key={city.villeId} value={city.villeId} className="text-gray-900">
                            {city.nom}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Departure Date */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-green-500" />
                        Date de départ
                      </label>
                      <input
                        type="date"
                        value={searchForm.dateDepart}
                        onChange={(e) => setSearchForm({...searchForm, dateDepart: e.target.value})}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-900"
                        required
                      />
                    </div>

                    {/* Passengers */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 flex items-center">
                        <Users className="h-4 w-4 mr-1 text-purple-500" />
                        Passagers
                      </label>
                      <select
                        value={searchForm.nbrPassagers}
                        onChange={(e) => setSearchForm({...searchForm, nbrPassagers: parseInt(e.target.value)})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-900"
                      >
                        {[1,2,3,4,5,6,7,8].map(num => (
                          <option key={num} value={num} className="text-gray-900">
                            {num} passager{num > 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Round Trip Option */}
                  <div className="flex items-center mb-6">
                    <input
                      type="checkbox"
                      id="allerRetour"
                      checked={searchForm.allerRetour}
                      onChange={(e) => setSearchForm({...searchForm, allerRetour: e.target.checked})}
                      className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    <label htmlFor="allerRetour" className="ml-2 text-sm font-medium text-gray-700">
                      Voyage aller-retour
                    </label>
                  </div>

                  {/* Return Date */}
                  {searchForm.allerRetour && (
                    <div className="mb-6">
                      <label className="text-sm font-medium text-gray-700 flex items-center mb-2">
                        <Calendar className="h-4 w-4 mr-1 text-red-500" />
                        Date de retour
                      </label>
                      <input
                        type="date"
                        value={searchForm.dateRetour}
                        onChange={(e) => setSearchForm({...searchForm, dateRetour: e.target.value})}
                        min={searchForm.dateDepart}
                        className="w-full max-w-xs p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-900"
                        required={searchForm.allerRetour}
                      />
                    </div>
                  )}

                  {/* Search Button */}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 flex items-center justify-center group"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    Rechercher des voyages
                    <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi Choisir MarocBus ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nous offrons une expérience de voyage exceptionnelle avec des services de qualité supérieure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group hover:scale-105 transition-transform duration-200">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sécurité Garantie</h3>
              <p className="text-gray-600">
                Tous nos véhicules sont régulièrement inspectés et nos chauffeurs sont expérimentés et certifiés
              </p>
            </div>

            <div className="text-center group hover:scale-105 transition-transform duration-200">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg">
                <Clock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ponctualité</h3>
              <p className="text-gray-600">
                Nous respectons scrupuleusement les horaires pour que vous arriviez toujours à temps
              </p>
            </div>

            <div className="text-center group hover:scale-105 transition-transform duration-200">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Confort Premium</h3>
              <p className="text-gray-600">
                Sièges confortables, climatisation, WiFi gratuit et divertissement à bord
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bus Companies Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Partenaires de Confiance
            </h2>
            <p className="text-xl text-gray-600">
              Collaborez avec les meilleures compagnies de transport du Maroc
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {busCompanies.map((company, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 text-center">
                <img 
  src={company.images} 
  alt={company.name} 
  className="h-12 w-auto mx-auto mb-3 object-contain" 
/>
                <h3 className="font-semibold text-gray-900">{company.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-orange-500 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt pour Votre Prochaine Aventure ?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Réservez dès maintenant et bénéficiez de tarifs préférentiels pour vos voyages à travers le Maroc
          </p>
          <button 
            onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200 inline-flex items-center"
          >
            Commencer ma Réservation
            <ArrowRight className="h-5 w-5 ml-2" />
          </button>
        </div>
      </section>
    </div>
  );
};