import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { MyContext } from "../../ContextApi/MyContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Register.css";

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
    const emailValue = emailRef.current.value;
    const usernameValue = usernameRef.current.value;

    if (!emailValue || !usernameValue) {
      toast.error("Username or Email must not be empty");
      return;
    }

    if (!emailValue.endsWith("@gmail.com")) {
      toast.error("Please enter a valid Gmail address ending with '@gmail.com'");
      return;
    }

    setEmail(emailValue);
    setUsername(usernameValue);
  };

  const handleFinish = async (e) => {
    e.preventDefault();
    if (password.length >= 8) {
      await FetchData(name, email, password);
    } else {
      toast.error("Minimum 8 characters are required");
    }

    if (message) {
      toast.error(message);
    }
  };

  const handleChange = (e) => {
    setPassword(e.target.value);
  };

  return (
    <>
      <div className="register">
        <div className="top">
          <div className="wrapper">
            <h1 className="logo">VIEW FIESTA</h1>
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
            <form className="input" onSubmit={handleFinish}>
              <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleChange}
                ref={passwordRef}
                required
              />
              <button className="registerButton" type="submit">
                Sign up
              </button>
            </form>
          )}
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
