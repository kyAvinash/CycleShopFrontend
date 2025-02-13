import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://cycle-shop-backend-zeta.vercel.app";

export const fetchCartItems = createAsyncThunk("cart/fetchItems", async () => {
  const response = await axios.get(`${API_URL}/cart`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data;
});

export const addToCart = createAsyncThunk(
  "cart/addItem",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/cart`,
        { productId, quantity },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeItemFromCart = createAsyncThunk(
  "cart/removeItem",
  async (itemId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/cart/${itemId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return itemId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateItemQuantity",
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/cart/${itemId}`,
        { quantity },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const clearCart = createAsyncThunk("cart/clearCart", async () => {
  await axios.delete(`${API_URL}/cart`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return [];
});

const initialState = {
  cartItems: [],
  status: "idle",
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Optimistically add item to cart
    addItemOptimistically: (state, action) => {
      const { productId, quantity } = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item.productId === productId
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cartItems.push({
          productId,
          quantity,
          _id: Date.now().toString(), // Temporary ID
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cartItems = action.payload;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        // Replace the temporary item with the actual item from the backend
        const index = state.cartItems.findIndex(
          (item) => item._id === action.payload._id
        );
        if (index !== -1) {
          state.cartItems[index] = action.payload;
        }
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.cartItems = state.cartItems.filter(
          (item) => item._id !== action.payload
        );
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        const index = state.cartItems.findIndex(
          (item) => item._id === action.payload._id
        );
        if (index !== -1) {
          state.cartItems[index].quantity = action.payload.quantity;
        }
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.cartItems = [];
      });
  },
});

export const { addItemOptimistically } = cartSlice.actions;
export default cartSlice.reducer;
