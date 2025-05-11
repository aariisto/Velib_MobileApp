import { StyleSheet, Platform, Dimensions } from "react-native";

// Constantes pour les dimensions
const { width } = Dimensions.get("window");
const TAB_WIDTH = width / 2; // Diviser la largeur de l'écran par le nombre d'onglets (2)

// Couleurs principales
const COLORS = {
  gradient: {
    start: "#4776E6",
    end: "#8E54E9",
  },
  background: "#1E1B33",
  active: "#8E54E9",
  inactive: "#516078", // Changé pour une couleur grise plus foncée/bleue pour meilleure visibilité
  text: {
    active: "#8E54E9",
    inactive: "#A0A8BD", // Plus visible que la version précédente
  },
  white: "#FFFFFF",
  shadow: "#000000",
};

export default StyleSheet.create({
  tabBar: {
    height: 75, // Légèrement agrandi pour plus d'espace
    backgroundColor: COLORS.background,
    borderTopWidth: 0,
    position: "absolute",
    elevation: 10,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    paddingTop: 5, // Ajouter un peu d'espace au-dessus
  },
  tabItemContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    width: TAB_WIDTH, // S'assurer que chaque onglet prend la moitié de la largeur
    height: "100%", // Utiliser toute la hauteur disponible
  },
  iconGradient: {
    width: 52, // Légèrement agrandi
    height: 52, // Légèrement agrandi
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.gradient.end,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 8,
  },
  iconInactive: {
    width: 44, // Légèrement agrandi
    height: 44, // Légèrement agrandi
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    // Ajout d'une légère ombre pour meilleure visibilité sur fond blanc
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  labelContainer: {
    marginTop: 5,
    alignItems: "center",
    width: TAB_WIDTH - 20, // Largeur ajustée pour s'assurer que le texte ne déborde pas
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    includeFontPadding: false, // Meilleur contrôle de la hauteur du texte
    // Ajout d'une ombre au texte pour meilleure visibilité
    ...Platform.select({
      ios: {
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 1,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  tabLabelActive: {
    color: COLORS.text.active,
  },
  tabLabelInactive: {
    color: COLORS.text.inactive,
  },
});
