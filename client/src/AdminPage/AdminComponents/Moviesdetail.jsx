import React, { useEffect } from "react";
import { MyContext } from "../../ContextApi/MyContext";
import { useContext } from "react";
import "./User.css";
import axios from "axios";
import { Link } from "react-router-dom";
import {toast, ToastContainer} from 'react-toastify'

const Moviesdetail = () => {
  const { AllMovie, allmovie, user } = useContext(MyContext);
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
    const response = await axios
      .delete(`http://localhost:5000/movie/${id}`, {
        withCredentials: true,
      })
      
      if(response.status === 200){
        toast.success(response.data)
        AllMovie()
      }else{
        console.log(response.data.message )
      }
  }

  return (
    <>
      {user && user.MyProfile && user.MyProfile.isAdmin ? (
        <>
          <h1 style={{ margin: "1rem" }}>All Movies List</h1>
          <div>
            <Link className="dashboardbtn" to={"/dashboard"}>
              Dashboard
            </Link>
          </div>
          <div>
            <Link className="dashboardbtn btnleft" to={"/upload"}>
              Add New Movie
            </Link>
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
              {allmovie &&
                allmovie.map((movie, index) => (
                  <tr key={index}>
                    <td>{movie.title}</td>
                    <td>{truncateDescription(movie.desc)}</td>
                    <td>{movie.gener}</td>
                    <td>{movie.limit}</td>
                    <td>
                      <button onClick={() => onDelete(movie._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      ) : (
        <h1>You are not Allowed</h1>
      )}
      <ToastContainer/>
    </>
  );
};

export default Moviesdetail;
