import { useEffect, useState } from 'react';
import apiClient from '../../services/http';
import useAuthContext from '../../hooks/useAuthContext';
import BloodEventCard from '../blood/BloodEventCard';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user } = useAuthContext();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await apiClient.get('/dashboard/');
      setDashboardData(res.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      await apiClient.post(`/blood-requests/${id}/accept/`);
      toast.success('Request accepted!');
      fetchDashboard(); 
    } catch (error) {
      toast.error(error.response?.data?.request?.[0] || 'Failed to accept request');
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (!user) return <div className="text-center py-10 text-red-500">Please login to view the dashboard.</div>;

  if (loading) return <div className="text-center py-10">Loading dashboard...</div>;

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">Welcome to your Dashboard</h2>

   
      <div>
        <h3 className="text-xl font-semibold mb-3">Recipient Requests</h3>
        {dashboardData?.available_requests?.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardData.available_requests.map((event) => (
              <BloodEventCard key={event.id} event={event} onAccept={handleAccept} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No available blood requests right now.</p>
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-3">Donation History</h3>
        {dashboardData?.donation_history?.length > 0 ? (
          <ul className="space-y-2">
            {dashboardData.donation_history.map((donation) => (
              <li key={donation.id} className="border p-3 rounded shadow-sm">
                <p><strong>Blood Group:</strong> {donation.blood_type}</p>
                <p><strong>Status:</strong> {donation.status}</p>
                <p><strong>Hospital:</strong> {donation.hospital}</p>
                <p><strong>Donated on:</strong> {new Date(donation.created_at).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No donation history available.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
