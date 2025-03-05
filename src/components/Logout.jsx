import React from 'react';

const LogoutButton = () => {
  const logout = () => {
    // Clear localStorage or cookies
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    document.cookie = 'email=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    document.cookie = 'password=; expires=Thu, 01 Jan 1970 00:00:00 UTC;';

    // Redirect to login page
    window.location.href = '/';
  };

  return <button onClick={logout}>Log out</button>;
};

export default LogoutButton;
