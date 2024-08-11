import { useState } from "react";
import Header from "./AdminComponents/Header";
import Sidebar from "./AdminComponents/Sidebar";
import AdminHome from "./AdminComponents/AdminHome";
import { MyContext } from "../ContextApi/MyContext";
import { useContext } from "react";

import "./Admin.css";

function App() {
  const { user } = useContext(MyContext);
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <>
      {user && user.isAdmin ? (
        <div className="grid-container">
          <Header OpenSidebar={OpenSidebar} />
          <Sidebar
            openSidebarToggle={openSidebarToggle}
            OpenSidebar={OpenSidebar}
          />
          <AdminHome />
        </div>
      ) : (
        <div>
          <h1>Not Allowed</h1>
        </div>
      )}
    </>
  );
}

export default App;
