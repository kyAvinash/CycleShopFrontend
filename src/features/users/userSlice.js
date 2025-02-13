import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://cycle-shop-backend-zeta.vercel.app";

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ email, password }) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    localStorage.setItem("token", response.data.token);
    return response.data.user;
  }
);

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async ({ name, email, password }) => {
    const response = await axios.post(`${API_URL}/register`, {
      name,
      email,
      password,
    });
    localStorage.setItem("token", response.data.token);
    return response.data.user;
  }
);

export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  }
);

const initialState = {
  user: null,
  isLoggedIn: false,
  status: "idle",
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.status = "idle";
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = true;
        state.status = "succeeded";
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { logoutUser } = userSlice.actions;

export default userSlice.reducer;
