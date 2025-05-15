import React, { useState } from "react";
import apiClient from "../../services/http";

const EventAcceptedButton = ({ eventId, onAccepted }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAccept = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await apiClient.post(`/blood-events/${eventId}/accept/`);
      setMessage(response.data.success || "Event accepted successfully.");
      if (onAccepted) onAccepted(); // callback to parent
    } catch (error) {
      if (error.response?.data?.error) {
        setMessage(error.response.data.error);
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleAccept}
        disabled={loading}
        className={`px-4 py-2 text-white rounded-lg ${
          loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {loading ? "Accepting..." : "Accept Event"}
      </button>

      {message && (
        <p className="mt-2 text-sm text-center text-red-500 whitespace-pre-line">{message}</p>
      )}
    </div>
  );
};

export default EventAcceptedButton;
