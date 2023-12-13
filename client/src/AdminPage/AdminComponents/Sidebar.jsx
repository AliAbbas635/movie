import React from 'react';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import {
  BsCameraVideoFill,
  BsGrid1X2Fill,
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsListCheck,
  BsMenuButtonWideFill,
  BsFillGearFill,
  BsDoorOpen,
  BsPeople,
  BsPeopleFill
} from 'react-icons/bs';
import "../Admin.css";
import { faSignOut } from '@fortawesome/free-solid-svg-icons';

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <div className='sidebar-title'>
        <div className='sidebar-brand'>XFlix</div>
        <span className='icon close_icon' onClick={OpenSidebar}>X</span>
      </div>

      <ul className='sidebar-list'>
        <li className='sidebar-list-item'>
          <Link to="/">
            <BsGrid1X2Fill className='icon'/> Home
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/upload">
            <BsCameraVideoFill className='icon'/> Upload Movie
          </Link>
        </li>

        <li className='sidebar-list-item'>
          <Link to="/user">
            <BsPeopleFill className='icon'/> Users
          </Link>
        </li>

        <li className='sidebar-list-item'>
          <Link to="/moviedetails">
            <BsMenuButtonWideFill className='icon'/> Movie List & Deletion
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/logout">
            <BsDoorOpen className='icon'/> Logout
          </Link>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
