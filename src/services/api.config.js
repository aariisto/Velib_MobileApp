// Configuration de base pour l'API
export const API_URL = "http://172.20.10.2:5001";

// Configuration par défaut pour les requêtes
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

// Fonction utilitaire pour gérer les erreurs
export const handleApiError = (error) => {
  console.error("API Error:", error);
  throw error;
};
