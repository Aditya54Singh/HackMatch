import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useContext } from "react";

const Navbar = () => {

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItemClass = ({ isActive }) =>
    `relative transition-all duration-200 ${
      isActive
        ? "text-blue-600 font-semibold"
        : "text-gray-600 dark:text-gray-300 hover:text-blue-600"
    }`;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 shadow-md px-10 py-4 flex justify-between items-center transition-colors duration-300">

      {/* Logo */}
      <h1 className="text-2xl font-bold tracking-wide text-blue-600">
        HackMatch
      </h1>

      {/* Navigation */}
      <div className="flex items-center gap-8 text-sm">

        <NavLink to="/app" className={navItemClass}>
          Home
        </NavLink>

        <NavLink to="/app/connect" className={navItemClass}>
          Discover
        </NavLink>

        <NavLink to="/app/myhackathons" className={navItemClass}>
          My Hackathons
        </NavLink>

        <NavLink
          to="/app/create"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:scale-105 hover:shadow-lg transition-all duration-200"
        >
          + Create
        </NavLink>

        <NavLink to="/app/profile" className={navItemClass}>
          Profile
        </NavLink>

      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-4">

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-200 shadow"
        >
          Logout
        </button>

      </div>

    </nav>
  );
};

export default Navbar;
