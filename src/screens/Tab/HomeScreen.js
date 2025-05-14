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
} from "react-native";
import MapView, { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from "react-native-maps";
import { useSelector, useDispatch } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { clearCredentials } from "../../store/slices/authSlice";
import DropdownMenu from "../../components/DropdownMenu";

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
  const mapRef = useRef(null);

  useEffect(() => {
    console.log("============= CONTENU DU SLICE AUTH =============");
    console.log(JSON.stringify(authState, null, 2));
    console.log("================================================");
  }, [authState]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission refusée",
          "L'accès à la localisation a été refusé. La carte sera centrée sur Paris."
        );
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        const currentUserRegion = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setUserLocation(currentUserRegion);
        setMapRegion(currentUserRegion);
        if (mapRef.current) {
          mapRef.current.animateToRegion(currentUserRegion, 1000);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de la localisation:",
          error
        );
        Alert.alert(
          "Erreur de localisation",
          "Impossible de récupérer votre position. La carte sera centrée sur Paris."
        );
      }
    })();
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
    if (userLocation) {
      if (mapRef.current) {
        mapRef.current.animateToRegion(userLocation, 1000);
      }
    } else {
      (async () => {
        let { status } = await Location.getForegroundPermissionsAsync();
        if (status !== "granted") {
          const permissionResponse =
            await Location.requestForegroundPermissionsAsync();
          status = permissionResponse.status;
        }

        if (status === "granted") {
          try {
            let location = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.High,
            });
            const currentUserRegion = {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            };
            setUserLocation(currentUserRegion);
            setMapRegion(currentUserRegion);
            if (mapRef.current) {
              mapRef.current.animateToRegion(currentUserRegion, 1000);
            }
          } catch (error) {
            console.error(
              "Erreur lors de la nouvelle tentative de localisation:",
              error
            );
            Alert.alert(
              "Erreur",
              "Impossible de récupérer votre position pour le moment."
            );
          }
        } else {
          Alert.alert(
            "Permission requise",
            "Veuillez activer la permission de localisation dans les paramètres de l'application pour utiliser cette fonctionnalité."
          );
        }
      })();
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
          />
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
});
