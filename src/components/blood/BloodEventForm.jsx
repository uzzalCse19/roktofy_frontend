import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BloodEventForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    blood_type: '',
    message: '',
    required_date: '',,
    location: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/events', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSuccess(true);
      setError('');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event');
    }
  };

  const bloodGroups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

  return (
    <div className="event-form">
      <h2>Create Blood Donation Event</h2>
      {error && <div className="alert error">{error}</div>}
      {success && (
        <div className="alert success">
          Event created successfully! Redirecting to dashboard...
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Blood Group Needed</label>
          <select
            name="blood_type"
            value={formData.blood_type}
            onChange={handleChange}
            required
          >
            <option value="">Select Blood Group</option>
            {bloodGroups.map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Event Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label>Required Date</label>
          <input
            type="datetime-local"
            name="required_date:"
            value={formData.required_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn-primary">
          Create Event
        </button>
      </form>
    </div>
  );
};

export default BloodEventForm;