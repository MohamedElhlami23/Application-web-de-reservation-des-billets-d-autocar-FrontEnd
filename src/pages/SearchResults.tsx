import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Clock, MapPin, Users, ArrowRight, Filter, Calendar, Loader } from 'lucide-react';
import { trajetService, TrajetDto } from '../services/trajetService';
import { villeService, VilleDto } from '../services/villeService';

// Mapping des logos pour chaque compagnie
const companyLogos: { [key: string]: string } = {
  'Asfar Tissir': '/images/Asfar Tissir.webp',
  'Trans AL YAMAMA': '/images/Trans al yamama.webp',
  'Supratours': '/images/supratours.webp',
  'CTM Voyage': '/images/ctm.webp',
  'Ghazala Bus': '/images/ghazala.webp'
};

// Mapping des couleurs de fond pour chaque compagnie (si logo non trouvé)
const companyColors: { [key: string]: string } = {
  'Asfar Tissir': 'bg-gradient-to-r from-blue-500 to-blue-700',
  'Trans AL YAMAMA': 'bg-gradient-to-r from-green-500 to-green-700',
  'Supratours': 'bg-gradient-to-r from-orange-500 to-orange-700',
  'CTM Voyage': 'bg-gradient-to-r from-red-500 to-red-700',
  'Ghazala Bus': 'bg-gradient-to-r from-purple-500 to-purple-700'
};

export const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [trajets, setTrajets] = useState<TrajetDto[]>([]);
  const [filteredTrajets, setFilteredTrajets] = useState<TrajetDto[]>([]);
  const [cities, setCities] = useState<{ [key: number]: string }>({});
  const [filters, setFilters] = useState({
    maxPrice: 300,
    company: '',
    timeRange: ''
  });

  const companies = ['Asfar Tissir', 'Trans AL YAMAMA', 'Supratours', 'CTM Voyage', 'Ghazala Bus'];

  // Fonction pour obtenir une compagnie aléatoire
  const getRandomCompagnie = () => {
    return companies[Math.floor(Math.random() * companies.length)];
  };

  // Charger les villes
  useEffect(() => {
    const loadCities = async () => {
      try {
        const citiesData = await villeService.getAllVilles();
        const citiesMap = citiesData.reduce((acc: { [key: number]: string }, city: VilleDto) => {
          acc[city.villeId] = city.nom;
          return acc;
        }, {});
        setCities(citiesMap);
      } catch (error) {
        console.error('Failed to load cities:', error);
        // Fallback
        setCities({
          1: 'Casablanca', 2: 'Rabat', 3: 'Fès', 4: 'Marrakech', 5: 'Tanger',
          6: 'Agadir', 7: 'Meknès', 8: 'Oujda', 9: 'Tétouan', 10: 'El Jadida'
        });
      }
    };

    loadCities();
  }, []);

  // Rechercher les trajets
  useEffect(() => {
    const searchTrajets = async () => {
      try {
        const villeDepartId = parseInt(searchParams.get('villeDepartId') || '0');
        const villeArriveeId = parseInt(searchParams.get('villeArriveeId') || '0');
        const dateDepart = searchParams.get('dateDepart') || '';
        const nbrPassagers = parseInt(searchParams.get('nbrPassagers') || '1');
        const allerRetour = searchParams.get('allerRetour') === 'true';
        const dateRetour = searchParams.get('dateRetour') || '';

        // Vérifier les paramètres requis
        if (!villeDepartId || !villeArriveeId || !dateDepart) {
          setLoading(false);
          return;
        }

        const searchData = {
          villeDepartId,
          villeArriveeId,
          dateDepart,
          nbrpassagers: nbrPassagers,
          ...(allerRetour && dateRetour && { dateArrivee: dateRetour })
        };

        let results: TrajetDto[];
        if (allerRetour && dateRetour) {
          results = await trajetService.searchAllerRetour(searchData);
        } else {
          results = await trajetService.searchAllerSimple(searchData);
        }

        // Ajouter des compagnies aux résultats
        const resultsWithCompanies = results.map(trajet => ({
          ...trajet,
          compagnie: getRandomCompagnie()
        }));

        setTrajets(resultsWithCompanies);
        setFilteredTrajets(resultsWithCompanies);
      } catch (error) {
        console.error('Failed to search trajets:', error);
        
        // Générer un nombre aléatoire de trajets entre 3 et 20
        const trajetCount = Math.floor(Math.random() * 18) + 3; 
        
        // Créer une date de base valide
        const baseDate = searchParams.get('dateDepart') 
          ? new Date(searchParams.get('dateDepart') as string)
          : new Date('2025-01-20');
        
        // Vérifier que la date est valide
        const isValidDate = !isNaN(baseDate.getTime());
        const safeDate = isValidDate ? baseDate : new Date('2025-01-20');
        
        const mockTrajets: TrajetDto[] = Array.from({ length: trajetCount }, (_, i) => {
          // Heure de départ aléatoire entre 00:00 et 23:59
          const randomHour = Math.floor(Math.random() * 24);
          const randomMinute = Math.floor(Math.random() * 60);
          
          // Calcul de la durée aléatoire (entre 1h et 6h)
          const dureeTrajet = 60 + Math.floor(Math.random() * 300);
          
          // Calcul de la date d'arrivée en ajoutant la durée au départ
          const dateDepart = new Date(safeDate);
          dateDepart.setHours(randomHour, randomMinute);
          
          const dateArrivee = new Date(dateDepart.getTime() + dureeTrajet * 60000);
          
          return {
            trajetId: i + 1,
            villeDepartId: parseInt(searchParams.get('villeDepartId') || '1'),
            villeArriveeId: parseInt(searchParams.get('villeArriveeId') || '2'),
            dateDepart: dateDepart.toISOString(),
            dateArrivee: dateArrivee.toISOString(),
            prix: 80 + Math.floor(Math.random() * 100),
            capacite: 50,
            nbrPassagers: Math.floor(Math.random() * 40),
            dureeTrajet: dureeTrajet,
            allerRetour: searchParams.get('allerRetour') === 'true',
            adminId: 1,
            compagnie: getRandomCompagnie()
          };
        });
        
        setTrajets(mockTrajets);
        setFilteredTrajets(mockTrajets);
      } finally {
        setLoading(false);
      }
    };

    searchTrajets();
  }, [searchParams]);

  useEffect(() => {
    let filtered = trajets.filter(trajet => {
      if (trajet.prix > filters.maxPrice) return false;
      if (filters.company && trajet.compagnie !== filters.company) return false;
      return true;
    });
    setFilteredTrajets(filtered);
  }, [filters, trajets]);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins > 0 ? ` ${mins}min` : ''}`;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '--:--';
    
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    }).replace(':', 'h');
  };

  const handleBooking = (trajetId: number) => {
    navigate(`/booking/${trajetId}?passengers=${searchParams.get('nbrPassagers') || '1'}`);
  };

  // Fonction pour formater la date de recherche
  const formatSearchDate = (dateString: string | null) => {
    if (!dateString) return 'Date inconnue';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Date invalide';
    
    return date.toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Recherche des trajets disponibles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-orange-500" />
                <span className="font-medium">
                  {cities[parseInt(searchParams.get('villeDepartId') || '1')] || 'Ville inconnue'} → 
                  {cities[parseInt(searchParams.get('villeArriveeId') || '2')] || 'Ville inconnue'}
                </span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1 text-blue-500" />
                <span>{formatSearchDate(searchParams.get('dateDepart'))}</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1 text-green-500" />
                <span>{searchParams.get('nbrPassagers')} passager(s)</span>
              </div>
            </div>
            <span className="text-sm text-gray-500">
              {filteredTrajets.length} trajet(s) trouvé(s)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2 text-orange-500" />
                Filtres
              </h3>

              {/* Price Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix maximum: {filters.maxPrice} DH
                </label>
                <input
                  type="range"
                  min="50"
                  max="300"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({...filters, maxPrice: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Company Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Compagnie
                </label>
                <select
                  value={filters.company}
                  onChange={(e) => setFilters({...filters, company: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Toutes les compagnies</option>
                  {companies.map(company => (
                    <option key={company} value={company}>{company}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3 space-y-4">
            {filteredTrajets.map((trajet) => {
              const logoPath = companyLogos[trajet.compagnie];
              const bgColor = companyColors[trajet.compagnie] || 'bg-gradient-to-r from-blue-500 to-orange-500';
              
              return (
                <div key={trajet.trajetId} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    {/* Company & Route Info */}
                    <div className="md:col-span-2">
                      <div className="flex items-center mb-2">
                        {/* Logo de la compagnie */}
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-3 overflow-hidden">
                          {logoPath ? (
                            <img 
                              src={logoPath} 
                              alt={trajet.compagnie}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <div className={`${bgColor} w-full h-full flex items-center justify-center`}>
                              <span className="text-white font-bold text-lg">
                                {trajet.compagnie.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{trajet.compagnie}</h3>
                          <p className="text-sm text-gray-500">Autocar confortable</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600 space-x-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{formatDuration(trajet.dureeTrajet)}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{trajet.capacite - trajet.nbrPassagers} places restantes</span>
                        </div>
                      </div>
                    </div>

                    {/* Schedule */}
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {formatTime(trajet.dateDepart)}
                      </div>
                      <div className="text-sm text-gray-500">{cities[trajet.villeDepartId] || 'Départ'}</div>
                      <div className="flex items-center justify-center my-2">
                        <div className="w-16 h-px bg-gray-300"></div>
                        <ArrowRight className="h-4 w-4 mx-2 text-gray-400" />
                        <div className="w-16 h-px bg-gray-300"></div>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {formatTime(trajet.dateArrivee)}
                      </div>
                      <div className="text-sm text-gray-500">{cities[trajet.villeArriveeId] || 'Arrivée'}</div>
                    </div>

                    {/* Price & Booking */}
                    <div className="text-right">
                      <div className="text-3xl font-bold text-orange-600 mb-2">
                        {trajet.prix} DH
                      </div>
                      <div className="text-sm text-gray-500 mb-4">par personne</div>
                      <button
                        onClick={() => handleBooking(trajet.trajetId)}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-4 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-colors duration-200"
                      >
                        Réserver
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredTrajets.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🚌</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Aucun trajet trouvé
                </h3>
                <p className="text-gray-500">
                  Essayez de modifier vos critères de recherche
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg"
                >
                  Nouvelle recherche
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};