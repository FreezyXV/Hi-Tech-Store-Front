import React, { useEffect, useState } from "react";
import { fetchUserProfile, changeUserPassword } from "../services/api";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import "../assets/auth.css";

const Account = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [changePasswordError, setChangePasswordError] = useState("");
  const [changePasswordSuccess, setChangePasswordSuccess] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const getUserProfileData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate("/login");
          return;
        }
        const response = await fetchUserProfile(token);
        if (response) {
          setUser(response);
        } else {
          setError("User data is unavailable");
        }
      } catch (err) {
        setError(err.message || "Error fetching user profile");
      } finally {
        setLoading(false);
      }
    };

    const fetchWishlistFromLocalStorage = () => {
      try {
        const storedWishlist = localStorage.getItem("wishlist");
        setWishlist(storedWishlist ? JSON.parse(storedWishlist) : []);
      } catch (err) {
        console.error("Error loading wishlist from localStorage:", err);
      }
    };

    getUserProfileData();
    fetchWishlistFromLocalStorage();
  }, [navigate]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setChangePasswordError("");
    setChangePasswordSuccess("");

    if (newPassword !== confirmNewPassword) {
      setChangePasswordError("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setChangePasswordError("New password must be at least 6 characters long");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("No token found");
      await changeUserPassword(token, { currentPassword, newPassword });
      setChangePasswordSuccess("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setShowChangePassword(false);
    } catch (err) {
      setChangePasswordError(err.message || "Error changing password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrders((prevState) => ({
      ...prevState,
      [orderId]: !prevState[orderId],
    }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{`Error: ${error}`}</div>;
  if (!user) return <div>Error: User data is unavailable</div>;

  return (
    <div className="body">
      <h1 className="account-title">Account</h1>
      <div className="account-container">
        <p>
          Welcome, <strong>{user.username}</strong>!
        </p>
        <p>
          Email: <strong>{user.email}</strong>
        </p>
        <p>
          Account Created On:{" "}
          <strong>{new Date(user.createdAt).toLocaleDateString()}</strong>
        </p>

        <div className="account-options">
          <button className="account-button" onClick={handleLogout}>
            Logout
          </button>
          <button
            className="account-button"
            onClick={() => setShowChangePassword(!showChangePassword)}
          >
            {showChangePassword ? "Cancel" : "Change Password"}
          </button>
        </div>

        {showChangePassword && (
          <div className="change-password-section">
            <form onSubmit={handleChangePassword}>
              <InputField
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <InputField
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <InputField
                label="Confirm New Password"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />
              <button type="submit" className="account-button">
                Change Password
              </button>
            </form>
            {changePasswordError && (
              <div className="error">{changePasswordError}</div>
            )}
            {changePasswordSuccess && (
              <div className="success">{changePasswordSuccess}</div>
            )}
          </div>
        )}
      </div>
      <div className="order-wishlist-containers">
        {/* Orders Section */}
        <div className="ordershistory-container">
          <h2>Your Orders</h2>
          {user.orders && user.orders.length > 0 ? (
            user.orders.map((order) => (
              <div key={order._id} className="order-card">
                <p className="order-info">
                  <strong>Order ID:</strong> {order._id}
                </p>
                <p className="order-info">
                  <strong>Date:</strong>{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="order-info">
                  <strong>Status:</strong> {order.status}
                </p>
                <p className="order-info">
                  <strong>Total:</strong> €
                  {order.totalAmount?.toFixed(2) || "N/A"}
                </p>
                <button
                  onClick={() => toggleOrderDetails(order._id)}
                  className="toggle-order-details-btn"
                >
                  {expandedOrders[order._id] ? "Hide Details" : "Show Details"}
                </button>
                {expandedOrders[order._id] && (
                  <ul className="order-items-list">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item) => {
                        const imageUrl =
                          item.variant?.imageUrls?.[0] ||
                          "https://via.placeholder.com/150";
                        return (
                          <li
                            key={item.variant?._id || item._id}
                            className="order-item"
                          >
                            <img
                              src={imageUrl}
                              alt={item.variant?.name || "Unknown Product"}
                            />
                            <div className="order-item-details">
                              <h2 className="item-name">
                                {item.variant?.name || "Unknown Product"}
                              </h2>
                              <p className="item-quantity">
                                Quantity: {item.quantity || 1}
                              </p>
                              <p className="item-price">
                                Price: €
                                {item.variant?.price?.toFixed(2) || "N/A"}
                              </p>
                            </div>
                          </li>
                        );
                      })
                    ) : (
                      <li>No items in this order.</li>
                    )}
                  </ul>
                )}
              </div>
            ))
          ) : (
            <p>You have no orders yet.</p>
          )}
        </div>
        {/* Wishlist Section */}
        <div className="wishlist-container">
          <h2>Your Wishlist</h2>
          {wishlist && wishlist.length > 0 ? (
            <ul>
              {wishlist.map((item) => (
                <li key={item.id} className="wishlist-item">
                  <img
                    src={item.imageUrls || "https://via.placeholder.com/150"}
                    alt={item.name || "Wishlist Item"}
                  />
                  <h2 className="wishlist-item-name">{item.name || "Wishlist Item"}</h2>
                  <p className="wishlist-item-price">
                    €{item.price?.toFixed(2) || "N/A"}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Your wishlist is empty.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

const InputField = ({ label, type, value, onChange, required }) => (
  <div className="form-group">
    <label>{label}:</label>
    <input type={type} value={value} onChange={onChange} required={required} />
  </div>
);

export default Account;
