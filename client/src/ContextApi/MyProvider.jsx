import React, { useState } from "react";
import { MyContext } from "./MyContext.jsx";
import axios from "axios";
import BaseURL from "../BaseURL.js";

function MyProvider({ children }) {
  const [user, setUser] = useState("");
  const [message, setmessge] = useState("");
  const [randommov, setrandommov] = useState("");
  const [randomfifty, setrandomfifty] = useState("");
  const [allmovie, setallmovie] = useState("");
  const [alluser, setalluser] = useState([]);
  const [searchresult, setsearchresult] = useState([]);
  const [loading, setloading] = useState(false);
  const [movieStats, setMovieStats] = useState(null);  // New state for movie stats

  async function FetchData(name, email, password) {
    try {
      const response = await axios.post(
        `${BaseURL}/user/register`,
        { name, email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem('token', token);
        document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24}; secure=${process.env.NODE_ENV !== 'development'}; samesite=lax`;
        setUser(response.data.user);
      } else {
        setmessge("Something went wrong");
      }
    } catch (error) {
      setmessge("An error has occurred");
      console.error("An error has occurred:", error.response?.data || error.message);
    }
  }

  async function FetchMyData() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BaseURL}/user/profile`, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      if (response.status === 200) {
        setUser(response.data);
      }
    } catch (error) {
      if (error.response) {
        console.error("An error has occurred:", error.response.data);
      } else {
        console.error("An error has occurred:", error.message);
      }
    }
  }

  async function FetchAllUsers() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BaseURL}/user`, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${token}`,
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

  async function FetchLoginData(email, password) {
    try {
      const response = await axios.post(
        `${BaseURL}/user/login`,
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem('token', token);
        document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24}; secure=${process.env.NODE_ENV !== 'development'}; samesite=lax`;
        setUser(response.data.user);
        setmessge(response.data);
      }
    } catch (error) {
      setmessge({ success: false });
      console.error("An error has occurred:", error.response?.data || error.message);
    }
  }

  async function LogoutUser() {
    try {
      localStorage.removeItem('token');
      document.cookie = `token=; path=/; max-age=0; secure=${process.env.NODE_ENV !== 'development'}; samesite=lax`;
      await axios.post(`${BaseURL}/user/logout`, {}, { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error("An error occurred during logout:", error.message);
    }
  }

  // //***************** Movie *********************
  
  async function fetchRandomMovie() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BaseURL}/movie/random`, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      if (response.status === 200) {
        setrandommov(response.data);
      } else {
        setmessge({ success: false });
      }
    } catch (error) {
      setmessge(error.response.data);
      console.error("An error has occurred:", error.response.data);
    }
  }

  async function fetchRandomFifty() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BaseURL}/movie/random50`, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      if (response.status === 200) {
        setrandomfifty(response.data);
      } else {
        setmessge({ success: false });
      }
    } catch (error) {
      setmessge(error.response.data);
      console.error("An error has occurred:", error.response.data);
    }
  }

  async function AllMovie() {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BaseURL}/movie`, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      if (response.status === 200) {
        setallmovie(response.data);
      } else {
        setmessge({ success: false });
      }
    } catch (error) {
      setmessge(error.response.data);
      console.error("An error has occurred:", error.response.data);
    }
  }

  async function SearchMov(title) {
    setloading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BaseURL}/movie/find`, {
        params: {
          title: title
        },
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.status === 200) {
        setsearchresult(response.data);
        setloading(false);
      } else {
        setsearchresult("Fail to Found");
        setmessge({ success: false });
        setloading(false);
      }
    } catch (error) {
      setmessge(error.response.data);
      console.error("An error has occurred:", error.response.data);
      setloading(false);
    }
  }

  // Fetch movie statistics
  async function FetchMovieStats() {
    try {
      const token = localStorage.getItem('token'); // Retrieve token from local storage
      const response = await axios.get(`${BaseURL}/movie/stat`, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      if (response.status === 200) {
        setMovieStats(response.data);
      } else {
        console.error("Failed to fetch movie stats");
      }
    } catch (error) {
      console.error("An error has occurred:", error.response ? error.response.data : error.message);
    }
  }

  return (
    <MyContext.Provider
      value={{
        user,
        setUser,
        FetchData,
        FetchLoginData,
        message,
        setmessge,
        LogoutUser,
        fetchRandomMovie,
        randommov,
        fetchRandomFifty,
        randomfifty,
        allmovie,
        AllMovie,
        alluser,
        FetchAllUsers,
        SearchMov,
        searchresult,
        setalluser,
        setsearchresult,
        loading,
        setloading,
        FetchMyData,
        movieStats,     
        FetchMovieStats,
      }}
    >
      {children}
    </MyContext.Provider>
  );
}

export default MyProvider;
