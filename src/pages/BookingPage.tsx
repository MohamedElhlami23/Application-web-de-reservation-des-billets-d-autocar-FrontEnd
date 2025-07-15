import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { User, CreditCard, Shield, ArrowLeft, Check, X, MapPin, Calendar, Clock, Loader } from 'lucide-react';
import { trajetService, TrajetDto } from '../services/trajetService';
import { reservationService } from '../services/reservationService';
import { villeService } from '../services/villeService';

interface PassengerInfo {
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
}

export const BookingPage: React.FC = () => {
  const { trajetId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [passengers, setPassengers] = useState<PassengerInfo[]>([]);
  const [seatSelection, setSeatSelection] = useState<number[]>([]);
  const [paymentInfo, setPaymentInfo] = useState({
    methodPaiement: 'CARTE_BANCAIRE',
    cardNumber: '',
    expiry: '',
    cvv: '',
    holderName: ''
  });
  const [trajetDetails, setTrajetDetails] = useState<TrajetDto | null>(null);
  const [cities, setCities] = useState<{[key: number]: string}>({});
  const [occupiedSeats, setOccupiedSeats] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const passengerCount = parseInt(searchParams.get('passengers') || '1');
  const busLayout = Array.from({ length: 50 }, (_, i) => i + 1);

  // Récupérer les détails du trajet
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Charger les villes
      const citiesData = await villeService.getAllVilles();
      const citiesMap = citiesData.reduce((acc: {[key: number]: string}, city) => {
        acc[city.villeId] = city.nom;
        return acc;
      }, {});
      setCities(citiesMap);
      
      // Récupérer les détails du trajet
      if (trajetId) {
        const details = await trajetService.getTrajetById(parseInt(trajetId));
        
        // Récupérer les noms des villes
        const villeDepart = await villeService.getVilleById(details.villeDepartId);
        const villeArrivee = await villeService.getVilleById(details.villeArriveeId);
        
        // Enrichir les détails avec les noms des villes
        setTrajetDetails({
          ...details,
          villeDepartNom: villeDepart.nom,
          villeArriveeNom: villeArrivee.nom
        });
        
        // Simuler des sièges occupés
        const occupied = Array.from({ length: Math.floor(Math.random() * 20) + 10 }, 
          () => Math.floor(Math.random() * 50) + 1);
        setOccupiedSeats(occupied);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Erreur lors du chargement des données du trajet');
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [trajetId]);

  // Initialiser les passagers
  useEffect(() => {
    if (passengerCount > 0) {
      setPassengers(Array(passengerCount).fill(null).map(() => ({
        nom: '',
        prenom: '',
        telephone: '',
        email: ''
      })));
    }
  }, [passengerCount]);

  const updatePassenger = (index: number, field: keyof PassengerInfo, value: string) => {
    const updated = [...passengers];
    updated[index] = { ...updated[index], [field]: value };
    setPassengers(updated);
  };

  const toggleSeat = (seatNumber: number) => {
    if (occupiedSeats.includes(seatNumber)) return;
    
    const newSelection = [...seatSelection];
    const seatIndex = newSelection.indexOf(seatNumber);
    
    if (seatIndex > -1) {
      newSelection.splice(seatIndex, 1);
    } else if (newSelection.length < passengerCount) {
      newSelection.push(seatNumber);
    }
    
    setSeatSelection(newSelection);
  };

  const getSeatClass = (seatNumber: number) => {
    if (occupiedSeats.includes(seatNumber)) {
      return 'bg-red-500 text-white cursor-not-allowed';
    }
    if (seatSelection.includes(seatNumber)) {
      return 'bg-green-500 text-white';
    }
    return 'bg-gray-200 hover:bg-gray-300 cursor-pointer';
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return passengers.every(p => p.nom && p.prenom && p.email && p.telephone);
      case 2:
        return seatSelection.length === passengerCount;
      case 3:
        return paymentInfo.cardNumber && paymentInfo.expiry && paymentInfo.cvv && paymentInfo.holderName;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (isStepValid(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

const handleBooking = async () => {
  if (!trajetId || !trajetDetails) return;
  
  try {
    setLoading(true);
    setError('');
    
    const userString = localStorage.getItem('user');
    if (!userString) throw new Error('Utilisateur non connecté');
    
    const user = JSON.parse(userString);
    if (user.userType !== 'client') throw new Error('Réservation réservée aux clients');
    
    // Créer la réservation avec SEULEMENT les champs requis
    const reservationData = {
      trajetId: parseInt(trajetId),
      clientId: user.userId,
      nbrReservation: passengerCount,
      etat: 'CONFIRMEE'
    };
    
    const reservation = await reservationService.createReservation(reservationData);
    console.log('Réservation créée:', reservation);
    
    // Naviger vers le tableau de bord avec un message de succès
    navigate('/dashboard?booking=success');
  } catch (err) {
    console.error('Booking failed:', err);
    setError('Erreur lors de la réservation. Veuillez réessayer.');
  } finally {
    setLoading(false);
  }
};

  const steps = [
    { number: 1, title: 'Informations passagers', icon: User },
    { number: 2, title: 'Sélection des sièges', icon: Check },
    { number: 3, title: 'Paiement', icon: CreditCard }
  ];

  // Formater la date et l'heure
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Chargement des détails du trajet...</p>
        </div>
      </div>
    );
  }

  if (!trajetDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Trajet non trouvé
          </h3>
          <p className="text-gray-500">
            Le trajet demandé n'existe pas ou n'est plus disponible
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-orange-500 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux résultats
          </button>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Finaliser votre réservation</h1>
          
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          
          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step.number 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {currentStep > step.number ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">{step.title}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-24 h-px mx-4 ${
                    currentStep > step.number ? 'bg-orange-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          {/* Step 1: Passenger Information */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Informations des passagers
              </h2>
              
              <div className="space-y-6">
                {passengers.map((passenger, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Passager {index + 1}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nom *
                        </label>
                        <input
                          type="text"
                          value={passenger.nom}
                          onChange={(e) => updatePassenger(index, 'nom', e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Prénom *
                        </label>
                        <input
                          type="text"
                          value={passenger.prenom}
                          onChange={(e) => updatePassenger(index, 'prenom', e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={passenger.email}
                          onChange={(e) => updatePassenger(index, 'email', e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Téléphone *
                        </label>
                        <input
                          type="tel"
                          value={passenger.telephone}
                          onChange={(e) => updatePassenger(index, 'telephone', e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Seat Selection */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Sélection des sièges
              </h2>
              
              <div className="mb-6">
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                    <span>Disponible</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                    <span>Sélectionné</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                    <span>Occupé</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Sélectionnez {passengerCount} siège(s). Sièges sélectionnés: {seatSelection.join(', ')}
                </p>
              </div>

              {/* Bus Layout */}
              <div className="bg-gray-100 p-6 rounded-lg">
                <div className="text-center mb-4 text-sm font-medium text-gray-600">
                  Avant du bus
                </div>
                
                <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
                  {busLayout.map((seatNumber) => (
                    <button
                      key={seatNumber}
                      onClick={() => toggleSeat(seatNumber)}
                      className={`w-10 h-10 rounded text-sm font-medium transition-colors ${getSeatClass(seatNumber)}`}
                      disabled={occupiedSeats.includes(seatNumber)}
                    >
                      {seatNumber}
                    </button>
                  ))}
                </div>
                
                <div className="text-center mt-4 text-sm font-medium text-gray-600">
                  Arrière du bus
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {currentStep === 3 && trajetDetails && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Informations de paiement
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Méthode de paiement
                      </label>
                      <select
                        value={paymentInfo.methodPaiement}
                        onChange={(e) => setPaymentInfo({...paymentInfo, methodPaiement: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="CARTE_BANCAIRE">Carte bancaire</option>
                        <option value="PAYPAL">PayPal</option>
                        <option value="VIREMENT">Virement bancaire</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom du titulaire *
                      </label>
                      <input
                        type="text"
                        value={paymentInfo.holderName}
                        onChange={(e) => setPaymentInfo({...paymentInfo, holderName: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Numéro de carte *
                      </label>
                      <input
                        type="text"
                        value={paymentInfo.cardNumber}
                        onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
                        placeholder="1234 5678 9012 3456"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date d'expiration *
                        </label>
                        <input
                          type="text"
                          value={paymentInfo.expiry}
                          onChange={(e) => setPaymentInfo({...paymentInfo, expiry: e.target.value})}
                          placeholder="MM/AA"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV *
                        </label>
                        <input
                          type="text"
                          value={paymentInfo.cvv}
                          onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                          placeholder="123"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Récapitulatif
                    </h3>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
  <span>Trajet</span>
  <span>
    {trajetDetails?.villeDepartNom} → {trajetDetails?.villeArriveeNom}
  </span>
</div>
                      <div className="flex justify-between">
                        <span>Date</span>
                        <span>{formatDate(trajetDetails.dateDepart)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Heure</span>
                        <span>{formatTime(trajetDetails.dateDepart)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Passagers</span>
                        <span>{passengerCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sièges</span>
                        <span>{seatSelection.join(', ')}</span>
                      </div>
                      <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span className="text-orange-600">
                          {(trajetDetails.prix * passengerCount).toFixed(2)} DH
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center text-xs text-gray-500">
                      <Shield className="h-4 w-4 mr-1 text-green-500" />
                      Paiement sécurisé SSL
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>

            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid(currentStep)}
                className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Suivant
              </button>
            ) : (
              <button
                onClick={handleBooking}
                disabled={!isStepValid(currentStep) || loading}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader className="animate-spin h-5 w-5 mr-2" />
                    Traitement...
                  </span>
                ) : (
                  'Confirmer la réservation'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};