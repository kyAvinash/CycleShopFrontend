import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/users/userSlice";
import { toast } from "react-toastify";

const DashBoard = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.users.user);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressFormData, setAddressFormData] = useState({
    fullName: "",
    phone: "",
    pincode: "",
    addressLine: "",
    city: "",
    state: "",
    country: "",
    isDefault: false,
  });
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    profilePicture: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  // Fetch user data and orders on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await fetch("https://cycle-shop-backend-zeta.vercel.app/users/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const ordersResponse = await fetch("https://cycle-shop-backend-zeta.vercel.app/orders", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUserData({
            name: userData.name,
            email: userData.email,
            phone: userData.phone || "",
            profilePicture: userData.profilePicture || "",
          });
          setAddresses(userData.addresses || []);
        }

        if (ordersResponse.ok) {
          const orderData = await ordersResponse.json();
          setOrders(orderData);
        }
      } catch (error) {
        toast.error("Error fetching data: " + error.message);
      }
    };

    fetchData();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingAddressId
        ? `https://cycle-shop-backend-zeta.vercel.app/users/me/addresses/${editingAddressId}`
        : "https://cycle-shop-backend-zeta.vercel.app/users/me/addresses";

      const response = await fetch(url, {
        method: editingAddressId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(addressFormData),
      });

      if (response.ok) {
        const updatedUser = await fetch("https://cycle-shop-backend-zeta.vercel.app/users/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }).then((res) => res.json());

        setAddresses(updatedUser.addresses || []);
        setShowAddressForm(false);
        setAddressFormData({
          fullName: "",
          phone: "",
          pincode: "",
          addressLine: "",
          city: "",
          state: "",
          country: "",
          isDefault: false,
        });
        setEditingAddressId(null);
        toast.success(editingAddressId ? "Address updated!" : "Address added!");
      } else {
        const errorData = await response.json();
        toast.error(
          errorData.message || "Failed to save address. Please try again."
        );
      }
    } catch (error) {
      toast.error("Error saving address: " + error.message);
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      const response = await fetch(
        `https://cycle-shop-backend-zeta.vercel.app/users/me/addresses/${addressId}/default`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.ok) {
        const updatedUser = await fetch("https://cycle-shop-backend-zeta.vercel.app/users/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }).then((res) => res.json());

        setAddresses(updatedUser.addresses || []);
        toast.success("Default address updated successfully!");
      } else {
        const errorData = await response.json();
        toast.error(
          errorData.message ||
            "Failed to set default address. Please try again."
        );
      }
    } catch (error) {
      toast.error("Error setting default address: " + error.message);
    }
  };

  const handleEditAddress = (address) => {
    setAddressFormData(address);
    setEditingAddressId(address._id);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const response = await fetch(
        `https://cycle-shop-backend-zeta.vercel.app/users/me/addresses/${addressId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.ok) {
        const updatedUser = await fetch("https://cycle-shop-backend-zeta.vercel.app/users/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }).then((res) => res.json());

        setAddresses(updatedUser.addresses || []);
        toast.success("Address deleted successfully!");
      } else {
        const errorData = await response.json();
        toast.error(
          errorData.message || "Failed to delete address. Please try again."
        );
      }
    } catch (error) {
      toast.error("Error deleting address: " + error.message);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch("https://cycle-shop-backend-zeta.vercel.app/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUserData({
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone || "",
          profilePicture: updatedUser.profilePicture,
        });
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      } else {
        const errorData = await response.json();
        toast.error(
          errorData.message || "Failed to update profile. Please try again."
        );
      }
    } catch (error) {
      toast.error("Error updating profile: " + error.message);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("Logged out successfully!");
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Welcome to Cycle Wala Dashboard</h1>

      {/* Profile Section */}
      {user && (
        <div className="card p-3 mb-4">
          <div className="d-flex align-items-center">
            <img
              src={userData.profilePicture || "/default-avatar.png"}
              alt="Profile"
              className="rounded-circle me-3"
              style={{ width: "80px", height: "80px", objectFit: "cover" }}
            />
            <div>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="form-control mb-2"
                    value={userData.name}
                    onChange={handleProfileChange}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="form-control mb-2"
                    value={userData.email}
                    onChange={handleProfileChange}
                  />
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone"
                    className="form-control mb-2"
                    value={userData.phone}
                    onChange={handleProfileChange}
                  />
                  <button
                    className="btn btn-success me-2"
                    onClick={handleSaveProfile}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <h5 className="mb-0">{userData.name}</h5>
                  <p className="text-muted mb-1">{userData.email}</p>
                  <p className="text-muted">Phone: {userData.phone || "N/A"}</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Address Section */}
      <div className="card mb-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">My Addresses</h5>
          <button
            className="btn btn-primary"
            onClick={() => {
              setShowAddressForm(!showAddressForm);
              setEditingAddressId(null);
              setAddressFormData({
                fullName: "",
                phone: "",
                pincode: "",
                addressLine: "",
                city: "",
                state: "",
                country: "",
                isDefault: false,
              });
            }}
          >
            {showAddressForm ? "Cancel" : "Add New Address"}
          </button>
        </div>
        <div className="card-body">
          {showAddressForm && (
            <form onSubmit={handleAddressSubmit} className="mb-4">
              <div className="row">
                {[
                  "fullName",
                  "phone",
                  "pincode",
                  "addressLine",
                  "city",
                  "state",
                  "country",
                ].map((field) => (
                  <div className="col-md-6 mb-3" key={field}>
                    <label className="form-label">
                      {field.replace(/([A-Z])/g, " $1")}
                    </label>
                    <input
                      type={
                        field === "phone" || field === "pincode"
                          ? "text"
                          : "text"
                      }
                      name={field}
                      className="form-control"
                      value={addressFormData[field]}
                      onChange={handleAddressChange}
                      required
                    />
                  </div>
                ))}
                <div className="col-12 mb-3">
                  <input
                    type="checkbox"
                    id="isDefault"
                    name="isDefault"
                    checked={addressFormData.isDefault}
                    onChange={handleAddressChange}
                  />
                  <label className="form-check-label ms-2" htmlFor="isDefault">
                    Set as default address
                  </label>
                </div>
              </div>
              <button type="submit" className="btn btn-success">
                {editingAddressId ? "Update Address" : "Save Address"}
              </button>
            </form>
          )}

          {addresses.length > 0 ? (
            <div className="row">
              {addresses.map((address) => (
                <div key={address._id} className="col-md-6 mb-3">
                  <div className="card">
                    <div className="card-body">
                      <h6 className="card-title">
                        {address.fullName}{" "}
                        {address.isDefault && (
                          <span className="badge bg-success ms-2">Default</span>
                        )}
                      </h6>
                      <p className="card-text">
                        {address.addressLine}, {address.city}, {address.state} -{" "}
                        {address.pincode}, {address.country}
                      </p>
                      <p className="text-muted">Phone: {address.phone}</p>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEditAddress(address)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm me-2"
                        onClick={() => handleDeleteAddress(address._id)}
                      >
                        Delete
                      </button>
                      {!address.isDefault && (
                        <button
                          className="btn btn-info btn-sm"
                          onClick={() => handleSetDefaultAddress(address._id)}
                        >
                          Set as Default
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">No addresses saved yet.</p>
          )}
        </div>
      </div>

      {/* Order History Section */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="mb-0">Order History</h5>
        </div>
        <div className="card-body">
          {orders.length > 0 ? (
            <div className="accordion" id="orderAccordion">
              {orders.map((order, index) => (
                <div key={order._id} className="accordion-item">
                  <h2 className="accordion-header" id={`orderHeading${index}`}>
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#orderCollapse${index}`}
                      aria-expanded="true"
                      aria-controls={`orderCollapse${index}`}
                    >
                      Order #{order._id} - ₹{order.totalAmount} {" "} - {" "}<span
                      className={`badge bg-${
                        order.status === "Cancelled" ? "danger" : "primary"
                      }`}
                    >
                      {order.status}
                    </span>
                    </button>
                  </h2>
                  <div
                    id={`orderCollapse${index}`}
                    className="accordion-collapse collapse"
                    aria-labelledby={`orderHeading${index}`}
                    data-bs-parent="#orderAccordion"
                  >
                    <div className="accordion-body">
                      <p>
                        <strong>Placed on:</strong>{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <ul>
                        {order.items.map((item) => (
                          <li key={item.productId._id}>
                            {item.productId.name} - {item.quantity} x ₹
                            {item.productId.price}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">No orders found.</p>
          )}
        </div>
      </div>

      {/* Logout Button */}
      <div className="text-center py-4">
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashBoard;
