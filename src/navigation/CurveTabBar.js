import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, Animated } from "react-native";
import Svg, { Path } from "react-native-svg";
import { COLORS } from "./TabNavigatorStyles";

const { width } = Dimensions.get("window");
const TAB_WIDTH = width / 2; // Pour 2 onglets
const CURVE_HEIGHT = 15;

/**
 * Composant pour créer une courbe sous l'onglet actif
 * Cette version utilise uniquement des valeurs numériques pour le path SVG
 */
const CurveTabBar = ({ tabWidth = TAB_WIDTH, position = 0 }) => {
  // État pour stocker le chemin SVG sous forme de chaîne
  const [pathD, setPathD] = useState("");

  // Calculer le chemin SVG lorsque la position change
  useEffect(() => {
    // S'assurer que la position est un nombre
    const posValue = Number(position);
    const center = tabWidth / 2;

    let path = `M0,0`; // Début du path
    path += ` L${posValue},0`; // Ligne jusqu'au début de la courbe

    // Premier arc (côté gauche)
    const leftControl = posValue + center / 3;
    const midPoint = posValue + center / 2;
    const centerPoint = posValue + center;
    path += ` C${leftControl},0 ${midPoint},${CURVE_HEIGHT} ${centerPoint},${CURVE_HEIGHT}`;

    // Deuxième arc (côté droit)
    const rightMidPoint = posValue + center + center / 2;
    const rightControl = posValue + center + (2 * center) / 3;
    const rightEnd = posValue + tabWidth;
    path += ` C${rightMidPoint},${CURVE_HEIGHT} ${rightControl},0 ${rightEnd},0`;

    // Fermer le chemin
    path += ` L${width},0`;

    setPathD(path);
  }, [position, tabWidth]);

  return (
    <View style={[styles.container]}>
      <Svg width={width} height={CURVE_HEIGHT}>
        <Path d={pathD} fill={COLORS.background} stroke="none" />
      </Svg>
    </View>
  );
};

/**
 * Version animée du composant CurveTabBar qui utilise uniquement des valeurs standards
 */
export const AnimatedCurveTabBar = ({ selectedTabIndex }) => {
  // État pour stocker la position actuelle (valeur numérique)
  const [position, setPosition] = useState(0);

  // Référence pour l'animation
  const animPosition = React.useRef(new Animated.Value(0)).current;

  // Mettre à jour la position lorsque l'onglet sélectionné change
  useEffect(() => {
    const newPosition = selectedTabIndex * TAB_WIDTH;

    // Configurer l'animation
    Animated.timing(animPosition, {
      toValue: newPosition,
      duration: 300,
      useNativeDriver: false, // Les chemins SVG ne prennent pas en charge le native driver
    }).start();

    // Mettre à jour directement la position pour le composant statique
    setPosition(newPosition);
  }, [selectedTabIndex, animPosition]);

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 0,
      }}
    >
      <CurveTabBar
        tabWidth={TAB_WIDTH}
        position={position} // Passer une valeur numérique standard
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: -CURVE_HEIGHT,
    left: 0,
    right: 0,
    zIndex: 10,
  },
});

export default CurveTabBar;
