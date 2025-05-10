import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers } from "redux";
import authReducer from "./slices/authSlice";

// Configuration de persistance pour le slice auth
const authPersistConfig = {
  key: "auth",
  storage: AsyncStorage,
  whitelist: ["user", "token", "isAuthenticated"], // Éléments à persister
};

// Combinaison des reducers avec persistance
const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  // Ajoutez d'autres reducers ici si nécessaire
});

// Configuration du store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

// Création du persistor
export const persistor = persistStore(store);
