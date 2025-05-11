import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import HomeScreen from "../screens/Tab/HomeScreen";
import HistoriqueScreen from "../screens/Tab/HistoriqueScreen";

const Tab = createBottomTabNavigator();

// Composant personnalisé pour l'icône de l'onglet avec dégradé
function TabBarIcon({ focused, name, label }) {
  return (
    <View style={styles.tabItemContainer}>
      {focused ? (
        <LinearGradient
          colors={["#4776E6", "#8E54E9"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.iconGradient}
        >
          <Ionicons name={name} size={24} color="#fff" />
        </LinearGradient>
      ) : (
        <View style={styles.iconInactive}>
          <Ionicons name={name} size={22} color="rgba(255, 255, 255, 0.7)" />
        </View>
      )}
      <Text
        style={[
          styles.tabLabel,
          focused ? styles.tabLabelActive : styles.tabLabelInactive,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="home" label="Accueil" />
          ),
        }}
      />
      <Tab.Screen
        name="historique"
        component={HistoriqueScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} name="time" label="Historique" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 70,
    backgroundColor: "#1E1B33", // Couleur sombre harmonisée avec le dégradé
    borderTopWidth: 0,
    position: "absolute",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  tabItemContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  iconGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#8E54E9",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
  },
  iconInactive: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  tabLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "bold",
  },
  tabLabelActive: {
    color: "#8E54E9",
  },
  tabLabelInactive: {
    color: "rgba(255, 255, 255, 0.5)",
  },
});
