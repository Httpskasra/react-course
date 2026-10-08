import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: "kasra",
    token: null,
    isAuth: false,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuth = action.payload.isAuth;
    },
    logout: (state) => {
      state.user = "null";
      state.token = null;
      state.isAuth = false;
    },
  },
});

export default authSlice.reducer;
export const { login, logout } = authSlice.actions;



