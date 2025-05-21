import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

// Configuration personnalisée des toasts
export const toastConfig = {
  success: ({ text1, text2, ...props }) => (
    <LinearGradient
      colors={["#4776E6", "#8E54E9"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.toastContainer, styles.successToast]}
    >
      <View style={styles.toastContent}>
        <Text style={styles.toastTitle}>{text1}</Text>
        {text2 && <Text style={styles.toastMessage}>{text2}</Text>}
      </View>
    </LinearGradient>
  ),
  error: ({ text1, text2, ...props }) => (
    <LinearGradient
      colors={["#FF416C", "#FF4B2B"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.toastContainer, styles.errorToast]}
    >
      <View style={styles.toastContent}>
        <Text style={styles.toastTitle}>{text1}</Text>
        {text2 && <Text style={styles.toastMessage}>{text2}</Text>}
      </View>
    </LinearGradient>
  ),
  info: ({ text1, text2, ...props }) => (
    <LinearGradient
      colors={["#4776E6", "#8E54E9"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.toastContainer, styles.infoToast]}
    >
      <View style={styles.toastContent}>
        <Text style={styles.toastTitle}>{text1}</Text>
        {text2 && <Text style={styles.toastMessage}>{text2}</Text>}
      </View>
    </LinearGradient>
  ),
};

const styles = StyleSheet.create({
  toastContainer: {
    width: "90%",
    borderRadius: 12,
    marginHorizontal: "5%",
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 55,
  },
  successToast: {
    // Le dégradé est appliqué via LinearGradient
  },
  errorToast: {
    // Le dégradé est appliqué via LinearGradient
  },
  infoToast: {
    // Le dégradé est appliqué via LinearGradient
  },
  toastContent: {
    flexDirection: "column",
  },
  toastTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  toastMessage: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
  },
});
