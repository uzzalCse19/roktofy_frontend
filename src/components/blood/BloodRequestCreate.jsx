// import { useForm } from 'react-hook-form';
// import { useNavigate } from 'react-router-dom';
// import Alert from '../common/Alert';
// import LoadingSpinner from '../common/LoadingSpinner';
// import { bloodRequestService } from '../../services/http';


// const BloodRequestCreate = () => {
//   const { register, handleSubmit, formState: { errors } } = useForm();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const onSubmit = async (data) => {
//     setLoading(true);
//     setError(null);
    
//     try {
//       // Format the data to match your API endpoint
//       const requestData = {
//         blood_group: data.bloodGroup,
//         units_needed: parseInt(data.unitsNeeded),
//         hospital: data.hospital,
//         location: data.location,
//         urgency: data.urgency,
//         additional_info: data.additionalInfo,
//         needed_by: new Date(data.neededBy).toISOString()
//       };

//       await bloodRequestService.create(requestData);
//       navigate('/blood-requests'); // Redirect to requests list after creation
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to create request');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <LoadingSpinner/>;

//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-6">Create Blood Donation Request</h2>
      
//       {error && <Alert variant="error" message={error} />}

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//         <div className="form-control">
//           <label className="label">
//             <span className="label-text">Blood Group</span>
//           </label>
//           <select
//             {...register("bloodGroup", { required: "Blood group is required" })}
//             className="select select-bordered w-full"
//           >
//             <option value="">Select blood group</option>
//             <option value="A+">A+</option>
//             <option value="A-">A-</option>
//             <option value="B+">B+</option>
//             <option value="B-">B-</option>
//             <option value="AB+">AB+</option>
//             <option value="AB-">AB-</option>
//             <option value="O+">O+</option>
//             <option value="O-">O-</option>
//           </select>
//           {errors.bloodGroup && (
//             <span className="text-error text-sm">{errors.bloodGroup.message}</span>
//           )}
//         </div>

//         <div className="form-control">
//           <label className="label">
//             <span className="label-text">Units Needed</span>
//           </label>
//           <input
//             type="number"
//             {...register("unitsNeeded", { 
//               required: "Units needed is required",
//               min: { value: 1, message: "Minimum 1 unit required" }
//             })}
//             className="input input-bordered w-full"
//           />
//           {errors.unitsNeeded && (
//             <span className="text-error text-sm">{errors.unitsNeeded.message}</span>
//           )}
//         </div>

//         <div className="form-control">
//           <label className="label">
//             <span className="label-text">Hospital Name</span>
//           </label>
//           <input
//             type="text"
//             {...register("hospital", { required: "Hospital name is required" })}
//             className="input input-bordered w-full"
//           />
//           {errors.hospital && (
//             <span className="text-error text-sm">{errors.hospital.message}</span>
//           )}
//         </div>

//         <div className="form-control">
//           <label className="label">
//             <span className="label-text">Location</span>
//           </label>
//           <input
//             type="text"
//             {...register("location", { required: "Location is required" })}
//             className="input input-bordered w-full"
//           />
//           {errors.location && (
//             <span className="text-error text-sm">{errors.location.message}</span>
//           )}
//         </div>

//         <div className="form-control">
//           <label className="label">
//             <span className="label-text">Urgency Level</span>
//           </label>
//           <select
//             {...register("urgency", { required: "Urgency level is required" })}
//             className="select select-bordered w-full"
//           >
//             <option value="normal">Normal</option>
//             <option value="urgent">Urgent</option>
//             <option value="emergency">Emergency</option>
//           </select>
//         </div>

//         <div className="form-control">
//           <label className="label">
//             <span className="label-text">Needed By</span>
//           </label>
//           <input
//             type="datetime-local"
//             {...register("neededBy", { required: "Date is required" })}
//             className="input input-bordered w-full"
//             min={new Date().toISOString().slice(0, 16)}
//           />
//           {errors.neededBy && (
//             <span className="text-error text-sm">{errors.neededBy.message}</span>
//           )}
//         </div>

//         <div className="form-control">
//           <label className="label">
//             <span className="label-text">Additional Information</span>
//           </label>
//           <textarea
//             {...register("additionalInfo")}
//             className="textarea textarea-bordered w-full"
//             rows={3}
//           />
//         </div>

//         <div className="flex justify-end gap-2 mt-6">
//           <button 
//             type="button" 
//             onClick={() => navigate(-1)}
//             className="btn btn-ghost"
//           >
//             Cancel
//           </button>
//           <button 
//             type="submit" 
//             className="btn btn-primary"
//             disabled={loading}
//           >
//             {loading ? 'Submitting...' : 'Create Request'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default BloodRequestCreate;