import React, { useState, useEffect } from "react";
import { View, Dimensions, Animated, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AnimatedCurveTabBar } from "./CurveTabBar";

const { width } = Dimensions.get("window");
const TAB_WIDTH = width / 2; // Pour 2 onglets

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(state.index);
  const insets = useSafeAreaInsets();

  // Animation pour l'opacité des icônes
  const fadeAnim = React.useMemo(() => ({
    0: new Animated.Value(state.index === 0 ? 1 : 0),
    1: new Animated.Value(state.index === 1 ? 1 : 0),
  }), []);

  // Animation pour l'échelle des icônes
  const scaleAnim = React.useMemo(() => ({
    0: new Animated.Value(state.index === 0 ? 1 : 0.8),
    1: new Animated.Value(state.index === 1 ? 1 : 0.8),
  }), []);

  // Mettre à jour les animations lorsque l'index change
  useEffect(() => {
    setSelectedTabIndex(state.index);
    
    // Animer tous les onglets
    state.routes.forEach((_, i) => {
      Animated.parallel([
        Animated.timing(fadeAnim[i], {
          toValue: state.index === i ? 1 : 0.5,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim[i], {
          toValue: state.index === i ? 1 : 0.85,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, [state.index, fadeAnim, scaleAnim, state.routes]);

  return (
    <View style={[
      styles.tabBarContainer, 
      { paddingBottom: insets.bottom > 0 ? insets.bottom : 10 }
    ]}>
      {/* Courbe animée qui suit l'onglet sélectionné */}
      <AnimatedCurveTabBar selectedTabIndex={selectedTabIndex} />
      
      {/* Conteneur des onglets */}
      <View style={styles.tabsContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Rendre le contenu de l'onglet (icône + label) avec les animations
          return (
            <Animated.View
              key={index}
              style={[
                styles.tabButton,
                {
                  opacity: fadeAnim[index],
                  transform: [{ scale: scaleAnim[index] }],
                },
              ]}
            >
              {options.tabBarIcon &&
                options.tabBarIcon({
                  focused: isFocused,
                  color: isFocused ? "#8E54E9" : "#516078",
                  size: 24,
                })}
              <View 
                style={[
                  styles.tabTouchable,
                  { width: TAB_WIDTH }
                ]} 
                onTouchEnd={onPress}
              />
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1E1B33",
    height: 80, // Hauteur de base, sera augmentée par le paddingBottom du safe area
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    overflow: "visible", // Pour que la courbe puisse déborder
  },
  tabsContainer: {
    flexDirection: "row",
    width: "100%",
    height: "100%",
    position: "relative",
    zIndex: 2,
  },
  tabButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  tabTouchable: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default CustomTabBar;
