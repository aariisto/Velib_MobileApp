import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// Données fictives pour l'historique des recherches
const recherches = [
  {
    id: "r1",
    terme: "Station Bastille",
    date: "10 mai 2025",
    heure: "14:30",
    type: "station",
  },
  {
    id: "r2",
    terme: "Place de la République",
    date: "09 mai 2025",
    heure: "11:15",
    type: "adresse",
  },
  {
    id: "r3",
    terme: "Station Gare du Nord",
    date: "08 mai 2025",
    heure: "19:45",
    type: "station",
  },
  {
    id: "r4",
    terme: "Champs-Élysées",
    date: "07 mai 2025",
    heure: "16:20",
    type: "adresse",
  },
  {
    id: "r5",
    terme: "Station Montparnasse",
    date: "05 mai 2025",
    heure: "10:05",
    type: "station",
  },
];

// Données fictives pour l'historique des réservations
const reservations = [
  {
    id: "res1",
    velo: "VéloB-45892",
    station: "Station Bastille",
    date: "10 mai 2025",
    heure: "14:45",
    duree: "30 min",
    statut: "Terminé",
  },
  {
    id: "res2",
    velo: "VéloB-12547",
    station: "Station République",
    date: "08 mai 2025",
    heure: "09:30",
    duree: "45 min",
    statut: "Terminé",
  },
  {
    id: "res3",
    velo: "VéloB-33698",
    station: "Station Montparnasse",
    date: "01 mai 2025",
    heure: "11:20",
    duree: "15 min",
    statut: "Terminé",
  },
  {
    id: "res4",
    velo: "VéloB-78541",
    station: "Station Concorde",
    date: "28 avr 2025",
    heure: "16:05",
    duree: "40 min",
    statut: "Terminé",
  },
];

// Composant pour une carte de recherche
const RechercheCard = ({ item, onDelete }) => {
  const getIconName = (type) => {
    return type === "station" ? "bicycle" : "location";
  };

  return (
    <View style={styles.historyCard}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Ionicons name={getIconName(item.type)} size={22} color="#fff" />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.termeText}>{item.terme}</Text>
          <Text style={styles.dateText}>
            {item.date} à {item.heure}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(item.id)}
      >
        <Ionicons name="trash-outline" size={18} color="#ff6b6b" />
        <Text style={styles.deleteButtonText}>Supprimer</Text>
      </TouchableOpacity>
    </View>
  );
};

// Composant pour une carte de réservation
const ReservationCard = ({ item, onViewDetails }) => {
  return (
    <View style={styles.historyCard}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, styles.bikeIconContainer]}>
          <Ionicons name="bicycle" size={22} color="#fff" />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.termeText}>{item.velo}</Text>
          <Text style={styles.stationText}>{item.station}</Text>
          <Text style={styles.dateText}>
            {item.date} à {item.heure} • {item.duree}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.detailButton}
        onPress={() => onViewDetails(item.id)}
      >
        <Ionicons name="information-circle-outline" size={18} color="#4dabf7" />
        <Text style={styles.detailButtonText}>Détails</Text>
      </TouchableOpacity>
    </View>
  );
};

// Composant pour l'en-tête de section
const SectionHeader = ({ title, count }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.countBadge}>
      <Text style={styles.countText}>{count}</Text>
    </View>
  </View>
);

export default function HistoriqueScreen() {
  const [activeTab, setActiveTab] = useState("recherche"); // 'recherche' ou 'reservation'

  const handleDeleteRecherche = (id) => {
    Alert.alert(
      "Supprimer la recherche",
      "Voulez-vous vraiment supprimer cette recherche de l'historique ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
          onPress: () => console.log(`Suppression de la recherche ${id}`),
          style: "destructive",
        },
      ]
    );
  };

  const handleViewReservationDetails = (id) => {
    console.log(`Afficher les détails de la réservation ${id}`);
    // Navigation vers la page de détails ou modal
  };

  const renderTabButton = (tabName, title, iconName) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        activeTab === tabName ? styles.activeTabButton : null,
      ]}
      onPress={() => setActiveTab(tabName)}
    >
      <Ionicons
        name={iconName}
        size={20}
        color={activeTab === tabName ? "#fff" : "rgba(255, 255, 255, 0.6)"}
      />
      <Text
        style={[
          styles.tabButtonText,
          activeTab === tabName ? styles.activeTabButtonText : null,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#1C1B33" />
      <LinearGradient
        colors={["#1C1B33", "#2D2B49"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Historique</Text>
            <Text style={styles.subtitle}>
              Suivez vos recherches et réservations
            </Text>
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            {renderTabButton("recherche", "Recherches", "search-outline")}
            {renderTabButton("reservation", "Réservations", "bicycle-outline")}
          </View>

          {/* Content */}
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.contentContainer}
          >
            {activeTab === "recherche" ? (
              <>
                <SectionHeader
                  title="Historique de recherche"
                  count={recherches.length}
                />
                <View style={styles.cardsContainer}>
                  {recherches.length > 0 ? (
                    recherches.map((item) => (
                      <RechercheCard
                        key={item.id}
                        item={item}
                        onDelete={handleDeleteRecherche}
                      />
                    ))
                  ) : (
                    <View style={styles.emptyState}>
                      <Ionicons
                        name="search-outline"
                        size={50}
                        color="rgba(255, 255, 255, 0.3)"
                      />
                      <Text style={styles.emptyStateText}>
                        Aucune recherche récente
                      </Text>
                    </View>
                  )}
                </View>
              </>
            ) : (
              <>
                <SectionHeader
                  title="Historique de réservation"
                  count={reservations.length}
                />
                <View style={styles.cardsContainer}>
                  {reservations.length > 0 ? (
                    reservations.map((item) => (
                      <ReservationCard
                        key={item.id}
                        item={item}
                        onViewDetails={handleViewReservationDetails}
                      />
                    ))
                  ) : (
                    <View style={styles.emptyState}>
                      <Ionicons
                        name="bicycle-outline"
                        size={50}
                        color="rgba(255, 255, 255, 0.3)"
                      />
                      <Text style={styles.emptyStateText}>
                        Aucune réservation récente
                      </Text>
                    </View>
                  )}
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1C1B33",
  },
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 12,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 15,
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  activeTabButton: {
    backgroundColor: "rgba(107, 99, 255, 0.8)",
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.6)",
    marginLeft: 6,
  },
  activeTabButtonText: {
    color: "#ffffff",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  countBadge: {
    backgroundColor: "rgba(107, 99, 255, 0.3)",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  countText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  cardsContainer: {
    marginBottom: 20,
  },
  historyCard: {
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(107, 99, 255, 0.35)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  bikeIconContainer: {
    backgroundColor: "rgba(77, 171, 247, 0.25)",
  },
  cardInfo: {
    flex: 1,
  },
  termeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  stationText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    marginBottom: 4,
  },
  dateText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 13,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  deleteButtonText: {
    color: "#ff6b6b",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
  },
  detailButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(77, 171, 247, 0.1)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  detailButtonText: {
    color: "#4dabf7",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  emptyStateText: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 16,
    marginTop: 10,
  },
});
