import { Platform } from "react-native";

// Configuration de base pour l'API
// Utilisez l'IP de votre ordinateur pour le développement
// Utilisez localhost pour le web, et l'IP actuelle pour iOS/Android
const LOCAL_IP = "192.X.X.X";

// Choisissez l'URL en fonction de la plateforme
export const API_URL = Platform.select({
  // Sur iOS, utilisez l'IP complète, car "localhost" pointerait vers l'appareil lui-même
  ios: `http://${LOCAL_IP}:5001`,
  // Sur Android, utilisez 10.0.2.2 qui est un alias spécial pointant vers la machine hôte
  android: `http://10.0.2.2:5001`,
  // Sur web, utilisez l'IP normale
  default: `http://${LOCAL_IP}:5001`,
});

console.log(`Utilisation de l'API URL: ${API_URL}`);

// Configuration par défaut pour les requêtes
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

// Fonction utilitaire pour gérer les erreurs
export const handleApiError = (error) => {
  console.error("API Error:", error);
  throw error;
};
