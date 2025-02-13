import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../cart/cartSlice";
import { toast } from "react-toastify";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const user = useSelector((state) => state.users.user);

  const [selectedAddress, setSelectedAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  useEffect(() => {
    if (user?.addresses?.length > 0) {
      setSelectedAddress(
        user.addresses.find((addr) => addr.isDefault)?._id ||
          user.addresses[0]._id
      );
    }
  }, [user]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.productId?.price || 0) * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("You need to log in first!");
      navigate("/login");
      return;
    }

    if (!user || !selectedAddress) {
      toast.error("Please select a valid address.");
      return;
    }

    const addressDetails = user.addresses.find(
      (addr) => addr._id === selectedAddress
    );
    if (!addressDetails) {
      toast.error("Invalid address selection.");
      return;
    }

    const orderData = {
      items: cartItems.map((item) => ({
        productId: item.productId?._id || "",
        quantity: item.quantity,
        price: item.productId?.price || 0,
      })),
      totalAmount: subtotal,
      address: addressDetails,
      paymentMethod,
    };

    try {
      const response = await fetch("https://cycle-shop-backend-zeta.vercel.app/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(`Failed to place order: ${data.error || "Unknown error"}`);
        return;
      }

      toast.success("Order placed successfully!");
      dispatch(clearCart());
      navigate("/orders");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container my-5">
        <div className="alert alert-warning text-center">
          Your cart is empty. <a href="/shop">Continue shopping</a>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4">Checkout</h2>

      <div className="row">
        <div className="col-md-8">
          {/* Address Selection */}
          <div className="card mb-4">
            <div className="card-body">
              <h4 className="card-title mb-4">Select Delivery Address</h4>
              {user?.addresses?.length > 0 ? (
                <div className="row">
                  {user.addresses.map((address) => (
                    <div key={address._id} className="col-md-6 mb-3">
                      <div className="card">
                        <div className="card-body">
                          <div className="form-check">
                            <input
                              type="radio"
                              className="form-check-input"
                              name="address"
                              id={address._id}
                              value={address._id}
                              checked={selectedAddress === address._id}
                              onChange={(e) =>
                                setSelectedAddress(e.target.value)
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor={address._id}
                            >
                              <strong>{address.fullName}</strong>
                              {address.isDefault && (
                                <span className="badge bg-success ms-2">
                                  Default
                                </span>
                              )}
                              <br />
                              {address.addressLine}, {address.city},{" "}
                              {address.state} - {address.pincode}
                              <br />
                              Phone: {address.phone}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="alert alert-warning">
                  No addresses found. Please add an address in your profile.
                </div>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="card mb-4">
            <div className="card-body">
              <h4 className="card-title mb-4">Payment Method</h4>
              {["cod", "card", "upi"].map((method) => (
                <div className="form-check mb-2" key={method}>
                  <input
                    type="radio"
                    className="form-check-input"
                    name="paymentMethod"
                    id={method}
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label className="form-check-label" htmlFor={method}>
                    {method === "cod"
                      ? "Cash on Delivery"
                      : method === "card"
                      ? "Credit/Debit Card"
                      : "UPI"}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-4">Order Summary</h4>
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="d-flex justify-content-between mb-2"
                >
                  <span>
                    {item.productId?.name} × {item.quantity}
                  </span>
                  <span>
                    ₹{((item.productId?.price || 0) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <strong>Subtotal</strong>
                <strong>₹{subtotal.toFixed(2)}</strong>
              </div>
              <button
                className="btn btn-primary w-100 mt-3"
                onClick={handlePlaceOrder}
                disabled={!selectedAddress}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
