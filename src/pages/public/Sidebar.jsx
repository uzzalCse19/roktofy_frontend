import { NavLink, Link, useNavigate } from "react-router-dom";
import { FiHome, FiUser, FiPlusCircle, FiActivity } from "react-icons/fi";
import { LogOut } from "lucide-react";
import { FaTint } from "react-icons/fa";
// import useAuthContext from "../../hooks/useAuthContext";

import useAuthContext from "../../hooks/useAuthContext";    // ⬅️ use context, not useAuth


const Sidebar = () => {
  const { logoutUser } = useAuthContext();                 // ⬅️ shared logout
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();                                    // updates context → Navbar re-renders
    navigate("/");                                         // redirect to home
  };

  return (
    <aside className="w-64 bg-white shadow-lg p-6 hidden md:block">
      {/* Brand / Logo */}
      <div className="flex-1 mb-8 mt-4">
        <Link
          to="/"
          className="text-2xl font-extrabold text-red-600 flex items-center gap-1"
        >
          <FaTint className="text-red-600" />
          Roktofy
        </Link>
      </div>

      {/* Navigation links */}
      <nav className="flex flex-col space-y-4">
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `flex items-center space-x-2 ${isActive ? "text-red-600" : "text-gray-700"} hover:text-red-600`
          }
        >
          <FiHome />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/dashboard/profile"
          className={({ isActive }) =>
            `flex items-center space-x-2 ${isActive ? "text-red-600" : "text-gray-700"} hover:text-red-600`
          }
        >
          <FiUser />
          <span>My Profile</span>
        </NavLink>

        <NavLink
          to="/dashboard/create-event"
          className={({ isActive }) =>
            `flex items-center space-x-2 ${isActive ? "text-red-600" : "text-gray-700"} hover:text-red-600`
          }
        >
          <FiPlusCircle />
          <span>Create Event</span>
        </NavLink>

        <NavLink
          to="/dashboard/my-request"
          className={({ isActive }) =>
            `flex items-center space-x-2 ${isActive ? "text-red-600" : "text-gray-700"} hover:text-red-600`
          }
        >
          <FiActivity />
          <span>My Requests</span>
        </NavLink>

        <NavLink
          to="/dashboard/history"
          className={({ isActive }) =>
            `flex items-center space-x-2 ${isActive ? "text-red-600" : "text-gray-700"} hover:text-red-600`
          }
        >
          <FiActivity />
          <span>Donation History</span>
        </NavLink>

        {/* Logout */}
<button
  onClick={handleLogout}
  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 w-full text-left cursor-pointer"
>
  <LogOut size={16} className="mr-1" />
  <span>Logout</span>
</button>

      </nav>
    </aside>
  );
};

export default Sidebar;


