import React, { useEffect } from "react";
import { StyleSheet, View, Dimensions, Platform } from "react-native";
import { WebView } from "react-native-webview";
import { useSelector } from "react-redux";

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
      <View style={styles.container}>
        <iframe
          src="https://www.openstreetmap.org/export/embed.html?bbox=2.3422,48.8466,2.3622,48.8666&layer=mapnik"
          style={{
            width: "100%",
            height: "100%",
            border: "none",
          }}
        />
      </View>
    );
  }

  // Version mobile avec WebView contenant OpenStreetMap
  return (
    <View style={styles.container}>
      <WebView
        style={styles.map}
        source={{ html: mapHTML }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn("WebView error: ", nativeEvent);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
