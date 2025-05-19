import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Animated,
  Vibration,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

/**
 * Modal qui affiche les détails d'une station Vélib
 */
const StationDetailsModal = ({
  visible,
  onClose,
  station,
  stationDetails,
  loading,
  onReserve,
}) => {
  const [selectedBikeType, setSelectedBikeType] = useState(null); // 'mechanical' ou 'electric'
  const [showSelectionMessage, setShowSelectionMessage] = useState(false);
  const slideAnim = useRef(new Animated.Value(400)).current;
  const mechanicalBikeAnim = useRef(new Animated.Value(1)).current;
  const electricBikeAnim = useRef(new Animated.Value(1)).current;

  // Animation pour l'ouverture du modal
  useEffect(() => {
    if (visible) {
      slideAnim.setValue(400);
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 7,
      }).start();
    }
  }, [visible, slideAnim]);
  // Animation pour mettre en évidence les boutons de sélection
  const animateBikeButtons = () => {
    Vibration.vibrate(100); // Légère vibration pour indiquer qu'une selection est requise
    setShowSelectionMessage(true);

    // Animation séquencée pour les deux boutons
    Animated.sequence([
      Animated.parallel([
        // Animation pour le vélo mécanique
        Animated.sequence([
          Animated.timing(mechanicalBikeAnim, {
            toValue: 1.4,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(mechanicalBikeAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]),
        // Animation pour le vélo électrique
        Animated.sequence([
          Animated.timing(electricBikeAnim, {
            toValue: 1.4,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(electricBikeAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]),
      ]),
      // Deuxième séquence d'animation
      Animated.parallel([
        Animated.sequence([
          Animated.timing(mechanicalBikeAnim, {
            toValue: 1.4,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(mechanicalBikeAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(electricBikeAnim, {
            toValue: 1.4,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(electricBikeAnim, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();

    // Masquer le message après 3 secondes
    setTimeout(() => {
      setShowSelectionMessage(false);
    }, 3000);
  };

  // Gestion de la sélection d'un type de vélo
  const handleBikeTypeSelect = (type) => {
    setSelectedBikeType(type);
    setShowSelectionMessage(false);
  };

  // Gestion du bouton de réservation
  const handleReservePress = () => {
    if (!selectedBikeType) {
      animateBikeButtons();
      return;
    }
    onReserve(selectedBikeType);
  };

  // Réinitialiser la sélection quand le modal se ferme
  useEffect(() => {
    if (!visible) {
      setSelectedBikeType(null);
      setShowSelectionMessage(false);
    }
  }, [visible]);

  // Si aucun détail n'est disponible et pas de chargement, ne rien afficher
  if (!stationDetails && !loading && !visible) {
    return null;
  }

  // Vérifier si la station est opérationnelle (installée et disponible pour location)
  const isOperational =
    stationDetails &&
    stationDetails.is_installed === 1 &&
    stationDetails.is_renting === 1;

  // Vérifier si la station peut recevoir des vélos
  const canReturnBikes = stationDetails && stationDetails.is_returning === 1;

  // Compter le nombre de vélos mécaniques et électriques
  const mechanicalBikes =
    stationDetails &&
    stationDetails.num_bikes_available_types &&
    stationDetails.num_bikes_available_types.find(
      (type) => type.mechanical !== undefined
    )
      ? stationDetails.num_bikes_available_types.find(
          (type) => type.mechanical !== undefined
        ).mechanical
      : 0;

  const electricBikes =
    stationDetails &&
    stationDetails.num_bikes_available_types &&
    stationDetails.num_bikes_available_types.find(
      (type) => type.ebike !== undefined
    )
      ? stationDetails.num_bikes_available_types.find(
          (type) => type.ebike !== undefined
        ).ebike
      : 0;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <LinearGradient
              colors={["#302b63", "#24243e"]}
              style={styles.modalContent}
            >
              {/* Bouton de fermeture */}
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close-circle" size={28} color="#fff" />
              </TouchableOpacity>

              {/* Contenu du modal */}
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#4776E6" />
                  <Text style={styles.loadingText}>
                    Chargement des détails...
                  </Text>
                </View>
              ) : (
                <View style={styles.detailsContainer}>
                  {/* Titre avec nom de la station */}
                  <Text style={styles.stationName}>
                    {station ? station.name : "Station Vélib"}
                  </Text>
                  {/* Statut de la station */}
                  <View style={styles.statusContainer}>
                    <View
                      style={[
                        styles.statusIndicator,
                        {
                          backgroundColor: isOperational
                            ? "#4cd964"
                            : "#ff3b30",
                        },
                      ]}
                    />
                    <Text style={styles.statusText}>
                      {isOperational
                        ? "Station disponible"
                        : "Station indisponible"}
                    </Text>
                  </View>
                  {/* Contenu des informations */}
                  <View style={styles.infoContainer}>
                    {/* Disponibilité des vélos */}
                    <View style={styles.infoBox}>
                      <Text style={styles.infoTitle}>Vélos disponibles</Text>
                      <Text style={styles.infoValue}>
                        {stationDetails
                          ? stationDetails.numBikesAvailable
                          : "-"}
                      </Text>
                      <View style={styles.bikeTypesContainer}>
                        <Animated.View
                          style={{
                            transform: [{ scale: mechanicalBikeAnim }],
                          }}
                        >
                          <TouchableOpacity
                            style={[
                              styles.bikeType,
                              selectedBikeType === "mechanical" &&
                                styles.bikeTypeSelected,
                              mechanicalBikes <= 0 && styles.bikeTypeDisabled,
                            ]}
                            onPress={() =>
                              mechanicalBikes > 0 &&
                              handleBikeTypeSelect("mechanical")
                            }
                            disabled={mechanicalBikes <= 0}
                          >
                            <Ionicons
                              name="bicycle"
                              size={16}
                              color={
                                selectedBikeType === "mechanical"
                                  ? "#4776E6"
                                  : "#fff"
                              }
                            />
                            <Text
                              style={[
                                styles.bikeTypeText,
                                selectedBikeType === "mechanical" &&
                                  styles.bikeTypeTextSelected,
                              ]}
                            >
                              {mechanicalBikes || "0"}
                            </Text>
                          </TouchableOpacity>
                        </Animated.View>
                        <Animated.View
                          style={{
                            transform: [{ scale: electricBikeAnim }],
                          }}
                        >
                          <TouchableOpacity
                            style={[
                              styles.bikeType,
                              selectedBikeType === "electric" &&
                                styles.bikeTypeSelected,
                              electricBikes <= 0 && styles.bikeTypeDisabled,
                            ]}
                            onPress={() =>
                              electricBikes > 0 &&
                              handleBikeTypeSelect("electric")
                            }
                            disabled={electricBikes <= 0}
                          >
                            <Ionicons
                              name="flash"
                              size={16}
                              color={
                                selectedBikeType === "electric"
                                  ? "#4776E6"
                                  : "#fff"
                              }
                            />
                            <Text
                              style={[
                                styles.bikeTypeText,
                                selectedBikeType === "electric" &&
                                  styles.bikeTypeTextSelected,
                              ]}
                            >
                              {electricBikes || "0"}
                            </Text>
                          </TouchableOpacity>
                        </Animated.View>
                      </View>
                    </View>

                    {/* Places disponibles */}
                    <View style={styles.infoBox}>
                      <Text style={styles.infoTitle}>Places libres</Text>
                      <Text style={styles.infoValue}>
                        {stationDetails
                          ? stationDetails.numDocksAvailable
                          : "-"}
                      </Text>
                      <View style={styles.returnStatusContainer}>
                        <Ionicons
                          name="arrow-down-circle"
                          size={18}
                          color={canReturnBikes ? "#4cd964" : "#8e8e93"}
                        />
                        <Text
                          style={[
                            styles.returnStatusText,
                            { color: canReturnBikes ? "#4cd964" : "#8e8e93" },
                          ]}
                        >
                          {canReturnBikes
                            ? "Retour possible"
                            : "Retour impossible"}
                        </Text>
                      </View>
                    </View>
                  </View>
                  {/* Message de sélection */}
                  {showSelectionMessage && (
                    <View style={styles.messageContainer}>
                      <Text style={styles.selectionMessage}>
                        Veuillez sélectionner un type de vélo
                      </Text>
                    </View>
                  )}
                  {/* Infos supplémentaires */}
                  <View style={styles.additionalInfo}>
                    <Text style={styles.additionalInfoText}>
                      Code station:{" "}
                      {stationDetails ? stationDetails.stationCode : "-"}
                    </Text>
                    <Text style={styles.additionalInfoText}>
                      Dernière mise à jour:{" "}
                      {stationDetails && stationDetails.last_reported
                        ? new Date(
                            stationDetails.last_reported * 1000
                          ).toLocaleTimeString()
                        : "-"}
                    </Text>
                  </View>
                  {/* Bouton de réservation */}
                  <TouchableOpacity
                    style={[
                      styles.reserveButton,
                      (!isOperational || !selectedBikeType) &&
                        styles.reserveButtonDisabled,
                    ]}
                    disabled={!isOperational}
                    onPress={handleReservePress}
                  >
                    <LinearGradient
                      colors={
                        isOperational && selectedBikeType
                          ? ["#4776E6", "#8E54E9"]
                          : ["#9a9a9a", "#727272"]
                      }
                      style={styles.reserveButtonGradient}
                    >
                      <Text style={styles.reserveButtonText}>
                        {selectedBikeType
                          ? `Réserver un vélo ${
                              selectedBikeType === "mechanical"
                                ? "mécanique"
                                : "électrique"
                            }`
                          : "Réserver"}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
            </LinearGradient>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#302b63",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    minHeight: "50%",
  },
  closeButton: {
    position: "absolute",
    right: 20,
    top: 20,
    zIndex: 1,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 16,
  },
  detailsContainer: {
    paddingTop: 20,
  },
  stationName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
    paddingRight: 30,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  infoContainer: {
    flexDirection: "row",
    marginBottom: 20,
    justifyContent: "space-between",
  },
  infoBox: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    padding: 15,
    width: "48%",
    alignItems: "center",
  },
  infoTitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  bikeTypesContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 5,
  },
  bikeType: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  bikeTypeSelected: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderColor: "#4776E6",
  },
  bikeTypeDisabled: {
    opacity: 0.4,
  },
  bikeTypeText: {
    color: "#fff",
    marginLeft: 5,
    fontSize: 12,
  },
  bikeTypeTextSelected: {
    color: "#302b63",
  },
  returnStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  returnStatusText: {
    marginLeft: 5,
    fontSize: 12,
  },
  messageContainer: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    padding: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  selectionMessage: {
    color: "#ff9500",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  additionalInfo: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  additionalInfoText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    marginBottom: 5,
  },
  reserveButton: {
    marginTop: 10,
  },
  reserveButtonDisabled: {
    opacity: 0.7,
  },
  reserveButtonGradient: {
    borderRadius: 15,
    padding: 16,
    alignItems: "center",
  },
  reserveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default StationDetailsModal;
