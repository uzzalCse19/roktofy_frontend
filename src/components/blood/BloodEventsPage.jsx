import { useState, useEffect } from 'react';
import { FaPlus, FaFilter } from 'react-icons/fa';
import BloodEventCard from './BloodEventCard';
import CreateBloodEventModal from './CreateEventModal';
import apiClient from '../../services/http';


const BloodEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await apiClient.get('/blood-events/');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching blood events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => {
    const matchesFilter = filter === 'all' || event.blood_typee === filter;
    const matchesSearch = event.hospital.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleEventCreated = (newEvent) => {
    setEvents(prev => [newEvent, ...prev]);
  };

  const handleEventAccepted = (eventId) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p>Loading blood requests...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Blood Donation Requests</h1>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="join flex-1">
            <input
              type="text"
              placeholder="Search by hospital or location..."
              className="input input-bordered join-item w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline join-item">
              <FaFilter />
            </button>
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary gap-2"
          >
            <FaPlus />
            Create Request
          </button>
        </div>
      </div>

      <BloodGroupFilter value={filter} onChange={setFilter} />

      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <BloodEventCard
              key={event.id}
              event={event}
              onAccept={handleEventAccepted}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            {events.length === 0 
              ? 'No blood requests available yet' 
              : 'No requests match your filters'}
          </h3>
          <p className="text-gray-500">
            {events.length === 0
              ? 'Be the first to create a request'
              : 'Try adjusting your search or filters'}
          </p>
        </div>
      )}

      <CreateBloodEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleEventCreated}
      />
    </div>
  );
};

export default BloodEventsPage;