// import { useParams, Link } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import Alert from '../common/Alert';
// import { bloodRequestService } from '../../services/http';
// import LoadingSpinner from '../common/LoadingSpinner';

// const BloodRequestDetail = () => {
//   const { id } = useParams();
//   const [request, setRequest] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchRequest = async () => {
//       try {
//         const response = await bloodRequestService.getById(id);
//         setRequest(response.data);
//       } catch (err) {
//         setError(err.message || 'Failed to load request details');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRequest();
//   }, [id]);

//   if (loading) return <LoadingSpinner />;
//   if (error) return <Alert variant="error" message={error} />;

//   return (
//     <div className="container mx-auto p-4">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold">Request Details</h2>
//         <Link to="/blood-requests" className="btn btn-ghost">
//           Back to List
//         </Link>
//       </div>

//       {request && (
//         <div className="card bg-base-100 shadow">
//           <div className="card-body">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <h3 className="font-bold">Blood Group</h3>
//                 <p>{request.blood_group}</p>
//               </div>
//               <div>
//                 <h3 className="font-bold">Units Needed</h3>
//                 <p>{request.units_needed}</p>
//               </div>
//               <div>
//                 <h3 className="font-bold">Hospital</h3>
//                 <p>{request.hospital}</p>
//               </div>
//               <div>
//                 <h3 className="font-bold">Location</h3>
//                 <p>{request.location}</p>
//               </div>
//               <div>
//                 <h3 className="font-bold">Urgency</h3>
//                 <span className={`badge ${
//                   request.urgency === 'emergency' ? 'badge-error' : 
//                   request.urgency === 'urgent' ? 'badge-warning' : 'badge-info'
//                 }`}>
//                   {request.urgency}
//                 </span>
//               </div>
//               <div>
//                 <h3 className="font-bold">Status</h3>
//                 <span className={`badge ${
//                   request.status === 'pending' ? 'badge-warning' : 'badge-success'
//                 }`}>
//                   {request.status}
//                 </span>
//               </div>
//               <div>
//                 <h3 className="font-bold">Needed By</h3>
//                 <p>{new Date(request.needed_by).toLocaleString()}</p>
//               </div>
//               <div>
//                 <h3 className="font-bold">Created At</h3>
//                 <p>{new Date(request.created_at).toLocaleString()}</p>
//               </div>
//             </div>
            
//             {request.additional_info && (
//               <div className="mt-4">
//                 <h3 className="font-bold">Additional Information</h3>
//                 <p>{request.additional_info}</p>
//               </div>
//             )}

//             <div className="card-actions justify-end mt-4">
//               {request.status === 'pending' && (
//                 <button
//                   onClick={() => handleAcceptRequest(request.id)}
//                   className="btn btn-primary"
//                 >
//                   Accept Request
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BloodRequestDetail;