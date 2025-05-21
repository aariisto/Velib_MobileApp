import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ActivityIndicator,
  Animated,
} from "react-native";
import { EventRegister } from "react-native-event-listeners";
import MapView, {
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
  Marker,
  Callout,
} from "react-native-maps";
import { useSelector, useDispatch } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { clearCredentials } from "../../store/slices/authSlice";
import DropdownMenu from "../../components/DropdownMenu";
import StationDetailsModal from "../../components/StationDetailsModal";
import {
  getUserLocation,
  loadStationsAndRefreshMap,
} from "../../utils/LocationUtils";
import {
  StationService,
  reservationService,
  searchService,
} from "../../services"; // Import des services depuis l'index
import Toast from "react-native-toast-message"; // Import Toast

const PARIS_REGION = {
  latitude: 48.8566,
  longitude: 2.3522,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function HomeScreen() {
  const authState = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(PARIS_REGION);
  const [stations, setStations] = useState([]); // State pour stocker les stations
  const [loading, setLoading] = useState(true); // State pour indiquer si les stations sont en cours de chargement
  const [selectedStation, setSelectedStation] = useState(null); // Station sélectionnée sur la carte
  const [stationDetails, setStationDetails] = useState(null); // Détails de la station sélectionnée
  const [detailsLoading, setDetailsLoading] = useState(false); // État de chargement des détails
  const [modalVisible, setModalVisible] = useState(false); // Visibilité du modal
  const [searchLoading, setSearchLoading] = useState(false); // État de chargement de la recherche
  const mapRef = useRef(null);

  useEffect(() => {
    console.log("============= CONTENU DU SLICE AUTH =============");
    console.log(JSON.stringify(authState, null, 2));
    console.log("================================================");
  }, [authState]);
  // useEffect pour la localisation
  useEffect(() => {
    // Utiliser la fonction utilitaire pour obtenir la localisation
    getUserLocation({
      showAlert: true,
      mapRef: mapRef,
      onSuccess: (region) => {
        setUserLocation(region);
        setMapRegion(region);
      },
      onError: () => {
        // En cas d'erreur, centrer sur Paris (déjà fait par initialisation)
        console.log("Localisation non disponible, carte centrée sur Paris.");
      },
    });
  }, []);

  // useEffect combiné pour charger les stations et gérer l'événement de rechargement
  useEffect(() => {
    // Fonction de chargement des stations qui sera utilisée à la fois au montage
    // et lors du double-clic sur l'onglet Accueil
    const loadStationsData = (ref_state) => {
      loadStationsAndRefreshMap({
        fetchStationsFunction: StationService.fetchStations,
        setLoadingState: setLoading,
        setStationsData: setStations,
        refresh: ref_state,
        goToLocationFunction: goToMyLocation,
        onSuccess: (stationsData) => {
          console.log(
            `Stations chargées avec succès: ${stationsData.length} stations`
          );
        },
        onError: (error) => {
          console.error("Erreur gérée dans le composant:", error);
        },
      });
    };

    // Chargement initial des stations au montage du composant
    loadStationsData(true);

    // Créer un écouteur pour l'événement RELOAD_STATIONS (double-clic sur l'onglet Accueil)
    const reloadListener = EventRegister.addEventListener(
      "RELOAD_STATIONS",
      () => {
        console.log(
          "Double-clic sur Accueil détecté, rechargement des stations..."
        );
        loadStationsData(false); // Passer false pour ne pas rafraîchir la carte
      }
    );

    // Nettoyage de l'écouteur lors du démontage du composant
    return () => {
      EventRegister.removeEventListener(reloadListener);
    };
  }, []);

  // Fonction pour gérer la recherche
  const handleSearch = async () => {
    // Si le champ de recherche est vide, ne rien faire
    if (!searchQuery.trim()) {
      Toast.show({
        type: "error",
        text1: "Champ vide",
        text2: "Veuillez entrer une adresse ou un nom de station.",
        position: "bottom",
        visibilityTime: 3000,
      });
      return;
    }

    const { user, token } = authState;

    // Vérifier si l'utilisateur est connecté
    if (!user || !token) {
      Toast.show({
        type: "error",
        text1: "Non connecté",
        text2: "Vous devez être connecté pour effectuer une recherche.",
        position: "bottom",
        visibilityTime: 3000,
      });
      return;
    }

    try {
      // Indiquer que la recherche est en cours
      setSearchLoading(true);
      Keyboard.dismiss();

      // Appel à l'API pour la recherche
      const result = await searchService.searchLocation(
        searchQuery,
        user.id,
        token
      );

      if (result && result.lat && result.lon) {
        // Convertir lat et lon en nombres si ce sont des chaînes
        const latitude =
          typeof result.lat === "string" ? parseFloat(result.lat) : result.lat;
        const longitude =
          typeof result.lon === "string" ? parseFloat(result.lon) : result.lon;

        // Définir la région pour centrer la carte sur le résultat
        const searchRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }; // Centrer la carte sur le résultat
        mapRef.current.animateToRegion(searchRegion, 1000);

        // Afficher un message temporaire pour indiquer le succès de la recherche
        Toast.show({
          type: "success",
          text1: result.message,
          text2: searchQuery,
          position: "bottom",
          visibilityTime: 2500,
        });
      } else {
        Toast.show({
          type: "info",
          text1: "Aucun résultat",
          text2: "Essayez une autre recherche",
          position: "bottom",
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      // Vérifier si c'est une erreur 404 NOT_FOUND
      if (
        error.response &&
        error.response.status === 404 &&
        error.response.data &&
        error.response.data.error_code === "NOT_FOUND"
      ) {
        // Message spécifique quand aucune station ni adresse n'est trouvée
        Toast.show({
          type: "info",
          text1: "Aucune correspondance",
          text2: "Aucune station ni adresse trouvée",
          position: "bottom",
          visibilityTime: 3000,
        });
      } else {
        // Message d'erreur générique pour les autres types d'erreurs
        Toast.show({
          type: "error",
          text1: "Erreur de recherche",
          text2: "Veuillez réessayer ultérieurement",
          position: "bottom",
          visibilityTime: 3000,
        });
      }
      console.error("Erreur lors de la recherche:", error);
    } finally {
      setSearchLoading(false);
    }
  };
  const dispatch = useDispatch();
  const handleOptionSelect = (option) => {
    console.log(`Option sélectionnée: ${option}`);

    if (option === "logout") {
      Alert.alert("Déconnexion", "Voulez-vous vraiment vous déconnecter ?", [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Oui",
          onPress: () => {
            console.log("Déconnexion en cours...");
            dispatch(clearCredentials());
          },
        },
      ]);
    } else if (option === "settings") {
      console.log("Ouverture des paramètres");
    }
  };
  const goToMyLocation = () => {
    // Si on a déjà la position utilisateur, l'utiliser directement
    if (userLocation) {
      if (mapRef.current) {
        mapRef.current.animateToRegion(userLocation, 1000);
      }
    } else {
      // Sinon, demander la position avec l'utilitaire
      getUserLocation({
        showAlert: true,
        mapRef: mapRef,
        onSuccess: (region) => {
          setUserLocation(region);
          setMapRegion(region);
        },
      });
    }
  };

  // Fonction pour gérer le clic sur un marqueur de station
  const handleStationPress = async (station) => {
    setSelectedStation(station);
    setDetailsLoading(true);
    setModalVisible(true);

    try {
      // Appel de l'API pour récupérer les détails de la station
      const details = await StationService.getStationDetails(
        station.station_id
      );
      setStationDetails(details);
      console.log("Détails de la station récupérés:", details);
    } catch (error) {
      console.error(
        `Erreur lors de la récupération des détails de la station ${station.station_id}:`,
        error
      );
      Alert.alert(
        "Erreur",
        "Impossible de récupérer les détails de cette station. Veuillez réessayer."
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  // Fonction pour fermer le modal
  const handleCloseModal = () => {
    setModalVisible(false);
    // Réinitialiser les détails après une courte période
    setTimeout(() => {
      setSelectedStation(null);
      setStationDetails(null);
    }, 300);
  }; // Fonction pour gérer le clic sur le bouton "Réserver"
  const handleReservation = (bikeType) => {
    // Récupération des informations de l'utilisateur depuis le store Redux
    const { user, token } = authState;

    if (!user || !token) {
      Alert.alert(
        "Erreur de connexion",
        "Vous devez être connecté pour effectuer une réservation.",
        [{ text: "OK" }]
      );
      return;
    }

    // Mapping du type de vélo (electric = 1, mechanical = 2)
    const bikeTypeId = bikeType === "electric" ? 1 : 2;
    const bikeTypeName = bikeType === "mechanical" ? "mécanique" : "électrique";

    Alert.alert(
      "Réservation",
      `Vous allez réserver un vélo ${bikeTypeName} à la station ${selectedStation?.name}.`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Confirmer",
          onPress: async () => {
            try {
              // Affichage d'un loader
              setLoading(true);

              // Appel à l'API pour la réservation
              const result = await reservationService.postReservation(
                bikeTypeId,
                selectedStation.station_id,
                user.id,
                token
              );

              // Fermeture du modal et arrêt du loader
              setModalVisible(false);
              setLoading(false); // Affichage du message de confirmation
              Alert.alert(
                "Réservation confirmée",
                `Votre vélo ${bikeTypeName} a été réservé avec succès !`,
                [{ text: "OK" }]
              );

              // Rafraîchissement des stations pour mettre à jour les disponibilités
            } catch (error) {
              setLoading(false);
              Alert.alert(
                "Erreur de réservation",
                `La réservation n'a pas pu être effectuée. Erreur: ${
                  error.message || "Erreur inconnue"
                }`,
                [{ text: "OK" }]
              );
              console.error("Erreur lors de la réservation:", error);
            }
          },
        },
      ]
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.title}>Cartes</Text>
          <Text style={styles.subtitle}>
            Trouvez les stations Vélib proches de vous
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <DropdownMenu onSelect={handleOptionSelect} />
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="rgba(255, 255, 255, 0.7)"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une station ou une adresse..."
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity onPress={handleSearch} disabled={searchLoading}>
          <Ionicons
            name={searchLoading ? "hourglass-outline" : "arrow-forward"}
            size={20}
            color="rgba(255, 255, 255, 0.7)"
            style={styles.searchActionIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <LinearGradient
        colors={["#0f0c29", "#302b63", "#24243e"]}
        style={styles.gradientContainer}
      >
        {renderHeader()}
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_DEFAULT}
            style={styles.map}
            region={mapRegion}
            // onRegionChangeComplete={setMapRegion}
            showsUserLocation={true}
            showsMyLocationButton={false}
            zoomEnabled={true}
            zoomControlEnabled={true}
          >
            {/* Afficher les marqueurs des stations */}
            {stations.map((station) => (
              <Marker
                key={station.station_id}
                coordinate={{
                  latitude: station.lat,
                  longitude: station.lon,
                }}
                onPress={() => handleStationPress(station)}
                pinColor="#8E54E9" // Couleur violette pour les marqueurs natifs de la map
              />
            ))}
            {/* Le marqueur de recherche a été supprimé */}
          </MapView>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={goToMyLocation}
          >
            <LinearGradient
              colors={["#4776E6", "#8E54E9"]}
              style={styles.locationButtonGradient}
            >
              <Ionicons name="locate-outline" size={28} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
          {/* Indicateur de chargement */}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4776E6" />
              <Text style={styles.loadingText}>Chargement des stations...</Text>
            </View>
          )}
        </View>

        {/* Modal des détails de la station */}
        <StationDetailsModal
          visible={modalVisible}
          onClose={handleCloseModal}
          station={selectedStation}
          stationDetails={stationDetails}
          loading={detailsLoading}
          onReserve={handleReservation}
        />
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    marginTop: 15,
    height: 50,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    height: "100%",
  },
  searchActionIcon: {
    marginLeft: 10,
    padding: 5,
  },
  mapContainer: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
    marginTop: 10,
    position: "relative",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  locationButton: {
    position: "absolute",
    bottom: 90, // Position au-dessus de la Tab Navigation
    right: 20,
    borderRadius: 50,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 1000, // Assure que le bouton est au-dessus de tous les autres éléments
  },
  locationButtonGradient: {
    padding: 15, // Padding augmenté pour un bouton plus grand
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  // Styles pour les callouts des marqueurs
  calloutContainer: {
    width: 200,
    padding: 10,
    borderRadius: 10,
  },
  calloutTitle: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 5,
  },
  calloutDescription: {
    fontSize: 12,
    color: "#555",
  }, // Styles pour l'indicateur de chargement
  loadingContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -75 }, { translateY: -40 }],
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 20,
    borderRadius: 10,
    width: 150,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingText: {
    marginTop: 10,
    color: "#333",
    fontWeight: "500",
    textAlign: "center",
  },
});
