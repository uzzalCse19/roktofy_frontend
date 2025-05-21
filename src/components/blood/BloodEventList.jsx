// import { useEffect, useState } from 'react';
// import useAuth from '../../hooks/useAuth';
// import apiClient from '../../services/http';




// const BloodEventList = () => {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { user } = useAuth();

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         setLoading(true);
//         const response = await apiClient.get('/blood-events/');
//         // apiClient.get('/blood-events/');
//         setEvents(response.data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEvents();
//   }, []);

//   const handleAccept = async (eventId) => {
//     try {
//       await apiClient.post('/events/accept/', { event: eventId });
//       // Update the event to show as accepted
//       setEvents(events.map(event => 
//         event.id === eventId 
//           ? { ...event, has_accepted: true } 
//           : event
//       ));
//     } catch (err) {
//       console.error('Error accepting event:', err);
//       alert(err.response?.data?.error || 'Failed to accept event');
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return <div className="text-red-500 p-4">Error: {error}</div>;
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold text-gray-800 mb-8">Blood Donation Events</h1>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {events.map(event => (
//           <EventCard 
//             key={event.id}
//             event={event}
//             user={user}
//             onAccept={handleAccept}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// const EventCard = ({ event, user, onAccept }) => {
//   const bloodTypeColors = {
//     'O+': 'bg-red-100 text-red-800',
//     'O-': 'bg-red-200 text-red-900',
//     'A+': 'bg-blue-100 text-blue-800',
//     'A-': 'bg-blue-200 text-blue-900',
//     'B+': 'bg-green-100 text-green-800',
//     'B-': 'bg-green-200 text-green-900',
//     'AB+': 'bg-purple-100 text-purple-800',
//     'AB-': 'bg-purple-200 text-purple-900',
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
//       <div className="p-6">
//         <div className="flex justify-between items-start mb-4">
//           <span className={`px-3 py-1 rounded-full text-sm font-semibold ${bloodTypeColors[event.blood_type]}`}>
//             {event.blood_type}
//           </span>
//           <span className="text-sm text-gray-500">
//             {new Date(event.required_date).toLocaleDateString()}
//           </span>
//         </div>
        
//         <h3 className="text-xl font-semibold text-gray-800 mb-2">
//           Needed at: {event.location}
//         </h3>
        
//         {event.message && (
//           <p className="text-gray-600 mb-4">{event.message}</p>
//         )}
        
//         <div className="flex items-center justify-between mt-4">
//           <div>
//             <p className="text-sm text-gray-500">Posted by:</p>
//             <p className="font-medium">{event.creator_name || event.creator_email}</p>
//           </div>
          
//           {!event.is_creator && user?.user_type !== 'recipient' && (
//             <div>
//               {event.has_accepted ? (
//                 <span className="px-4 py-2 bg-green-100 text-green-800 rounded-md">
//                   Accepted
//                 </span>
//               ) : (
//                 <button
//                   onClick={() => onAccept(event.id)}
//                   className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
//                 >
//                   Accept
//                 </button>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BloodEventList;



import { useEffect, useState } from "react";
import { format } from "date-fns";
import apiClient from "../../services/http";
import useAuthContext from "../../hooks/useAuthContext";

const BloodEventList = () => {
  const { user } = useAuthContext();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    blood_type: "",
    message: "",
    required_date: "",
    location: "",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/blood-events/");
      setEvents(response.data);
    } catch (err) {
      setError("Failed to fetch events");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (eventId) => {
    try {
      await apiClient.post(`/blood-events/${eventId}/accept/`);
      fetchEvents();
    } catch (err) {
      setError("Failed to accept event");
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post("/blood-events/", formData);
      setFormData({
        blood_type: "",
        message: "",
        required_date: "",
        location: "",
      });
      setShowForm(false); // Hide form after submission
      fetchEvents();
    } catch (err) {
      setError("Failed to create event");
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">

    
        <div className="flex justify-start mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            {showForm ? "Hide Form" : "Create Event"}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-12">
            <h2 className="text-2xl font-bold mb-4">Create Blood Donation Event</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2">Blood Type</label>
                  <select
                    name="blood_type"
                    value={formData.blood_type}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Blood Type</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Required Date</label>
                  <input
                    type="date"
                    name="required_date"
                    value={formData.required_date}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Message (Optional)</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  rows="3"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Submit Event
              </button>
            </form>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-6">Available Blood Donation Events</h2>
        {events.length === 0 ? (
          <p className="text-gray-500">No events available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-bold text-red-600 mb-1">
                    {event.blood_type} Needed
                  </h3>
                  <p className="text-gray-600">
                    {format(new Date(event.required_date), "MMMM d, yyyy")}
                  </p>
                  <p className="text-gray-600 mb-2">Location: {event.location}</p>
                  {event.message && (
                    <p className="text-gray-700 mb-2">{event.message}</p>
                  )}
                  <p className="text-sm text-gray-500">Created by: {event.creator}</p>
                  <p className="text-sm text-gray-500">
                    Accepted by: {event.accepted_by.length} donors
                  </p>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Created: {format(new Date(event.created_at), "MMM d, yyyy")}
                  </span>
                  {user && user.email !== event.creator && (
                    <button
                      onClick={() => handleAccept(event.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition text-sm"
                    >
                      Accept to Donate
                    </button>
                  )}
                  {user && user.email === event.creator && (
                    <span className="text-sm text-gray-500">Your event</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BloodEventList;