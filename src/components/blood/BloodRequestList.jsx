// import { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';


// import { bloodRequestService } from '../../services/http';
// import LoadingSpinner from '../common/LoadingSpinner';
// import Alert from '../common/Alert';

// const BloodRequestList = () => {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [filter, setFilter] = useState('all'); // 'all', 'pending', 'completed'

//   useEffect(() => {
//     const fetchRequests = async () => {
//       try {
//         setLoading(true);
//         const response = await bloodRequestService.getAll();
//         setRequests(response.data);
//       } catch (err) {
//         setError(err.message || 'Failed to load blood requests');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRequests();
//   }, []);

//   const filteredRequests = requests.filter(request => {
//     if (filter === 'all') return true;
//     return request.status === filter;
//   });

//   const handleAcceptRequest = async (requestId) => {
//     try {
//       await bloodRequestService.accept(requestId);
//       // Refresh the list after accepting
//       const response = await bloodRequestService.getAll();
//       setRequests(response.data);
//     } catch (err) {
//       setError(err.message || 'Failed to accept request');
//     }
//   };

//   if (loading) return <LoadingSpinner />;

//   return (
//     <div className="container mx-auto p-4">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold">Blood Donation Requests</h2>
//         <Link to="/create-request" className="btn btn-primary">
//           Create New Request
//         </Link>
//       </div>

//       {error && <Alert variant="error" message={error} />}

//       <div className="flex gap-2 mb-4">
//         <button 
//           onClick={() => setFilter('all')} 
//           className={`btn ${filter === 'all' ? 'btn-active' : ''}`}
//         >
//           All Requests
//         </button>
//         <button 
//           onClick={() => setFilter('pending')} 
//           className={`btn ${filter === 'pending' ? 'btn-active' : ''}`}
//         >
//           Pending
//         </button>
//         <button 
//           onClick={() => setFilter('completed')} 
//           className={`btn ${filter === 'completed' ? 'btn-active' : ''}`}
//         >
//           Completed
//         </button>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="table w-full">
//           <thead>
//             <tr>
//               <th>Blood Group</th>
//               <th>Units Needed</th>
//               <th>Hospital</th>
//               <th>Location</th>
//               <th>Urgency</th>
//               <th>Needed By</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredRequests.length > 0 ? (
//               filteredRequests.map(request => (
//                 <tr key={request.id}>
//                   <td>{request.blood_group}</td>
//                   <td>{request.units_needed}</td>
//                   <td>{request.hospital}</td>
//                   <td>{request.location}</td>
//                   <td>
//                     <span className={`badge ${
//                       request.urgency === 'emergency' ? 'badge-error' : 
//                       request.urgency === 'urgent' ? 'badge-warning' : 'badge-info'
//                     }`}>
//                       {request.urgency}
//                     </span>
//                   </td>
//                   <td>{new Date(request.needed_by).toLocaleString()}</td>
//                   <td>
//                     <span className={`badge ${
//                       request.status === 'pending' ? 'badge-warning' : 'badge-success'
//                     }`}>
//                       {request.status}
//                     </span>
//                   </td>
//                   <td>
//                     <div className="flex gap-2">
//                       <Link 
//                         to={`/blood-requests/${request.id}`} 
//                         className="btn btn-sm btn-info"
//                       >
//                         Details
//                       </Link>
//                       {request.status === 'pending' && (
//                         <button
//                           onClick={() => handleAcceptRequest(request.id)}
//                           className="btn btn-sm btn-success"
//                         >
//                           Accept
//                         </button>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="8" className="text-center py-4">
//                   No blood requests found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default BloodRequestList;