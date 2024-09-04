import React, { useEffect } from "react";
import { MyContext } from "../../ContextApi/MyContext";
import { useContext } from "react";
import { useState } from "react";
import "./User.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the toastify CSS
import BaseURL from "../../BaseURL";

const Moviesdetail = () => {
  const { AllMovie, allmovie, user } = useContext(MyContext);
  const [deleting, setDeleting] = useState(null); // Track the deleting state

  useEffect(() => {
    AllMovie();
  }, []);

  function truncateDescription(description) {
    const words = description.split(" ");
    const truncated = words.slice(0, 25).join(" ");

    if (words.length > 25) {
      return `${truncated}...`;
    }

    return truncated;
  }

  async function onDelete(id) {
    try {
      setDeleting(id); // Set the deleting state to the movie ID

      const token = localStorage.getItem('token'); // Retrieve token from local storage

      const response = await axios.delete(`${BaseURL}/movie/${id}`, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${token}`,  // Send token in the Authorization header
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        toast.success("Movie deleted successfully");
        AllMovie(); // Refresh the movie list after deletion
      } else {
        toast.error("Failed to delete movie");
        console.log(response.data.message);
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error("An error has occurred:", error.response ? error.response.data : error.message);
    } finally {
      setDeleting(null); // Reset the deleting state
    }
  }

  return (
    <>
      <ToastContainer /> {/* Toast Container to show notifications */}
      {user && user.isAdmin ? (
        <>
          <div className="maincon">
            <div className="headingcon">

              <h1 className="hcon" style={{ margin: "1rem" }}>All Movies List</h1>
            </div>
            <div className="buttoncon">
              <div>
                <Link className="dashboardbtn btnleft leftbtn" to={"/dashboard"}>
                  Dashboard
                </Link>
              </div>
              <div>
                <Link className="dashboardbtn rightbtn" to={"/upload"}>
                  Add New Movie
                </Link>
              </div>
            </div>
          </div>
          <table className="movie-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Genre</th>
                <th>Rating</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {allmovie && allmovie.map((movie, index) => (
                <tr key={index}>
                  <td>{movie.title}</td>
                  <td>{truncateDescription(movie.desc)}</td>
                  <td>{movie.genre}</td>
                  <td>{movie.limit}</td>
                  <td>
                    <button
                      onClick={() => onDelete(movie.id)}
                      disabled={deleting === movie.id} // Disable button if deleting
                    >
                      {deleting === movie.id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <h1>You are not allowed to view this page</h1>
      )}
    </>
  );
};

export default Moviesdetail;
