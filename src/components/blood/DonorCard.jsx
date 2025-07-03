
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaCheckCircle } from 'react-icons/fa';
import apiClient from '../../services/http';
import RequestBloodModal from './RequestBloodModal';
import useAuthContext from '../../hooks/useAuthContext'; 
import { Button } from '../common/Button';
import BloodGroupBadge from './BloodGroupBadge';

export const DonorCard = ({ donor }) => {
  const { user } = useAuthContext(); 
  const navigate = useNavigate();
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  const isSameUser = user?.id === donor.id;

  const handleRequestBlood = async (requestData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        requester: user.id,
        blood_type: requestData.blood_type,
        units_needed: requestData.units_needed,
        hospital: requestData.hospital,
        location: requestData.location,
        urgency: requestData.urgency,
        additional_info: requestData.additional_info || '',
        needed_by: requestData.needed_by,
      };

      const response = await apiClient.post('/blood-requests/', payload);

      toast.success('Blood request submitted successfully!');
      navigate(`/request-confirmation/${response.data.id}`, {
        state: {
          donorDetails: donor,
          requestDetails: response.data,
          advice: 'Please wait for the donor to respond. They will contact you shortly.',
        },
      });
      setRequestSuccess(true);
      setIsRequestModalOpen(false);
    } catch (error) {
      console.error('Request failed:', error.response?.data);
      const errorMessage =
        error.response?.data?.message ||
        Object.values(error.response?.data || {}).flat().join(', ') ||
        'Failed to submit blood request';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-base-200 rounded-3xl shadow-lg p-6 w-full">
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <BloodGroupBadge bloodGroup={donor.blood_type} size="xl" />
        <div className="text-center sm:text-left">
          <h3 className="text-xl md:text-2xl font-extrabold text-gray-900">
            {donor.full_name}
          </h3>
          <p className="text-sm md:text-base text-gray-600">{donor.address}</p>
          <p className="text-sm md:text-base text-gray-600">{donor.email}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 text-sm md:text-base text-gray-800">
        <div>
          <p className="font-semibold text-gray-500">Blood Group</p>
          <p className="font-bold">{donor.blood_type}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-500">Phone</p>
          <p className="font-bold">{donor.phone || 'Not provided'}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-500">Last Donation</p>
          <p className="font-bold">
            {donor.last_donation_date || 'Not available'}
          </p>
        </div>
        <div>
          <p className="font-semibold text-gray-500">Status</p>
          <p
            className={`font-bold ${
              donor.is_available ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {donor.is_available ? 'Available' : 'Unavailable'}
          </p>
        </div>
      </div>

      <div className="mt-6">
        {!user ? (
          <Button
            onClick={() => navigate('/login')}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg"
          >
            Login to Request Blood
          </Button>
        ) : isSameUser ? (
          <p className="text-center font-semibold text-gray-500 py-3 text-lg">
            Your Profile
          </p>
        ) : requestSuccess ? (
          <div className="flex items-center justify-center gap-3 p-4 bg-green-50 text-green-700 rounded-xl text-lg">
            <FaCheckCircle className="text-green-600" />
            <span className="font-semibold">Request Sent</span>
          </div>
        ) : (
          <>
            <Button
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 text-lg"
              disabled={!donor.is_available}
              onClick={() => setIsRequestModalOpen(true)}
            >
              {isSubmitting ? 'Processing...' : 'Request Blood'}
            </Button>

            <RequestBloodModal
              open={isRequestModalOpen}
              onClose={() => setIsRequestModalOpen(false)}
              onSubmit={handleRequestBlood}
              donor={donor}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default DonorCard;


