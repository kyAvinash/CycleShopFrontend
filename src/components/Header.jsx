import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { logoutUser } from "../features/users/userSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaHeart, FaUser, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";

const Header = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.users);
  const cartItems = useSelector((state) => state.cart.cartItems) || [];
  const wishlistItems =
    useSelector((state) => state.wishlist.wishlistItems) || []; // Fallback to empty array
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("Logged out successfully!");
    navigate("/"); // Redirect to home page after logout
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/shop"); // Navigate to shop page without a search query
    }
  };

  return (
    <header className="sticky-top">
      <nav
        className="navbar navbar-expand-lg navbar-dark"
        style={{ backgroundColor: "#1a1a1a", borderBottom: "3px solid gold" }}
      >
        <div className="container">
          <NavLink
            to="/"
            className="navbar-brand d-flex align-items-center text-white"
            style={{ textDecoration: "none" }}
          >
            <span style={{ fontSize: "30px", marginRight: "10px" }}>
              &#128690;
            </span>
            Cycle Wala
          </NavLink>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink className="nav-link text-white" to="/">
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link text-white" to="/shop">
                  Shop
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link text-white" to="/about">
                  About
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link text-white" to="/faq">
                  FAQ
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link text-white" to="/contact">
                  Contact
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link text-white" to="/blogs">
                  Blog
                </NavLink>
              </li>
            </ul>

            <ul className="navbar-nav ms-auto">
              {isLoggedIn ? (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link text-white" to="/cart">
                      <FaShoppingCart /> Cart ({cartItems.length})
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link text-white" to="/wishlist">
                      <FaHeart /> Wishlist ({wishlistItems.length})
                    </NavLink>
                  </li>
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle text-white"
                      href="#"
                      id="navbarDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <FaUser /> {user.name}
                    </a>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="navbarDropdown"
                    >
                      <li>
                        <NavLink className="dropdown-item" to="/dashboard">
                          Dashboard
                        </NavLink>
                      </li>
                      <li>
                        <NavLink className="dropdown-item" to="/orders">
                          Orders
                        </NavLink>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <NavLink className="nav-link text-white" to="/login">
                    <FaUser /> Login
                  </NavLink>
                </li>
              )}
            </ul>

            <form
              className="d-flex ms-lg-3 mt-2 mt-lg-0"
              style={{ maxWidth: "400px" }}
              onSubmit={handleSearch}
            >
              <input
                type="text"
                className="form-control"
                placeholder="Search for cycles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-outline-light ms-2" type="submit">
                <FaSearch />
              </button>
            </form>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
