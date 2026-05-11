import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";

type User = {
  id: string;
  email: string;
  name?: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  roles: string[];
  hasLocalPassword: boolean;
};

type SetCredentialsPayload = {
  user?: User | null;
  accessToken?: string | null;
  roles?: string[];
  hasLocalPassword?: boolean;
};

const initialState: AuthState = {
  user: null,
  token: null,
  roles: [],
  hasLocalPassword: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<SetCredentialsPayload>) => {
      const { user, accessToken, roles, hasLocalPassword } = action.payload;

      if (user !== undefined) state.user = user;
      if (accessToken !== undefined) state.token = accessToken;
      if (roles !== undefined) state.roles = roles;
      if (hasLocalPassword !== undefined) {
        state.hasLocalPassword = hasLocalPassword;
      }
    },

    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.roles = [];
      state.hasLocalPassword = false;
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;
export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentToken = (state: RootState) => state.auth.token;
export const selectCurrentRoles = (state: RootState) => state.auth.roles;
export const selectHasLocalPassword = (state: RootState) =>
  state.auth.hasLocalPassword;
