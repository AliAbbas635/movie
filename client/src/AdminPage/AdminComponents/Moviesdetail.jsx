import React, { useEffect } from "react";
import { MyContext } from "../../ContextApi/MyContext";
import { useContext } from "react";
import "./User.css";
import axios from "axios";
import { Link } from "react-router-dom";


const Moviesdetail = () => {
  const { AllMovie, allmovie,user } = useContext(MyContext);
  useEffect(() => {
    AllMovie();
  
  }, []);

  function truncateDescription(description) {
    const words = description.split(' ');
    const truncated = words.slice(0, 25).join(' ');
  
    if (words.length > 25) {
      return `${truncated}...`;
    }
  
    return truncated;
  }
  

  async function onDelete(id) {
    const response = await axios
      .delete(`http://localhost:5000/user/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log("deleted Successfully")
      })
      .catch((err) => {
        console.log(err);
      });
  }

  console.log(allmovie[0])

  return (
    <>
      {user && user.MyProfile && user.MyProfile.isAdmin ?  
      <>
      <h1 style={{ margin: "1rem" }}>All Movies List</h1>
      <div>
        <Link className="dashboardbtn" to={"/dashboard"}>Dashboard</Link>
      </div>

      <div>
        <Link className="dashboardbtn btnleft" to={"/upload"}>Add New Movie</Link>
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
          {allmovie.map((movie, index) => (
            <tr key={index}>
              <td>{movie.title}</td>
              <td>{truncateDescription(movie.desc)}</td>
              <td>{movie.gener}</td>
              <td>{movie.limit}</td>
              <td>
                <button onClick={() => onDelete(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </>
      : <h1>You are not Allowed</h1>}
    </>
  );
};

export default Moviesdetail;
