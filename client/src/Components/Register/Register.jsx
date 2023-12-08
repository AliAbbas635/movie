import { useEffect, useRef } from "react";
import { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { MyContext } from "../../ContextApi/MyContext";
import logo from "../../Static/Netflix.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setUsername] = useState("");
  const emailRef = useRef();
  const passwordRef = useRef();
  const usernameRef = useRef();
  const Navigate = useNavigate();
  const { user, FetchData, message } = useContext(MyContext);

  useEffect(() => {
    if (user) {
      Navigate("/");
    }
  }, [user, Navigate]);
  const handleStart = () => {
    setEmail(emailRef.current.value);
    setUsername(usernameRef.current.value);
    if (emailRef.current.value === "" || usernameRef.current.value === "") {
      toast.error("Username or Email Must not empty");
    }
   };
  const handleFinish = async (e) => {
    e.preventDefault();
    FetchData(name, email, password);
  };

  const handleChange = async (e) => {
    setPassword(e.target.value);
  };

  return (
      <>
    <div className="register">
      <div className="top">
        <div className="wrapper">
          <img className="logo" src={logo} alt="" />
          <Link to={"/login "} className="link loginButton">
            Sign In
          </Link>
        </div>
      </div>
      <div className="container">
        <h1>Unlimited movies, TV shows, and more.</h1>
        <h2>Watch anywhere. Cancel anytime.</h2>

        {!email ? (
          <>
            <div className="input">
              <input
                type="text"
                placeholder="Username"
                ref={usernameRef}
                required
              />
            </div>
            <div className="input">
              <input
                type="email"
                placeholder="email address"
                ref={emailRef}
                required
              />
              <button className="registerButton" onClick={handleStart}>
                Get Started
              </button>
            </div>
          </>
        ) : (
          <form className="input">
            <input
              type="password"
              placeholder="password"
              name="name"
              onChange={(e) => handleChange(e)}
              ref={passwordRef}
              required
            />
            <button className="registerButton" onClick={(e) => handleFinish(e)}>
              Start
            </button>
          </form>
        )}
      </div>
    </div>
<ToastContainer/>
</>
  );
}
