import axios from "axios";
import { API_URL, DEFAULT_HEADERS, handleApiError } from "./api.config";

/**
 * Service pour gérer les opérations de recherche
 */
class SearchService {
  /**
   * Recherche une localisation (station ou adresse)
   * @param {string} query - Texte de la recherche
   * @param {number} user_id - ID de l'utilisateur qui effectue la recherche
   * @param {string} token - Token d'authentification de l'utilisateur
   * @returns {Promise<Object>} Résultat de la recherche contenant lat, lon et message
   */ async searchLocation(query, user_id, token) {
    try {
      // Corps de la requête
      const requestBody = {
        search: query,
        user_id: user_id,
      };

      // Configuration des en-têtes avec le token d'authentification
      const headers = {
        ...DEFAULT_HEADERS,
        Authorization: `Bearer ${token}`,
      };

      console.log("Recherche en cours:", requestBody);

      // Envoi de la requête POST au serveur
      const response = await axios.post(`${API_URL}/api/search/`, requestBody, {
        headers: headers,
      });

      return response.data;
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      handleApiError(error);
      throw error;
    }
  }
}

export default new SearchService();
