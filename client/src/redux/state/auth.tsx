import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";

type AuthState = {
  user: string | null;
  accessToken: string | null;
  roles: string[];
  hasLocalPassword: boolean;
  isInitialized: boolean;
};

type SetCredentialsPayload = {
  user?: string | null;
  accessToken?: string | null;
  roles?: string[];
  hasLocalPassword?: boolean;
};

const initialState: AuthState = {
  user: null,
  accessToken: null,
  roles: [],
  hasLocalPassword: false,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<SetCredentialsPayload>) => {
      const { user, accessToken, roles, hasLocalPassword } = action.payload;

      if (user !== undefined) state.user = user;
      if (accessToken !== undefined) state.accessToken = accessToken;
      if (roles !== undefined) state.roles = roles;
      if (hasLocalPassword !== undefined) {
        state.hasLocalPassword = hasLocalPassword;
      }
    },

    logOut: (state) => {
      state.user = null;
      state.accessToken = null;
      state.roles = [];
      state.hasLocalPassword = false;
      state.isInitialized = true;
    },
    setInitialized: (state) => {
      state.isInitialized = true;
    },
  },
});

export const { setCredentials, logOut, setInitialized } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentToken = (state: RootState) => state.auth.accessToken;
export const selectCurrentRoles = (state: RootState) => state.auth.roles;
export const selectHasLocalPassword = (state: RootState) =>
  state.auth.hasLocalPassword;
export const isInitialized = (state: RootState) => state.auth.isInitialized;
