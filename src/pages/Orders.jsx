import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Orders = () => {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("https://cycle-shop-backend-zeta.vercel.app/orders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        // Sort orders by createdAt in descending order
        const sortedOrders = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to fetch orders. Please check your network connection."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await axios.put(
        `https://cycle-shop-backend-zeta.vercel.app/orders/${orderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update the order status in the state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: "Cancelled" } : order
        )
      );

      toast.success("Order cancelled successfully!");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to cancel order.");
    }
  };

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      {location.state?.success && (
        <div className="alert alert-success">{location.state.message}</div>
      )}

      <h2 className="mb-4">My Orders</h2>

      {orders.length === 0 ? (
        <div className="alert alert-info">
          No orders found. <Link to="/shop">Continue shopping</Link>
        </div>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <div key={order._id} className="col-12 mb-4">
              <div className="card">
                <div className="card-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Order #{order._id}</span>
                    <span
                      className={`badge bg-${
                        order.status === "Cancelled" ? "danger" : "primary"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-8">
                      <h5 className="card-title">Items</h5>
                      {order.items.map((item, index) => (
                        <div
                          key={`${order._id}-${item.productId?._id || index}`} // Fallback to index
                          className="d-flex align-items-center mb-2"
                        >
                          <img
                            src={
                              item.productId?.imageUrls?.[0] ||
                              "/placeholder.svg"
                            }
                            alt={item.productId?.name || "Product image"}
                            className="me-2"
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                            }}
                          />
                          <div>
                            <div>
                              {item.productId?.name || "Unnamed Product"}
                            </div>
                            <small className="text-muted">
                              Quantity: {item.quantity} × ₹
                              {item.productId?.price?.toFixed(2) || "0.00"}
                            </small>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="col-md-4">
                      <h5 className="card-title">Delivery Address</h5>
                      <p>
                        {order.address ? (
                          <>
                            {order.address.fullName || "N/A"}
                            {order.address.addressLine1 && (
                              <>
                                <br />
                                {order.address.addressLine1}
                              </>
                            )}
                            {order.address.addressLine2 && (
                              <>
                                <br />
                                {order.address.addressLine2}
                              </>
                            )}
                            <br />
                            {order.address.city || "City not specified"},{" "}
                            {order.address.state || "State not specified"} -{" "}
                            {order.address.pincode || "N/A"}
                            <br />
                            Phone: {order.address.phone || "N/A"}
                          </>
                        ) : (
                          "Address not provided"
                        )}
                      </p>
                      <hr />
                      <div className="d-flex justify-content-between">
                        <strong>Total Amount:</strong>
                        <strong>₹{order.totalAmount?.toFixed(2)}</strong>
                      </div>
                      <div className="mt-2">
                        <small className="text-muted">
                          Payment Method:{" "}
                          {order.paymentMethod?.toUpperCase() || "N/A"}
                        </small>
                      </div>
                      {/* Cancel Order Button */}
                      {order.status === "Pending" && (
                        <button
                          className="btn btn-danger mt-3"
                          onClick={() => handleCancelOrder(order._id)}
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
