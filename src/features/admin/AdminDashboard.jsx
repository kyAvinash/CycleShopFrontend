import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminOrders,
  fetchAdminContacts,
  updateOrderStatus,
  adminLogout,
} from "../admin/adminSlice";
import { useNavigate } from "react-router-dom";
import { Tab, Tabs } from "react-bootstrap";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orders, contacts, status, isAdminLoggedIn } = useSelector(
    (state) => state.admin
  );

  useEffect(() => {
    if (isAdminLoggedIn) {
      dispatch(fetchAdminOrders());
      dispatch(fetchAdminContacts());
    } else {
      navigate("/admin/login");
    }
  }, [dispatch, isAdminLoggedIn, navigate]);

  const handleUpdateStatus = async (orderId, status) => {
    await dispatch(updateOrderStatus({ orderId, status }));
  };

  const handleLogout = () => {
    dispatch(adminLogout());
    navigate("/admin/login");
  };

  if (status === "loading") {
    return (
      <div className="text-center mt-5">
        <h4>Loading...</h4>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      {/* Admin Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Admin Dashboard</h2>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Dashboard Tabs (Orders & Contacts) */}
      <Tabs defaultActiveKey="orders" className="mb-3">
        {/* Orders Section */}
        <Tab eventKey="orders" title="Orders">
          <div className="card shadow-sm p-3">
            <h4 className="mb-3 fw-bold">Manage Orders</h4>
            <div className="table-responsive">
              <table className="table table-hover table-bordered text-center">
                <thead className="table-dark">
                  <tr>
                    <th>Order ID</th>
                    <th>User</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                    <th>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order._id}>
                        <td>{order._id}</td>
                        <td>{order.userId?.name || "Unknown"}</td>
                        <td>₹{order.totalAmount.toFixed(2)}</td>
                        <td>
                          <span
                            className={`badge bg-${
                              order.status === "Delivered"
                                ? "success"
                                : order.status === "Cancelled"
                                ? "danger"
                                : "warning"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td>
                          {/* Disable dropdown for Cancelled or Delivered orders */}
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleUpdateStatus(order._id, e.target.value)
                            }
                            className="form-select"
                            disabled={
                              order.status === "Cancelled" ||
                              order.status === "Delivered"
                            }
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">No orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Tab>

        {/* Contact Messages Section */}
        <Tab eventKey="contacts" title="Contact Messages">
          <div className="card shadow-sm p-3">
            <h4 className="mb-3 fw-bold">Customer Messages</h4>
            <div className="table-responsive">
              <table className="table table-hover table-bordered text-center">
                <thead className="table-dark">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Message</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.length > 0 ? (
                    contacts.map((contact) => (
                      <tr key={contact._id}>
                        <td>{contact.name}</td>
                        <td>{contact.email}</td>
                        <td>{contact.message}</td>
                        <td>{new Date(contact.createdAt).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">No contact messages found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
