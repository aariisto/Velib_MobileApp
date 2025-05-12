import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { verifySession } from "../store/slices/authSlice";

/**
 * Composant de vérification de session
 * Ce composant est responsable de vérifier si l'utilisateur est authentifié
 * et de rediriger vers la page de connexion si nécessaire
 */
const SessionValidator = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Fonction pour vérifier la session
    const checkSession = async () => {
      // Si l'utilisateur est déjà authentifié selon le state Redux
      if (isAuthenticated) {
        try {
          // Dispatche l'action pour vérifier le token auprès du serveur
          const resultAction = await dispatch(verifySession()).unwrap();

          // Si la vérification a échoué, rediriger vers la page de login
          if (!resultAction.success) {
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          }
        } catch (error) {
          // En cas d'erreur, rediriger vers la page de login
          console.error("Erreur lors de la vérification de session:", error);
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        }
      } else {
        // Si pas authentifié, rediriger vers la page de login
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      }
    };

    // Exécuter la vérification
    checkSession();

    // Intervalle pour vérifier périodiquement la session (toutes les 5 minutes)
    const sessionCheckInterval = setInterval(checkSession, 5 * 60 * 1000);

    // Nettoyer l'intervalle lors du démontage du composant
    return () => clearInterval(sessionCheckInterval);
  }, [dispatch, navigation, isAuthenticated]);

  // Ce composant ne rend rien visuellement
  return null;
};

export default SessionValidator;
