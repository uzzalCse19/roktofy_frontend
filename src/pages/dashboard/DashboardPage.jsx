import { Outlet, Link, useNavigate } from 'react-router-dom';
import { FaTint, FaBell, FaUserCircle, FaSignOutAlt, FaUser } from 'react-icons/fa';
import Sidebar from '../public/Sidebar';
import useAuth from '../../hooks/useAuth';
import defaultImage from '../../assets/images/default.png'; // fallback avatar image

const DashboardPage = () => {
  const { user, logoutUser } = useAuth();       // ✅ Use logoutUser from context
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  const avatarUrl = user?.profile?.avatar
    ? `https://res.cloudinary.com/ds2qkcwly/${user.profile.avatar}`
    : defaultImage;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* ---------- TOP NAV ---------- */}
        <header className="bg-white shadow-sm h-16 border-b border-gray-200">
          <div className="flex items-center justify-between h-full px-6 mx-auto max-w-screen-2xl">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <FaTint className="text-red-600 text-2xl" />
              <span className="text-xl font-bold text-red-600 tracking-tight">Roktofy</span>
            </Link>

            {/* Right Side */}
            <div className="flex items-center space-x-6">
              {/* Notifications */}
              <button className="relative text-gray-500 hover:text-gray-700 transition-colors">
                <FaBell className="text-xl" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
              </button>

              {/* PROFILE DROPDOWN */}
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-9 rounded-full ring-offset-2 ring-red-600 ring">
                    <img
                      src={avatarUrl}
                      alt="User avatar"
                      onError={(e) => (e.target.src = defaultImage)}
                      className="object-cover w-full h-full rounded-full"
                    />
                  </div>
                </label>

                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-white dark:bg-gray-800 rounded-box w-56 divide-y"
                >
                  {/* Name & Email */}
                  <li className="py-2 px-3">
                    <span className="font-semibold text-gray-800 dark:text-gray-200">
                      {user?.first_name
                        ? `${user.first_name} ${user.last_name || ''}`
                        : 'User'}
                    </span>
                    <span className="text-xs text-gray-500">{user?.email}</span>
                  </li>

                  {/* Profile */}
                  <li>
                    <Link to="/profile">
                      <FaUser className="mr-2" /> My Profile
                    </Link>
                  </li>

                  {/* Logout */}
                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-gray-700 hover:text-red-600 w-full text-left cursor-pointer"
                    >
                      <FaSignOutAlt className="mr-2" />
                      <span>Logout</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </header>

        {/* ---------- DYNAMIC AREA ---------- */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;


// import { Outlet } from 'react-router-dom';
// import Sidebar from '../public/Sidebar';
// import useAuth from '../../hooks/useAuth';
// import { Link } from 'react-router-dom';
// import { FaTint, FaBell, FaUserCircle } from 'react-icons/fa';
// import { useNavigate } from "react-router-dom";

// const DashboardPage = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Persistent Sidebar */}
//       <Sidebar />
      
//       {/* Main Content Area */}
//       <div className="flex-1 flex flex-col">
//         {/* Top Navigation Bar */}
//         <header className="bg-white shadow-sm h-16 border-b border-gray-200">
//           <div className="flex items-center justify-between h-full px-6 mx-auto max-w-screen-2xl">
//             <Link to="/" className="flex items-center space-x-2">
//               <FaTint className="text-red-600 text-2xl" />
//               <span className="text-xl font-bold text-red-600 tracking-tight">Roktofy</span>
//             </Link>

//             <div className="flex items-center space-x-6">
//               <button className="relative text-gray-500 hover:text-gray-700 transition-colors">
//                 <FaBell className="text-xl" />
//                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
//                   3
//                 </span>
//               </button>

//               <div
//                 className="flex items-center space-x-2 group cursor-pointer"
//                 onClick={() => navigate("/profile")}
//               >
//                 <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
//                   <FaUserCircle className="text-red-600 text-xl" />
//                 </div>
//                 <div className="hidden md:flex flex-col items-start">
//                   <span className="text-sm font-medium text-gray-700">
//                     {user?.first_name || user?.last_name
//                       ? `${user?.first_name || ""} ${user?.last_name || ""}`.trim()
//                       : "User"}
//                   </span>
//                   <span className="text-xs text-gray-500">{user?.email}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Dynamic Content Area */}
//         <main className="flex-1 p-6 overflow-y-auto">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;
