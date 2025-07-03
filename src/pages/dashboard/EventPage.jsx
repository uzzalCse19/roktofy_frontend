import React, { useEffect, useState } from 'react';
import { createEvent, getEvents } from '../../services/http';
import useAuth from '../../hooks/useAuth';
import CreateEventModal from '../../components/blood/CreateEventModal';
import BloodEventCard from '../../components/blood/BloodEventCard';

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 8;

  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await getEvents();
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEvent = async (eventData) => {
    try {
      const response = await createEvent(eventData);
      setEvents(prev => [response.data, ...prev]);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const handleAccept = (eventId, userEmail) => {
    setEvents(prev =>
      prev.map(event =>
        event.id === eventId
          ? { ...event, accepted_by: [...(event.accepted_by || []), userEmail] }
          : event
      )
    );
  };

  const filteredEvents = events.filter(event => {
    const search = searchTerm.toLowerCase();
    return (
      event.location?.toLowerCase().includes(search) ||
      event.blood_type?.toLowerCase().includes(search) ||
      event.message?.toLowerCase().includes(search) ||
      event.creator?.toLowerCase().includes(search) ||
      new Date(event.required_date).toDateString().toLowerCase().includes(search) ||
      event.status?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Blood Donation Events</h1>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          onClick={() => setIsModalOpen(true)}
        >
          Create New Event
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search Events by location, blood type, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-2xl mx-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 block"
        />
      </div>

      {/* Event Cards */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No events found matching your search criteria.</p>
          <button 
            onClick={() => setSearchTerm('')}
            className="mt-4 text-red-600 hover:underline"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredEvents.map(event => (
            <BloodEventCard
              key={event.id}
              event={event}
              currentUserId={user?.id}
              onDonationCreated={() => handleAccept(event.id, user?.email)}
              className="h-full"
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <CreateEventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateEvent}
        />
      )}
    </div>
  );
};

export default EventPage;

// import React, { useEffect, useState } from 'react';
// import { createEvent, getEvents } from '../../services/http';
// import useAuth from '../../hooks/useAuth';
// import CreateEventModal from '../../components/blood/CreateEventModal';
// import BloodEventCard from '../../components/blood/BloodEventCard';

// const EventPage = () => {
//   const [events, setEvents] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const eventsPerPage = 8;

//   const { user } = useAuth();

//   useEffect(() => {
//     fetchEvents();
//   }, []);

//   const fetchEvents = async () => {
//     try {
//       setIsLoading(true);
//       const response = await getEvents();
//       setEvents(response.data);
//     } catch (error) {
//       console.error('Error fetching events:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCreateEvent = async (eventData) => {
//     try {
//       const response = await createEvent(eventData);
//       setEvents(prev => [response.data, ...prev]);
//     } catch (error) {
//       console.error('Error creating event:', error);
//     }
//   };

//   const handleAccept = (eventId, userEmail) => {
//     setEvents(prev =>
//       prev.map(event =>
//         event.id === eventId
//           ? { ...event, accepted_by: [...(event.accepted_by || []), userEmail] }
//           : event
//       )
//     );
//   };

// const filteredEvents = events.filter(event => {
//   const search = searchTerm.toLowerCase();
//   return (
//     event.location?.toLowerCase().includes(search) ||
//     event.blood_type?.toLowerCase().includes(search) ||
//     event.message?.toLowerCase().includes(search) ||
//     event.creator?.toLowerCase().includes(search) ||
//     new Date(event.required_date).toDateString().toLowerCase().includes(search) ||
//     event.status?.toLowerCase().includes(search)
//   );
// });


//   return (
//     <div className="container mx-auto px-4 py-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">Blood Donation Events</h1>
//         <button
//           className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
//           onClick={() => setIsModalOpen(true)}
//         >
//           Create New Event
//         </button>
//       </div>

//       {/* 🌟 Centered Search Bar */}
//       <div className="mb-6 flex justify-center">
//         <input
//           type="text"
//           placeholder="Search Events..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full sm:w-80 md:w-96 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
//         />
//       </div>

//       {/* Event Cards */}
//       {isLoading ? (
//         <p>Loading events...</p>
//       ) : filteredEvents.length === 0 ? (
//         <p>No events found for this location.</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {filteredEvents.map(event => (
//             <BloodEventCard
//               key={event.id}
//               event={event}
//               currentUserId={user?.id}
//               onDonationCreated={() => handleAccept(event.id, user?.email)}
//             />
//           ))}
//         </div>
//       )}

//       {/* Modal */}
//       {isModalOpen && (
//         <CreateEventModal
//           isOpen={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           onCreate={handleCreateEvent}
//         />
//       )}
//     </div>
//   );
// };

// export default EventPage;
