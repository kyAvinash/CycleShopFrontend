import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Login from "./features/users/Login";
import DashBoard from "./components/DashBoard";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchUserProfile } from "./features/users/userSlice";
import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import Shop from "./features/cycles/Shop";
import Cart from "./features/cart/Cart";
import Wishlist from "./features/wishlist/Wishlist";
import ProductDetail from "./features/products/ProductDetail";
import Checkout from "./features/checkout/Checkout";
import AdminDashboard from "./features/admin/AdminDashboard";
import AdminLogin from "./features/admin/AdminLogin";
import Orders from "./pages/Orders";
import { fetchCartItems } from "./features/cart/cartSlice";
import { fetchWishlistItems } from "./features/wishlist/wishlistSlice";
import { ToastContainer } from "react-toastify";

function App() {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.users);
  const { isAdminLoggedIn } = useSelector((state) => state.admin);
  const location = useLocation(); // Get the current route location

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(fetchUserProfile());
      dispatch(fetchCartItems());
      dispatch(fetchWishlistItems());
    }
  }, [dispatch]);

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {/* Conditionally render Header if not an admin route */}
      {!isAdminRoute && <Header />}
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route
          path="/admin/login"
          element={
            isAdminLoggedIn ? (
              <Navigate to="/admin/dashboard" />
            ) : (
              <AdminLogin />
            )
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            isAdminLoggedIn ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/admin/login" />
            )
          }
        />
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/dashboard"
          element={isLoggedIn ? <DashBoard /> : <Navigate to="/" />}
        />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blogs" element={<Blog />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route
          path="/checkout"
          element={isLoggedIn ? <Checkout /> : <Navigate to="/" />}
        />
        <Route
          path="/orders"
          element={isLoggedIn ? <Orders /> : <Navigate to="/" />}
        />
      </Routes>
      {/* Conditionally render Footer if not an admin route */}
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;
