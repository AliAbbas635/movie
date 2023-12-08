import React, { useState } from "react";
import { MyContext } from "./MyContext.jsx";
import axios from "axios";

function MyProvider({ children }) {
  const [user, setUser] = useState("");
  const [message, setmessge] = useState("");
  const [randommov, setrandommov] = useState("");
  const [randomfifty, setrandomfifty] = useState("");
  const [allmovie, setallmovie] = useState("");
  const [alluser, setalluser] = useState([]);
  const [searchresult, setsearchresult] = useState([]);
  const [loading, setloading] = useState(false)

  async function FetchData(name, email, password) {
    try {
      const response = await axios.post(
        "http://localhost:5000/user/register",
        { name, email, password },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setUser(response.data);
      }
    } catch (error) {
      console.error("An error has occurred:", error.response.data);
    }
  }

  async function FetchMyData() {
    try {
      const response = await axios.get("http://localhost:5000/user/profile", {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUser(response.data);
      }
    } catch (error) {
      console.error("An error has occurred:", error.response.data);
    }
  }

  async function FetchAllUsers() {
    try {
      const response = await axios.get("http://localhost:5000/user", {
        withCredentials: true,
      });
      if (response.status === 200) {
        setalluser(response.data);
      }
    } catch (error) {
      console.error("An error has occurred:", error.response.data);
    }
  }
  async function FetchLoginData(email, password) {
    try {
      const response = await axios.post(
        "http://localhost:5000/user/login",
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setmessge(response.data);
        setUser(response.data);
      }
    } catch (error) {
      setmessge({ success: false });
      console.error("An error has occurred:", error.response.data);
    }
  }

  async function LogoutUser() {
    try {
      await axios.get("http://localhost:5000/user/logout", {
        withCredentials: true,
      });
      setUser("");
    } catch (error) {
      setmessge(error.response.data);
      console.error("An error has occurred:", error.response.data);
    }
  }

  // //***************** Movie *********************

  async function fetchRandomMovie() {
    try {
      const response = await axios.get("http://localhost:5000/movie/random", {
        withCredentials: true,
      });
      if (response.status === 200) {
        setrandommov(response.data[0]);
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
      const response = await axios.get("http://localhost:5000/movie/random50", {
        withCredentials: true,
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
      const response = await axios.get("http://localhost:5000/movie", {
        withCredentials: true,
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
      const response = await axios.get('http://localhost:5000/movie/find', {
        params: {
          title: title 
        },
        withCredentials: true 
      });

      if (response.status === 200) {
        setsearchresult(response.data);
        setloading(false)
      } else {
        setsearchresult("Fail to Found")
        setmessge({ success: false });
        setloading(false)
      }
    } catch (error) {
      setmessge(error.response.data);
      console.error("An error has occurred:", error.response.data);
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
        FetchMyData,
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
        setsearchresult,
        loading,
        setloading
      }}
    >
      {children}
    </MyContext.Provider>
  );
}

export default MyProvider;
