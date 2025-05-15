import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import apiClient from '../../services/http';
import useAuth from '../../hooks/useAuth';
import { toast } from 'react-toastify';

const DashboardPage = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('requests');
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      fetchDashboardData();
    }
  }, [user, authLoading, navigate]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get('/dashboard/');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
   
      const response = await apiClient.post(`/blood-requests/${requestId}/accept/`);
      
      toast.success('Request accepted successfully!');
      
    
      const acceptedRequest = dashboardData.available_requests.find(req => req.id === requestId);
      
      setDashboardData(prev => ({
        ...prev,
        available_requests: prev.available_requests.filter(req => req.id !== requestId),
        donation_history: [
          {
            id: Date.now(), 
            request_blood_type: acceptedRequest.blood_type,
            request_hospital: acceptedRequest.hospital,
            donation_date: new Date().toISOString(),
            units_donated: acceptedRequest.units_needed,
            is_verified: true
          },
          ...prev.donation_history
        ],
        completed_donations: (prev.completed_donations || 0) + 1,
        last_donation_date: new Date().toISOString()
      }));

  
      setTimeout(fetchDashboardData, 1500);

    } catch (error) {
      console.error('Error accepting request:', error);
      
  
      if (error.response?.status === 404 || error.response?.status === 500) {
        try {
          await handleAcceptFallback(requestId);
        } catch (fallbackError) {
          toast.error(fallbackError.response?.data?.error || 'Failed to accept request');
        }
      } else {
        toast.error(error.response?.data?.error || 'Failed to accept request');
      }
    }
  };

  const handleAcceptFallback = async (requestId) => {

    const request = dashboardData.available_requests.find(req => req.id === requestId);
    

    await apiClient.patch(`/blood-requests/${requestId}/`, {
      status: 'accepted'
    });

    await apiClient.post('/donations/', {
      donor: user.id,
      request: requestId,
      blood_type: request.blood_type,
      units_donated: request.units_needed,
      is_verified: true
    });

    toast.success('Request accepted (fallback method)');
    fetchDashboardData(); 
  };

  const handleCancelRequest = async (requestId) => {
    try {
      await apiClient.patch(`/blood-requests/${requestId}/`, { status: 'cancelled' });
      toast.success('Request cancelled successfully!');
      
      setDashboardData(prev => ({
        ...prev,
        my_requests: prev.my_requests.map(req => 
          req.id === requestId ? { ...req, status: 'cancelled' } : req
        ),
        pending_requests: prev.pending_requests - 1
      }));
    } catch (error) {
      console.error('Error cancelling request:', error);
      toast.error(error.response?.data?.error || 'Failed to cancel request');
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!user) return null;

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Failed to load dashboard data</p>
        <button 
          onClick={fetchDashboardData}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
          
       
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-blue-800">Blood Group</h3>
              <p className="text-2xl font-bold text-blue-600">
                {dashboardData.blood_type || 'Not specified'}
              </p>
            </div>
            
            {user.user_type !== 'donor' && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-purple-800">My Requests</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {dashboardData.total_requests || 0}
                </p>
                <p className="text-sm text-purple-500">
                  {dashboardData.pending_requests || 0} pending
                </p>
              </div>
            )}
            
            {user.user_type !== 'recipient' && dashboardData.blood_type && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-green-800">Donations</h3>
                <p className="text-2xl font-bold text-green-600">
                  {dashboardData.completed_donations || 0}
                </p>
                <p className="text-sm text-green-500">
                  {dashboardData.last_donation_date 
                    ? `Last: ${format(parseISO(dashboardData.last_donation_date), 'MMM d, yyyy')}`
                    : 'Never donated'}
                </p>
              </div>
            )}
          </div>

   
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('requests')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'requests' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500'
                }`}
              >
                Blood Requests
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'history' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500'
                }`}
              >
                Donation History
              </button>
            </nav>
          </div>


          {activeTab === 'requests' ? (
            <div className="space-y-6">
              {user.user_type !== 'recipient' && dashboardData.blood_type && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Available Requests for {dashboardData.blood_type}
                  </h2>
                  {dashboardData.available_requests?.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardData.available_requests.map(request => (
                        <div key={request.id} className="border border-gray-200 rounded-lg p-6 shadow-sm">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-bold">{request.hospital}</h3>
                              <p className="text-gray-600">{request.location}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              request.urgency === 'high' ? 'bg-orange-100 text-orange-800' : 
                              request.urgency === 'emergency' ? 'bg-red-100 text-red-800' : 
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {request.urgency}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-500">Blood Type</p>
                              <p className="font-medium">{request.blood_type}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Units Needed</p>
                              <p className="font-medium">{request.units_needed}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Needed By</p>
                              <p className="font-medium">
                                {format(parseISO(request.needed_by), 'MMM d, yyyy h:mm a')}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Contact</p>
                              <p className="font-medium">{request.requester_phone}</p>
                            </div>
                          </div>
                          
                          {request.additional_info && (
                            <div className="bg-gray-50 p-3 rounded mb-4">
                              <p className="text-sm text-gray-700">{request.additional_info}</p>
                            </div>
                          )}
                          
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleAcceptRequest(request.id)}
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-medium"
                            >
                              Accept Request
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No available requests matching your blood group</p>
                  )}
                </div>
              )}

              {user.user_type !== 'donor' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">My Requests</h2>
                  {dashboardData.my_requests?.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardData.my_requests.map(request => (
                        <div key={request.id} className="border border-gray-200 rounded-lg p-6 shadow-sm">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-bold">{request.hospital}</h3>
                              <p className="text-gray-600">{request.location}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {request.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-500">Blood Type</p>
                              <p className="font-medium">{request.blood_type}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Units Needed</p>
                              <p className="font-medium">{request.units_needed}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Needed By</p>
                              <p className="font-medium">
                                {format(parseISO(request.needed_by), 'MMM d, yyyy h:mm a')}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Created</p>
                              <p className="font-medium">
                                {format(parseISO(request.created_at), 'MMM d, yyyy')}
                              </p>
                            </div>
                          </div>
                          
                          {request.status === 'pending' && (
                            <button
                              onClick={() => handleCancelRequest(request.id)}
                              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md font-medium"
                            >
                              Cancel Request
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">You haven't made any requests yet</p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Donation History</h2>
              {dashboardData.donation_history?.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.donation_history.map(donation => (
                    <div key={donation.id} className="border border-gray-200 rounded-lg p-6 shadow-sm">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold">{donation.request_hospital}</h3>
                          <p className="text-gray-600">
                            {format(parseISO(donation.donation_date), 'MMM d, yyyy h:mm a')}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          donation.is_verified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {donation.is_verified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Blood Type</p>
                          <p className="font-medium">{donation.request_blood_type}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Units Donated</p>
                          <p className="font-medium">{donation.units_donated}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No donation history available</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;