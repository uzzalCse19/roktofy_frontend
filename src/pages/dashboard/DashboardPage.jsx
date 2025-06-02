import { Outlet } from 'react-router-dom';
import Sidebar from '../public/Sidebar';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { FaTint, FaBell, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Persistent Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar */}
        <header className="bg-white shadow-sm h-16 border-b border-gray-200">
          <div className="flex items-center justify-between h-full px-6 mx-auto max-w-screen-2xl">
            <Link to="/" className="flex items-center space-x-2">
              <FaTint className="text-red-600 text-2xl" />
              <span className="text-xl font-bold text-red-600 tracking-tight">Roktofy</span>
            </Link>

            <div className="flex items-center space-x-6">
              <button className="relative text-gray-500 hover:text-gray-700 transition-colors">
                <FaBell className="text-xl" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
              </button>

              <div
                className="flex items-center space-x-2 group cursor-pointer"
                onClick={() => navigate("/profile")}
              >
                <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
                  <FaUserCircle className="text-red-600 text-xl" />
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-700">
                    {user?.first_name || user?.last_name
                      ? `${user?.first_name || ""} ${user?.last_name || ""}`.trim()
                      : "User"}
                  </span>
                  <span className="text-xs text-gray-500">{user?.email}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
