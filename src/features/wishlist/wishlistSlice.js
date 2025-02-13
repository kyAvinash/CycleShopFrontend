import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://cycle-shop-backend-zeta.vercel.app";

// Fetch wishlist items
export const fetchWishlistItems = createAsyncThunk(
  "wishlist/fetchItems",
  async () => {
    const response = await axios.get(`${API_URL}/wishlist`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    //console.log("Fetched Wishlist Items:", response.data);
    return response.data;
  }
);

// Add to wishlist
export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/wishlist`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data; // Return the added item or updated wishlist
    } catch (error) {
      return rejectWithValue(error.response.data); // Return error message from the backend
    }
  }
);

// Remove from wishlist
export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeItem",
  async (productId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return productId; // Return the removed productId
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  wishlistItems: [],
  status: "idle",
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Wishlist Items
      .addCase(fetchWishlistItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWishlistItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.wishlistItems = action.payload;
      })
      .addCase(fetchWishlistItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Add to Wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.wishlistItems.push(action.payload); // Add the new item to the wishlist
        state.error = null; // Clear any previous errors
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to add to wishlist";
      })

      // Remove from Wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.wishlistItems = state.wishlistItems.filter(
          (item) => item._id !== action.payload
        ); // Remove the item from the wishlist
        state.error = null; // Clear any previous errors
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to remove from wishlist";
      });
  },
});

export default wishlistSlice.reducer;
