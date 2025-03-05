import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import '../styles/dashboard.css';
import user from '../assets/user.svg';
import LogoutButton from './Logout';

function NavBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  // const handleLogOut = () => {

  // }

  return (
    <nav className='navbar'>
      <div className='logo'>NAME</div>

      <div className='user-menu'>
        <img
          src={user}
          alt='User Icon'
          className='user-icon'
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        />

        {isDropdownOpen && (
          <div className='dropdown-content'>
            <button onClick={() => navigate(`/home/${userId}`)}>
              Dashboard
            </button>
            <button onClick={() => navigate('/profile')}>Profile</button>
            {/* <button onClick={() => navigate("/")}>Log out</button> */}
            <LogoutButton />
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
