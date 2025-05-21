import axios from "axios";
import { API_URL, DEFAULT_HEADERS, handleApiError } from "./api.config";

/**
 * Service pour gérer les opérations de recherche
 */
class SearchService {
  /**
   * Récupère l'historique des recherches d'un utilisateur
   * @param {number} user_id - ID de l'utilisateur
   * @param {string} token - Token d'authentification JWT
   * @returns {Promise<Array>} Liste des recherches
   */ async getSearchHistory(user_id, token) {
    try {
      // Log pour le débogage
      console.log(`Récupération de l'historique pour l'utilisateur ${user_id}`);

      // Configuration des en-têtes avec le token d'authentification
      const headers = {
        ...DEFAULT_HEADERS,
        Authorization: `Bearer ${token}`,
      };

      // S'assurer que user_id est un entier (le backend attend un int, pas un string)
      const userId = parseInt(user_id, 10);

      // Utiliser l'option params au lieu de les mettre dans l'URL pour éviter la redirection 308
      const response = await axios.get(`${API_URL}/api/search/`, {
        headers,
        params: { user_id: userId },
      });

      console.log("Réponse API historique de recherche:", response.status);
      return response.data.data;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'historique:", error);
      console.error("Status:", error.response?.status);
      console.error("Message:", error.response?.data);
      handleApiError(error);
      return [];
    }
  }

  /**
   * Supprime une recherche de l'historique
   * @param {number} id_search - ID de la recherche à supprimer
   * @param {number} user_id - ID de l'utilisateur qui effectue la suppression
   * @param {string} token - Token d'authentification de l'utilisateur
   * @returns {Promise<Object>} Résultat de la suppression
   */
  async deleteSearch(id_search, user_id, token) {
    try {
      // Log pour le débogage
      console.log(
        `Suppression de la recherche ${id_search} pour l'utilisateur ${user_id}`
      );

      // Configuration des en-têtes avec le token d'authentification
      const headers = {
        ...DEFAULT_HEADERS,
        Authorization: `Bearer ${token}`,
      };

      // Corps de la requête
      const requestBody = {
        id_search: parseInt(id_search, 10),
        user_id: parseInt(user_id, 10),
      };

      console.log("Données envoyées:", requestBody);

      // Envoi de la requête POST au serveur
      const response = await axios.post(
        `${API_URL}/api/search/delete`,
        requestBody,
        { headers }
      );

      console.log("Réponse API suppression:", response.status);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Erreur lors de la suppression de la recherche:", error);
      console.error("Status:", error.response?.status);
      console.error("Message:", error.response?.data);
      handleApiError(error);
      return { success: false, error };
    }
  }
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
      if (error.response.status != 404) {
        console.error("Erreur lors de la recherche:", error);

        handleApiError(error);

        throw error;
      }
    }
  }
}

export default new SearchService();
