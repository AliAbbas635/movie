import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";
import { useContext } from "react";
import { MyContext } from "../../ContextApi/MyContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const Navigate = useNavigate()
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const { FetchLoginData,user} = useContext(MyContext);

 useEffect(()=>{
  if(user){
    Navigate("/")
  }

 },[user,Navigate])

 const handleSignIn = async (e) => {
   e.preventDefault();
 await  FetchLoginData(email, password)
   if (user) {
    toast.success("Log in Successfull")
    Navigate("/")
    }else{
      toast.error("error");
    }

 };

 return (
   <div className="login">
     <div className="top">
       <div className="wrapper">
         <h1 className="red">XFlix</h1>
       </div>
     </div>
     <div className="container">
       <form>
         <h1>Sign In</h1>
         <input
           type="email"
           placeholder="Email "
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
         <button className="loginButton" onClick={handleSignIn}>
           Sign In
         </button>
         <span>
           New to XFlix?
           <Link to={"/register"}>
             <b>Sign up now.</b>
           </Link>
         </span>
       </form>
     </div>
     <ToastContainer/>
   </div>
 );
}
