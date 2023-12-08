import React, { useEffect, useState } from "react";
import "../Admin.css";
import {
  BsPeopleFill,
  BsFillBellFill,
  BsFilm,
} from "react-icons/bs";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { MyContext } from "../../ContextApi/MyContext";
import { useContext } from "react";
import BaseURL from "../../BaseURL.js"

function AdminHome() {
  const [data, setdata] = useState();

  useEffect(() => {
    async function stats() {
      try {
        const response = await axios.get(`${BaseURL}/user/stats`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setdata(response.data);
        }
      } catch (error) {
        console.error("An error has occurred:", error.response.data);
      }
    }
    AllMovie();
    FetchAllUsers();
    stats();
  }, []);

  const monthNumberToName = (monthNumber) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return months[monthNumber - 1] || ""; // Subtract 1 to match the array index
  };

  const { AllMovie, allmovie, alluser, FetchAllUsers } = useContext(MyContext);

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Admin DASHBOARD</h3>
      </div>

      <div className="main-cards">
        <div className="card">
          <div className="card-inner">
            <h3>Movies</h3>
            <BsFilm className="card_icon" />
          </div>
          {allmovie && <h1>{allmovie.length}</h1>}
        </div>
        {/* <div className="card">
          <div className="card-inner">
            <h3>CATEGORIES</h3>
            <BsFillGrid3X3GapFill className="card_icon" />
          </div>
          <h1>12</h1>
        </div> */}
        <div className="card">
          <div className="card-inner">
            <h3>Users</h3>
            <BsPeopleFill className="card_icon" />
          </div>
          {alluser && <h1>{alluser.length}</h1>}
        </div>
        <div className="card">
          <div className="card-inner">
            <h3>ALERTS</h3>
            <BsFillBellFill className="card_icon" />
          </div>
          <h1>0</h1>
        </div>
      </div>

      {data && (
        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            <BarChart
              data={data.map(({ _id, total }) => ({
                name: monthNumberToName(_id), // Convert month number to name
                total,
              }))}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="total"
                fill="#8884d8"
                name="Number of Users per Month"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </main>
  );
}

export default AdminHome;
