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
// import { useEffect, useState } from 'react';
// import Sidebar from '../public/Sidebar';
// import DonorRequests from '../../components/blood/DonorRequests';
// import EventPage from './EventPage';
// import DonationHistory from '../../components/blood/DonationHistory';
// import { getEvents } from '../../services/http';
// import BloodEventCard from '../../components/blood/BloodEventCard';
// import useAuth from '../../hooks/useAuth';
// import { Link } from 'react-router-dom';
// import { FaTint, FaBell, FaUserCircle, FaChevronDown } from 'react-icons/fa';
// import { useNavigate } from "react-router-dom";

// const DashboardPage = () => {
//   const [activeSection, setActiveSection] = useState('requests');
//   const [showAllEvents, setShowAllEvents] = useState(false);
//   const [events, setEvents] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const { user } = useAuth();
//   // const navigate = useNavigate();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         setIsLoading(true);
//         const response = await getEvents();
//         setEvents(response.data);
//       } catch (error) {
//         console.error('Error fetching events:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchEvents();
//   }, []);

//   const handleAccept = (eventId, userEmail) => {
//     setEvents(prev =>
//       prev.map(event =>
//         event.id === eventId
//           ? { ...event, accepted_by: [...(event.accepted_by || []), userEmail] }
//           : event
//       )
//     );
//   };

//   const displayedEvents = showAllEvents ? events : events.slice(0, 6);

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Enhanced Professional Dashboard Navbar */}
//       <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-40 h-16 border-b border-gray-200">
//         <div className="flex items-center justify-between h-full px-6 mx-auto max-w-screen-2xl">
//           {/* Logo Section */}
//           <Link to="/" className="flex items-center space-x-2">
//             <FaTint className="text-red-600 text-2xl" />
//             <span className="text-xl font-bold text-red-600 tracking-tight">Roktofy</span>
//           </Link>

//           {/* User Navigation */}
//           <div className="flex items-center space-x-6">
//             {/* Notification Badge */}
//             <button className="relative text-gray-500 hover:text-gray-700 transition-colors">
//               <FaBell className="text-xl" />
//               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
//                 3
//               </span>
//             </button>

//             {/* User Profile Dropdown */}
//             <div
//               className="flex items-center space-x-2 group cursor-pointer"
//               onClick={() => navigate("/profile")}
//             >
//               <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
//                 <FaUserCircle className="text-red-600 text-xl" />
//               </div>
//               <div className="hidden md:flex flex-col items-start">
//                 <span className="text-sm font-medium text-gray-700">
//                   {user?.first_name || user?.last_name
//                     ? `${user?.first_name || ""} ${user?.last_name || ""}`.trim()
//                     : "User"}
//                 </span>
//                 <span className="text-xs text-gray-500">{user?.email}</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Sidebar - unchanged */}
//       <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
//       {/* Main Content - added pt-16 to account for navbar height */}
//       <main className="flex-1 p-6 overflow-y-auto space-y-8 pt-16">
//         {/* Rest of your content remains exactly the same */}
//         <section 
//           id="requests"
//           className="bg-white rounded-lg shadow-md p-6"
//           onMouseEnter={() => setActiveSection('requests')}
//         >
//           <h2 className="text-2xl font-semibold text-red-600 text-center mb-6">My Donor Requests</h2>
//           <DonorRequests />
//         </section>

//         {/* Events Section */}
//         <section 
//           id="events"
//           className="bg-white rounded-lg shadow-md p-6"
//           onMouseEnter={() => setActiveSection('events')}
//         >
//           <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
//             <h2 className="text-2xl font-semibold text-red-600 text-center mb-6">Recipient Request</h2>
//             {events.length > 6 && (
//               <button
//                 onClick={() => setShowAllEvents(!showAllEvents)}
//                 className="text-red-600 hover:text-red-800 font-medium"
//               >
//                 {showAllEvents ? 'Show Less' : 'Show All'}
//               </button>
//             )}
//           </div>

//           {isLoading ? (
//             <p className="text-center py-4 text-gray-500">Loading events...</p>
//           ) : events.length === 0 ? (
//             <p className="text-center py-4 text-gray-500">No events available.</p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {displayedEvents.map(event => (
//                 <BloodEventCard
//                   key={event.id}
//                   event={event}
//                   currentUserId={user?.id}
//                   onDonationCreated={() => handleAccept(event.id, user?.email)}
//                   showAcceptButton={true}
//                 />
//               ))}
//             </div>
//           )}
//         </section>

//         {/* Donation History */}
//         <section 
//           id="history"
//           className="bg-white rounded-lg shadow-md p-6"
//           onMouseEnter={() => setActiveSection('history')}
//         >
//           <h2 className="text-2xl font-semibold text-red-600 text-center mb-6">Donation History</h2>
//           <DonationHistory />
//         </section>
//       </main>
//     </div>
//   );
// };

// export default DashboardPage;


// import { useEffect, useState } from 'react';
// import Sidebar from '../public/Sidebar';
// import DonorRequests from '../../components/blood/DonorRequests';
// import EventPage from './EventPage';
// import DonationHistory from '../../components/blood/DonationHistory';
// import { getEvents } from '../../services/http';
// import BloodEventCard from '../../components/blood/BloodEventCard';
// import useAuth from '../../hooks/useAuth';

// const DashboardPage = () => {
//   const [activeSection, setActiveSection] = useState('requests');
//   const [showAllEvents, setShowAllEvents] = useState(false);
//   const [events, setEvents] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const { user } = useAuth();

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         setIsLoading(true);
//         const response = await getEvents();
//         setEvents(response.data);
//       } catch (error) {
//         console.error('Error fetching events:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchEvents();
//   }, []);

//   const handleAccept = (eventId, userEmail) => {
//     setEvents(prev =>
//       prev.map(event =>
//         event.id === eventId
//           ? { ...event, accepted_by: [...(event.accepted_by || []), userEmail] }
//           : event
//       )
//     );
//   };

//   const displayedEvents = showAllEvents ? events : events.slice(0, 6);

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar - unchanged */}
//       <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
//       {/* Main Content */}
//       <main className="flex-1 p-6 overflow-y-auto space-y-8">
//         {/* Donor Requests */}
//         <section 
//           id="requests"
//           className="bg-white rounded-lg shadow-md p-6"
//           onMouseEnter={() => setActiveSection('requests')}
//         >
//           <h2 className="text-2xl font-semibold text-red-600 text-center mb-6">My Donor Requests</h2>
//           <DonorRequests />
//         </section>

//         {/* Events Section */}
//         <section 
//           id="events"
//           className="bg-white rounded-lg shadow-md p-6"
//           onMouseEnter={() => setActiveSection('events')}
//         >
//           <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
//             <h2 className="text-2xl font-semibold text-red-600 text-center mb-6">Recipient Request</h2>
//             {events.length > 6 && (
//               <button
//                 onClick={() => setShowAllEvents(!showAllEvents)}
//                 className="text-red-600 hover:text-red-800 font-medium"
//               >
//                 {showAllEvents ? 'Show Less' : 'Show All'}
//               </button>
//             )}
//           </div>

//           {isLoading ? (
//             <p className="text-center py-4 text-gray-500">Loading events...</p>
//           ) : events.length === 0 ? (
//             <p className="text-center py-4 text-gray-500">No events available.</p>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {displayedEvents.map(event => (
//                 <BloodEventCard
//                   key={event.id}
//                   event={event}
//                   currentUserId={user?.id}
//                   onDonationCreated={() => handleAccept(event.id, user?.email)}
//                   showAcceptButton={true}
//                 />
//               ))}
//             </div>
//           )}
//         </section>

//         {/* Donation History */}
//         <section 
//           id="history"
//           className="bg-white rounded-lg shadow-md p-6"
//           onMouseEnter={() => setActiveSection('history')}
//         >
//           <h2 className="text-2xl font-semibold text-red-600 text-center mb-6">Donation History</h2>
//           <DonationHistory />
//         </section>
//       </main>
//     </div>
//   );
// };

// export default DashboardPage; 


// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { format, parseISO } from 'date-fns';
// import apiClient from '../../services/http';
// import useAuth from '../../hooks/useAuth';
// import { toast } from 'react-toastify';
// import Sidebar from '../public/Sidebar';


// const DashboardPage = () => {
//   const { user, isLoading: authLoading } = useAuth();
//   const [dashboardData, setDashboardData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('requests');
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!authLoading && !user) {
//       navigate('/login');
//       return;
//     }

//     if (user) {
//       fetchDashboardData();
//     }
//   }, [user, authLoading, navigate]);

//   const fetchDashboardData = async () => {
//     try {
//       setIsLoading(true);
//       const response = await apiClient.get('/dashboard/');
//       setDashboardData(response.data);
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//       toast.error('Failed to load dashboard data');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleAcceptRequest = async (requestId) => {
//     try {
//       const response = await apiClient.post(`/blood-requests/${requestId}/accept/`);
//       toast.success('Request accepted successfully!');

//       const acceptedRequest = dashboardData.available_requests.find(req => req.id === requestId);
//       setDashboardData(prev => ({
//         ...prev,
//         available_requests: prev.available_requests.filter(req => req.id !== requestId),
//         donation_history: [
//           {
//             id: Date.now(),
//             request_blood_type: acceptedRequest.blood_type,
//             request_hospital: acceptedRequest.hospital,
//             donation_date: new Date().toISOString(),
//             units_donated: acceptedRequest.units_needed,
//             is_verified: true
//           },
//           ...prev.donation_history
//         ],
//         completed_donations: (prev.completed_donations || 0) + 1,
//         last_donation_date: new Date().toISOString()
//       }));

//       setTimeout(fetchDashboardData, 1500);
//     } catch (error) {
//       console.error('Error accepting request:', error);

//       if (error.response?.status === 404 || error.response?.status === 500) {
//         try {
//           await handleAcceptFallback(requestId);
//         } catch (fallbackError) {
//           toast.error(fallbackError.response?.data?.error || 'Failed to accept request');
//         }
//       } else {
//         toast.error(error.response?.data?.error || 'Failed to accept request');
//       }
//     }
//   };

//   const handleAcceptFallback = async (requestId) => {
//     const request = dashboardData.available_requests.find(req => req.id === requestId);
//     await apiClient.patch(`/blood-requests/${requestId}/`, {
//       status: 'accepted'
//     });

//     await apiClient.post('/donations/', {
//       donor: user.id,
//       request: requestId,
//       blood_type: request.blood_type,
//       units_donated: request.units_needed,
//       is_verified: true
//     });

//     toast.success('Request accepted (fallback method)');
//     fetchDashboardData();
//   };

//   const handleCancelRequest = async (requestId) => {
//     try {
//       await apiClient.patch(`/blood-requests/${requestId}/`, { status: 'cancelled' });
//       toast.success('Request cancelled successfully!');
//       setDashboardData(prev => ({
//         ...prev,
//         my_requests: prev.my_requests.map(req =>
//           req.id === requestId ? { ...req, status: 'cancelled' } : req
//         ),
//         pending_requests: prev.pending_requests - 1
//       }));
//     } catch (error) {
//       console.error('Error cancelling request:', error);
//       toast.error(error.response?.data?.error || 'Failed to cancel request');
//     }
//   };

//   if (authLoading || isLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
//       </div>
//     );
//   }

//   if (!user) return null;

//   if (!dashboardData) {
//     return (
//       <div className="text-center py-12">
//         <p className="text-gray-500 text-lg">Failed to load dashboard data</p>
//         <button
//           onClick={fetchDashboardData}
//           className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex bg-gray-50">
//       {/* ✅ Sidebar on the left */}
//       <Sidebar />

//       {/* ✅ Main Dashboard Content */}
//       <main className="flex-1 p-6">
//         <div className="max-w-4xl mx-auto">
//           <div className="bg-white shadow rounded-lg p-6 mb-8">
//             <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//               <div className="bg-blue-50 p-4 rounded-lg">
//                 <h3 className="text-lg font-medium text-blue-800">Blood Group</h3>
//                 <p className="text-2xl font-bold text-blue-600">
//                   {dashboardData.blood_type || 'Not specified'}
//                 </p>
//               </div>

//               {user.user_type !== 'donor' && (
//                 <div className="bg-purple-50 p-4 rounded-lg">
//                   <h3 className="text-lg font-medium text-purple-800">My Requests</h3>
//                   <p className="text-2xl font-bold text-purple-600">
//                     {dashboardData.total_requests || 0}
//                   </p>
//                   <p className="text-sm text-purple-500">
//                     {dashboardData.pending_requests || 0} pending
//                   </p>
//                 </div>
//               )}

//               {user.user_type !== 'recipient' && dashboardData.blood_type && (
//                 <div className="bg-green-50 p-4 rounded-lg">
//                   <h3 className="text-lg font-medium text-green-800">Donations</h3>
//                   <p className="text-2xl font-bold text-green-600">
//                     {dashboardData.completed_donations || 0}
//                   </p>
//                   <p className="text-sm text-green-500">
//                     {dashboardData.last_donation_date
//                       ? `Last: ${format(parseISO(dashboardData.last_donation_date), 'MMM d, yyyy')}`
//                       : 'Never donated'}
//                   </p>
//                 </div>
//               )}
//             </div>

//             <div className="border-b border-gray-200 mb-6">
//               <nav className="-mb-px flex space-x-8">
//                 <button
//                   onClick={() => setActiveTab('requests')}
//                   className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
//                     activeTab === 'requests' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500'
//                   }`}
//                 >
//                   Blood Requests
//                 </button>
//                 <button
//                   onClick={() => setActiveTab('history')}
//                   className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
//                     activeTab === 'history' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500'
//                   }`}
//                 >
//                   Donation History
//                 </button>
//               </nav>
//             </div>

//             {/* ... rest of the dashboard tab content (blood requests / history) ... */}
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default DashboardPage;
