
import React from 'react';
import { format } from 'date-fns';
import apiClient from '../../services/http';

const BloodEventCard = ({ 
  event, 
  currentUserId,
  onDonationCreated,
  showAcceptButton = true,
  className = ''
}) => {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-green-100 text-green-800',
    canceled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800'
  };

  const [hasAccepted, setHasAccepted] = React.useState(
    event.donations?.some(donation => donation?.donor?.id === currentUserId) || 
    (event.accepted_by && event.accepted_by.some(user => user.id === currentUserId))
  );

  const isCreator = (
    event.creator?.id === currentUserId || 
    (event.requester && event.requester.id === currentUserId)
  );

  const handleAcceptDonation = async () => {
    try {
      const donationData = {
        event: event.id,
        units_donated: 1
      };

      const response = await apiClient.post('/donations/', donationData);
      
      if (onDonationCreated) {
        onDonationCreated(response.data);
      }

      setHasAccepted(true);
      alert('Thank you for your donation! Your contribution will save lives.');

    } catch (error) {
      console.error('Error creating donation:', error);
      let errorMessage = 'Failed to create donation. Please try again.';
      
      if (error.response) {
        if (error.response.status === 400) {
          errorMessage = error.response.data.detail || 
            'You have already donated to this event.';
        } else if (error.response.status === 401) {
          errorMessage = 'Please login to donate.';
        } else if (error.response.data) {
          errorMessage = error.response.data.message || errorMessage;
        }
      }
      
      alert(errorMessage);
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'PPP');
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500 hover:shadow-lg transition-shadow flex flex-col h-full ${className}`}>
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Blood Group: <span className="text-red-600">{event.blood_type}</span>
            </h3>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            statusColors[event.status] || 'bg-gray-100 text-gray-800'
          }`}>
            {event.status?.charAt(0).toUpperCase() + event.status?.slice(1)}
          </span>
        </div>

        <div className="space-y-2 text-sm">
          <p className="text-gray-600">
            <span className="font-medium">Needed by:</span> {formatDate(event.required_date)}
          </p>
          
          {event.request_type && (
            <p className="text-gray-600">
              <span className="font-medium">Type:</span> {event.request_type}
            </p>
          )}

          {event.urgency_level && event.urgency_level.toLowerCase() !== 'normal' && (
            <p className="text-red-600 font-medium">
              Urgency: {event.urgency_level}
            </p>
          )}

          {event.message && event.message !== "string" && (
            <div className="p-2 bg-gray-50 rounded-lg">
              <p className="text-gray-700 text-sm">"{event.message}"</p>
            </div>
          )}

          {event.location && (
            <p className="text-gray-600">
              <span className="font-medium">Location:</span> {event.location}
            </p>
          )}

          <p className="text-gray-500 text-xs">
            Posted by: {event.creator || event.creator?.email}
          </p>
        </div>

        {event.accepted_by?.length > 0 && (
          <div className="mt-3 p-2 bg-blue-50 rounded-lg">
            <p className="text-xs font-medium text-blue-800 mb-1">Donors pledged:</p>
            <ul className="text-xs text-blue-700">
              {event.accepted_by.map((donor, index) => (
                <li key={index} className="flex items-center">
                  <svg className="w-2 h-2 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {donor}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100">
        {showAcceptButton && (
          <div className="flex justify-end">
            {hasAccepted ? (
              <div className="flex items-center text-green-600 text-sm font-medium">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Accepted
              </div>
            ) : (
              <button
                onClick={handleAcceptDonation}
                className={`${
                  isCreator || event.status !== 'pending' 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-red-600 hover:bg-red-700 cursor-pointer'
                } text-white px-3 py-1.5 rounded text-sm transition duration-200 flex items-center`}
                disabled={isCreator || event.status !== 'pending'}
              >
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {isCreator 
                  ? 'Your Request' 
                  : event.status === 'pending' 
                    ? 'Accept' 
                    : 'Closed'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BloodEventCard;

// import React from 'react';
// import { format } from 'date-fns';
// import apiClient from '../../services/http';

// const BloodEventCard = ({ 
//   event, 
//   currentUserId,
//   onDonationCreated,
//   showAcceptButton = true
// }) => {
//   const statusColors = {
//     pending: 'bg-yellow-100 text-yellow-800',
//     accepted: 'bg-green-100 text-green-800',
//     canceled: 'bg-red-100 text-red-800',
//     completed: 'bg-blue-100 text-blue-800'
//   };

//   const [hasAccepted, setHasAccepted] = React.useState(
//     event.donations?.some(donation => donation?.donor?.id === currentUserId) || 
//     (event.accepted_by && event.accepted_by.some(user => user.id === currentUserId))
//   );

//   const isCreator = (
//     event.creator?.id === currentUserId || 
//     (event.requester && event.requester.id === currentUserId)
//   );

//   const handleAcceptDonation = async () => {
//     try {
//       const donationData = {
//         event: event.id,
//         units_donated: 1
//       };

//       const response = await apiClient.post('/donations/', donationData);
      
//       if (onDonationCreated) {
//         onDonationCreated(response.data);
//       }

//       // Immediately update the UI state
//       setHasAccepted(true);
//       alert('Thank you for your donation! Your contribution will save lives.');

//     } catch (error) {
//       console.error('Error creating donation:', error);
//       let errorMessage = 'Failed to create donation. Please try again.';
      
//       if (error.response) {
//         if (error.response.status === 400) {
//           errorMessage = error.response.data.detail || 
//             'You have already donated to this event.';
//         } else if (error.response.status === 401) {
//           errorMessage = 'Please login to donate.';
//         } else if (error.response.data) {
//           errorMessage = error.response.data.message || errorMessage;
//         }
//       }
      
//       alert(errorMessage);
//     }
//   };

//   const formatDate = (dateString) => {
//     try {
//       return format(new Date(dateString), 'PPP');
//     } catch {
//       return 'Invalid date';
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500 hover:shadow-lg transition-shadow">
//       <div className="flex justify-between items-start">
//         <div className="w-full">
//           <div className="flex justify-between items-start">
//             <div>
//               <h3 className="text-xl font-semibold text-gray-800">
//                 Blood Group: <span className="text-red-600">{event.blood_type}</span>
//               </h3>
//               <p className="text-gray-600 mt-1">
//                 Needed by: <span className="font-medium">{formatDate(event.required_date)}</span>
//               </p>
//               {event.request_type && (
//                 <p className="text-sm text-gray-600">
//                   Request Type: <span className="font-medium">{event.request_type}</span>
//                 </p>
//               )}
//               {event.urgency_level && event.urgency_level.toLowerCase() !== 'normal' && (
//                 <p className="text-sm text-red-600 font-semibold">
//                   Urgency: {event.urgency_level}
//                 </p>
//               )}
//             </div>
//             <span className={`px-3 py-1 rounded-full text-sm font-medium ${
//               statusColors[event.status] || 'bg-gray-100 text-gray-800'
//             }`}>
//               {event.status?.charAt(0).toUpperCase() + event.status?.slice(1)}
//             </span>
//           </div>

//           <div className="mt-3 space-y-2">
//             {event.message && event.message !== "string" && (
//               <div className="p-3 bg-gray-50 rounded-lg">
//                 <p className="text-gray-700">"{event.message}"</p>
//               </div>
//             )}

//             <div className="flex items-center text-sm text-gray-600">
//               <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//               </svg>
//               <span>Created by: <span className="font-medium">{event.creator || event.creator?.email}</span></span>
//             </div>

//             <div className="flex items-center text-sm text-gray-600">
//               <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//               </svg>
//               <span>Posted on: <span className="font-medium">{formatDate(event.created_at)}</span></span>
//             </div>

//             {event.location && (
//               <div className="flex items-center text-sm text-gray-600">
//                 <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                 </svg>
//                 <span>Location: <span className="font-medium">{event.location}</span></span>
//               </div>
//             )}
//           </div>

//           {event.accepted_by?.length > 0 && (
//             <div className="mt-3 p-3 bg-blue-50 rounded-lg">
//               <p className="text-sm font-medium text-blue-800 mb-1">Donors pledged:</p>
//               <ul className="text-sm text-blue-700">
//                 {event.accepted_by.map((donor, index) => (
//                   <li key={index} className="flex items-center">
//                     <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                     </svg>
//                     {donor}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           <div className="mt-4 pt-4 border-t border-gray-100">
//             <div className="flex justify-between items-center">
//               {showAcceptButton && (
//                 <div className="w-full flex justify-end">
//                   {hasAccepted ? (
//                     <div className="flex items-center text-green-600 font-medium">
//                       <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                       </svg>
//                       Already Accepted
//                     </div>
//                   ) : (
//                     <button
//                       onClick={handleAcceptDonation}
//                       className={`${
//                         isCreator || event.status !== 'pending' 
//                           ? 'bg-gray-400 cursor-not-allowed' 
//                           : 'bg-red-600 hover:bg-red-700 cursor-pointer'
//                       } text-white px-4 py-2 rounded-md transition duration-200 flex items-center`}
//                       disabled={isCreator || event.status !== 'pending'}
//                     >
//                       <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                       </svg>
//                       {isCreator 
//                         ? 'Your Request' 
//                         : event.status === 'pending' 
//                           ? 'Accept' 
//                           : 'Request Closed'}
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BloodEventCard;

