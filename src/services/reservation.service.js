import axios from "axios";
import { API_URL, DEFAULT_HEADERS, handleApiError } from "./api.config";
import { generateConfirmationID } from "../utils/reservationUtils";

/**
 * Service pour gérer les opérations liées aux réservations Vélib
 */
class ReservationService {
  /**
   * Envoi une demande de réservation au serveur
   * @param {number} id_velo - ID du type de vélo (1: électrique, 2: mécanique)
   * @param {number} station_id - ID de la station Vélib
   * @param {number} user_id - ID de l'utilisateur qui fait la réservation
   * @param {string} token - Token d'authentification de l'utilisateur
   * @returns {Promise<Object>} Résultat de la réservation
   */
  async postReservation(id_velo, station_id, user_id, token) {
    try {
      // Génération d'un ID de confirmation unique à 8 chiffres
      const confirmation_id = generateConfirmationID();

      // Configuration des en-têtes avec le token d'authentification
      const headers = {
        ...DEFAULT_HEADERS,
        Authorization: `Bearer ${token}`,
      };
      // Corps de la requête
      const requestBody = {
        id_velo: id_velo,
        station_id: station_id,
        user_id: user_id,
        confirmationID: confirmation_id,
      };

      console.log("Envoi de la réservation:", requestBody);

      // Envoi de la requête POST au serveur
      const response = await axios.post(
        `${API_URL}/api/reservation/`,
        requestBody,
        { headers }
      );

      return response.data;
    } catch (error) {
      console.error("Erreur lors de la réservation:", error);
      handleApiError(error);
      throw error;
    }
  }
  /**
   * Récupère les réservations d'un utilisateur
   * @param {number} user_id - ID de l'utilisateur
   * @param {string} token - Token d'authentification JWT
   * @returns {Promise<Array>} Liste des réservations
   */
  async getReservations(user_id, token) {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      // S'assurer que user_id est un entier (le backend attend un int, pas un string)
      const userId = parseInt(user_id, 10);

      const response = await axios.get(`${API_URL}/api/reservation/`, {
        headers,
        params: { user_id: userId },
      });

      return response.data.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations:", error);
      console.error("Status:", error.response?.status);
      console.error("Message:", error.response?.data);
      handleApiError(error);
      return [];
    }
  }
}

export default new ReservationService();
