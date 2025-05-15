import { useState } from 'react';
import axios from 'axios';
import BloodGroupBadge from './BloodGroupBadge';

const BloodRequestCard = ({ request, userType }) => {
  const [status, setStatus] = useState(request.status);
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    if (userType === 'recipient') return;
    
    setLoading(true);
    try {
      await axios.post(`/api/requests/${request.id}/accept`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStatus('accepted');
    } catch (err) {
      console.error('Failed to accept request:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`request-card ${status}`}>
      <div className="request-header">
        <BloodGroupBadge bloodGroup={request.blood_type} />
        <h3>{request.requesterName}</h3>
        <span className={`status-badge ${status}`}>{status}</span>
      </div>

      <div className="request-details">
        <p><strong>Location:</strong> {request.hospital}, {request.location}</p>
        <p><strong>Units Needed:</strong> {request.unitsNeeded}</p>
        <p><strong>Urgency:</strong> {request.urgency}</p>
        <p><strong>Needed by:</strong> {new Date(request.neededBy).toLocaleString()}</p>
      </div>

      {userType !== 'recipient' && status === 'pending' && (
        <button 
          onClick={handleAccept} 
          disabled={loading}
          className="btn-accept"
        >
          {loading ? 'Processing...' : 'Accept Request'}
        </button>
      )}
    </div>
  );
};

export default BloodRequestCard;