import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import HomeScreen from "../screens/Tab/HomeScreen";
import HistoriqueScreen from "../screens/Tab/HistoriqueScreen";
import styles from "./TabNavigatorStyles";
import CustomTabBar from "./CustomTabBar";
import { COLORS } from "./TabNavigatorStyles";

const Tab = createBottomTabNavigator();

// Composant personnalisé pour l'icône de l'onglet avec dégradé
function TabBarIcon({ focused, name, label }) {
  return (
    <View style={styles.tabItemContainer}>
      {focused ? (
        <LinearGradient
          colors={[COLORS.gradient.start, COLORS.gradient.end]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.iconGradient}
        >
          <Ionicons name={name} size={26} color={COLORS.white} />
        </LinearGradient>
      ) : (
        <View style={styles.iconInactive}>
          <Ionicons name={name} size={24} color={COLORS.inactive} />
        </View>
      )}
      <View style={styles.labelContainer}>
        <Text
          style={[
            styles.tabLabel,
            focused ? styles.tabLabelActive : styles.tabLabelInactive,
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {label}
        </Text>
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          display: "none", // Masquer la tabBar par défaut car nous utilisons une personnalisée
        },
        tabBarShowLabel: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
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

// Les styles ont été déplacés vers TabNavigatorStyles.js
