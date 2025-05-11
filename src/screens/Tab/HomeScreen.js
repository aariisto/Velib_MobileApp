import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  Keyboard,
} from "react-native";
import { WebView } from "react-native-webview";
import { useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

const PARIS_REGION = {
  latitude: 48.8566,
  longitude: 2.3522,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

// HTML pour la carte OpenStreetMap sur le web
const mapHTML = `
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    <style>
        #map { height: 100vh; width: 100vw; }
        body { margin: 0; }
    </style>
</head>
<body>
    <div id="map"></div>
    <script>
        const map = L.map('map').setView([48.8566, 2.3522], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        L.marker([48.8566, 2.3522]).addTo(map)
            .bindPopup('Paris')
            .openPopup();
    </script>
</body>
</html>
`;

// Composant pour le menu déroulant
const DropdownMenu = ({ visible, onClose, onOptionSelect }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => onOptionSelect("settings")}
            >
              <Ionicons name="settings-outline" size={20} color="#fff" />
              <Text style={styles.dropdownText}>Paramètres</Text>
            </TouchableOpacity>

            <View style={styles.dropdownDivider} />

            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => onOptionSelect("logout")}
            >
              <Ionicons name="log-out-outline" size={20} color="#fff" />
              <Text style={styles.dropdownText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default function HomeScreen() {
  // Récupérer le contenu complet du slice auth
  const authState = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Afficher le contenu complet du slice auth dans la console
  useEffect(() => {
    console.log("============= CONTENU DU SLICE AUTH =============");
    console.log(JSON.stringify(authState, null, 2));
    console.log("================================================");
  }, [authState]);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleOptionSelect = (option) => {
    // Ici, vous pourriez implémenter les actions pour chaque option
    console.log(`Option sélectionnée: ${option}`);
    setDropdownVisible(false);
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
        <TouchableOpacity style={styles.menuButton} onPress={toggleDropdown}>
          <Ionicons name="menu" size={28} color="#fff" />
        </TouchableOpacity>
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

      <DropdownMenu
        visible={dropdownVisible}
        onClose={() => setDropdownVisible(false)}
        onOptionSelect={handleOptionSelect}
      />
    </View>
  );

  if (Platform.OS === "web") {
    // Version web avec OpenStreetMap dans une iframe
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <LinearGradient
          colors={["#0f0c29", "#302b63", "#24243e"]}
          style={styles.gradientContainer}
        >
          {renderHeader()}
          <View style={styles.mapContainer}>
            <WebView
              source={{
                uri: "https://www.openstreetmap.org/export/embed.html?bbox=2.3422,48.8466,2.3622,48.8666&layer=mapnik",
              }}
              style={styles.map}
            />
          </View>
        </LinearGradient>
      </TouchableWithoutFeedback>
    );
  }

  // Version mobile avec WebView contenant OpenStreetMap
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <LinearGradient
        colors={["#0f0c29", "#302b63", "#24243e"]}
        style={styles.gradientContainer}
      >
        {renderHeader()}
        <View style={styles.mapContainer}>
          <WebView
            style={styles.map}
            source={{ html: mapHTML }}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.warn("WebView error: ", nativeEvent);
            }}
          />
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
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  dropdownContainer: {
    backgroundColor: "rgba(15, 12, 41, 0.95)",
    borderRadius: 12,
    marginTop: 95,
    marginRight: 20,
    width: 200,
    padding: 5,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
  },
  dropdownText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 12,
  },
  dropdownDivider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginVertical: 5,
  },
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
