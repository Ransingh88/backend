import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
  status: "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.status = "authenticated";
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.status = "unauthenticated";
    },
    setAuth: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.status = "authenticated";
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.status = "unauthenticated";
    },
    setAuthLoading: (state) => {
      state.status = "loading";
    },
  },
});

export const { login, logout, setAuthLoading, setAuth, clearAuth } =
  authSlice.actions;

export default authSlice.reducer;
