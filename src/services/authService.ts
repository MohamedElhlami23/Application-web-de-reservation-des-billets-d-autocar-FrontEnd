import { apiRequest } from './api';

export interface LoginRequest {
  email: string;
  motDePass: string;
}

export interface RegisterClientRequest {
  nom: string;
  prenom: string;
  email: string;
  motDePass: string;
  nmrTelephon: string;
}

export interface RegisterAdminRequest {
  nom: string;
  prenom: string;
  email: string;
  motDePass: string;
  nmrTelephon: string;
}

export interface ClientResponse {
  clientId: number;
  nom: string;
  prenom: string;
  email: string;
  nmrTelephon: string;
  clientDetails?: string;
}

export interface AdminResponse {
  adminId: number;
  nom: string;
  prenom: string;
  email: string;
  nmrTelephon: string;
}

export const authService = {
  // ✅ Authentification client - MODIFIÉ pour retourner l'ID client
  authenticateClient: async (credentials: LoginRequest): Promise<{ authenticated: boolean; clientId?: number }> => {
    try {
      console.log('Credentials envoyés au backend:', credentials);
      const response = await apiRequest('/clients/authenticate', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      // Retourner à la fois le statut de succès et l'ID client
      return { 
        authenticated: response.authenticated, 
        clientId: response.clientId 
      };
    } catch (error) {
      console.error('Client authentication failed:', error);
      return { authenticated: false };
    }
  },

  // ✅ Authentification admin
  authenticateAdmin: async (credentials: LoginRequest): Promise<AdminResponse | null> => {
    try {
      const response = await apiRequest('/admin/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      return response;
    } catch (error) {
      console.error('Admin authentication failed:', error);
      return null;
    }
  },

  // ✅ Inscription client
  registerClient: async (clientData: RegisterClientRequest): Promise<ClientResponse> => {
    try {
      const response = await apiRequest('/clients', {
        method: 'POST',
        body: JSON.stringify(clientData),
      });
      return response;
    } catch (error: any) {
      console.error('Client registration failed:', error);
    // Amélioration du message d'erreur
      let errorMessage = 'Erreur inconnue';
      if (error.message && error.message.includes('|')) {
        errorMessage = error.message.split('|')[1].trim();
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(`Erreur d'inscription: ${errorMessage}`);
      throw error;
    }
  },

  // ✅ Inscription admin
  registerAdmin: async (adminData: RegisterAdminRequest): Promise<AdminResponse> => {
    try {
      const response = await apiRequest('/admin', {
        method: 'POST',
        body: JSON.stringify(adminData),
      });
      return response;
    } catch (error) {
      console.error('Admin registration failed:', error);
      throw error;
    }
  },

  // ✅ Vérifier si un email client existe
  checkClientEmailExists: async (email: string): Promise<boolean> => {
    try {
      await apiRequest(`/clients/by-email?email=${encodeURIComponent(email)}`);
      return true;
    } catch (error) {
      return false;
    }
  },

  // ✅ Vérifier si numéro existe
  checkPhoneExists: async (phone: string): Promise<boolean> => {
    try {
      const response = await apiRequest(`/clients/phone-exists?nmrTelephon=${phone}`);
      return response; // bool
    } catch (error) {
      return false;
    }
  },

    // ✅ Récupérer les détails d'un client
  getClientDetails: async (clientId: number): Promise<any> => {
    try {
      const response = await apiRequest(`/clients/${clientId}`,{ method:'GET'});
      return response;
    } catch (error) {
      console.error('Failed to fetch client details:', error);
      throw error;
    }
  },
    // ✅ Mettre à jour le profil client
  updateClientProfile: async (clientId: number, profileData: any): Promise<any> => {
    try {
      // Créer l'objet ClientRequestDTO attendu par le backend
      const clientRequestDTO = {
        nom: profileData.nom,
        prenom: profileData.prenom,
        email: profileData.email,
        nmrTelephon: profileData.nmrTelephon,
        motDePass: "" // Mot de passe vide car non modifié
      };

      const response = await apiRequest(`/clients/${clientId}`, {
        method: 'PUT',
        body: JSON.stringify(clientRequestDTO)
      });
      
      return response;
    } catch (error:any) {
      console.error('Failed to update client profile:', error);
      
      // Amélioration du message d'erreur
      let errorMessage = 'Erreur inconnue lors de la mise à jour';
      if (error.message) {
        if (error.message.includes("Un client avec cet email existe déjà")) {
          errorMessage = "Cet email est déjà utilisé par un autre client";
        } else if (error.message.includes("Un client avec ce numéro de téléphone existe déjà")) {
          errorMessage = "Ce numéro de téléphone est déjà utilisé";
        } else {
          errorMessage = error.message;
        }
      }
      
      throw new Error(errorMessage);
    }
  }
};
