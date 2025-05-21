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
}

export default new ReservationService();
