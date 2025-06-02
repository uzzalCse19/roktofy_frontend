import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import BloodEventCard from '../../components/blood/BloodEventCard';
import { getEvents } from '../../services/http';
import DonationHistory from '../../components/blood/DonationHistory';
import DonorRequests from '../../components/blood/DonorRequests';

const DashboardHome = () => {
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
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
    fetchEvents();
  }, []);

  const handleAccept = (eventId, userEmail) => {
    setEvents(prev =>
      prev.map(event =>
        event.id === eventId
          ? { ...event, accepted_by: [...(event.accepted_by || []), userEmail] }
          : event
      )
    );
  };

  const displayedEvents = showAllEvents ? events : events.slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Donor Requests Section */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-red-600 text-center mb-6">My Donor Requests</h2>
        <DonorRequests />
      </section>

      {/* Events Section */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-2xl font-semibold text-red-600 text-center mb-6">Recipient Request</h2>
          {events.length > 6 && (
            <button
              onClick={() => setShowAllEvents(!showAllEvents)}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              {showAllEvents ? 'Show Less' : 'Show All'}
            </button>
          )}
        </div>

        {isLoading ? (
          <p className="text-center py-4 text-gray-500">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="text-center py-4 text-gray-500">No events available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedEvents.map(event => (
              <BloodEventCard
                key={event.id}
                event={event}
                currentUserId={user?.id}
                onDonationCreated={() => handleAccept(event.id, user?.email)}
                showAcceptButton={true}
              />
            ))}
          </div>
        )}
      </section>

      {/* Donation History Section */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-red-600 text-center mb-6">Donation History</h2>
        <DonationHistory />
      </section>
    </div>
  );
};

export default DashboardHome;