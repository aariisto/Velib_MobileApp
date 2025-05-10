import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../../services";

// Thunks
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authService.login(email, password);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const response = await authService.register(username, email, password);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Nouveau thunk pour vérifier la validité du token
export const verifySession = createAsyncThunk(
  "auth/verifySession",
  async (_, { getState, rejectWithValue }) => {
    try {
      // Récupération du token depuis le state
      const { token } = getState().auth;

      // Si pas de token, rejeter la requête
      if (!token) {
        return rejectWithValue("Pas de token disponible");
      }

      // Vérification du token
      const response = await authService.verifyToken(token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: {
    id: null,
    username: null,
    email: null,
  },
  token: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action) => {
      state.user = {
        id: action.payload.user.id,
        username: action.payload.user.username,
        email: action.payload.user.email,
      };
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    clearCredentials: (state) => {
      state.user = {
        id: null,
        username: null,
        email: null,
      };
      state.token = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        // Extraction des données depuis la structure de réponse
        state.user = {
          id: action.payload.data.id,
          username: action.payload.data.username,
          email: action.payload.data.email,
        };
        state.token = action.payload.data.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = {
          id: null,
          username: null,
          email: null,
        };
        state.token = null;
        state.isLoading = false;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      }) // Verify Session
      .addCase(verifySession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifySession.fulfilled, (state, action) => {
        state.isLoading = false;
        // Vérifier si la réponse indique que le token est valide
        if (!action.payload.success) {
          // Si la vérification échoue, réinitialiser l'état
          state.user = {
            id: null,
            username: null,
            email: null,
          };
          state.token = null;
          state.isAuthenticated = false;
        }
        // Si la vérification réussit, on garde l'état courant
      })
      .addCase(verifySession.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        // La vérification a échoué, réinitialiser l'état
        state.user = {
          id: null,
          username: null,
          email: null,
        };
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, setCredentials, clearCredentials } =
  authSlice.actions;
export default authSlice.reducer;
