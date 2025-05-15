
import React, { useEffect, useState } from 'react';
import apiClient from '../../services/http';
import DonorCard from '../../components/blood/DonorCard';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const DonorListPage = () => {
  const [donors, setDonors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    blood_type: '',
    search: '',
    ordering: '-last_donation_date'
  });

  useEffect(() => {
    fetchDonors();
  }, [filters]);

  const fetchDonors = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      
      if (filters.blood_type) params.append('profile__blood_type', filters.blood_type);
      if (filters.search) params.append('search', filters.search);
      if (filters.ordering) params.append('ordering', filters.ordering);
      
      const response = await apiClient.get(`/donor-list/?${params.toString()}`);
      setDonors(response.data);
    } catch (error) {
      console.error('Error fetching donors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Available Blood Donors</h1>
        
  
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
              <select
                value={filters.blood_type}
                onChange={(e) => handleFilterChange('blood_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Blood Groups</option>
                {BLOOD_GROUPS.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Search by name or location"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={filters.ordering}
                onChange={(e) => handleFilterChange('ordering', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="-last_donation_date">Most Recent Donors</option>
                <option value="last_donation_date">Oldest Donors</option>
                <option value="first_name">Name (A-Z)</option>
                <option value="-first_name">Name (Z-A)</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : donors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {filters.blood_type
                ? `No available donors found for blood group ${filters.blood_type}`
                : 'No available donors found'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donors.map(donor => (
              <DonorCard key={donor.id} donor={donor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorListPage;