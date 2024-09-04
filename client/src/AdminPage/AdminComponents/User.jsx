import React, { useEffect, useState } from "react";
import { MyContext } from "../../ContextApi/MyContext";
import { useContext } from "react";
import "./User.css";
import axios from "axios";
import { Link } from "react-router-dom";
import BaseURL from "../../BaseURL";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const User = () => {
  const { alluser, setalluser, user } = useContext(MyContext);
  const [deleting, setDeleting] = useState(null); // Track the ID of the user being deleted

  // Function to fetch all users
  async function FetchAllUsers() {
    try {
      const token = localStorage.getItem('token'); // Retrieve token from local storage

      const response = await axios.get(`${BaseURL}/user`, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${token}`,  // Send token in the Authorization header
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.status === 200) {
        setalluser(response.data);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("An error has occurred:", error.response ? error.response.data : error.message);
    }
  }

  useEffect(() => {
    FetchAllUsers();
  }, []);

  // Function to delete a user
  async function onDelete(id) {
    setDeleting(id); // Set deleting state to the user ID being deleted
    try {
      const token = localStorage.getItem('token'); // Retrieve token from local storage

      const response = await axios.delete(`${BaseURL}/user/${id}`, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${token}`,  // Send token in the Authorization header
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        toast.success("User deleted successfully");
        FetchAllUsers(); // Refresh the user list after deletion
      } else {
        console.error("Failed to delete user");
        toast.error("Failed to delete user");
      }
    } catch (error) {
      console.error("An error has occurred:", error.response ? error.response.data : error.message);
      toast.error("An error occurred");
    } finally {
      setDeleting(null); // Reset deleting state after operation
    }
  }

  return (
    <>
      <ToastContainer /> {/* Toast Container to show notifications */}
      {user && user.isAdmin ?  
      <>
      <h1 style={{ margin: "1rem" }}>All Users List</h1>
      <div>
        <Link className="dashboardbtn" to={"/dashboard"}>Dashboard</Link>
      </div>
      <table className="movie-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>IsAdmin</th>
            <th className="created-at">User Created At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {alluser && alluser.map((user, index) => (
            <tr key={index}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.isAdmin ? "Yes" : "No"}</td>
              <td className="created-at">{new Date(user.createdAt).toLocaleString()}</td>
              <td>
                <button 
                  onClick={() => onDelete(user.id)} 
                  disabled={deleting === user.id} // Disable the button while deleting
                >
                  {deleting === user.id ? "Deleting..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </>
      : <h1>You are not allowed to view this page</h1>}
    </>
  );
};

export default User;
