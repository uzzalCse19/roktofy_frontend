import React, { useState, useEffect, useRef } from 'react';
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

// Custom hook for detecting clicks outside an element
function useClickOutside(ref, callback) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const navigate = useNavigate();
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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  const sidebarRef = useRef();
  useClickOutside(sidebarRef, () => {
    if (mobileSidebarOpen) setMobileSidebarOpen(false);
  });

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
          <div className="flex items-center space-x-4">
            {/* Hamburger menu for mobile */}
            <button 
              className="md:hidden text-gray-500 hover:text-gray-700"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            {/* Logo Section */}
            <Link to="/" className="flex items-center space-x-2">
              <FaTint className="text-red-600 text-2xl" />
              <span className="text-xl font-bold text-red-600 tracking-tight">Roktofy</span>
            </Link>
          </div>

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
                    : "User"}
                </span>
                <span className="text-xs text-gray-500">{user?.email}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar - shown on desktop, hidden on mobile unless open */}
      <div 
        ref={sidebarRef}
        className={`fixed md:relative z-50 md:z-auto inset-y-0 left-0 transform ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out w-64 bg-white border-r border-gray-200 flex flex-col shadow-lg md:shadow-none`}
      >
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-red-600 to-red-700">
          <h1 className="text-xl font-bold text-white">Admin Panel</h1>
        </div>
        
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {[
            { id: 'dashboard', icon: <ClipboardListIcon className="h-5 w-5" />, label: 'Dashboard' },
            { id: 'users', icon: <UsersIcon className="h-5 w-5" />, label: 'User Management' },
            { id: 'requests', icon: <HeartIcon className="h-5 w-5" />, label: 'Blood Requests' },
            { id: 'donations', icon: <CashIcon className="h-5 w-5" />, label: 'Donations' },
            { id: 'audit-logs', icon: <ShieldCheckIcon className="h-5 w-5" />, label: 'Audit Logs' },
            { id: 'settings', icon: <CogIcon className="h-5 w-5" />, label: 'Settings' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setMobileSidebarOpen(false);
              }}
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

      {/* Main Content */}
      <div className="flex-1 overflow-auto pt-16 md:pt-0">
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