// import React, { useEffect, useState } from 'react';
// import useAuth from '../../hooks/useAuth';
// import { getMyEvents } from '../../services/http';
// import BloodEventCard from '../../components/blood/BloodEventCard';


// const MyEventsPage = () => {
//   const [events, setEvents] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const { user } = useAuth();

//   useEffect(() => {
//     fetchMyEvents();
//   }, []);

//   const fetchMyEvents = async () => {
//     try {
//       setIsLoading(true);
//       const response = await getMyEvents();
//       setEvents(response.data);
//     } catch (error) {
//       console.error('Error fetching my events:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-4xl mx-auto py-8 px-4">
//         <h1 className="text-3xl font-bold text-gray-800 mb-8">My Blood Donation Events</h1>

//         {isLoading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
//           </div>
//         ) : events.length === 0 ? (
//           <div className="text-center py-12">
//             <p className="text-gray-500 text-lg">You haven't created any blood donation events yet.</p>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {events.map(event => (
//               <BloodEventCard
//                 key={event.id} 
//                 event={event} 
//                 isMyEvent={true}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyEventsPage;