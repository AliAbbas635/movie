import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../../ContextApi/MyContext";
import "./Setting.css";
import axios from "axios";
import BaseURL from "../../BaseURL";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

function Setting() {
  const { user, setUser, FetchMyData } = useContext(MyContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false); // State for loading

  useEffect(() => {
    // Fetch user data when the component mounts
    FetchMyData();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: "", // Keep password field empty for security
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Activate loading state
    try {
      const response = await axios.put(
        `${BaseURL}/user/profile`,
        { ...formData },
        {
          withCredentials: true,
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setUser(response.data);
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      console.error("An error has occurred:", error.response?.data || error.message);
      toast.error("An error occurred while updating the profile.");
    } finally {
      setLoading(false); // Deactivate loading state
    }
  };

  return (
    <div className="setting-container">
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit} className="setting-form">
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading} // Disable input when loading
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading} // Disable input when loading
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter new password"
            disabled={loading} // Disable input when loading
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Save Changes"}
        </button>

        <div className="back">
          <Link to={"/"}>Back To Home</Link>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Setting;
