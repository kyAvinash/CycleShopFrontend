import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://cycle-shop-backend-zeta.vercel.app";

export const fetchCycles = createAsyncThunk("cycles/fetchCycles", async () => {
  const response = await axios.get(`${API_URL}/products`);
  return response.data;
});

const initialState = {
  cycles: [],
  status: "idle",
  error: null,
};

const cycleSlice = createSlice({
  name: "cycles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCycles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCycles.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cycles = action.payload;
      })
      .addCase(fetchCycles.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default cycleSlice.reducer;
