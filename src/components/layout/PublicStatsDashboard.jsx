import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import apiClient from '../../services/http';  

const PublicStatsDashboard = () => {
  const [stats, setStats] = useState({
    total_users: 0,
    total_donors: 0,
    total_recipients: 0,
    total_blood_requests: 0,
    completed_donations: 0,
    pending_requests: 0,
    upcoming_events: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/stats/public/');
        setStats(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      {user && (
        <div className="bg-white rounded-xl shadow-lg p-8 mb-10 text-center">
          <h2 className="text-3xl font-bold text-red-600">Together, We Make a Difference</h2>
          <p className="text-gray-600 mt-2">Your contribution saves lives.</p>
        </div>
      )}
      

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Users" 
          value={stats.total_users} 
          icon={<UsersIcon />}
          color="bg-blue-100"
          textColor="text-blue-800"
        />
        
        <StatCard 
          title="Total Donors" 
          value={stats.total_donors} 
          icon={<DonorIcon />}
          color="bg-green-100"
          textColor="text-green-800"
        />
        
        <StatCard 
          title="Total Recipients" 
          value={stats.total_recipients} 
          icon={<RecipientIcon />}
          color="bg-purple-100"
          textColor="text-purple-800"
        />
        
        <StatCard 
          title="Total Requests" 
          value={stats.total_blood_requests} 
          icon={<RequestIcon />}
          color="bg-yellow-100"
          textColor="text-yellow-800"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Completed Donations" 
          value={stats.completed_donations} 
          icon={<CheckIcon />}
          color="bg-teal-100"
          textColor="text-teal-800"
        />
        
        <StatCard 
          title="Pending Requests" 
          value={stats.pending_requests} 
          icon={<ClockIcon />}
          color="bg-orange-100"
          textColor="text-orange-800"
        />
        
        <StatCard 
          title="Upcoming Events" 
          value={stats.upcoming_events} 
          icon={<CalendarIcon />}
          color="bg-pink-100"
          textColor="text-pink-800"
        />
      </div>
    </div>
  );
};

// Reusable StatCard component
const StatCard = ({ title, value, icon, color, textColor }) => (
  <div className={`p-6 rounded-lg shadow-md ${color} transition-transform hover:scale-105`}>
    <div className="flex justify-between items-center">
      <div>
        <p className={`text-sm font-medium ${textColor}`}>{title}</p>
        <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
      </div>
      <div className={`p-3 rounded-full ${textColor.replace('text', 'bg').replace('-800', '-200')}`}>
        {icon}
      </div>
    </div>
  </div>
);

// Icon components (keep your existing icons)
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const DonorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
  </svg>
);


const RecipientIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

const RequestIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export default PublicStatsDashboard;