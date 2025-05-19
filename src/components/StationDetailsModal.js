import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
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
  // Si aucun détail n'est disponible, afficher un état de chargement ou vide
  if (!stationDetails && !loading) {
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
                        <View style={styles.bikeType}>
                          <Ionicons name="bicycle" size={18} color="#fff" />
                          <Text style={styles.bikeTypeText}>
                            {mechanicalBikes}
                          </Text>
                        </View>
                        <View style={styles.bikeType}>
                          <Ionicons name="flash" size={18} color="#fff" />
                          <Text style={styles.bikeTypeText}>
                            {electricBikes}
                          </Text>
                        </View>
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
                      !isOperational && styles.reserveButtonDisabled,
                    ]}
                    disabled={!isOperational}
                    onPress={onReserve}
                  >
                    <LinearGradient
                      colors={
                        isOperational
                          ? ["#4776E6", "#8E54E9"]
                          : ["#9a9a9a", "#727272"]
                      }
                      style={styles.reserveButtonGradient}
                    >
                      <Text style={styles.reserveButtonText}>Réserver</Text>
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
  bikeTypeText: {
    color: "#fff",
    marginLeft: 4,
    fontWeight: "500",
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
