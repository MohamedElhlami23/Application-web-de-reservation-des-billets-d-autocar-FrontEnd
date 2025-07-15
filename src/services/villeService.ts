import { apiRequest } from './api';

export interface VilleDto {
  villeId: number;
  nom: string;
  trajetDepartIds?: number[];
  trajetDestinationIds?: number[];
  autocarDepartIds?: number[];
  autocarArriveeIds?: number[];
  gareIds?: number[];
  nombreGares?: number;
}

export const villeService = {
  // Récupérer toutes les villes
  getAllVilles: async (): Promise<VilleDto[]> => {
    try {
      const response = await apiRequest('/villes');
      return response;
    } catch (error) {
      console.error('Failed to fetch cities:', error);
      throw error;
    }
  },

  // Récupérer une ville par ID
  getVilleById: async (id: number): Promise<VilleDto> => {
    try {
      const response = await apiRequest(`/villes/${id}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch city:', error);
      throw error;
    }
  },

  // Rechercher une ville par nom
  searchVilleByNom: async (nom: string): Promise<VilleDto> => {
    try {
      const response = await apiRequest(`/villes/search?nom=${encodeURIComponent(nom)}`);
      return response;
    } catch (error) {
      console.error('Failed to search city:', error);
      throw error;
    }
  },

  // Créer une nouvelle ville
  createVille: async (ville: Omit<VilleDto, 'villeId'>): Promise<VilleDto> => {
    try {
      const response = await apiRequest('/villes', {
        method: 'POST',
        body: JSON.stringify(ville),
      });
      return response;
    } catch (error) {
      console.error('Failed to create city:', error);
      throw error;
    }
  },

  // Mettre à jour une ville
  updateVille: async (id: number, ville: Partial<VilleDto>): Promise<VilleDto> => {
    try {
      const response = await apiRequest(`/villes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(ville),
      });
      return response;
    } catch (error) {
      console.error('Failed to update city:', error);
      throw error;
    }
  },

  // Supprimer une ville
  deleteVille: async (id: number): Promise<void> => {
    try {
      await apiRequest(`/villes/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Failed to delete city:', error);
      throw error;
    }
  },
};