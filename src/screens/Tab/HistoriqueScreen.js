import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const historiques = [
  {
    date: "10 mai 2025",
    heure: "14:30",
    lieu: "Station Bastille",
    duree: "45 min",
    icon: "bicycle",
  },
  {
    date: "08 mai 2025",
    heure: "09:15",
    lieu: "Station Concorde",
    duree: "30 min",
    icon: "bicycle",
  },
  {
    date: "05 mai 2025",
    heure: "18:45",
    lieu: "Station Republique",
    duree: "20 min",
    icon: "bicycle",
  },
  {
    date: "01 mai 2025",
    heure: "11:20",
    lieu: "Station Montparnasse",
    duree: "15 min",
    icon: "bicycle",
  },
  {
    date: "28 avr 2025",
    heure: "16:05",
    lieu: "Station Saint-Michel",
    duree: "40 min",
    icon: "bicycle",
  },
  {
    date: "25 avr 2025",
    heure: "08:30",
    lieu: "Station Eiffel",
    duree: "55 min",
    icon: "bicycle",
  },
];

export default function HistoriqueScreen() {
  return (
    <LinearGradient
      colors={["#0f0c29", "#302b63", "#24243e"]}
      style={styles.gradientContainer}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Historique</Text>
          <Text style={styles.subtitle}>Vos déplacements récents</Text>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.historiquesListe}>
            {historiques.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.historiqueCard}
                onPress={() => console.log(`Détails de: ${item.date}`)}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name={item.icon} size={28} color="#8E54E9" />
                </View>
                <View style={styles.historiqueInfo}>
                  <Text style={styles.dateText}>
                    {item.date} · {item.heure}
                  </Text>
                  <Text style={styles.lieuText}>{item.lieu}</Text>
                  <Text style={styles.dureeText}>Durée: {item.duree}</Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#8E54E9"
                  style={styles.arrowIcon}
                />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    padding: 20,
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
  content: {
    flex: 1,
    marginTop: 10,
  },
  historiquesListe: {
    paddingHorizontal: 20,
  },
  historiqueCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  historiqueInfo: {
    flex: 1,
  },
  dateText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  lieuText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
    marginTop: 3,
  },
  dureeText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
    marginTop: 3,
  },
  arrowIcon: {
    marginLeft: 10,
  },
});
