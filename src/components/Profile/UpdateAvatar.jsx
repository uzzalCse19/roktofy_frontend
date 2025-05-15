import { useState } from 'react';
import axios from 'axios';

const UpdateAvatar = () => {
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
    setError(null); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!avatar) {
      setError('Please select an image file');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', avatar);

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
      
      alert('Avatar updated successfully!');
      console.log('Updated avatar:', response.data);
      localStorage.setItem("authTokens", JSON.stringify(response.data));
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setError(
        error.response?.data?.detail || 
        error.message || 
        'Failed to update avatar. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow-md max-w-md mx-auto">
      <label className="block">
        <span className="text-gray-700 font-medium">Choose Profile Picture</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-2 block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer"
        />
      </label>

      {preview && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-600">Preview:</p>
          <img src={preview} alt="Avatar Preview" className="h-32 w-32 rounded-full object-cover border mt-2" />
        </div>
      )}

      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold"
      >
        {loading ? 'Updating...' : 'Update Avatar'}
      </button>
    </form>
  );
};

export default UpdateAvatar;