import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCartItems,
  removeItemFromCart,
  updateCartItemQuantity,
  clearCart,
} from "./cartSlice";
import { Link, NavLink } from "react-router-dom";
import { toast } from "react-toastify";

const Cart = () => {
  const dispatch = useDispatch();
  const { cartItems, status } = useSelector((state) => state.cart);
  const { isLoggedIn } = useSelector((state) => state.users);
  const [localCart, setLocalCart] = useState([]);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchCartItems());
    }
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    setLocalCart(cartItems);
  }, [cartItems]);

  const handleRemove = (itemId) => {
    dispatch(removeItemFromCart(itemId))
      .unwrap()
      .then(() => {
        toast.success("Item removed from cart successfully!");
      })
      .catch((error) => {
        toast.error(error.message || "Failed to remove item from cart");
      });
  };

  const handleClearCart = () => {
    dispatch(clearCart())
      .unwrap()
      .then(() => {
        toast.success("Cart cleared successfully!");
      })
      .catch((error) => {
        toast.error(error.message || "Failed to clear cart");
      });
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity > 0) {
      setLocalCart((prevCart) =>
        prevCart.map((item) =>
          item._id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );

      // Dispatch the action to update the backend
      dispatch(updateCartItemQuantity({ itemId, quantity: newQuantity }))
        .unwrap()
        .then(() => {
          toast.success("Quantity updated successfully!");
        })
        .catch((error) => {
          toast.error(error.message || "Failed to update quantity");
        });
    }
  };

  const calculateTotal = () => {
    return localCart.reduce((total, item) => {
      if (item.productId) {
        return total + item.productId.price * item.quantity;
      }
      return total;
    }, 0);
  };

  if (!isLoggedIn) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          Please login to view your cart.
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Your Cart</h2>
      {localCart.length === 0 ? (
        <div className="alert alert-info">
          Your cart is empty. <Link to="/shop">Continue shopping</Link>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-8">
            {localCart.map((item) =>
              item.productId ? (
                <div key={item._id} className="card mb-3">
                  <div className="row g-0">
                    <div className="col-md-4">
                      <NavLink
                        to={`/product/${item.productId._id}`}
                        className="nav-link"
                      >
                        <img
                          src={
                            item.productId.imageUrls?.[0] || "/placeholder.svg"
                          }
                          alt={item.productId.name || "No Name"}
                          className="img-fluid rounded-start"
                          style={{ height: "200px", objectFit: "cover" }}
                        />
                      </NavLink>
                    </div>
                    <div className="col-md-8">
                      <div className="card-body">
                        <NavLink
                          to={`/product/${item.productId._id}`}
                          className="nav-link"
                        >
                          <h5 className="card-title">{item.productId.name}</h5>
                        </NavLink>
                        <p className="card-text">
                          Price: ₹
                          {item.productId.price?.toLocaleString() || "N/A"}
                        </p>
                        <div className="d-flex align-items-center mb-3">
                          <label
                            htmlFor={`quantity-${item._id}`}
                            className="me-2"
                          >
                            Quantity:
                          </label>
                          <input
                            type="number"
                            id={`quantity-${item._id}`}
                            className="form-control"
                            style={{ width: "70px" }}
                            value={item.quantity}
                            min="1"
                            onChange={(e) =>
                              handleQuantityChange(
                                item._id,
                                Number.parseInt(e.target.value)
                              )
                            }
                          />
                        </div>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleRemove(item._id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null
            )}
          </div>
          <div className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Order Summary</h5>
                <p className="card-text">Total Items: {localCart.length}</p>
                <p className="card-text">
                  Total: ₹{calculateTotal().toLocaleString()}
                </p>
                {localCart.length > 0 && (
                  <button
                    className="btn btn-danger w-100 mb-2"
                    onClick={handleClearCart}
                  >
                    Clear Cart
                  </button>
                )}
                <Link to="/checkout" className="btn btn-success w-100">
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
