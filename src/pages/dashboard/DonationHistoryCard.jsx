import React from 'react';
import { format } from 'date-fns';

const DonationHistoryCard = ({ donation }) => {
  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    accepted: 'bg-blue-100 text-blue-800',
    canceled: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-800">
            Donated {donation.blood_type} to {donation.recipient?.name || 'Anonymous'}
          </h3>
          <div className="flex items-center mt-2 space-x-4">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[donation.status] || 'bg-gray-100 text-gray-800'}`}>
              {donation.status}
            </span>
            <span className="text-sm text-gray-500">
              {format(new Date(donation.donation_date), 'MMM d, yyyy')}
            </span>
          </div>
          {donation.request?.message && (
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-medium">Note:</span> {donation.request.message}
            </p>
          )}
        </div>
        {donation.is_verified && (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
            Verified
          </span>
        )}
      </div>
    </div>
  );
};

export default DonationHistoryCard;