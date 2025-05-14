import axios from "axios";
import { API_URL } from "./api.config";

/**
 * Service pour gérer les opérations liées aux stations Vélib
 */
class StationService {
  /**
   * Récupère toutes les stations Vélib disponibles
   * @returns {Promise<Array>} Liste des stations
   */
  async fetchStations() {
    try {
      const response = await axios.get(`${API_URL}/api/station/stations`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des stations:", error);
      throw error;
    }
  }

  /**
   * Récupère les détails d'une station spécifique
   * @param {string|number} stationId - ID de la station
   * @returns {Promise<Object>} Détails de la station
   */
  async getStationDetails(stationId) {
    try {
      const response = await axios.get(`${API_URL}/api/station/${stationId}`);
      return response.data;
    } catch (error) {
      console.error(
        `Erreur lors de la récupération de la station ${stationId}:`,
        error
      );
      throw error;
    }
  }
}

// Exporter une instance du service
export default new StationService();
