import React, { useEffect, useState } from "react";
import apiClient from "../../services/http";

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiClient
      .get("/blood-events/my_events/")
      .then((res) => {
        setEvents(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load events");
        setLoading(false);
      });
  }, []);

  if (loading)
    return <div className="text-center py-10 text-gray-700">Loading...</div>;
  if (error)
    return (
      <div className="text-center text-red-500 py-10 font-semibold">{error}</div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">My Created Events</h1>
      {events.length === 0 ? (
        <p className="text-center text-gray-500">
          You haven't created any events yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white shadow-md rounded-2xl p-5 border border-gray-200 hover:shadow-xl transition"
            >
              <h2 className="text-xl font-semibold mb-2 text-red-600">
                Blood Type: {event.blood_type}
              </h2>
              <p className="text-gray-600">
                <strong>Status:</strong>{" "}
                <span
                  className={`inline-block px-2 py-1 rounded text-sm ${
                    event.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : event.status === "accepted"
                      ? "bg-blue-100 text-blue-700"
                      : event.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {event.status}
                </span>
              </p>
              <p className="text-gray-700 mt-1">
                <strong>Required Date:</strong> {event.required_date}
              </p>
              <p className="text-gray-700">
                <strong>Location:</strong> {event.location}
              </p>
              <p className="text-gray-700">
                <strong>Message:</strong> {event.message || "N/A"}
              </p>
              <div className="mt-3">
                <strong className="block text-gray-800 mb-1">Accepted By:</strong>
                {event.accepted_by.length === 0 ? (
                  <span className="text-sm text-gray-500">
                    No one has accepted yet.
                  </span>
                ) : (
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {event.accepted_by.map((email, idx) => (
                      <li key={idx}>{email}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEvents;
