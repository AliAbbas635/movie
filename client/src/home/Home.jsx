import React, { useEffect } from "react";
import "./Home.css";
import Navbar from "../Components/Navbar/Navbar";
import Features from "./Features/Features";
import List from "../Components/List/List";
import { useContext } from "react";
import { MyContext } from "../ContextApi/MyContext";
import { useNavigate } from "react-router-dom";


export default function Home() {

  const Navigate = useNavigate();

  const {FetchMyData, user, fetchRandomMovie, fetchRandomFifty, AllMovie } = useContext(MyContext);


  useEffect(() => {
    fetchRandomMovie();
    fetchRandomFifty();
    AllMovie();
    const intervalId = setInterval(() => {
      fetchRandomMovie();
    }, 5000); 
  
    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  },  [])


  useEffect(() => {
    FetchMyData();
    if (!user) {
      Navigate("/login", { replace: true }); 
    }
  }, [Navigate]);

  return (
    <div>
      <Navbar />
      <Features />
      <List />

    </div>
  );
}
