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
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { clearCredentials } from "../../store/slices/authSlice";
import DropdownMenu from "../../components/DropdownMenu";
import {
  getUserLocation,
  loadStationsAndRefreshMap,
} from "../../utils/LocationUtils";
import StationService from "../../services/station.service"; // Import du service station

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
          placeholder="Rechercher une station..."
          placeholderTextColor="rgba(255, 255, 255, 0.5)"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
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
                title={station.name}
                description={`Capacité: ${station.capacity} vélos`}
                onPress={() =>
                  console.log(`Station sélectionnée: ID ${station.station_id}`)
                }
              ></Marker>
            ))}
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
  },
  // Styles pour l'indicateur de chargement
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
