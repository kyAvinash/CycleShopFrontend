import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../features/users/userSlice";
import cycleSlice from "../features/cycles/cycleSlice";
import cartSlice from "../features/cart/cartSlice";
import wishlistSlice from "../features/wishlist/wishlistSlice";
import adminSlice from "../features/admin/adminSlice";

const store = configureStore({
  reducer: {
    users: userSlice,
    cycles: cycleSlice,
    cart: cartSlice,
    wishlist: wishlistSlice,
    admin: adminSlice,
  },
});

export default store;
