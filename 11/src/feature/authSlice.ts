import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AuthUser = { id: string; name: string; email: string };
type AuthState = { user: AuthUser | null; isAuth: boolean };
const STORAGE_KEY = "demo-auth-user";

function loadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    if (
      typeof value === "object" &&
      value !== null &&
      "id" in value &&
      "name" in value &&
      "email" in value &&
      typeof value.id === "string" &&
      typeof value.name === "string" &&
      typeof value.email === "string" &&
      value.id === "demo-user" &&
      value.email === "student@example.com"
    ) {
      return { id: value.id, name: value.name, email: value.email };
    }
  } catch {
    /* Ignore corrupt browser storage */
  }
  return null;
}
const savedUser = loadUser();
const initialState: AuthState = { user: savedUser, isAuth: savedUser !== null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      state.isAuth = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuth = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;






export const saveDemoSession = (user: AuthUser) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
export const clearDemoSession = () => localStorage.removeItem(STORAGE_KEY);
