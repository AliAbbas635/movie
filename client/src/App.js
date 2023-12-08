import React, { useEffect } from "react";

import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

import Home from "./home/Home";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";
import { MyContext } from "./ContextApi/MyContext";
import { useContext } from "react";
import UploadMovie from "./AdminPage/uploadMovie";
import Dashboard from "./AdminPage/Dashboard";
import "./App.css";

import User from "./AdminPage/AdminComponents/User.jsx"
import Moviesdetail from "./AdminPage/AdminComponents/Moviesdetail";

import Search from "./Components/SearchPage/Search";

const App = () => {
  const { FetchMyData} = useContext(MyContext);
  
  useEffect(() => {
    FetchMyData();
  }, []);

  return (
    <Router>
      <Routes>


        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />
        
        <Route path="/upload" element={<UploadMovie />} />

        <Route path="/user" element={<User />} />

        <Route path="/moviedetails" element={<Moviesdetail />} />

        <Route path="/search" element={<Search />} />

        
      </Routes>
    </Router>
  );
};

export default App;
