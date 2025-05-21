import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { register, clearError } from "../../store/slices/authSlice";

const RegisterScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // États pour les erreurs
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [termsError, setTermsError] = useState("");

  useEffect(() => {
    if (error) {
      Alert.alert("Erreur d'inscription", error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  // Fonction de validation du nom
  const validateName = (name) => {
    if (!name.trim()) {
      setNameError("Le nom est requis");
      return false;
    } else if (name.trim().length < 2) {
      setNameError("Le nom doit contenir au moins 2 caractères");
      return false;
    } else {
      setNameError("");
      return true;
    }
  };

  // Fonction de validation de l'email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("L'email est requis");
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError("Format d'email invalide");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  // Fonction de validation du mot de passe
  const validatePassword = (password) => {
    if (!password) {
      setPasswordError("Le mot de passe est requis");
      return false;
    } else if (password.length < 6) {
      setPasswordError("Le mot de passe doit contenir au moins 6 caractères");
      return false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setPasswordError(
        "Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule et un chiffre"
      );
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  // Fonction de validation de la confirmation du mot de passe
  const validateConfirmPassword = (confirmPassword) => {
    if (!confirmPassword) {
      setConfirmPasswordError("La confirmation du mot de passe est requise");
      return false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError("Les mots de passe ne correspondent pas");
      return false;
    } else {
      setConfirmPasswordError("");
      return true;
    }
  };

  // Fonction de validation des conditions d'utilisation
  const validateTerms = () => {
    if (!acceptTerms) {
      setTermsError("Vous devez accepter les conditions d'utilisation");
      return false;
    } else {
      setTermsError("");
      return true;
    }
  };

  // Fonction de validation du formulaire
  const handleRegister = async () => {
    console.log("Début de handleRegister");

    // Réinitialiser les erreurs
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setTermsError("");

    try {
      // Validation de base
      if (!name.trim()) {
        setNameError("Le nom est requis");
        return;
      }

      if (!email.trim()) {
        setEmailError("L'email est requis");
        return;
      }

      if (!password) {
        setPasswordError("Le mot de passe est requis");
        return;
      }

      if (password !== confirmPassword) {
        setConfirmPasswordError("Les mots de passe ne correspondent pas");
        return;
      }

      if (!acceptTerms) {
        setTermsError("Vous devez accepter les conditions d'utilisation");
        return;
      }

      console.log("Envoi des données:", {
        username: name,
        email,
        password,
      });

      dispatch(
        register({
          username: name,
          email,
          password,
        })
      ).then((action) => {
        if (!action.error) {
          Alert.alert(
            "Inscription réussie",
            "Votre compte a été créé avec succès !",
            [
              {
                text: "OK",
                onPress: () => {
                  console.log("Tentative de navigation vers Login");
                  navigation.reset({
                    index: 0,
                    routes: [{ name: "Login" }],
                  });
                },
              },
            ]
          );
        }
      });
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      Alert.alert(
        "Erreur d'inscription",
        error.message ||
          "Une erreur est survenue lors de l'inscription. Veuillez vérifier vos informations."
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <LinearGradient
        colors={["#0f0c29", "#302b63", "#24243e"]}
        style={styles.gradientContainer}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
          style={styles.container}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.headerContainer}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.title}>CRÉER UN COMPTE</Text>
              <View style={styles.line} />
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Nom complet"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  autoCapitalize="words"
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    if (nameError) validateName(text);
                  }}
                  onBlur={() => validateName(name)}
                />
                <Ionicons
                  name="person-outline"
                  size={22}
                  color="rgba(255, 255, 255, 0.7)"
                  style={styles.inputIcon}
                />
              </View>
              {nameError ? (
                <Text style={styles.errorText}>{nameError}</Text>
              ) : null}

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (emailError) validateEmail(text);
                  }}
                  onBlur={() => validateEmail(email)}
                />
                <Ionicons
                  name="mail-outline"
                  size={22}
                  color="rgba(255, 255, 255, 0.7)"
                  style={styles.inputIcon}
                />
              </View>
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Mot de passe"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (passwordError) validatePassword(text);
                    if (confirmPassword && confirmPasswordError)
                      validateConfirmPassword(confirmPassword);
                  }}
                  onBlur={() => validatePassword(password)}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.inputIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color="rgba(255, 255, 255, 0.7)"
                  />
                </TouchableOpacity>
              </View>
              {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : null}

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Confirmer mot de passe"
                  placeholderTextColor="rgba(255, 255, 255, 0.5)"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    if (confirmPasswordError) validateConfirmPassword(text);
                  }}
                  onBlur={() => validateConfirmPassword(confirmPassword)}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.inputIcon}
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? "eye-off-outline" : "eye-outline"
                    }
                    size={22}
                    color="rgba(255, 255, 255, 0.7)"
                  />
                </TouchableOpacity>
              </View>
              {confirmPasswordError ? (
                <Text style={styles.errorText}>{confirmPasswordError}</Text>
              ) : null}

              <TouchableOpacity
                style={styles.termsContainer}
                onPress={() => setAcceptTerms(!acceptTerms)}
              >
                <View
                  style={[
                    styles.checkbox,
                    acceptTerms && styles.checkboxChecked,
                  ]}
                >
                  {acceptTerms && (
                    <Ionicons name="checkmark" size={15} color="#fff" />
                  )}
                </View>
                <Text style={styles.termsText}>
                  J'accepte les{" "}
                  <Text style={styles.termsHighlight}>
                    Conditions d'utilisation
                  </Text>
                  et la{" "}
                  <Text style={styles.termsHighlight}>
                    Politique de confidentialité
                  </Text>
                </Text>
              </TouchableOpacity>
              {termsError ? (
                <Text style={styles.errorText}>{termsError}</Text>
              ) : null}

              <TouchableOpacity
                style={[
                  styles.registerButton,
                  isLoading && styles.disabledButton,
                ]}
                onPress={handleRegister}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={["#4776E6", "#8E54E9"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradient}
                >
                  <Text style={styles.registerButtonText}>
                    {isLoading ? "INSCRIPTION..." : "S'INSCRIRE"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Déjà un compte ?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text style={styles.loginLink}>Se connecter</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
  },
  headerContainer: {
    marginTop: 50,
    marginBottom: 30,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: 5,
    padding: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1,
    marginTop: 10,
  },
  line: {
    width: 60,
    height: 4,
    backgroundColor: "#8E54E9",
    marginTop: 12,
    borderRadius: 2,
  },
  formContainer: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    marginBottom: 5,
    height: 55,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    paddingHorizontal: 20,
    height: "100%",
  },
  inputIcon: {
    padding: 10,
    paddingRight: 15,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 12,
    marginBottom: 15,
    marginLeft: 5,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#8E54E9",
    borderColor: "#8E54E9",
  },
  termsText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    flex: 1,
  },
  termsHighlight: {
    color: "#8E54E9",
    fontWeight: "bold",
  },
  registerButton: {
    width: "100%",
    height: 55,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#8E54E9",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 0.7,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  loginText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    marginRight: 5,
  },
  loginLink: {
    color: "#8E54E9",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default RegisterScreen;
