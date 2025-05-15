import { useState } from 'react';
import axios from 'axios';

const DonorProfile = () => {
  const [formData, setFormData] = useState({
    user_type: 'donor', 
    age: '',
    address: '',
    last_donation_date: '',
    is_available: true,
    blood_group: '',
  });

  const [showBloodGroup, setShowBloodGroup] = useState(false);
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
    setLoading(true);
    setError(null);

    const authTokens = JSON.parse(localStorage.getItem('authTokens'));
    if (!authTokens?.access) {
      setError('Authentication token missing. Please log in again.');
      return;
    }

    try {

      await axios.patch(
        'https://roktofy.vercel.app/api/me/update/',
        {
          user_type: formData.user_type,
          age: formData.age,
          address: formData.address,
          last_donation_date: formData.last_donation_date,
          is_available: formData.is_available,
        },
        {
          headers: {
            Authorization: `JWT ${authTokens.access}`,
            'Content-Type': 'application/json',
          },
        }
      );


      if (showBloodGroup && formData.blood_group) {
        const bloodFormData = new FormData();
        bloodFormData.append('blood_type', formData.blood_group);

        await axios.patch(
          'https://roktofy.vercel.app/api/profile/update/',
          bloodFormData,
          {
            headers: {
              Authorization: `JWT ${authTokens.access}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      }

      alert('Donor Account Created Successfully');
    } catch (err) {
      console.error('Submission failed:', err);
      setError(err.response?.data?.detail || 'Submission failed.');
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
        <label className="block font-medium">User Type</label>
        <div className="w-full mt-1 border rounded px-3 py-2 bg-gray-100">
          Donor
        </div>
      </div>

      <div>
        <label className="block font-medium">Age</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          className="w-full mt-1 border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block font-medium">Address</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full mt-1 border rounded px-3 py-2"
        ></textarea>
      </div>

      <div>
        <label className="block font-medium">Last Donation Date</label>
        <input
          type="date"
          name="last_donation_date"
          value={formData.last_donation_date}
          onChange={handleChange}
          className="w-full mt-1 border rounded px-3 py-2"
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
        <label className="font-medium">Available to Donate</label>
      </div>

  
      {showBloodGroup && (
        <div>
          <label className="block font-medium">Blood Group</label>
          <select
            name="blood_group"
            value={formData.blood_group}
            onChange={handleChange}
            className="w-full mt-1 border rounded px-3 py-2"
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
        </div>
      )}


      <div className="flex justify-start">
        <button
          type="button"
          onClick={() => setShowBloodGroup(true)}
          disabled={showBloodGroup}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded font-semibold"
        >
          Add Blood Group
        </button>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      {/* Finish Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
        >
          {loading ? 'Submitting...' : 'Finish'}
        </button>
      </div>
    </form>
  );
};

export default DonorProfile;