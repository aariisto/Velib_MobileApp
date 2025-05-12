import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import MapView, {
  Marker,
  UrlTile,
  PROVIDER_GOOGLE,
  PROVIDER_DEFAULT,
} from "react-native-maps";
import { useSelector, useDispatch } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { clearCredentials } from "../../store/slices/authSlice";
import DropdownMenu from "../../components/DropdownMenu";

const PARIS_REGION = {
  latitude: 48.8566,
  longitude: 2.3522,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

// Points supplémentaires autour de Paris
const ADDITIONAL_LOCATIONS = [
  {
    id: 1,
    title: "Paris 1",
    description: "Quartier du 1er arrondissement",
    coordinate: {
      latitude: 48.863, // Légèrement au nord
      longitude: 2.341,
    },
  },
  {
    id: 2,
    title: "Paris 2",
    description: "Quartier du 2ème arrondissement",
    coordinate: {
      latitude: 48.865, // Nord-est
      longitude: 2.3622,
    },
  },
  {
    id: 3,
    title: "Paris 3",
    description: "Quartier du 3ème arrondissement",
    coordinate: {
      latitude: 48.8502, // Sud
      longitude: 2.36,
    },
  },
];

// Le composant DropdownMenu est maintenant importé depuis "../../components/DropdownMenu"

export default function HomeScreen() {
  // Récupérer le contenu complet du slice auth
  const authState = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState("");

  // Afficher le contenu complet du slice auth dans la console
  useEffect(() => {
    console.log("============= CONTENU DU SLICE AUTH =============");
    console.log(JSON.stringify(authState, null, 2));
    console.log("================================================");
  }, [authState]);
  const dispatch = useDispatch();
  const handleOptionSelect = (option) => {
    console.log(`Option sélectionnée: ${option}`);

    if (option === "logout") {
      // Afficher une alerte de confirmation avant la déconnexion
      Alert.alert("Déconnexion", "Voulez-vous vraiment vous déconnecter ?", [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Oui",
          onPress: () => {
            // Exécuter la déconnexion avec clearCredentials du authSlice
            console.log("Déconnexion en cours...");

            // Cette action va réinitialiser l'état d'authentification
            // en mettant isAuthenticated à false et en effaçant les informations utilisateur
            dispatch(clearCredentials());

            // Pas besoin de navigation manuelle ici car AppContent dans App.js
            // détecte que isAuthenticated est passé à false et redirige automatiquement
            // vers l'écran de connexion grâce à la condition du NavigationContainer
          },
        },
      ]);
    } else if (option === "settings") {
      // Implémentation future des paramètres
      console.log("Ouverture des paramètres");
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
  // Version mobile avec MapView et OpenStreetMap
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <LinearGradient
        colors={["#0f0c29", "#302b63", "#24243e"]}
        style={styles.gradientContainer}
      >
        {renderHeader()}
        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_DEFAULT} // Utiliser le fournisseur Google Maps
            style={styles.map}
            initialRegion={{
              latitude: PARIS_REGION.latitude,
              longitude: PARIS_REGION.longitude,
              latitudeDelta: 0.01, // Zoom plus proche
              longitudeDelta: 0.01,
            }}
            showsUserLocation={false}
            showsMyLocationButton={false}
            zoomEnabled={true}
            zoomControlEnabled={true}
          >
            {/* Marqueur personnalisé pour Paris central */}
            <Marker
              coordinate={{
                latitude: PARIS_REGION.latitude,
                longitude: PARIS_REGION.longitude,
              }}
              title="Paris"
              description="Centre de Paris"
              pinColor="#4285F4" // Couleur bleue comme dans votre version précédente
            />

            {/* Marqueurs supplémentaires pour Paris 1, 2, 3 */}
            {ADDITIONAL_LOCATIONS.map((location) => (
              <Marker
                key={location.id}
                coordinate={location.coordinate}
                title={location.title}
                description={location.description}
                pinColor="#4285F4" // Même couleur bleue
              />
            ))}
          </MapView>
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
  }, // Les styles du menu ont été supprimés car nous utilisons maintenant le composant externe
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
  }, // Les styles du dropdown ont été supprimés car nous utilisons maintenant le composant externe
  mapContainer: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
    marginTop: 10,
  },
  map: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
});
