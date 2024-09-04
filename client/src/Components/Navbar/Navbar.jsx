import React, { useEffect } from "react";
import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBurger, faBars} from "@fortawesome/free-solid-svg-icons";
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
  const { LogoutUser, user, setUser, SearchMov, FetchMyData } = useContext(MyContext);

  function Logout() {
    LogoutUser();
    setUser("");
    Navigate("/login");
  }

  function SearchMovie() {
    if (searchValue.length > 2) {
      SearchMov(searchValue);
      Navigate("/search");
    } else {
      toast.error("Please insert what you want to search");
    }
  }

  useEffect(() => {
    if (!user) {
      FetchMyData();
    }
  }, []);

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
            icon={faBars}
            className="Navuser"
            onBlur={() => settoggle(false)}
          />

          {toggle && (
            <div className="con">
              {user && user.isAdmin && (
                <Link to="/Dashboard" className="setting">
                  Dashboard
                </Link>
              )}
              <Link to="/setting" className="setting">
                Settings
              </Link>
              <span className="setting" onClick={Logout}>
                Logout
              </span>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Navbar;
