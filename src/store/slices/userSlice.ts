import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  isAuthenticated: boolean;
  name: string | null;
  role: string | null;
  userId: string | null; 
  lastLoginTime: string | null;
  loading: boolean;
  error: string | null;
  token: string | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  name: null,
  role: null,
  userId: null,   
  lastLoginTime: null,
  token: null,
  loading: false,
  error: null,
};

export interface LoginSuccessPayload {
  name: string;
  role: string;
  userId: number;       
  time: string;
  token: string;
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<LoginSuccessPayload>) => {
      state.isAuthenticated = true;
      state.name = action.payload.name;
      state.role = action.payload.role;
      state.userId = `USER${String(action.payload.userId).padStart(3, "0")}`;
      state.lastLoginTime = action.payload.time;
      state.token = action.payload.token;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.name = null;
      state.role = null;
      state.userId = null;
      state.lastLoginTime = null;
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.name = null;
      state.role = null;
      state.userId = null;
      state.lastLoginTime = null;
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
} = userSlice.actions;

export default userSlice.reducer;
