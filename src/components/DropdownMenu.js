import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const DropdownMenu = ({ onSelect }) => {
  const [visible, setVisible] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const buttonRef = React.useRef(null);

  const measureButton = () => {
    if (buttonRef.current) {
      buttonRef.current.measure((x, y, width, height, pageX, pageY) => {
        setMenuPosition({
          top: pageY + height + 5, // Position 5 pixels below the button
          right: 10,
        });
      });
    }
  };

  const toggleDropdown = () => {
    if (visible) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }).start(() => {
        setVisible(false);
      });
    } else {
      measureButton();
      setVisible(true);
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5)),
      }).start();
    }
  };

  const handleSelect = (option) => {
    onSelect && onSelect(option);
    toggleDropdown();
  };

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-15, 0],
  });

  const scale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        ref={buttonRef}
        onPress={toggleDropdown}
        style={styles.iconButton}
      >
        <Ionicons name="menu" size={24} color="white" />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="none">
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={toggleDropdown}>
            <View style={styles.modalBackdrop} />
          </TouchableWithoutFeedback>

          <Animated.View
            style={[
              styles.dropdown,
              {
                top: menuPosition.top,
                right: menuPosition.right,
                opacity,
                transform: [{ translateY }, { scale }],
              },
            ]}
          >
            <TouchableOpacity
              style={[styles.option, { marginTop: 2 }]}
              onPress={() => handleSelect("settings")}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="settings-outline" size={20} color="white" />
              </View>
              <Text style={styles.optionText}>Paramètres</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={[styles.option, { marginBottom: 2 }]}
              onPress={() => handleSelect("logout")}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="exit-outline" size={20} color="white" />
              </View>
              <Text style={styles.optionText}>Déconnexion</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  iconButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    backgroundColor: "rgba(67, 67, 113, 0.6)",
    marginLeft: 8,
  },
  overlay: {
    flex: 1,
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  dropdown: {
    position: "absolute",
    width: 190,
    backgroundColor: "#1C1C35",
    borderRadius: 15,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 6,
    zIndex: 1000,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingHorizontal: 20,
  },
  optionText: {
    color: "white",
    fontSize: 15,
    marginLeft: 12,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    marginHorizontal: 10,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(79, 79, 128, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DropdownMenu;
