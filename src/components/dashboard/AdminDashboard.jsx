import React, { useState, useEffect } from 'react';
import { 
  UsersIcon, ClipboardListIcon, HeartIcon, CashIcon,
  BanIcon, CheckIcon, PencilIcon, ExclamationCircleIcon,
  CogIcon, ShieldCheckIcon, LogoutIcon, SearchIcon,
  ChevronUpIcon, ChevronDownIcon, ArrowSmRightIcon
} from '@heroicons/react/outline';
import apiClient from '../../services/http';
import { FaBell, FaUserCircle, FaTint } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
const AdminDashboard = () => {
  // State management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    donationCooldown: 90,
    maxUnitsPerDonation: 2
  });
  const [auditLogs, setAuditLogs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Data fetching
  const fetchData = async (endpoint, setData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(endpoint);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Data manipulation
  const handlePatch = async (endpoint, data, successCallback) => {
    try {
      const response = await apiClient.patch(endpoint, data);
      successCallback(response.data);
      setError(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
      return false;
    }
  };

  const handleDelete = async (endpoint, successCallback) => {
    try {
      await apiClient.delete(endpoint);
      successCallback();
      setError(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Delete operation failed');
      return false;
    }
  };

  // Action handlers
  const toggleUserStatus = (userId) => handlePatch(
    `/admin/users/${userId}/`,
    { is_active: !users.find(u => u.id === userId)?.is_active },
    () => setUsers(users.map(user => 
      user.id === userId ? {...user, is_active: !user.is_active} : user
    ))
  );

  const deleteUser = (userId) => handleDelete(
    `/admin/users/${userId}/`,
    () => setUsers(users.filter(user => user.id !== userId))
  );

  const updateRequestStatus = (reqId, status) => handlePatch(
    `/admin/blood-requests/${reqId}/`,
    { status },
    () => setRequests(requests.map(req => 
      req.id === reqId ? {...req, status} : req
    ))
  );

  const toggleDonationVerify = (donationId) => handlePatch(
    `/admin/donations/${donationId}/`,
    { is_verified: !donations.find(d => d.id === donationId)?.is_verified },
    () => setDonations(donations.map(donation => 
      donation.id === donationId 
        ? {...donation, is_verified: !donation.is_verified} 
        : donation
    ))
  );

  const updateSystemSettings = (newSettings) => handlePatch(
    '/admin/settings/',
    newSettings,
    setSettings
  );

  // Sorting functionality
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = (data) => {
    if (!sortConfig.key) return data;
    
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  // Filtering functionality
  const filterData = (data, fields) => {
    if (!searchQuery) return data;
    
    return data.filter(item => 
      fields.some(field => 
        String(item[field]).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  // Effect for loading data
  useEffect(() => {
    const endpoints = {
      dashboard: '/admin/dashboard/',
      users: '/admin/users/',
      requests: '/admin/blood-requests/',
      donations: '/admin/donations/',
      'audit-logs': '/admin/audit-logs/',
    };
    
    if (endpoints[activeTab]) {
      fetchData(endpoints[activeTab], (data) => {
        switch(activeTab) {
          case 'dashboard': setStats(data); break;
          case 'users': setUsers(data); break;
          case 'requests': setRequests(data); break;
          case 'donations': setDonations(data); break;
          case 'audit-logs': setAuditLogs(data); break;
          case 'settings': setSettings(data); break;
          default: break;
        }
      });
    }
  }, [activeTab]);

  // UI Components
  const StatCard = ({ icon, title, value, trend, trendText }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="flex items-start">
        <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white shadow-md">
          {React.cloneElement(icon, { className: "h-6 w-6" })}
        </div>
        <div className="ml-4">
          <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 flex items-center ${
              trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`}>
              <ArrowSmRightIcon className={`h-3 w-3 mr-1 ${
                trend.startsWith('+') ? 'rotate-0' : 'rotate-180'
              }`} />
              {trend} {trendText}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const SortableHeader = ({ name, sortKey, width = 'auto' }) => (
    <th 
      className={`px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer w-${width} bg-gray-50`}
      onClick={() => requestSort(sortKey)}
    >
      <div className="flex items-center">
        {name}
        {sortConfig.key === sortKey && (
          sortConfig.direction === 'asc' ? 
            <ChevronUpIcon className="ml-1 h-4 w-4" /> : 
            <ChevronDownIcon className="ml-1 h-4 w-4" />
        )}
      </div>
    </th>
  );

  const DataTable = ({ 
    title, 
    headers, 
    data, 
    renderRow,
    emptyMessage = "No data available",
    searchFields = [],
    sortable = true
  }) => {
    const filteredData = filterData(data, searchFields);
    const sortedData = sortable ? getSortedData(filteredData) : filteredData;

    return (
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
        
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">{title}</h2>
            {searchFields.length > 0 && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg mx-4 my-2">
            <div className="flex items-center">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        ) : sortedData.length === 0 ? (
          <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg m-4">
            {emptyMessage}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {headers.map((header) => (
                    sortable ? (
                      <SortableHeader 
                        key={header.key} 
                        name={header.name} 
                        sortKey={header.key}
                        width={header.width}
                      />
                    ) : (
                      <th 
                        key={header.key}
                        className={`px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-${header.width || 'auto'} bg-gray-50`}
                      >
                        {header.name}
                      </th>
                    )
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedData.map((item) => renderRow(item))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const SettingsPanel = () => (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100">
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
        <h2 className="text-lg font-bold text-gray-800">System Settings</h2>
      </div>
      <div className="p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <label htmlFor="maintenance" className="block text-sm font-medium text-gray-700 mb-1">
                Maintenance Mode
              </label>
              <p className="text-xs text-gray-500">
                When enabled, the system will be unavailable to regular users
              </p>
            </div>
            <button
              onClick={() => updateSystemSettings({ maintenanceMode: !settings.maintenanceMode })}
              className={`${
                settings.maintenanceMode ? 'bg-red-600' : 'bg-gray-200'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </button>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <label htmlFor="cooldown" className="block text-sm font-medium text-gray-700 mb-1">
              Donation Cooldown (days)
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Minimum days required between donations
            </p>
            <input
              type="number"
              min="30"
              max="365"
              value={settings.donationCooldown}
              onChange={(e) => updateSystemSettings({ donationCooldown: parseInt(e.target.value) || 90 })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
            />
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <label htmlFor="maxUnits" className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Units Per Donation
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Maximum blood units that can be donated at once
            </p>
            <input
              type="number"
              min="1"
              max="5"
              value={settings.maxUnitsPerDonation}
              onChange={(e) => updateSystemSettings({ maxUnitsPerDonation: parseInt(e.target.value) || 2 })}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
              {/* Admin Navbar */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-40 h-16 border-b border-gray-200">
        <div className="flex items-center justify-between h-full px-6 mx-auto max-w-screen-2xl">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-2">
            <FaTint className="text-red-600 text-2xl" />
            <span className="text-xl font-bold text-red-600 tracking-tight">Roktofy</span>
          </Link>

          {/* User Navigation */}
          <div className="flex items-center space-x-6">
            {/* Notification Badge */}
            <button className="relative text-gray-500 hover:text-gray-700 transition-colors">
              <FaBell className="text-xl" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </button>

            {/* User Profile Dropdown */}
            <div
              className="flex items-center space-x-2 group cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
                <FaUserCircle className="text-red-600 text-xl" />
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium text-gray-700">
                  {user?.first_name || user?.last_name
                    ? `${user?.first_name || ""} ${user?.last_name || ""}`.trim()
                    : "Admin"}
                </span>
                <span className="text-xs text-gray-500">{user?.email}</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0 ">
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-lg">
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-red-600 to-red-700">
            <h1 className="text-xl font-bold text-white">Admin Pannel</h1>
          </div>
          
          <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
            {[
              { id: 'dashboard', icon: <ClipboardListIcon className="h-5 w-5" />, label: 'Dashboard' },
              { id: 'users', icon: <UsersIcon className="h-5 w-5" />, label: 'User Management' },
              { id: 'requests', icon: <HeartIcon className="h-5 w-5" />, label: 'Blood Requests' },
              { id: 'donations', icon: <CashIcon className="h-5 w-5" />, label: 'Donations' },
              { id: 'audit-logs', icon: <ShieldCheckIcon className="h-5 w-5" />, label: 'Audit Logs' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-red-100 text-red-700 shadow-inner'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="mr-3">{tab.icon}</span>
                {tab.label}
                {activeTab === tab.id && (
                  <div className="ml-auto h-2 w-2 bg-red-500 rounded-full"></div>
                )}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button className="flex items-center w-full text-sm font-medium text-gray-700 hover:text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors">
              <LogoutIcon className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto pt-16">
        <div className="p-6">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex items-center">
                <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
                </div>
              ) : stats ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard 
                      icon={<UsersIcon />} 
                      title="Total Users" 
                      value={stats.users.total}
                      trend="+5%"
                      trendText="from last week"
                    />
                    <StatCard 
                      icon={<HeartIcon />} 
                      title="Active Requests" 
                      value={stats.requests.pending}
                      trend="+12%"
                      trendText="from yesterday"
                    />
                    <StatCard 
                      icon={<CashIcon />} 
                      title="Total Donations" 
                      value={stats.donations.total}
                    />
                    <StatCard 
                      icon={<ShieldCheckIcon />} 
                      title="Verified Donations" 
                      value={stats.donations.verified}
                      trend="+8%"
                      trendText="verification rate"
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <DataTable
                      title="Recent Requests"
                      headers={[
                        { key: 'id', name: 'ID', width: '20' },
                        { key: 'blood_type', name: 'Blood Type' },
                        { key: 'status', name: 'Status' }
                      ]}
                      data={stats.recent_requests || []}
                      searchFields={['blood_type', 'status']}
                      emptyMessage="No recent requests"
                      renderRow={(request) => (
                        <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{request.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className="font-medium">{request.blood_type}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              request.status === 'completed' ? 'bg-green-100 text-green-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      )}
                    />

                    <DataTable
                      title="Recent Donations"
                      headers={[
                        { key: 'id', name: 'ID', width: '20' },
                        { key: 'donor_email', name: 'Donor' },
                        { key: 'is_verified', name: 'Status' }
                      ]}
                      data={stats.recent_donations || []}
                      searchFields={['donor_email']}
                      emptyMessage="No recent donations"
                      renderRow={(donation) => (
                        <tr key={donation.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{donation.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className="font-medium">{donation.donor_email}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {donation.is_verified ? (
                              <span className="inline-flex items-center text-green-600 font-medium">
                                <CheckIcon className="h-4 w-4 mr-1" />
                                Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-yellow-600 font-medium">
                                <BanIcon className="h-4 w-4 mr-1" />
                                Pending
                              </span>
                            )}
                          </td>
                        </tr>
                      )}
                    />
                  </div>
                </>
              ) : (
                <div className="bg-white p-8 rounded-xl shadow text-center border border-gray-200">
                  <p className="text-gray-500 font-medium">Failed to load dashboard data</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'users' && (
            <DataTable 
              title="User Management"
              headers={[
                { key: 'id', name: 'ID', width: '20' },
                { key: 'first_name', name: 'Name' },
                { key: 'email', name: 'Email' },
                { key: 'user_type', name: 'Type' },
                { key: 'is_active', name: 'Status' },
                { key: 'actions', name: 'Actions', sortable: false }
              ]}
              data={users}
              loading={loading}
              error={error}
              searchFields={['first_name', 'last_name', 'email', 'user_type']}
              emptyMessage="No users found"
              renderRow={(user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{user.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.first_name} {user.last_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                      {user.user_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        user.is_active 
                          ? 'bg-red-50 text-red-700 hover:bg-red-100' 
                          : 'bg-green-50 text-green-700 hover:bg-green-100'
                      }`}
                    >
                      {user.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="px-3 py-1 rounded-lg text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )}
            />
          )}

          {activeTab === 'requests' && (
            <DataTable 
              title="Blood Requests"
              headers={[
                { key: 'id', name: 'ID', width: '20' },
                { key: 'blood_type', name: 'Blood Type' },
                { key: 'units_needed', name: 'Units' },
                { key: 'hospital', name: 'Hospital' },
                { key: 'status', name: 'Status' },
                { key: 'actions', name: 'Actions', sortable: false }
              ]}
              data={requests}
              loading={loading}
              error={error}
              searchFields={['blood_type', 'hospital', 'status']}
              emptyMessage="No blood requests found"
              renderRow={(req) => (
                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{req.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="font-medium">{req.blood_type}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {req.units_needed}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {req.hospital}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      req.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1">
                    {['pending', 'accepted', 'completed', 'cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateRequestStatus(req.id, status)}
                        className={`px-2 py-1 text-xs rounded-lg font-medium transition-colors ${
                          req.status === status 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </td>
                </tr>
              )}
            />
          )}

          {activeTab === 'donations' && (
            <DataTable 
              title="Donations"
              headers={[
                { key: 'id', name: 'ID', width: '20' },
                { key: 'donor_email', name: 'Donor' },
                { key: 'blood_type', name: 'Blood Type' },
                { key: 'donation_date', name: 'Date' },
                { key: 'is_verified', name: 'Verified' },
                { key: 'actions', name: 'Actions', sortable: false }
              ]}
              data={donations}
              loading={loading}
              error={error}
              searchFields={['donor_email', 'blood_type']}
              emptyMessage="No donations found"
              renderRow={(donation) => (
                <tr key={donation.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{donation.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="font-medium">{donation.donor_email}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {donation.blood_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(donation.donation_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {donation.is_verified ? (
                      <span className="inline-flex items-center text-green-600 font-medium">
                        <CheckIcon className="h-4 w-4 mr-1" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-yellow-600 font-medium">
                        <BanIcon className="h-4 w-4 mr-1" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => toggleDonationVerify(donation.id)}
                      className="flex items-center px-3 py-1 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      {donation.is_verified ? 'Unverify' : 'Verify'}
                    </button>
                  </td>
                </tr>
              )}
            />
          )}

          {activeTab === 'audit-logs' && (
            <DataTable 
              title="Audit Logs"
              headers={[
                { key: 'timestamp', name: 'Date/Time' },
                { key: 'action', name: 'Action' },
                { key: 'admin', name: 'Admin' },
                { key: 'details', name: 'Details' }
              ]}
              data={auditLogs}
              loading={loading}
              error={error}
              searchFields={['action', 'admin', 'details']}
              emptyMessage="No audit logs available"
              renderRow={(log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                      {log.action.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {log.admin}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {log.details}
                  </td>
                </tr>
              )}
            />
          )}

          {activeTab === 'settings' && <SettingsPanel />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

// import React, { useState, useEffect } from 'react';
// import { 
//   UsersIcon, ClipboardListIcon, HeartIcon, CashIcon,
//   BanIcon, CheckIcon, PencilIcon, ExclamationCircleIcon,
//   CogIcon, ShieldCheckIcon, LogoutIcon, SearchIcon,
//   ChevronUpIcon, ChevronDownIcon, ArrowSmRightIcon
// } from '@heroicons/react/outline';
// import apiClient from '../../services/http';

// const AdminDashboard = () => {
//   // State management
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [stats, setStats] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [requests, setRequests] = useState([]);
//   const [donations, setDonations] = useState([]);
//   const [settings, setSettings] = useState({
//     maintenanceMode: false,
//     donationCooldown: 90,
//     maxUnitsPerDonation: 2
//   });
//   const [auditLogs, setAuditLogs] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

//   // Data fetching
//   const fetchData = async (endpoint, setData) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await apiClient.get(endpoint);
//       setData(response.data);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to fetch data');
//       console.error('API Error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Data manipulation
//   const handlePatch = async (endpoint, data, successCallback) => {
//     try {
//       const response = await apiClient.patch(endpoint, data);
//       successCallback(response.data);
//       setError(null);
//       return true;
//     } catch (err) {
//       setError(err.response?.data?.message || 'Operation failed');
//       return false;
//     }
//   };

//   const handleDelete = async (endpoint, successCallback) => {
//     try {
//       await apiClient.delete(endpoint);
//       successCallback();
//       setError(null);
//       return true;
//     } catch (err) {
//       setError(err.response?.data?.message || 'Delete operation failed');
//       return false;
//     }
//   };

//   // Action handlers
//   const toggleUserStatus = (userId) => handlePatch(
//     `/admin/users/${userId}/`,
//     { is_active: !users.find(u => u.id === userId)?.is_active },
//     () => setUsers(users.map(user => 
//       user.id === userId ? {...user, is_active: !user.is_active} : user
//     ))
//   );

//   const deleteUser = (userId) => handleDelete(
//     `/admin/users/${userId}/`,
//     () => setUsers(users.filter(user => user.id !== userId))
//   );

//   const updateRequestStatus = (reqId, status) => handlePatch(
//     `/admin/blood-requests/${reqId}/`,
//     { status },
//     () => setRequests(requests.map(req => 
//       req.id === reqId ? {...req, status} : req
//     ))
//   );

//   const toggleDonationVerify = (donationId) => handlePatch(
//     `/admin/donations/${donationId}/`,
//     { is_verified: !donations.find(d => d.id === donationId)?.is_verified },
//     () => setDonations(donations.map(donation => 
//       donation.id === donationId 
//         ? {...donation, is_verified: !donation.is_verified} 
//         : donation
//     ))
//   );

//   const updateSystemSettings = (newSettings) => handlePatch(
//     '/admin/settings/',
//     newSettings,
//     setSettings
//   );

//   // Sorting functionality
//   const requestSort = (key) => {
//     let direction = 'asc';
//     if (sortConfig.key === key && sortConfig.direction === 'asc') {
//       direction = 'desc';
//     }
//     setSortConfig({ key, direction });
//   };

//   const getSortedData = (data) => {
//     if (!sortConfig.key) return data;
    
//     return [...data].sort((a, b) => {
//       if (a[sortConfig.key] < b[sortConfig.key]) {
//         return sortConfig.direction === 'asc' ? -1 : 1;
//       }
//       if (a[sortConfig.key] > b[sortConfig.key]) {
//         return sortConfig.direction === 'asc' ? 1 : -1;
//       }
//       return 0;
//     });
//   };

//   // Filtering functionality
//   const filterData = (data, fields) => {
//     if (!searchQuery) return data;
    
//     return data.filter(item => 
//       fields.some(field => 
//         String(item[field]).toLowerCase().includes(searchQuery.toLowerCase())
//       )
//     );
//   };

//   // Effect for loading data
//   useEffect(() => {
//     const endpoints = {
//       dashboard: '/admin/dashboard/',
//       users: '/admin/users/',
//       requests: '/admin/blood-requests/',
//       donations: '/admin/donations/',
//       'audit-logs': '/admin/audit-logs/',
//     //   settings: '/admin/settings/'
//     };
    
//     if (endpoints[activeTab]) {
//       fetchData(endpoints[activeTab], (data) => {
//         switch(activeTab) {
//           case 'dashboard': setStats(data); break;
//           case 'users': setUsers(data); break;
//           case 'requests': setRequests(data); break;
//           case 'donations': setDonations(data); break;
//           case 'audit-logs': setAuditLogs(data); break;
//           case 'settings': setSettings(data); break;
//           default: break;
//         }
//       });
//     }
//   }, [activeTab]);

//   // UI Components
//   const StatCard = ({ icon, title, value, trend, trendText }) => (
//     <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
//       <div className="flex items-start">
//         <div className="p-3 rounded-full bg-blue-100 text-blue-600">
//           {icon}
//         </div>
//         <div className="ml-4">
//           <h3 className="text-gray-500 text-sm">{title}</h3>
//           <p className="text-2xl font-bold">{value}</p>
//           {trend && (
//             <p className={`text-xs mt-1 flex items-center ${
//               trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
//             }`}>
//               <ArrowSmRightIcon className={`h-3 w-3 mr-1 ${
//                 trend.startsWith('+') ? 'rotate-0' : 'rotate-180'
//               }`} />
//               {trend} {trendText}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );

//   const SortableHeader = ({ name, sortKey, width = 'auto' }) => (
//     <th 
//       className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-${width}`}
//       onClick={() => requestSort(sortKey)}
//     >
//       <div className="flex items-center">
//         {name}
//         {sortConfig.key === sortKey && (
//           sortConfig.direction === 'asc' ? 
//             <ChevronUpIcon className="ml-1 h-4 w-4" /> : 
//             <ChevronDownIcon className="ml-1 h-4 w-4" />
//         )}
//       </div>
//     </th>
//   );

//   const DataTable = ({ 
//     title, 
//     headers, 
//     data, 
//     renderRow,
//     emptyMessage = "No data available",
//     searchFields = [],
//     sortable = true
//   }) => {
//     const filteredData = filterData(data, searchFields);
//     const sortedData = sortable ? getSortedData(filteredData) : filteredData;

//     return (
//       <div className="bg-white shadow rounded-lg overflow-hidden">
//         <div className="p-4 border-b border-gray-200">
//           <div className="flex items-center justify-between">
//             <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
//             {searchFields.length > 0 && (
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <SearchIcon className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Search..."
//                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//               </div>
//             )}
//           </div>
//         </div>

//         {loading ? (
//           <div className="flex justify-center items-center p-8">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         ) : error ? (
//           <div className="p-4 bg-red-50 border-l-4 border-red-500">
//             <div className="flex items-center">
//               <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2" />
//               <p className="text-red-700">{error}</p>
//             </div>
//           </div>
//         ) : sortedData.length === 0 ? (
//           <div className="p-8 text-center text-gray-500">
//             {emptyMessage}
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   {headers.map((header) => (
//                     sortable ? (
//                       <SortableHeader 
//                         key={header.key} 
//                         name={header.name} 
//                         sortKey={header.key}
//                         width={header.width}
//                       />
//                     ) : (
//                       <th 
//                         key={header.key}
//                         className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-${header.width || 'auto'}`}
//                       >
//                         {header.name}
//                       </th>
//                     )
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {sortedData.map((item) => renderRow(item))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     );
//   };

//   const SettingsPanel = () => (
//     <div className="bg-white shadow rounded-lg overflow-hidden">
//       <div className="p-4 border-b border-gray-200">
      
//       </div>
//       <div className="p-6">
//         <div className="space-y-4">
//           <div className="flex items-center justify-between">
//             <label htmlFor="maintenance" className="block text-sm font-medium text-gray-700">
//               Maintenance Mode
//             </label>
//             <button
//               onClick={() => updateSystemSettings({ maintenanceMode: !settings.maintenanceMode })}
//               className={`${
//                 settings.maintenanceMode ? 'bg-blue-600' : 'bg-gray-200'
//               } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
//             >
//               <span
//                 className={`${
//                   settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
//                 } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
//               />
//             </button>
//           </div>

//           <div>
//             <label htmlFor="cooldown" className="block text-sm font-medium text-gray-700">
//               Donation Cooldown (days)
//             </label>
//             <input
//               type="number"
//               min="30"
//               max="365"
//               value={settings.donationCooldown}
//               onChange={(e) => updateSystemSettings({ donationCooldown: parseInt(e.target.value) || 90 })}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//             />
//           </div>

//           <div>
//             <label htmlFor="maxUnits" className="block text-sm font-medium text-gray-700">
//               Maximum Units Per Donation
//             </label>
//             <input
//               type="number"
//               min="1"
//               max="5"
//               value={settings.maxUnitsPerDonation}
//               onChange={(e) => updateSystemSettings({ maxUnitsPerDonation: parseInt(e.target.value) || 2 })}
//               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Sidebar */}
//       <div className="hidden md:flex md:flex-shrink-0">
//         <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
//           <div className="p-4 border-b border-gray-200">
//             <h1 className="text-xl font-bold text-gray-800">Admin Pannel</h1>
          
//           </div>
          
//           <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
//             {[
//               { id: 'dashboard', icon: <ClipboardListIcon className="h-5 w-5" />, label: 'Summery' },
//               { id: 'users', icon: <UsersIcon className="h-5 w-5" />, label: 'User Management' },
//               { id: 'requests', icon: <HeartIcon className="h-5 w-5" />, label: 'Blood Requests' },
//               { id: 'donations', icon: <CashIcon className="h-5 w-5" />, label: 'Donations' },
//               { id: 'audit-logs', icon: <ShieldCheckIcon className="h-5 w-5" />, label: 'Audit Logs' },
//             //   { id: 'settings', icon: <CogIcon className="h-5 w-5" />, label: 'System Settings' },
//             ].map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`flex items-center w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
//                   activeTab === tab.id
//                     ? 'bg-blue-50 text-blue-700'
//                     : 'text-gray-700 hover:bg-gray-100'
//                 }`}
//               >
//                 <span className="mr-3">{tab.icon}</span>
//                 {tab.label}
//               </button>
//             ))}
//           </nav>

//           <div className="p-4 border-t border-gray-200">
//             <button className="flex items-center w-full text-sm font-medium text-gray-700 hover:text-gray-900">
//               <LogoutIcon className="h-5 w-5 mr-2" />
//               Logout
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 overflow-auto">
//         <div className="p-6">
//           {error && (
//             <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
//               <div className="flex items-center">
//                 <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2" />
//                 <p className="text-red-700">{error}</p>
//               </div>
//             </div>
//           )}

//           {activeTab === 'dashboard' && (
//             <>
//               <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
//               {loading ? (
//                 <div className="flex justify-center items-center h-64">
//                   <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//                 </div>
//               ) : stats ? (
//                 <>
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                     <StatCard 
//                       icon={<UsersIcon className="h-6 w-6" />} 
//                       title="Total Users" 
//                       value={stats.users.total}
//                       trend="+5%"
//                       trendText="from last week"
//                     />
//                     <StatCard 
//                       icon={<HeartIcon className="h-6 w-6" />} 
//                       title="Active Requests" 
//                       value={stats.requests.pending}
//                       trend="+12%"
//                       trendText="from yesterday"
//                     />
//                     <StatCard 
//                       icon={<CashIcon className="h-6 w-6" />} 
//                       title="Total Donations" 
//                       value={stats.donations.total}
//                     />
//                     <StatCard 
//                       icon={<ShieldCheckIcon className="h-6 w-6" />} 
//                       title="Verified Donations" 
//                       value={stats.donations.verified}
//                       trend="+8%"
//                       trendText="verification rate"
//                     />
//                   </div>

//                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                     <DataTable
//                       title="Recent Requests"
//                       headers={[
//                         { key: 'id', name: 'ID', width: '20' },
//                         { key: 'blood_type', name: 'Blood Type' },
//                         { key: 'status', name: 'Status' }
//                       ]}
//                       data={stats.recent_requests || []}
//                       searchFields={['blood_type', 'status']}
//                       emptyMessage="No recent requests"
//                       renderRow={(request) => (
//                         <tr key={request.id} className="hover:bg-gray-50">
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                             {request.id}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             {request.blood_type}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                               request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                               request.status === 'completed' ? 'bg-green-100 text-green-800' :
//                               'bg-blue-100 text-blue-800'
//                             }`}>
//                               {request.status}
//                             </span>
//                           </td>
//                         </tr>
//                       )}
//                     />

//                     <DataTable
//                       title="Recent Donations"
//                       headers={[
//                         { key: 'id', name: 'ID', width: '20' },
//                         { key: 'donor_email', name: 'Donor' },
//                         { key: 'is_verified', name: 'Status' }
//                       ]}
//                       data={stats.recent_donations || []}
//                       searchFields={['donor_email']}
//                       emptyMessage="No recent donations"
//                       renderRow={(donation) => (
//                         <tr key={donation.id} className="hover:bg-gray-50">
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                             {donation.id}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             {donation.donor_email}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                             {donation.is_verified ? (
//                               <span className="inline-flex items-center text-green-600">
//                                 <CheckIcon className="h-4 w-4 mr-1" />
//                                 Verified
//                               </span>
//                             ) : (
//                               <span className="inline-flex items-center text-yellow-600">
//                                 <BanIcon className="h-4 w-4 mr-1" />
//                                 Pending
//                               </span>
//                             )}
//                           </td>
//                         </tr>
//                       )}
//                     />
//                   </div>
//                 </>
//               ) : (
//                 <div className="bg-white p-8 rounded-lg shadow text-center">
//                   <p className="text-gray-500">Failed to load dashboard data</p>
//                 </div>
//               )}
//             </>
//           )}

//           {activeTab === 'users' && (
//             <DataTable 
//               title="User Management"
//               headers={[
//                 { key: 'id', name: 'ID', width: '20' },
//                 { key: 'first_name', name: 'Name' },
//                 { key: 'email', name: 'Email' },
//                 { key: 'user_type', name: 'Type' },
//                 { key: 'is_active', name: 'Status' },
//                 { key: 'actions', name: 'Actions', sortable: false }
//               ]}
//               data={users}
//               loading={loading}
//               error={error}
//               searchFields={['first_name', 'last_name', 'email', 'user_type']}
//               emptyMessage="No users found"
//               renderRow={(user) => (
//                 <tr key={user.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     {user.id}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm font-medium text-gray-900">
//                       {user.first_name} {user.last_name}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {user.email}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
//                     {user.user_type}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                       user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                     }`}>
//                       {user.is_active ? 'Active' : 'Inactive'}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
//                     <button
//                       onClick={() => toggleUserStatus(user.id)}
//                       className={`px-3 py-1 rounded-md text-xs ${
//                         user.is_active 
//                           ? 'bg-red-100 text-red-800 hover:bg-red-200' 
//                           : 'bg-green-100 text-green-800 hover:bg-green-200'
//                       }`}
//                     >
//                       {user.is_active ? 'Deactivate' : 'Activate'}
//                     </button>
//                     <button
//                       onClick={() => deleteUser(user.id)}
//                       className="px-3 py-1 rounded-md text-xs bg-gray-100 text-gray-800 hover:bg-gray-200"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               )}
//             />
//           )}

//           {activeTab === 'requests' && (
//             <DataTable 
//               title="Blood Requests"
//               headers={[
//                 { key: 'id', name: 'ID', width: '20' },
//                 { key: 'blood_type', name: 'Blood Type' },
//                 { key: 'units_needed', name: 'Units' },
//                 { key: 'hospital', name: 'Hospital' },
//                 { key: 'status', name: 'Status' },
//                 { key: 'actions', name: 'Actions', sortable: false }
//               ]}
//               data={requests}
//               loading={loading}
//               error={error}
//               searchFields={['blood_type', 'hospital', 'status']}
//               emptyMessage="No blood requests found"
//               renderRow={(req) => (
//                 <tr key={req.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     {req.id}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {req.blood_type}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {req.units_needed}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {req.hospital}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                       req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                       req.status === 'completed' ? 'bg-green-100 text-green-800' :
//                       'bg-blue-100 text-blue-800'
//                     }`}>
//                       {req.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-1">
//                     {['pending', 'accepted', 'completed', 'cancelled'].map((status) => (
//                       <button
//                         key={status}
//                         onClick={() => updateRequestStatus(req.id, status)}
//                         className={`px-2 py-1 text-xs rounded-md ${
//                           req.status === status 
//                             ? 'bg-blue-100 text-blue-800' 
//                             : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
//                         }`}
//                       >
//                         {status}
//                       </button>
//                     ))}
//                   </td>
//                 </tr>
//               )}
//             />
//           )}

//           {activeTab === 'donations' && (
//             <DataTable 
//               title="Donations"
//               headers={[
//                 { key: 'id', name: 'ID', width: '20' },
//                 { key: 'donor_email', name: 'Donor' },
//                 { key: 'blood_type', name: 'Blood Type' },
//                 { key: 'donation_date', name: 'Date' },
//                 { key: 'is_verified', name: 'Verified' },
//                 { key: 'actions', name: 'Actions', sortable: false }
//               ]}
//               data={donations}
//               loading={loading}
//               error={error}
//               searchFields={['donor_email', 'blood_type']}
//               emptyMessage="No donations found"
//               renderRow={(donation) => (
//                 <tr key={donation.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     {donation.id}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {donation.donor_email}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {donation.blood_type}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {new Date(donation.donation_date).toLocaleDateString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {donation.is_verified ? (
//                       <span className="inline-flex items-center text-green-600">
//                         <CheckIcon className="h-4 w-4 mr-1" />
//                         Verified
//                       </span>
//                     ) : (
//                       <span className="inline-flex items-center text-yellow-600">
//                         <BanIcon className="h-4 w-4 mr-1" />
//                         Pending
//                       </span>
//                     )}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                     <button
//                       onClick={() => toggleDonationVerify(donation.id)}
//                       className="flex items-center px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200"
//                     >
//                       <PencilIcon className="h-4 w-4 mr-1" />
//                       {donation.is_verified ? 'Unverify' : 'Verify'}
//                     </button>
//                   </td>
//                 </tr>
//               )}
//             />
//           )}

//           {activeTab === 'audit-logs' && (
//             <DataTable 
//               title="Audit Logs"
//               headers={[
//                 { key: 'timestamp', name: 'Date/Time' },
//                 { key: 'action', name: 'Action' },
//                 { key: 'admin', name: 'Admin' },
//                 { key: 'details', name: 'Details' }
//               ]}
//               data={auditLogs}
//               loading={loading}
//               error={error}
//               searchFields={['action', 'admin', 'details']}
//               emptyMessage="No audit logs available"
//               renderRow={(log) => (
//                 <tr key={log.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {new Date(log.timestamp).toLocaleString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
//                     {log.action.replace('_', ' ')}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {log.admin}
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-500">
//                     {log.details}
//                   </td>
//                 </tr>
//               )}
//             />
//           )}

//           {activeTab === 'settings' && <SettingsPanel />}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
// import React, { useState, useEffect } from 'react';
// import { 
//   UsersIcon, ClipboardListIcon, 
//   HeartIcon, CashIcon, 
//   BanIcon, CheckIcon, PencilIcon,
//   ExclamationCircleIcon
// } from '@heroicons/react/outline';
// import apiClient from '../../services/http';

// export default function AdminDashboard() {
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [stats, setStats] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [requests, setRequests] = useState([]);
//   const [donations, setDonations] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const fetchData = async (endpoint, setData) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await apiClient.get(endpoint);
//       setData(response.data);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to fetch data');
//       console.error('API Error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const endpoints = {
//       dashboard: '/admin/stats/',
//       users: '/admin/users/',
//       requests: '/admin/blood-requests/',
//       donations: '/admin/donations/'
//     };
    
//     if (endpoints[activeTab]) {
//       fetchData(endpoints[activeTab], (data) => {
//         if (activeTab === 'dashboard') setStats(data);
//         else if (activeTab === 'users') setUsers(data);
//         else if (activeTab === 'requests') setRequests(data);
//         else if (activeTab === 'donations') setDonations(data);
//       });
//     }
//   }, [activeTab]);

//   const handlePatch = async (endpoint, successCallback) => {
//     try {
//       const response = await apiClient.patch(endpoint);
//       successCallback(response.data);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Operation failed');
//     }
//   };

//   const toggleUserStatus = (userId) => handlePatch(
//     `/admin/users/${userId}/`,
//     () => setUsers(users.map(user => 
//       user.id === userId ? {...user, is_active: !user.is_active} : user
//     ))
//   );

//   const toggleDonationVerify = (donationId) => handlePatch(
//     `/admin/donations/${donationId}/`,
//     () => setDonations(donations.map(donation => 
//       donation.id === donationId 
//         ? {...donation, is_verified: !donation.is_verified} 
//         : donation
//     ))
//   );

//   const updateRequestStatus = (reqId, status) => handlePatch(
//     `/admin/blood-requests/${reqId}/`,
//     () => setRequests(requests.map(req => 
//       req.id === reqId ? {...req, status} : req
//     ))
//   );

//   // Reusable Components
//   const StatCard = ({ icon, title, value }) => (
//     <div className="bg-white p-6 rounded-lg shadow">
//       <div className="flex items-center">
//         <div className="p-3 rounded-full bg-blue-100 text-blue-600">{icon}</div>
//         <div className="ml-4">
//           <h3 className="text-gray-500 text-sm">{title}</h3>
//           <p className="text-2xl font-bold">{value}</p>
//         </div>
//       </div>
//     </div>
//   );

//   const DataTable = ({ title, headers, data, renderRow }) => (
//     <div>
//       <h2 className="text-2xl font-bold mb-6">{title}</h2>
//       {loading ? (
//         <div className="text-center py-8">Loading...</div>
//       ) : error ? (
//         <div className="bg-red-50 p-4 rounded-md flex items-center">
//           <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2" />
//           <span className="text-red-700">{error}</span>
//         </div>
//       ) : (
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           <table className="min-w-full">
//             <thead className="bg-gray-50">
//               <tr>
//                 {headers.map(header => (
//                   <th key={header} className="px-6 py-3 text-left">{header}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {data.map(item => renderRow(item))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
// <div className="w-64 h-screen bg-gray-100 text-gray-900 border-r p-4 flex flex-col shadow-sm">
//   <div className="mb-8">
//     <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
//     {/* <p className="text-sm text-gray-500">Blood Bank System</p> */}
//   </div>

//   <nav className="flex-1 space-y-1">
//     {[
//       { id: 'dashboard', icon: <ClipboardListIcon className="h-5 w-5" />, label: 'Dashboard' },
//       { id: 'users', icon: <UsersIcon className="h-5 w-5" />, label: 'Users' },
//       { id: 'requests', icon: <HeartIcon className="h-5 w-5" />, label: 'Blood Requests' },
//       { id: 'donations', icon: <CashIcon className="h-5 w-5" />, label: 'Donations' }
//     ].map((tab) => (
//       <button
//         key={tab.id}
//         onClick={() => setActiveTab(tab.id)}
//         className={`flex items-center w-full px-4 py-3 rounded-lg font-medium transition-colors ${
//           activeTab === tab.id
//             ? 'bg-white shadow text-blue-600'
//             : 'hover:bg-gray-200 text-gray-700'
//         }`}
//       >
//         {tab.icon}
//         <span className="ml-3">{tab.label}</span>
//       </button>
//     ))}
//   </nav>

//   <div className="mt-6 pt-4 text-sm text-gray-500 border-t">
//     <p className="mb-2">Logged in as: <span className="font-semibold text-gray-800">Admin</span></p>
//     <button className="w-full text-left hover:underline text-red-500 hover:text-red-600">
//       Logout
//     </button>
//   </div>
// </div>



//       {/* Main Content */}
//       <div className="flex-1 overflow-auto p-8">
//         {activeTab === 'dashboard' && (
//           <>
//             <h2 className="text-2xl font-bold mb-6">System Overview</h2>
//             {loading ? (
//               <div className="text-center py-8">Loading statistics...</div>
//             ) : error ? (
//               <div className="bg-red-50 p-4 rounded-md flex items-center">
//                 <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2" />
//                 <span className="text-red-700">{error}</span>
//               </div>
//             ) : stats ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                 <StatCard 
//                   icon={<UsersIcon className="h-6 w-6" />} 
//                   title="Total Users" 
//                   value={stats.users.total} 
//                 />
//                 <StatCard 
//                   icon={<UsersIcon className="h-6 w-6" />} 
//                   title="New Users Today" 
//                   value={stats.users.new_today} 
//                 />
//                 <StatCard 
//                   icon={<HeartIcon className="h-6 w-6" />} 
//                   title="Pending Requests" 
//                   value={stats.requests.pending} 
//                 />
//                 <StatCard 
//                   icon={<CashIcon className="h-6 w-6" />} 
//                   title="Total Payments" 
//                   value={`$${stats.payments.toLocaleString()}`} 
//                 />
//               </div>
//             ) : null}
//           </>
//         )}

//         {activeTab === 'users' && (
//           <DataTable 
//             title="User Management"
//             headers={['ID', 'Email', 'Name', 'Type', 'Blood Type', 'Status', 'Actions']}
//             data={users}
//             renderRow={(user) => (
//               <tr key={user.id} className="border-t hover:bg-gray-50">
//                 <td className="p-3">{user.id}</td>
//                 <td className="p-3">{user.email}</td>
//                 <td className="p-3">{user.first_name} {user.last_name}</td>
//                 <td className="p-3 capitalize">{user.user_type}</td>
//                 <td className="p-3">{user.blood_type || '-'}</td>
//                 <td className="p-3">
//                   <span className={`px-2 py-1 rounded-full text-xs ${
//                     user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                   }`}>
//                     {user.is_active ? 'Active' : 'Inactive'}
//                   </span>
//                 </td>
//                 <td className="p-3">
//                   <button
//                     onClick={() => toggleUserStatus(user.id)}
//                     className={`px-3 py-1 rounded-md text-sm transition-colors ${
//                       user.is_active 
//                         ? 'bg-red-100 text-red-800 hover:bg-red-200' 
//                         : 'bg-green-100 text-green-800 hover:bg-green-200'
//                     }`}
//                   >
//                     {user.is_active ? 'Deactivate' : 'Activate'}
//                   </button>
//                 </td>
//               </tr>
//             )}
//           />
//         )}

//         {activeTab === 'requests' && (
//           <DataTable 
//             title="Blood Requests"
//             headers={['ID', 'Blood Type', 'Units', 'Hospital', 'Requester', 'Status', 'Actions']}
//             data={requests}
//             renderRow={(req) => (
//               <tr key={req.id} className="border-t hover:bg-gray-50">
//                 <td className="p-3">{req.id}</td>
//                 <td className="p-3">{req.blood_type}</td>
//                 <td className="p-3">{req.units_needed}</td>
//                 <td className="p-3">{req.hospital}</td>
//                 <td className="p-3">{req.requester_email}</td>
//                 <td className="p-3 capitalize">{req.status}</td>
//                 <td className="p-3 space-x-2">
//                   {['pending', 'accepted', 'completed'].map((status) => (
//                     <button
//                       key={status}
//                       onClick={() => updateRequestStatus(req.id, status)}
//                       className={`px-2 py-1 text-xs rounded-md transition-colors ${
//                         req.status === status 
//                           ? 'bg-blue-100 text-blue-800' 
//                           : 'bg-gray-100 hover:bg-gray-200'
//                       }`}
//                     >
//                       {status}
//                     </button>
//                   ))}
//                 </td>
//               </tr>
//             )}
//           />
//         )}

//         {activeTab === 'donations' && (
//           <DataTable 
//             title="Donations"
//             headers={['ID', 'Donor', 'Blood Type', 'Units', 'Date', 'Verified', 'Actions']}
//             data={donations}
//             renderRow={(donation) => (
//               <tr key={donation.id} className="border-t hover:bg-gray-50">
//                 <td className="p-3">{donation.id}</td>
//                 <td className="p-3">{donation.donor_email}</td>
//                 <td className="p-3">{donation.blood_type}</td>
//                 <td className="p-3">{donation.units_donated}</td>
//                 <td className="p-3">{new Date(donation.donation_date).toLocaleDateString()}</td>
//                 <td className="p-3">
//                   {donation.is_verified ? (
//                     <CheckIcon className="h-5 w-5 text-green-500" />
//                   ) : (
//                     <BanIcon className="h-5 w-5 text-red-500" />
//                   )}
//                 </td>
//                 <td className="p-3">
//                   <button
//                     onClick={() => toggleDonationVerify(donation.id)}
//                     className="flex items-center px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
//                   >
//                     <PencilIcon className="h-4 w-4 mr-1" />
//                     {donation.is_verified ? 'Unverify' : 'Verify'}
//                   </button>
//                 </td>
//               </tr>
//             )}
//           />
//         )}
//       </div>
//     </div>
//   );
// }