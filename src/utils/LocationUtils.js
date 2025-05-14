import * as Location from "expo-location";
import { Alert } from "react-native";

/**
 * Fonction utilitaire pour obtenir la position de l'utilisateur
 * @param {Object} options - Options pour la localisation
 * @param {boolean} options.showAlert - Afficher une alerte en cas d'erreur/refus
 * @param {Function} options.onSuccess - Callback à exécuter en cas de succès
 * @param {Function} options.onError - Callback à exécuter en cas d'erreur
 * @param {Object} options.mapRef - Référence à l'objet MapView pour animation
 * @param {number} options.animationDuration - Durée de l'animation (ms)
 * @returns {Promise<void>}
 */
export const getUserLocation = async (options = {}) => {
  const {
    showAlert = true,
    onSuccess,
    onError,
    mapRef,
    animationDuration = 1000,
  } = options;

  // Vérifier si on a déjà la permission de localisation
  let { status } = await Location.getForegroundPermissionsAsync();

  // Si on n'a pas la permission, la demander
  if (status !== "granted") {
    const permissionResponse =
      await Location.requestForegroundPermissionsAsync();
    status = permissionResponse.status;
  }

  if (status === "granted") {
    try {
      // Obtenir la position actuelle
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Créer un objet région à partir de la position
      const currentUserRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      // Exécuter le callback de succès si fourni
      if (typeof onSuccess === "function") {
        onSuccess(currentUserRegion);
      }

      // Animer la carte vers la position si une référence est fournie
      if (mapRef && mapRef.current) {
        mapRef.current.animateToRegion(currentUserRegion, animationDuration);
      }

      return currentUserRegion;
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de la localisation:",
        error
      );

      // Afficher une alerte en cas d'erreur
      if (showAlert) {
        Alert.alert(
          "Erreur de localisation",
          "Impossible de récupérer votre position pour le moment."
        );
      }

      // Exécuter le callback d'erreur si fourni
      if (typeof onError === "function") {
        onError(error);
      }
    }
  } else if (showAlert) {
    // Afficher une alerte si la permission est refusée
    Alert.alert(
      "Permission requise",
      "Veuillez activer la permission de localisation dans les paramètres de l'application pour utiliser cette fonctionnalité."
    );

    // Exécuter le callback d'erreur si fourni
    if (typeof onError === "function") {
      onError(new Error("Permission refusée"));
    }
  }

  return null;
};

/**
 * Fonction utilitaire pour charger les stations Vélib et rafraîchir la carte
 * @param {Object} options - Options pour le chargement des stations
 * @param {boolean} options.refresh - Indique si la carte doit être rafraîchie
 * @param {Function} options.fetchStationsFunction - Fonction pour récupérer les stations depuis l'API
 * @param {Function} options.setLoadingState - Fonction pour mettre à jour l'état de chargement
 * @param {Function} options.setStationsData - Fonction pour mettre à jour les données des stations
 * @param {Function} options.goToLocationFunction - Fonction pour centrer la carte sur l'utilisateur
 * @param {Function} options.onSuccess - Callback à exécuter en cas de succès (optionnel)
 * @param {Function} options.onError - Callback à exécuter en cas d'erreur (optionnel)
 * @returns {Promise<Array>} Liste des stations chargées
 */
export const loadStationsAndRefreshMap = async (options = {}) => {
  const {
    fetchStationsFunction,
    setLoadingState,
    setStationsData,
    goToLocationFunction,
    onSuccess,
    refresh,
    onError,
  } = options;

  // Vérifier que toutes les fonctions requises sont fournies
  if (!fetchStationsFunction || !setLoadingState || !setStationsData) {
    const error = new Error(
      "Paramètres requis manquants pour le chargement des stations"
    );
    console.error(error);
    if (typeof onError === "function") {
      onError(error);
    }
    return [];
  }

  try {
    // Indiquer que le chargement commence
    setLoadingState(true);

    // Récupérer les données des stations
    const stationsData = await fetchStationsFunction();

    // Mettre à jour les données des stations
    setStationsData(stationsData);

    console.log(`Récupération de ${stationsData.length} stations`);

    // Exécuter le callback de succès si fourni
    if (typeof onSuccess === "function") {
      onSuccess(stationsData);
    }

    return stationsData;
  } catch (error) {
    console.error("Erreur lors du chargement des stations:", error);

    // Afficher une alerte en cas d'erreur
    Alert.alert(
      "Erreur",
      "Impossible de charger les stations Vélib. Veuillez réessayer."
    );

    // Exécuter le callback d'erreur si fourni
    if (typeof onError === "function") {
      onError(error);
    }

    return [];
  } finally {
    // Indiquer que le chargement est terminé
    setLoadingState(false);
    if (refresh) {
      console.log("Rafraîchissement de la carte");
      goToLocationFunction();
    }
  }
};
