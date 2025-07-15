import { apiRequest } from './api';

export interface TrajetDto {
  trajetId: number;
  villeDepartId: number;
  villeArriveeId: number;
  dureeTrajet: number;
  dateDepart: string;
  dateArrivee: string;
  capacite: number;
  nbrPassagers: number;
  allerRetour: boolean;
  prix: number;
  adminId?: number;
  listAutocarIds?: number[];
  listArretIds?: number[];
  listReservationIds?: number[];
  listBilletIds?: number[];
  compagnie: string;
  villeDepartNom: string;
  villeArriveeNom: string;
}

export interface TrajetSearchParams {
  villeDepartId: number;
  villeArriveeId: number;
  dateDepart: string;
  nbrpassagers: number;
  dateArrivee?: string; // Pour aller-retour
}

export const trajetService = {
  // Rechercher des trajets aller simple
  searchAllerSimple: async (params: TrajetSearchParams): Promise<TrajetDto[]> => {
    try {
      const queryParams = new URLSearchParams({
        villeDepartId: params.villeDepartId.toString(),
        villeArriveeId: params.villeArriveeId.toString(),
        dateDepart: params.dateDepart,
        nbrpassagers: params.nbrpassagers.toString(),
      });

      const response = await apiRequest(`/trajets/recherche/all-simple?${queryParams}`);
      return response;
    } catch (error) {
      console.error('Failed to search simple trips:', error);
      throw error;
    }
  },

  // Rechercher des trajets aller-retour
  searchAllerRetour: async (params: TrajetSearchParams): Promise<TrajetDto[]> => {
    try {
      if (!params.dateArrivee) {
        throw new Error('Date d\'arrivée requise pour aller-retour');
      }

      const queryParams = new URLSearchParams({
        villeDepartId: params.villeDepartId.toString(),
        villeArriveeId: params.villeArriveeId.toString(),
        dateDepart: params.dateDepart,
        dateArrivee: params.dateArrivee,
        nbrpassagers: params.nbrpassagers.toString(),
      });

      const response = await apiRequest(`/trajets/recherche/all-retour?${queryParams}`);
      return response;
    } catch (error) {
      console.error('Failed to search round trips:', error);
      throw error;
    }
  },

  // Récupérer tous les trajets
  getAllTrajets: async (): Promise<TrajetDto[]> => {
    try {
      const response = await apiRequest('/trajets');
      return response;
    } catch (error) {
      console.error('Failed to fetch trips:', error);
      throw error;
    }
  },

  // Récupérer un trajet par ID
  getTrajetById: async (id: number): Promise<TrajetDto> => {
    try {
      const response = await apiRequest(`/trajets/${id}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch trip:', error);
      throw error;
    }
  },

  // Vérifier la disponibilité d'un trajet
  checkAvailability: async (trajetId: number, nombreSieges: number): Promise<string> => {
    try {
      const response = await apiRequest(
        `/trajets/${trajetId}/disponibilite?nombreSiegesDemandes=${nombreSieges}`
      );
      return response;
    } catch (error) {
      console.error('Failed to check availability:', error);
      throw error;
    }
  },

  // Créer un nouveau trajet
  createTrajet: async (trajet: Omit<TrajetDto, 'trajetId'>): Promise<TrajetDto> => {
    try {
      const response = await apiRequest('/trajets', {
        method: 'POST',
        body: JSON.stringify(trajet),
      });
      return response;
    } catch (error) {
      console.error('Failed to create trip:', error);
      throw error;
    }
  },

  // Mettre à jour un trajet
  updateTrajet: async (id: number, trajet: Partial<TrajetDto>): Promise<TrajetDto> => {
    try {
      const response = await apiRequest(`/trajets/${id}`, {
        method: 'PUT',
        body: JSON.stringify(trajet),
      });
      return response;
    } catch (error) {
      console.error('Failed to update trip:', error);
      throw error;
    }
  },

  // Supprimer un trajet
  deleteTrajet: async (id: number): Promise<void> => {
    try {
      await apiRequest(`/trajets/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Failed to delete trip:', error);
      throw error;
    }
  },
};