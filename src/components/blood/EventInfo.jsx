
import React from 'react';

const EventInfo = ({ event, onDonateClick }) => {
  if (!event) {
    return <div className="text-center p-4">Loading event info...</div>;
  }

  const { name, location, date, description, donations } = event;

  return (
    <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
      <h2 className="text-2xl font-bold text-red-600">{name}</h2>
      <p className="text-gray-700">
        <strong>Location:</strong> {location}
      </p>
      <p className="text-gray-700">
        <strong>Date:</strong> {new Date(date).toLocaleDateString()}
      </p>
      <p className="text-gray-700">{description}</p>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-red-500">Donations</h3>
        {donations && donations.length > 0 ? (
          <ul className="list-disc list-inside text-gray-600">
            {donations.map((donation, index) => (
              <li key={index}>
                {donation.name} donated {donation.amount}ml
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No donations yet.</p>
        )}
      </div>

      <button
        onClick={onDonateClick}
        className="mt-4 px-5 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition"
      >
        Donate Now
      </button>
    </div>
  );
};

export default EventInfo;
