// components/dashboard/DashboardNavbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Menu, X, Bell } from "lucide-react";
import defaultImage from '../../assets/images/default.png';

import { FaTint } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";

const DashboardNavbar = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const avatarUrl = user?.profile?.avatar
    ? `https://res.cloudinary.com/ds2qkcwly/${user.profile.avatar}`
    : defaultImage;

  const handleLogout = async () => {
    await logoutUser();
    navigate("/"); 
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side - toggle button and logo */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={onToggleSidebar}
            className="md:hidden text-gray-600 hover:text-gray-900"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link to="/dashboard" className="text-xl font-bold text-red-600 flex items-center gap-1">
            <FaTint className="text-red-600" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
        </div>

        {/* Right side - user controls */}
        <div className="flex items-center space-x-4">
          <button className="p-1 rounded-full hover:bg-gray-100">
            <Bell size={20} className="text-gray-600" />
          </button>
          
          {/* User dropdown */}
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar hover:ring-2 hover:ring-red-200">
              <div className="w-8 h-8 rounded-full">
                <img
                  src={avatarUrl}
                  alt="User profile"
                  className="object-cover w-full h-full rounded-full"
                  onError={(e) => {
                    e.target.src = defaultImage;
                  }}
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-white rounded-box w-52 divide-y"
            >
              <li>
                <Link to="/profile" className="hover:bg-gray-100 text-gray-700">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:bg-gray-100 text-gray-700">
                  Back to Main Site
                </Link>
              </li>
              <li>
                <button 
                  onClick={handleLogout}
                  className="hover:bg-gray-100 text-red-600 flex items-center"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;