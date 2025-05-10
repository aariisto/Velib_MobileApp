import { API_URL, DEFAULT_HEADERS, handleApiError } from "./api.config";

/**
 * Service pour gérer l'authentification
 */
class AuthService {
  /**
   * Connecte un utilisateur
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe de l'utilisateur
   * @returns {Promise} Réponse de l'API
   */
  async login(email, password) {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: DEFAULT_HEADERS,
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur de connexion");
      }
      console.log(data.data.token);
      return data;
    } catch (error) {
      handleApiError(error);
    }
  }

  /**
   * Inscrit un nouvel utilisateur
   * @param {string} username - Nom d'utilisateur
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe de l'utilisateur
   * @returns {Promise} Réponse de l'API
   */
  async register(username, email, password) {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: DEFAULT_HEADERS,
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de l'inscription");
      }
      console.log(data);
      return data;
    } catch (error) {
      handleApiError(error);
    }
  }

  /**
   * Déconnecte l'utilisateur
   * @returns {Promise} Réponse de l'API
   
  async logout() {
    try {
      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        headers: DEFAULT_HEADERS,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la déconnexion");
      }

      return data;
    } catch (error) {
      handleApiError(error);
    }
  }
  */

  /**
   * Vérifie la validité du token JWT
   * @param {string} token - Token JWT à vérifier
   * @returns {Promise} Réponse de l'API contenant la validité du token
   */
  async verifyToken(token) {
    try {
      const response = await fetch(`${API_URL}/api/auth/verify-token`, {
        method: "POST",
        headers: DEFAULT_HEADERS,
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Erreur lors de la vérification du token"
        );
      }

      return data;
    } catch (error) {
      handleApiError(error);
      // Retourner un objet avec success: false pour indiquer que la vérification a échoué
      return { success: false, message: error.message };
    }
  }
}

export const authService = new AuthService();
