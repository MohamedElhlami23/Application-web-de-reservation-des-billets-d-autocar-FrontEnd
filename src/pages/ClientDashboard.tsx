import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Clock, Download, CheckCircle, User } from 'lucide-react';
import { reservationService } from '../services/reservationService';
import { trajetService } from '../services/trajetService';
import { villeService } from '../services/villeService';
import { authService } from '../services/authService';
import { autocarService } from '../services/autocarService';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

// Fonction utilitaire pour formater les dates
const formatDate = (dateString: string) => {
  try {
    // Convertir en Date et ajouter le fuseau horaire
    const date = new Date(dateString);
    
    // Vérifier si la date est valide
    if (isNaN(date.getTime())) return 'Date inconnue';
    
    // Formater correctement avec le fuseau horaire du Maroc
    return date.toLocaleDateString('fr-FR', {
      timeZone: 'Africa/Casablanca',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return 'Date inconnue';
  }
};

// Fonction pour formater les heures
const formatTime = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? '--:--'
      : date.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Africa/Casablanca'
        });
  } catch {
    return '--:--';
  }
};

interface DetailedReservation {
  reservationId: number;
  dateReservation: string;
  etat: string;
  nbrReservation: number;
  trajetId: number;
  villeDepart?: string;
  villeArrivee?: string;
  heureDepart?: string;
  heureArrivee?: string;
  prix?: number;
  compagnieNom?: string;
  dateDepartRaw?: string;
  dateFormatted?: string; // Ajout pour stocker la date formatée
  dureeTrajet?: number;
  dateArriveeRaw?: string;
}

export const ClientDashboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('bookings');
  const bookingSuccess = searchParams.get('booking') === 'success';
  const [reservations, setReservations] = useState<DetailedReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState<{[key: number]: string}>({});
  const [clientInfo, setClientInfo] = useState({
    nom: '',
    prenom: '',
    email: '',
    nmrTelephon: ''
  });
  const navigate = useNavigate();

  // Charger les villes
  useEffect(() => {
    const loadCities = async () => {
      try {
        const citiesData = await villeService.getAllVilles();
        const citiesMap = citiesData.reduce((acc: {[key: number]: string}, city) => {
          acc[city.villeId] = city.nom;
          return acc;
        }, {});
        setCities(citiesMap);
      } catch (error) {
        console.error('Failed to load cities:', error);
        setCities({
          1: 'Casablanca', 2: 'Rabat', 3: 'Fès', 4: 'Marrakech', 5: 'Tanger',
          6: 'Agadir', 7: 'Meknès', 8: 'Oujda', 9: 'Tétouan', 10: 'El Jadida'
        });
      }
    };

    loadCities();
  }, []);

  // Récupérer les informations du client connecté
  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (!userString) {
      navigate('/login');
      return;
    }
    
    const user = JSON.parse(userString);
    if (user.userType !== 'client') {
      navigate('/login');
      return;
    }

    // Charger les informations détaillées du client
    const fetchClientDetails = async () => {
      try {
        const clientDetails = await authService.getClientDetails(user.userId);
        setClientInfo({
          nom: clientDetails.nom,
          prenom: clientDetails.prenom,
          email: clientDetails.email,
          nmrTelephon: clientDetails.nmrTelephon
        });
      } catch (error) {
        console.error('Failed to fetch client details:', error);
      }
    };

    fetchClientDetails();
  }, [navigate]);

  // Récupérer les réservations du client
  useEffect(() => {
    const fetchReservations = async () => {
      const userString = localStorage.getItem('user');
      if (!userString) return;
      
      const user = JSON.parse(userString);
      if (user.userType !== 'client') return;
      
      try {
        // Récupérer les réservations du client
        const reservationsData = await reservationService.getReservationsByClient(user.userId);
        
        // Enrichir les réservations avec les détails du trajet
        const detailedReservations = await Promise.all(
          reservationsData.map(async (reservation) => {
            try {
              const trajetDetails = await trajetService.getTrajetById(reservation.trajetId);
              
              // Récupérer les noms des villes
              const villeDepart = await villeService.getVilleById(trajetDetails.villeDepartId);
              const villeArrivee = await villeService.getVilleById(trajetDetails.villeArriveeId);
              
              // Calcul des heures
              const dateDepart = new Date(trajetDetails.dateDepart);
              const dateArrivee = new Date(dateDepart.getTime() + trajetDetails.dureeTrajet * 60000);

              return {
                ...reservation,
                villeDepart: villeDepart.nom,
                villeArrivee: villeArrivee.nom,
                prix: trajetDetails.prix,
                compagnieNom: trajetDetails.compagnie,
                heureDepart: dateDepart.toLocaleTimeString('fr-FR', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  timeZone: 'Africa/Casablanca'
                }),
                heureArrivee: dateArrivee.toLocaleTimeString('fr-FR', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  timeZone: 'Africa/Casablanca'
                }),
                dateDepartRaw: trajetDetails.dateDepart,
                dateFormatted: formatDate(trajetDetails.dateDepart), // Stocker la date formatée
                dureeTrajet: trajetDetails.dureeTrajet,
                dateArriveeRaw: dateArrivee.toISOString()
              };
            } catch (error) {
              console.error('Failed to fetch trajet details:', error);
              return reservation;
            }
          })
        );
        
        setReservations(detailedReservations);
      } catch (error) {
        console.error('Failed to fetch reservations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [navigate]);

  const tabs = [
    { id: 'bookings', name: 'Mes Réservations', icon: Calendar },
    { id: 'profile', name: 'Mon Profil', icon: User }
  ];

  // Générer un PDF pour un billet
  const generatePDF = async (reservation: DetailedReservation) => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const margin = 15;
      const pageWidth = pdf.internal.pageSize.getWidth() - 2 * margin;
      
      // Logo de la compagnie (s'il existe)
      const compagnieNom = reservation.compagnieNom || 'MarocBus';
      const logoFileName = compagnieNom.toLowerCase().replace(/\s+/g, '');
      
      try {
        const logoUrl = `/images/${logoFileName}.webp`;
        const logoImg = new Image();
        logoImg.src = logoUrl;
        
        // Ajouter le logo seulement s'il existe
        pdf.addImage(logoImg, 'WEBP', margin, margin, 30, 10);
      } catch (error) {
        console.log('Logo non trouvé, utilisation du nom à la place');
        pdf.setFontSize(16);
        pdf.setTextColor(40, 100, 255);
        pdf.text(compagnieNom, margin, margin + 10);
      }

      // Titre du billet
      pdf.setFontSize(16);
      pdf.setTextColor(0, 0, 0);
      pdf.text('BILLET DE BUS', pageWidth / 2, margin + 20, { align: 'center' });
      
      // Ligne séparatrice
      pdf.setDrawColor(255, 165, 0);
      pdf.setLineWidth(0.5);
      pdf.line(margin, margin + 25, pdf.internal.pageSize.getWidth() - margin, margin + 25);
      
      // Informations client
      pdf.setFontSize(12);
      let y = margin + 35;
      
      pdf.text(`Client: ${clientInfo.prenom} ${clientInfo.nom}`, margin, y);
      pdf.text(`Email: ${clientInfo.email}`, pageWidth / 2, y);
      y += 10;
      
      pdf.text(`Téléphone: ${clientInfo.nmrTelephon}`, margin, y);
      y += 15;
      
      // Détails du billet
      pdf.setFontSize(12);
      pdf.text(`Code billet: MB-${reservation.reservationId.toString().padStart(6, '0')}`, margin, y);
      y += 10;
      
      pdf.text(`Compagnie: ${compagnieNom}`, margin, y);
      y += 7;
      
      pdf.text(`Trajet: ${reservation.villeDepart || 'Départ'} → ${reservation.villeArrivee || 'Arrivée'}`, margin, y);
      y += 10;
      
      pdf.text(`Date: ${reservation.dateFormatted || formatDate(reservation.dateReservation)}`, margin, y);
      
      // Utilisation des heures calculées pour le PDF
      pdf.text(`Heure départ: ${reservation.heureDepart || formatTime(reservation.dateDepartRaw || '')}`, pageWidth / 2, y);
      y += 10;
      
      pdf.text(`Heure arrivée: ${reservation.heureArrivee || formatTime(reservation.dateArriveeRaw || '')}`, margin, y);
      pdf.text(`Passagers: ${reservation.nbrReservation}`, pageWidth / 2, y);
      y += 10;
      
      pdf.text(`Statut: ${reservation.etat}`, margin, y);
      pdf.text(`Prix: ${reservation.prix || 0} DH`, pageWidth / 2, y);
      y += 15;
      
      // Générer le QR code
      const qrCodeData = `MarocBus|${reservation.reservationId}|${clientInfo.email}|${reservation.trajetId}`;
      const qrCodeUrl = await QRCode.toDataURL(qrCodeData, {
        width: 80,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
    
    // Position pour le QR code (à droite)
    const qrCodeX = pageWidth - 30; // 30mm de la droite
    const qrCodeY = y;
    
    // Ajouter le QR code au PDF
    pdf.addImage(qrCodeUrl, 'PNG', qrCodeX, qrCodeY, 30, 30);
    
    // Ajouter un texte sous le QR code
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Scannez ce QR code', qrCodeX, qrCodeY + 35);
    pdf.text('pour valider votre billet', qrCodeX, qrCodeY + 40);
    
    // Pied de page
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text('MarocBus - Service Client: +212 522 123 456 - contact@marocbus.ma', 
             pageWidth / 2, pdf.internal.pageSize.getHeight() - margin, 
             { align: 'center' });
    
    // Sauvegarder le PDF
    pdf.save(`billet-MB-${reservation.reservationId.toString().padStart(6, '0')}.pdf`);
  } catch (error) {
    console.error('Erreur lors de la génération du QR code:', error);
    // En cas d'erreur, générer le PDF sans QR code
    alert('Erreur lors de la génération du QR code. Le billet a été généré sans QR code.');
  }
};

  // Mettre à jour le profil du client
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userString = localStorage.getItem('user');
      if (!userString) {
        alert('Vous devez être connecté pour mettre à jour votre profil');
        navigate('/login');
        return;
      }
      
      const user = JSON.parse(userString);
      if (user.userType !== 'client') {
        alert('Accès non autorisé');
        navigate('/');
        return;
      }

      // Appeler le service pour mettre à jour le profil
      await authService.updateClientProfile(user.userId, {
        nom: clientInfo.nom,
        prenom: clientInfo.prenom,
        email: clientInfo.email,
        nmrTelephon: clientInfo.nmrTelephon
      });
      
      alert('Profil mis à jour avec succès!');
      
      // Mettre à jour le localStorage si nécessaire
      const updatedUser = {
        ...user,
        email: clientInfo.email,
        nmrTelephon: clientInfo.nmrTelephon
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      alert(`Erreur: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de vos réservations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Message de succès */}
        {bookingSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500 mr-4" />
              <div>
                <h3 className="text-lg font-semibold text-green-900">
                  Réservation confirmée !
                </h3>
                <p className="text-green-700 mt-1">
                  Votre billet a été généré avec succès.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* En-tête */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Mon Espace Client</h1>
          <p className="text-gray-600">Gérez vos réservations et billets</p>
        </div>

        {/* Onglets */}
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
            {/* Onglet Réservations */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Mes Réservations</h2>
                
                {reservations.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      Aucune réservation
                    </h3>
                    <p className="text-gray-500">
                      Vous n'avez pas encore effectué de réservation
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reservations.map((reservation) => (
                      <div key={reservation.reservationId} className="border border-gray-200 rounded-lg p-6 hover:border-orange-300 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <div className="bg-gradient-to-r from-blue-500 to-orange-500 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-white font-bold text-sm">
                                  {reservation.compagnieNom?.charAt(0) || 'M'}
                                </span>
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {reservation.compagnieNom || 'MarocBus'}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  Code: MB-{reservation.reservationId.toString().padStart(6, '0')}
                                </p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1 text-orange-500" />
                                <span>
                                  {reservation.villeDepart || 'Départ'} → {reservation.villeArrivee || 'Arrivée'}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1 text-blue-500" />
                                {/* Utilisation de la date formatée */}
                                <span>{reservation.dateFormatted || formatDate(reservation.dateReservation)}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1 text-green-500" />
                                <span>
                                  {reservation.heureDepart} - {reservation.nbrReservation} passager{reservation.nbrReservation > 1 ? 's' : ''}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 md:mt-0 md:ml-6 text-right">
                            <div className="text-2xl font-bold text-orange-600 mb-2">
                              {reservation.prix || 0} DH
                            </div>
                            <div className="mb-3">
                              <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                                reservation.etat === 'CONFIRMEE' || reservation.etat.toLowerCase().includes('confirm')
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {(reservation.etat === 'CONFIRMEE' || reservation.etat.toLowerCase().includes('confirm'))
                                  ? 'Confirmée' 
                                  : 'En attente'}
                              </span>
                            </div>
                            <button 
                              onClick={() => generatePDF(reservation)}
                              className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-600 transition-colors flex items-center"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Télécharger
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Onglet Profil */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Mon Profil</h2>
                
                <form onSubmit={handleProfileUpdate}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom
                      </label>
                      <input
                        type="text"
                        value={clientInfo.nom}
                        onChange={(e) => setClientInfo({...clientInfo, nom: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prénom
                      </label>
                      <input
                        type="text"
                        value={clientInfo.prenom}
                        onChange={(e) => setClientInfo({...clientInfo, prenom: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={clientInfo.email}
                        onChange={(e) => setClientInfo({...clientInfo, email: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        value={clientInfo.nmrTelephon}
                        onChange={(e) => setClientInfo({...clientInfo, nmrTelephon: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="pt-6">
                    <button 
                      type="submit"
                      className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                    >
                      Mettre à jour le profil
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};