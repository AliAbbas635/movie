import React, { useEffect } from "react";
import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUser } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { MyContext } from "../../ContextApi/MyContext";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";

const Navbar = () => {
  const Navigate = useNavigate();
  const [toggle, settoggle] = useState(false);
  const [isScrol, setisScrol] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showdashboard, setshowdashboard] = useState(false);

  const { LogoutUser, user, setUser,SearchMov } = useContext(MyContext);
  function Logout() {
    LogoutUser();
    setUser("")
    Navigate("/login");
  }

   function SearchMovie() {
    if(searchValue.length >2){
      SearchMov(searchValue);
      Navigate("/search");
    }else{
      toast.error("Please insert that you want to searchc")
    }
  }

  useEffect(() => {
    if (user.isAdmin) {
      setshowdashboard(true);
    }
  }, [user]);

  window.onscroll = () => {
    setisScrol(window.pageYOffset === 0 ? false : true);
    return () => (window.onscroll = null);
  };
  return (
    <div className={isScrol ? "Navbar Scrolled" : "Navbar"}>
      <div className="container">
        <div className="left">
          <Link to="/" className="link">
            <h1 className="logo">View Fiesta</h1>
          </Link>
        </div>

        {showdashboard && (
          <div className="static">
            <Link to="/Dashboard" className="link staticlink" style={{ marginLeft: '50px' }}>
            Dashboard
            </Link>
          </div>
        )}

        <div className="right">
          <input
            value={searchValue}
            placeholder="Search"
            className="search"
            onChange={(e) => setSearchValue(e.target.value)}
            type="text"
          />

          <FontAwesomeIcon
            className="Navicon"
            onClick={SearchMovie}
            icon={faSearch}
            style={{ color: "#ffffff" }}
          />

          <FontAwesomeIcon
            onClick={() => settoggle(!toggle)}
            icon={faUser}
            className="Navuser"
            onBlur={() => settoggle(false)}
          />

          {toggle && (
            <div className="con">
              <span>Settings</span>
              <span onClick={Logout}>Logout</span>
            </div>
          )}
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default Navbar;
