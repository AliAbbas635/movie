import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";
import { useContext } from "react";
import { MyContext } from "../../ContextApi/MyContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const Navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // New state for loading
  const { FetchLoginData, user } = useContext(MyContext);

  useEffect(() => {
    if (user) {
      Navigate("/");
    }
  }, [user, Navigate]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      await FetchLoginData(email, password);

      if (user) {
        toast.success("Log in Successful");
        Navigate("/");
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error) {
      toast.error("An error occurred during login. Please try again.");
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="login">
      <div className="top">
        <div className="wrapper">
          <h1 className="red">VIEW FIESTA</h1>
        </div>
      </div>
      <div className="container">
        <form onSubmit={handleSignIn}>
          <h1>Sign In</h1>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="loginButton"
            type="submit"
            disabled={loading} // Disable the button while loading
          >
            {loading ? "Signing In..." : "Sign In"} {/* Change text while loading */}
          </button>
          <span>
            New to VIEW FIESTA?
            <Link to={"/register"}>
              <b>Sign up now.</b>
            </Link>
          </span>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
