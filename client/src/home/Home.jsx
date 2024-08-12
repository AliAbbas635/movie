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

  const { user,fetchRandomMovie,fetchRandomFifty,AllMovie } = useContext(MyContext);

  useEffect(() => {
  fetchRandomMovie();
  fetchRandomFifty();
   AllMovie();
    if (!user) {
      Navigate("/login");
    }
  }, [user]);

  return (
    <div>
      <Navbar />
      <Features />
      <List />

    </div>
  );
}
