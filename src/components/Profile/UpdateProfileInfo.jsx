import { useState } from 'react';
import axios from 'axios';

const UpdateProfileInfo = () => {
  const [formData, setFormData] = useState({
    user_type: '',
    age: '',
    address: '',
    last_donation_date: '',
    is_available: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      const authTokens = JSON.parse(localStorage.getItem('authTokens'));

      if (!authTokens?.access) {
        throw new Error('Authentication token missing. Please log in again.');
      }

      const response = await axios.patch(
        'https://roktofy.vercel.app/api/me/update/',
        formData,
        {
          headers: {
            Authorization: `JWT ${authTokens.access}`,
            'Content-Type': 'application/json',
          },
        }
      );

      alert('User information updated successfully!');
      console.log('Updated user:', response.data);
    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.detail || err.message || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-white rounded shadow-md max-w-md mx-auto"
    >
      <div>
        <label className="block text-gray-700 font-medium">User Type</label>
        <select
          name="user_type"
          value={formData.user_type}
          onChange={handleChange}
          className="w-full mt-1 border border-gray-300 rounded px-3 py-2"
        >
          <option value="">-- Select --</option>
          <option value="donor">Donor</option>
          <option value="recipient">Recipient</option>
          <option value="both">Both</option>
        </select>
      </div>

      <div>
        <label className="block text-gray-700 font-medium">Age</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          className="w-full mt-1 border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium">Address</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full mt-1 border border-gray-300 rounded px-3 py-2"
        ></textarea>
      </div>

      <div>
        <label className="block text-gray-700 font-medium">
          Last Donation Date
        </label>
        <input
          type="date"
          name="last_donation_date"
          value={formData.last_donation_date}
          onChange={handleChange}
          className="w-full mt-1 border border-gray-300 rounded px-3 py-2"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="is_available"
          checked={formData.is_available}
          onChange={handleChange}
          className="mr-2"
        />
        <label className="text-gray-700 font-medium">Available to Donate</label>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
      >
        {loading ? 'Updating...' : 'Update Profile'}
      </button>
    </form>
  );
};

export default UpdateProfileInfo;
