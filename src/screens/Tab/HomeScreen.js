import React, { useEffect } from "react";
import { StyleSheet, View, Dimensions, Platform, Text } from "react-native";
import { WebView } from "react-native-webview";
import { useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";

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

export default function HomeScreen() {
  // Récupérer le contenu complet du slice auth
  const authState = useSelector((state) => state.auth);

  // Afficher le contenu complet du slice auth dans la console
  useEffect(() => {
    console.log("============= CONTENU DU SLICE AUTH =============");
    console.log(JSON.stringify(authState, null, 2));
    console.log("================================================");
  }, [authState]);
  if (Platform.OS === "web") {
    // Version web avec OpenStreetMap dans une iframe
    return (
      <LinearGradient
        colors={["#0f0c29", "#302b63", "#24243e"]}
        style={styles.gradientContainer}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Cartes</Text>
          <Text style={styles.subtitle}>
            Trouvez les stations Vélib proches de vous
          </Text>
        </View>
        <View style={styles.mapContainer}>
          <WebView
            source={{
              uri: "https://www.openstreetmap.org/export/embed.html?bbox=2.3422,48.8466,2.3622,48.8666&layer=mapnik",
            }}
            style={styles.map}
          />
        </View>
      </LinearGradient>
    );
  }
  // Version mobile avec WebView contenant OpenStreetMap
  return (
    <LinearGradient
      colors={["#0f0c29", "#302b63", "#24243e"]}
      style={styles.gradientContainer}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Cartes</Text>
        <Text style={styles.subtitle}>
          Trouvez les stations Vélib proches de vous
        </Text>
      </View>
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
