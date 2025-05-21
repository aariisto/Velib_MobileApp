import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  RefreshControl, // Ajout de RefreshControl
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";
import { reservationService, searchService } from "../../services";
import { formatDate } from "../../utils/dateUtils";
import Toast from "react-native-toast-message";

// Composant pour une carte de recherche
const RechercheCard = ({ item, onDelete, isDeleting }) => {
  // Formatage de la date à partir de created_at
  const dateInfo = formatDate(item.created_at);

  // Déterminer l'icône en fonction du type de résultat
  const getIconName = () => {
    if (item.resultat_recherche === "Station trouvée") {
      return "bicycle";
    } else if (item.resultat_recherche === "Adresse trouvée") {
      return "location";
    } else {
      return "help-circle";
    }
  };
  return (
    <View style={[styles.historyCard, isDeleting && styles.deletingCard]}>
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.iconContainer,
            !item.resultat ? styles.errorIconContainer : null,
          ]}
        >
          <Ionicons name={getIconName()} size={22} color="#fff" />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.termeText}>
            {item.resultat_recherche === "Station trouvée"
              ? item.station
              : item.recherche}
          </Text>
          <Text style={styles.stationText}>
            {item.resultat_recherche || "Recherche"}
          </Text>
          <Text style={styles.dateText}>{dateInfo.complet}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButtonCircle}
        onPress={() => onDelete(item.id)}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Ionicons name="trash-outline" size={20} color="#fff" />
        )}
      </TouchableOpacity>
    </View>
  );
};

// Composant pour une carte de réservation
const ReservationCard = ({ item, onViewDetails }) => {
  // Formatage de la date à partir de create_time
  const dateInfo = formatDate(item.create_time);

  // Déterminer l'icône en fonction du type de vélo
  const getBikeIcon = (type) => {
    return type === "electrique" ? "flash" : "bicycle";
  };

  return (
    <View style={styles.historyCard}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, styles.bikeIconContainer]}>
          <Ionicons name={getBikeIcon(item.type_velo)} size={22} color="#fff" />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.termeText}>{item.station}</Text>
          <Text style={styles.stationText}>
            {item.type_velo === "electrique"
              ? "Vélo électrique"
              : "Vélo mécanique"}
          </Text>
          <Text style={styles.dateText}>
            {dateInfo.complet} • N°{item.confirmationID}
          </Text>
        </View>
      </View>
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
  const [activeTab, setActiveTab] = useState("recherche");
  const [apiReservations, setApiReservations] = useState([]);
  const [apiSearchHistory, setApiSearchHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // État pour le pull to refresh
  const [deletingId, setDeletingId] = useState(null); // ID de la recherche en cours de suppression
  const [error, setError] = useState(null);
  // Récupérer l'état d'authentification depuis Redux
  const authState = useSelector((state) => state.auth);

  // Fonction pour charger les réservations de l'utilisateur
  const loadReservations = async () => {
    // Vérifier si l'utilisateur est connecté
    if (!authState?.user?.id || !authState?.token) {
      setError("Vous devez être connecté pour voir vos réservations");
      console.log("Utilisateur non connecté");
      return;
    }

    console.log("Authentification:", {
      userId: authState.user.id,
      tokenLength: authState.token ? authState.token.length : 0,
    });

    try {
      setLoading(true);
      setError(null);

      const reservationsList = await reservationService.getReservations(
        authState.user.id,
        authState.token
      );

      setApiReservations(reservationsList || []);
    } catch (err) {
      console.error("Erreur lors du chargement des réservations:", err);
      setError("Impossible de charger vos réservations");
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: "Impossible de charger vos réservations",
        position: "bottom",
      });
    } finally {
      setLoading(false);
      setRefreshing(false); // Arrêter l'indicateur de rafraîchissement
    }
  };

  // Fonction pour charger l'historique des recherches
  const loadSearchHistory = async () => {
    // Vérifier si l'utilisateur est connecté
    if (!authState?.user?.id || !authState?.token) {
      setError("Vous devez être connecté pour voir votre historique");
      console.log("Utilisateur non connecté");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const searchHistoryList = await searchService.getSearchHistory(
        authState.user.id,
        authState.token
      );

      setApiSearchHistory(searchHistoryList || []);
    } catch (err) {
      console.error("Erreur lors du chargement de l'historique:", err);
      setError("Impossible de charger votre historique de recherche");
      Toast.show({
        type: "error",
        text1: "Erreur",
        text2: "Impossible de charger votre historique de recherche",
        position: "bottom",
      });
    } finally {
      setLoading(false);
      setRefreshing(false); // Arrêter l'indicateur de rafraîchissement
    }
  };

  // Fonction pour gérer le pull to refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    if (activeTab === "recherche") {
      await loadSearchHistory();
    } else {
      await loadReservations();
    }
  };

  // Charger les réservations de l'utilisateur
  useEffect(() => {
    // Charger les réservations lorsque l'onglet réservation est actif
    if (activeTab === "reservation") {
      loadReservations();
    }
  }, [activeTab, authState.user?.id, authState.token]);

  // Charger l'historique des recherches de l'utilisateur
  useEffect(() => {
    // Charger l'historique lorsque l'onglet recherche est actif
    if (activeTab === "recherche") {
      loadSearchHistory();
    }
  }, [activeTab, authState.user?.id, authState.token]);
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
          onPress: async () => {
            try {
              // Définir l'ID de la recherche en cours de suppression
              setDeletingId(id);

              // Appeler l'API pour supprimer la recherche
              const result = await searchService.deleteSearch(
                id,
                authState.user.id,
                authState.token
              );

              if (result.success) {
                // Mettre à jour l'état local pour supprimer l'élément de la liste
                setApiSearchHistory((prevHistory) =>
                  prevHistory.filter((item) => item.id !== id)
                );

                // Afficher un message de succès
                Toast.show({
                  type: "success",
                  text1: "Recherche supprimée",
                  text2: "La recherche a été supprimée de votre historique",
                  position: "bottom",
                });
              } else {
                throw new Error("Échec de la suppression");
              }
            } catch (err) {
              console.error("Erreur lors de la suppression:", err);

              // Afficher un message d'erreur
              Toast.show({
                type: "error",
                text1: "Erreur",
                text2: "Erreur lors de la suppression",
                position: "bottom",
              });
            } finally {
              // Réinitialiser l'ID de suppression
              setDeletingId(null);
            }
          },
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
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                tintColor="#6b63ff" // Couleur du spinner de chargement
                colors={["#6b63ff", "#4dabf7"]} // Couleurs pour Android
                title="Actualisation..." // Texte affiché sous le spinner (iOS uniquement)
                titleColor="rgba(255, 255, 255, 0.7)" // Couleur du texte (iOS uniquement)
              />
            }
          >
            {activeTab === "recherche" ? (
              <>
                <SectionHeader
                  title="Historique de recherche"
                  count={loading ? "..." : apiSearchHistory.length}
                />
                <View style={styles.cardsContainer}>
                  {loading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="large" color="#6b63ff" />
                      <Text style={styles.loadingText}>
                        Chargement de votre historique...
                      </Text>
                    </View>
                  ) : error ? (
                    <View style={styles.errorContainer}>
                      <Ionicons
                        name="alert-circle-outline"
                        size={50}
                        color="rgba(255, 107, 107, 0.7)"
                      />
                      <Text style={styles.errorText}>{error}</Text>
                    </View>
                  ) : apiSearchHistory.length > 0 ? (
                    apiSearchHistory.map((item) => (
                      <RechercheCard
                        key={item.id}
                        item={item}
                        onDelete={handleDeleteRecherche}
                        isDeleting={deletingId === item.id}
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
                  title="Mes réservations"
                  count={loading ? "..." : apiReservations.length}
                />
                <View style={styles.cardsContainer}>
                  {loading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="large" color="#6b63ff" />
                      <Text style={styles.loadingText}>
                        Chargement de vos réservations...
                      </Text>
                    </View>
                  ) : error ? (
                    <View style={styles.errorContainer}>
                      <Ionicons
                        name="alert-circle-outline"
                        size={50}
                        color="rgba(255, 107, 107, 0.7)"
                      />
                      <Text style={styles.errorText}>{error}</Text>
                    </View>
                  ) : apiReservations.length > 0 ? (
                    apiReservations.map((item) => (
                      <ReservationCard
                        key={item.confirmationID}
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
                        Aucune réservation trouvée
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
  loadingContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 10,
    fontSize: 14,
  },
  errorContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: "rgba(255, 107, 107, 0.9)",
    marginTop: 10,
    fontSize: 14,
    textAlign: "center",
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
    position: "relative",
  },
  deletingCard: {
    opacity: 0.5,
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
  errorIconContainer: {
    backgroundColor: "rgba(255, 59, 48, 0.25)",
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
  deleteButtonCircle: {
    position: "absolute",
    top: "70%",
    right: 25,
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 107, 107, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
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
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  loadingText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
    marginTop: 10,
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  errorText: {
    color: "rgba(255, 107, 107, 0.7)",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
});
