import React, { useState } from 'react';

const BLOOD_GROUPS = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
];

const CreateEventModal = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    blood_type: '',
    message: '',
    required_date: '',
    location:''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Create Blood Donation Event</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="blood_type">
                Blood Group Needed
              </label>
              <select
                id="blood_type"
                name="blood_type"
                value={formData.blood_type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              >
                <option value="">Select Blood Group</option>
                {BLOOD_GROUPS.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="required_date">
                Required Date
              </label>
              <input
                type="date"
                id="required_date"
                name="required_date"
                value={formData.required_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
                  <div className="mb-4">
  <label className="block text-gray-700 mb-2" htmlFor="location">
    Location
  </label>
  <input
    type="text"
    id="location"
    name="location"
    value={formData.location}
    onChange={handleChange}
    className="w-full px-3 py-2 border border-gray-300 rounded-md"
    required
    placeholder="Enter hospital or venue address"
  />
</div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="message">
                Additional Message (Optional)
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Create Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;