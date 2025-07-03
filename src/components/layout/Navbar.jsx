import { Link, useNavigate } from "react-router-dom";
import { LogOut, LogIn, UserPlus, Users } from "lucide-react";
import defaultImage from "../../assets/images/default.png";
import { FaTint } from "react-icons/fa";
import useAuthContext from "../../hooks/useAuthContext";   // ⬅️ use the shared context

const Navbar = () => {
  const { user, logoutUser } = useAuthContext();          // ⬅️ read from context
  const navigate = useNavigate();

  const avatarUrl = user?.profile?.avatar
    ? `https://res.cloudinary.com/ds2qkcwly/${user.profile.avatar}`
    : defaultImage;

  const handleLogout = async () => {
    await logoutUser();
    navigate("/");
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50 border-b dark:bg-gray-900 dark:text-white">
      <div className="navbar max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-2">
        {/* Brand */}
        <div className="flex-1">
          <Link to="/" className="text-2xl font-extrabold text-red-600 flex items-center gap-1">
            <FaTint className="text-red-600" />
            Roktofy
          </Link>
        </div>

        {/* Links + Avatar */}
        <div className="flex items-center gap-6 text-gray-700 font-medium dark:text-gray-200">
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="hover:text-red-600 transition-colors duration-200">
              Home
            </Link>
            <Link to="/donors" className="hover:text-red-600 transition-colors duration-200">
              <Users size={18} className="inline-block mr-1" />
              Donors
            </Link>
            {user && (
              <Link to="/event-page" className="hover:text-red-600 transition-colors duration-200">
                Events
              </Link>
            )}
            <Link to="/about" className="hover:text-red-600 transition-colors duration-200">
              About
            </Link>
            <Link to="/contact" className="hover:text-red-600 transition-colors duration-200">
              Contact
            </Link>

            {user ? (
              <span className="text-gray-500 text-sm hidden lg:inline dark:text-gray-300">
                {/* {user.email} */}
              </span>
            ) : (
              <>
                <Link to="/login" className="hover:text-red-600 transition-colors duration-200">
                  <LogIn size={16} className="inline-block mr-1" />
                  Login
                </Link>
                <Link to="/register" className="hover:text-red-600 transition-colors duration-200">
                  <UserPlus size={16} className="inline-block mr-1" />
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Avatar + Dropdown */}
          {user && (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar hover:ring-4 transition-all duration-200">
                <div className="w-10 h-10 rounded-full ring-2 ring-red-500">
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
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-white rounded-box w-52 divide-y dark:bg-gray-800"
              >
                <li>
                  <Link to="/profile" className="hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 flex items-center rounded px-2 py-1 text-base">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to={user?.is_staff ? "/admin-dashboard" : "/dashboard"}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 flex items-center rounded px-2 py-1 text-base"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/create-donor-profile" className="hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 flex items-center rounded px-2 py-1 text-base">
                    Create a Donor Account
                  </Link>
                </li>
                <li>
                  <Link to="/update-avatar" className="hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 flex items-center rounded px-2 py-1 text-base">
                    Update Avatar
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 flex items-center rounded px-2 py-1 w-full text-left text-base">
                    <LogOut size={16} className="mr-1" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden dropdown dropdown-end ml-2">
          <label tabIndex={0} className="btn btn-ghost btn-circle hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-white rounded-box w-52 dark:bg-gray-800"
          >
            <li>
              <Link to="/donors" className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2 py-1">
                Donors
              </Link>
            </li>
            {user && (
              <li>
                <Link to="/blood-events" className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2 py-1">
                  Events
                </Link>
              </li>
            )}
            {user ? (
              <>
                <li className="text-sm px-2">{user.email}</li>
                <li>
                  <Link to="/profile" className="hover:bg-gray-100 dark:hover:bg-gray-700">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to="/create-donor-profile" className="text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Create Donor Account
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="hover:bg-gray-100 dark:hover:bg-gray-700">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:bg-gray-100 dark:hover:bg-gray-700">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Navbar;


// import useAuth from "../../hooks/useAuth";
// import { Link, useNavigate } from "react-router-dom"; 
// import { LogOut, LogIn, UserPlus, Users } from "lucide-react";
// import defaultImage from '../../assets/images/default.png';
// import { FaTint } from "react-icons/fa";
// import { useEffect, useState } from "react";

// const Navbar = () => {
//   const { user, logoutUser } = useAuth();
//   const [currentUser, setCurrentUser] = useState(user);
//   const navigate = useNavigate();

//   useEffect(() => {
//     setCurrentUser(user);
//   }, [user]);

//   const avatarUrl = currentUser?.profile?.avatar
//     ? `https://res.cloudinary.com/ds2qkcwly/${currentUser.profile.avatar}`
//     : defaultImage;

//   const handleLogout = async () => {
//     await logoutUser();
//     navigate("/"); 
//   };

//   return (
//     <header className="bg-white shadow sticky top-0 z-50 border-b dark:bg-gray-900 dark:text-white">
//       <div className="navbar max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-2">
//         {/* Brand */}
//         <div className="flex-1">
//           <Link to="/" className="text-2xl font-extrabold text-red-600 flex items-center gap-1">
//             <FaTint className="text-red-600" />
//             Roktofy
//           </Link>
//         </div>

//         {/* Links + Avatar */}
//         <div className="flex items-center gap-6 text-gray-700 font-medium dark:text-gray-200">
//           {/* Desktop Links */}
//           <div className="hidden md:flex items-center gap-6">
//             <Link to="/" className="hover:text-red-600 transition-colors duration-200">
//               Home
//             </Link>
//             <Link to="/donors" className="hover:text-red-600 transition-colors duration-200">
//               <Users size={18} className="inline-block mr-1" />
//               Donors
//             </Link>
//             {currentUser && (
//               <Link to="/event-page" className="hover:text-red-600 transition-colors duration-200">
//                 Events
//               </Link>
//             )}
//             <Link to="about" className="hover:text-red-600 transition-colors duration-200">
//               About
//             </Link>
//             <Link to="/contact" className="hover:text-red-600 transition-colors duration-200">
//               Contact
//             </Link>

//             {currentUser ? (
//               <span className="text-gray-500 text-sm hidden lg:inline dark:text-gray-300">
//                 {/* {currentUser.email} */}
//               </span>
//             ) : (
//               <>
//                 <Link to="/login" className="hover:text-red-600 transition-colors duration-200">
//                   <LogIn size={16} className="inline-block mr-1" />
//                   Login
//                 </Link>
//                 <Link to="/register" className="hover:text-red-600 transition-colors duration-200">
//                   <UserPlus size={16} className="inline-block mr-1" />
//                   Register
//                 </Link>
//               </>
//             )}
//           </div>

//           {/* Avatar + Dropdown */}
//           {currentUser && (
//             <div className="dropdown dropdown-end">
//               <label tabIndex={0} className="btn btn-ghost btn-circle avatar hover:ring-4 transition-all duration-200">
//                 <div className="w-10 h-10 rounded-full ring-2 ring-red-500">
//                   <img
//                     src={avatarUrl}
//                     alt="User profile"
//                     className="object-cover w-full h-full rounded-full"
//                     onError={(e) => {
//                       e.target.src = defaultImage;
//                     }}
//                   />
//                 </div>
//               </label>
//               <ul
//                 tabIndex={0}
//                 className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-white rounded-box w-52 divide-y dark:bg-gray-800"
//               >
//                 <li>
//                   <Link to="/profile" className="hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 flex items-center rounded px-2 py-1 text-base">
//                     Profile
//                   </Link>
//                 </li>
//                 {/* <li>
//                   <Link to="/dashboard" className="hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 flex items-center rounded px-2 py-1 text-base">
//                     Dashboard
//                   </Link>
//                 </li> */}
//                 <li>
//   <Link 
//     to={currentUser?.is_staff ? '/admin-dashboard' : '/dashboard'} 
//     className="hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 flex items-center rounded px-2 py-1 text-base"
//   >
//     Dashboard
//   </Link>
// </li>
//                 <li>
//                   <Link to="/create-donor-profile" className="hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 flex items-center rounded px-2 py-1 text-base">
//                     Create a Donor Account
//                   </Link>
//                 </li>
//                 <li>
//                   <Link to="/update-avatar" className="hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 flex items-center rounded px-2 py-1 text-base">
//                     Update Avatar
//                   </Link>
//                 </li>
//                 <li>
//                   <button onClick={handleLogout} className="hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 flex items-center rounded px-2 py-1 w-full text-left text-base">
//                     <LogOut size={16} className="mr-1" />
//                     Logout
//                   </button>
//                 </li>
//                 <li>
//                   <Link to="/update-avatar" className="hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 flex items-center rounded px-2 py-1 text-base">
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//           )}
//         </div>

//         {/* Mobile Menu */}
//         <div className="md:hidden dropdown dropdown-end ml-2">
//           <label tabIndex={0} className="btn btn-ghost btn-circle hover:bg-gray-100 dark:hover:bg-gray-800 transition">
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
//             </svg>
//           </label>
//           <ul
//             tabIndex={0}
//             className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-white rounded-box w-52 dark:bg-gray-800"
//           >
//             <li>
//               <Link to="/donors" className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2 py-1">
//                 Donors
//               </Link>
//             </li>
//             {currentUser && (
//               <li>
//                 <Link to="/blood-events" className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded px-2 py-1">
//                   Events
//                 </Link>
//               </li>
//             )}
//             {currentUser ? (
//               <>
//                 <li className="text-sm px-2">{currentUser.email}</li>
//                 <li>
//                   <Link to="/profile" className="hover:bg-gray-100 dark:hover:bg-gray-700">Profile</Link>
//                 </li>
//                 <li>
//                   <Link to="/create-donor-profile" className="text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700">
//                     Create Donor Account
//                   </Link>
//                 </li>
//                 <li>
//                   <button onClick={handleLogout} className="text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700">
//                     Logout
//                   </button>
//                 </li>
//                 {currentUser?.email && (
//                   <li>
//                     <button className="text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700">
//                       {currentUser.email}
//                     </button>
//                   </li>
//                 )}
//               </>
//             ) : (
//               <>
//                 <li>
//                   <Link to="/login" className="hover:bg-gray-100 dark:hover:bg-gray-700">Login</Link>
//                 </li>
//                 <li>
//                   <Link to="/register" className="hover:bg-gray-100 dark:hover:bg-gray-700">Register</Link>
//                 </li>
//               </>
//             )}
//           </ul>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Navbar;