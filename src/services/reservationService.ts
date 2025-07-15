import { apiRequest } from './api';

export interface ReservationDto {
  reservationId: number;
  trajetId: number;
  clientId: number;
  dateReservation: string;
  nbrReservation: number;
  etat: string;
}

export interface CreateReservationRequest {
  trajetId: number;
  clientId: number;
  nbrReservation: number;
  etat: string;

   /*sieges: string;
  dateReservation: string;
  dateDepart: string;
  dureeTrajet: number;
  villeDepartId: number;
  villeArriveeId: number;
  prix: number;
  compagnieNom: string*/
}

export const reservationService = {
  // Créer une réservation
  createReservation: async (reservation: CreateReservationRequest): Promise<ReservationDto> => {
    try {
      const response = await apiRequest('/reservations', {
        method: 'POST',
        body: JSON.stringify(reservation),
      });
      return response;
    } catch (error) {
      console.error('Failed to create reservation:', error);
      throw error;
    }
  },

  // Vérifier la disponibilité
  checkAvailability: async (trajetId: number, nbrReservation: number): Promise<boolean> => {
    try {
      const response = await apiRequest('/reservations/check-availability', {
        method: 'POST',
        body: JSON.stringify({ trajetId, nbrReservation }),
      });
      return response;
    } catch (error) {
      console.error('Failed to check availability:', error);
      return false;
    }
  },

  // Récupérer les réservations d'un client
  getReservationsByClient: async (clientId: number): Promise<ReservationDto[]> => {
    try {
      const response = await apiRequest(`/reservations/client/${clientId}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch client reservations:', error);
      throw error;
    }
  },

  // Récupérer une réservation par ID
  getReservationById: async (id: number): Promise<ReservationDto> => {
    try {
      const response = await apiRequest(`/reservations/${id}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch reservation:', error);
      throw error;
    }
  },

  // Annuler une réservation
  cancelReservation: async (id: number): Promise<ReservationDto> => {
    try {
      const response = await apiRequest(`/reservations/${id}/cancel`, {
        method: 'PUT',
      });
      return response;
    } catch (error) {
      console.error('Failed to cancel reservation:', error);
      throw error;
    }
  },

  // Mettre à jour une réservation
  updateReservation: async (id: number, reservation: Partial<ReservationDto>): Promise<ReservationDto> => {
    try {
      const response = await apiRequest(`/reservations/${id}`, {
        method: 'PUT',
        body: JSON.stringify(reservation),
      });
      return response;
    } catch (error) {
      console.error('Failed to update reservation:', error);
      throw error;
    }
  },

  // Supprimer une réservation
  deleteReservation: async (id: number): Promise<void> => {
    try {
      await apiRequest(`/reservations/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Failed to delete reservation:', error);
      throw error;
    }
  },
};