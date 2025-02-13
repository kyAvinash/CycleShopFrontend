import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://cycle-shop-backend-zeta.vercel.app";

// Admin Login
export const adminLogin = createAsyncThunk(
  "admin/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/admin/login`, {
        email,
        password,
      });
      localStorage.setItem("adminToken", response.data.token);
      return response.data.admin;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Admin Signup
export const adminSignup = createAsyncThunk(
  "admin/signup",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/admin/signup`, {
        email,
        password,
      });
      return response.data.admin;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch Orders (Admin)
export const fetchAdminOrders = createAsyncThunk(
  "admin/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/admin/orders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update Order Status (Admin)
export const updateOrderStatus = createAsyncThunk(
  "admin/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/admin/orders/${orderId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch Contact Messages (Admin)
export const fetchAdminContacts = createAsyncThunk(
  "admin/fetchContacts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/admin/contacts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial State
const initialState = {
  admin: null,
  isAdminLoggedIn: !!localStorage.getItem("adminToken"),
  orders: [],
  contacts: [],
  status: "idle",
  error: null,
};

// Admin Slice
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    adminLogout: (state) => {
      state.admin = null;
      state.isAdminLoggedIn = false;
      state.orders = [];
      state.contacts = [];
      state.status = "idle";
      localStorage.removeItem("adminToken");
    },
  },
  extraReducers: (builder) => {
    builder
      // Admin Login
      .addCase(adminLogin.pending, (state) => {
        state.status = "loading";
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.admin = action.payload;
        state.isAdminLoggedIn = true;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })

      // Admin Signup
      .addCase(adminSignup.pending, (state) => {
        state.status = "loading";
      })
      .addCase(adminSignup.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.admin = action.payload;
      })
      .addCase(adminSignup.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })

      // Fetch Orders
      .addCase(fetchAdminOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload;
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })

      // Update Order Status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const index = state.orders.findIndex(
          (order) => order._id === action.payload._id
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })

      // Fetch Contacts
      .addCase(fetchAdminContacts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAdminContacts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.contacts = action.payload;
      })
      .addCase(fetchAdminContacts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      });
  },
});

export const { adminLogout } = adminSlice.actions;
export default adminSlice.reducer;
