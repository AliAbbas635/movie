import React, { useEffect } from "react";
import { MyContext } from "../../ContextApi/MyContext";
import { useContext } from "react";
import "./User.css";
import axios from "axios";
import { Link } from "react-router-dom";
import BaseURL from "../../BaseURL";

const User = () => {
  const { alluser, FetchAllUsers,user } = useContext(MyContext);
  useEffect(() => {
    FetchAllUsers();
  }, []);

  async function onDelete(id) {
    const response = await axios
      .delete(`${BaseURL}/user/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data);
        FetchAllUsers();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      {user && user.MyProfile && user.MyProfile.isAdmin ?  
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
            <th>User Created At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {alluser.map((user, index) => (
            <tr key={index}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.isAdmin ? "Yes" : "No"}</td>
              <td>{user.createdAt}</td>
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

export default User;
