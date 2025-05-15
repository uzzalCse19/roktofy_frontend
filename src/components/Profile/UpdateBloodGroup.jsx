import { useState } from 'react';
import axios from 'axios';

const UpdateBloodGroup = () => {
  const [bloodType, setBloodType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!bloodType) {
      setError('Please select a blood group');
      return;
    }

    const formData = new FormData();
    formData.append('blood_type', bloodType);

    try {
      setLoading(true);
      const authTokens = JSON.parse(localStorage.getItem('authTokens'));

      if (!authTokens?.access) {
        throw new Error('No authentication token found. Please login again.');
      }

      const response = await axios.patch(
        'https://roktofy.vercel.app/api/profile/update/',
        formData,
        {
          headers: {
            Authorization: `JWT ${authTokens.access}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      alert('Blood group updated successfully!');
      console.log('Updated blood group:', response.data);
    } catch (error) {
      console.error('Error updating blood group:', error);
      setError(
        error.response?.data?.detail ||
        error.message ||
        'Failed to update blood group. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow-md max-w-md mx-auto">
      <label className="block">
        <span className="text-gray-700 font-medium">Select Blood Group</span>
        <select
          value={bloodType}
          onChange={(e) => setBloodType(e.target.value)}
          className="mt-2 block w-full border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="">-- Select --</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>
      </label>

      {error && (
        <div className="text-red-500 text-sm mt-2">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold"
      >
        {loading ? 'Updating...' : 'Update Blood Group'}
      </button>
    </form>
  );
};

export default UpdateBloodGroup;
