import { useLocation } from 'react-router-dom';
import BloodGroupBadge from '../components/blood/BloodGroupBadge';



export const RequestConfirmation = () => {
  const { state } = useLocation();
  const { donorDetails, requestDetails, advice } = state || {};

  if (!state) {
    return <div className="text-center py-8">Invalid request confirmation</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">Blood Request Confirmation</h1>
        
        <div className="mb-8 p-4 bg-green-50 rounded-lg">
          <h2 className="text-xl font-semibold text-green-700 mb-2">Request Submitted Successfully!</h2>
          <p className="text-green-600">An email has been sent to the donor with your request details.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Donor Information</h2>
            <div className="flex items-center gap-4 mb-4">
              <BloodGroupBadge bloodGroup={donorDetails.blood_type} />
              <div>
                <h3 className="font-medium text-lg">{donorDetails.full_name}</h3>
                <p className="text-gray-600">{donorDetails.address}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p><span className="font-medium">Blood Group:</span> {donorDetails.blood_type}</p>
              <p><span className="font-medium">Contact:</span> {donorDetails.phone || 'Not provided'}</p>
              <p><span className="font-medium">Availability:</span> {donorDetails.is_available ? 'Available' : 'Unavailable'}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Request Details</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Hospital:</span> {requestDetails.hospital}</p>
              <p><span className="font-medium">Location:</span> {requestDetails.location}</p>
              <p><span className="font-medium">Units Needed:</span> {requestDetails.units_needed}</p>
              <p><span className="font-medium">Urgency:</span> {requestDetails.urgency}</p>
              <p><span className="font-medium">Needed By:</span> {new Date(requestDetails.needed_by).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">What Happens Next?</h2>
          <p className="text-gray-700">{advice}</p>
          <p className="mt-2 text-gray-700">You'll receive an email when the donor responds to your request.</p>
        </div>
      </div>
    </div>
  );
};