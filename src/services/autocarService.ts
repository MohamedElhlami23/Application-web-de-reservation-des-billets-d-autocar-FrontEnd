import { apiRequest } from './api';

export interface AutocarDto {
  autocarId: number;
  Nom: string;
   villeDepartId: number;
  villeArriveeId: number;
  dureeVoyageMinutes: number;
  heureDepart: string;
  heureArrivee: string;
  capacite: number;
  nbrPassagers: number;
  siegs: number;
  prix: number;
 adminId?: number;
 gareDepartId: number;
 gareArriveeId: number;
 listTrajetIds?: number[]; 
 listArretIds?: number[];
}

export const autocarService = {
  getAutocarById: async (id: number): Promise<AutocarDto> => {
    try {
      const response = await apiRequest(`/autocars/${id}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch autocar:', error);
      throw error;
    }
  },
};