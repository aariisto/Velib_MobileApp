import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import HomeScreen from "../screens/Tab/HomeScreen";
import HistoriqueScreen from "../screens/Tab/HistoriqueScreen";
import styles from "./TabNavigatorStyles";

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
          <Ionicons name={name} size={26} color="#fff" />
        </LinearGradient>
      ) : (
        <View style={styles.iconInactive}>
          <Ionicons name={name} size={24} color="#516078" />
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

// Les styles ont été déplacés vers TabNavigatorStyles.js
