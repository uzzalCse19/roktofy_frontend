import React, { useEffect, useState } from 'react';
import { createEvent, getEvents } from '../../services/http';
import useAuth from '../../hooks/useAuth';
import CreateEventModal from '../../components/blood/CreateEventModal';
import BloodEventCard from '../../components/blood/BloodEventCard';

const EventPage = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // current page state
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
          ? { ...event, accepted_by: [...event.accepted_by, userEmail] }
          : event
      )
    );
  };

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(events.length / eventsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Blood Donation Events</h1>
          {user && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-200"
            >
              Create Event
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No blood donation events available at the moment.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentEvents.map(event => (
                <BloodEventCard
                  key={event.id}
                  event={event}
                  onAccept={handleAccept}
                />
              ))}
            </div>

        
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-4 py-2 rounded ${
                      currentPage === index + 1
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateEvent}
      />
    </div>
  );
};
export default EventPage;
