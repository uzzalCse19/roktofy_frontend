import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { createBloodRequest } from '../../../services/api/requests';
import BloodGroupBadge from './BloodGroupBadge';

const BloodRequestForm = ({ onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    blood_type: '',
    units_needed: 1,
    hospital: '',
    location: '',
    urgency: 'normal',
    additional_info: '',
    needed_by: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bloodGroups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await createBloodRequest({
        ...formData,
        requester: user.id
      });
      onSuccess();
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="blood-request-form">
      <h2>Create Blood Request</h2>
      
      <div className="form-group">
        <label>Blood Group Needed *</label>
        <select
          name="blood_type"
          value={formData.blood_type}
          onChange={handleChange}
          required
          className={errors.blood_type ? 'error' : ''}
        >
          <option value="">Select Blood Group</option>
          {bloodGroups.map(group => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>
        {errors.blood_type && <span className="error-message">{errors.blood_type}</span>}
      </div>
      
      <div className="form-group">
        <label>Units Needed *</label>
        <input
          type="number"
          name="units_needed"
          min="1"
          value={formData.units_needed}
          onChange={handleChange}
          required
          className={errors.units_needed ? 'error' : ''}
        />
        {errors.units_needed && <span className="error-message">{errors.units_needed}</span>}
      </div>
      
      <div className="form-group">
        <label>Hospital/Clinic Name *</label>
        <input
          type="text"
          name="hospital"
          value={formData.hospital}
          onChange={handleChange}
          required
          className={errors.hospital ? 'error' : ''}
        />
        {errors.hospital && <span className="error-message">{errors.hospital}</span>}
      </div>
      
      <div className="form-group">
        <label>Location *</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          className={errors.location ? 'error' : ''}
        />
        {errors.location && <span className="error-message">{errors.location}</span>}
      </div>
      
      <div className="form-group">
        <label>Urgency *</label>
        <select
          name="urgency"
          value={formData.urgency}
          onChange={handleChange}
          required
        >
          <option value="normal">Normal</option>
          <option value="urgent">Urgent</option>
          <option value="emergency">Emergency</option>
        </select>
      </div>
      
      <div className="form-group">
        <label>Additional Information</label>
        <textarea
          name="additional_info"
          value={formData.additional_info}
          onChange={handleChange}
          rows="3"
        />
      </div>
      
      <div className="form-group">
        <label>Needed By Date/Time *</label>
        <input
          type="datetime-local"
          name="needed_by"
          value={formData.needed_by}
          onChange={handleChange}
          required
          className={errors.needed_by ? 'error' : ''}
        />
        {errors.needed_by && <span className="error-message">{errors.needed_by}</span>}
      </div>
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Request'}
      </button>
    </form>
  );
};

export default BloodRequestForm;