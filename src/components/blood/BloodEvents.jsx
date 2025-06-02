import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import apiClient from '../../services/http';

const BloodEvents = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await apiClient.get('/blood-events/');
                console.log(response.data);
                const eventsData = Array.isArray(response.data) ? response.data : [];

                const eventsWithAcceptFlag = eventsData.map(event => ({
                    ...event,
                    can_accept: event.creator !== user?.email
                }));

                setEvents(eventsWithAcceptFlag);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.error || err.message);
                setLoading(false);
            }
        };

        fetchEvents();
    }, [user?.email]);

    const handleAccept = async (eventId) => {
        try {
            await apiClient.post(`/blood-events/${eventId}/accept/`);

            setEvents(events.map(event =>
                event.id === eventId
                    ? {
                        ...event,
                        is_accepted: true,
                        accepted_by: [...event.accepted_by, user?.email].filter(Boolean)
                    }
                    : event
            ));
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to accept the event');
        }
    };

    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
    if (!events.length) return <div className="text-center py-8">No events found</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Blood Donation Events</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(event => {
                    const userHasAccepted = event.accepted_by.includes(user?.email);

                    return (
                        <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        {event.blood_type} Blood Needed
                                    </h2>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        event.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        event.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                                        event.status === 'completed' ? 'bg-green-100 text-green-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {event.status}
                                    </span>
                                </div>

                                {event.message && <p className="text-gray-600 mb-4">{event.message}</p>}

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span>{event.location || 'Location not specified'}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>{new Date(event.required_date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span>Posted by: {event.creator}</span>
                                    </div>
                                </div>

                                {event.can_accept && !userHasAccepted && (
                                    <button
                                        onClick={() => handleAccept(event.id)}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition duration-300"
                                    >
                                        Accept Request
                                    </button>
                                )}

                                {(userHasAccepted || event.is_accepted) && (
                                    <div className="w-full bg-green-100 text-green-800 py-2 px-4 rounded-md text-center">
                                        Accepted
                                    </div>
                                )}

                                {!event.can_accept && (
                                    <div className="w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-md text-center">
                                        Your Event
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BloodEvents;
