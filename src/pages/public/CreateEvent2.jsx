import React, { useState } from 'react';
// <-- Make sure the path is correct
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/http';

const CreateEvent2 = () => {
  const [formData, setFormData] = useState({
    blood_type: '',
    required_date: '',
    location: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const bloodTypes = [
    'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await apiClient.post(
        '/blood-events/',
        formData
      );
      setSuccess('Blood event created successfully!');
      setFormData({
        blood_type: '',
        required_date: '',
        location: '',
        message: '',
      });
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      console.error(err);
      if (err.response?.data) {
        setError(
          Object.values(err.response.data).flat().join('\n')
        );
      } else {
        setError('Failed to create event. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-red-600 text-center">
          Create Blood Donation Event
        </h2>

        {error && <div className="text-red-600 mb-4 whitespace-pre-line">{error}</div>}
        {success && <div className="text-green-600 mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1">Blood Type</label>
            <select
              name="blood_type"
              value={formData.blood_type}
              onChange={handleChange}
              required
              className="w-full border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="">Select</option>
              {bloodTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Required Date</label>
            <input
              type="date"
              name="required_date"
              value={formData.required_date}
              onChange={handleChange}
              required
              className="w-full border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full border-gray-300 rounded-lg px-4 py-2"
              placeholder="Hospital or address"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Message (optional)</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-lg px-4 py-2"
              placeholder="Any additional message"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            {loading ? 'Creating...' : 'Create Event'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent2;
