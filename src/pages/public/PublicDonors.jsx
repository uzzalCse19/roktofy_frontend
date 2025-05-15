import { useEffect, useState } from 'react';
import axios from 'axios';
import DonorCard from '../components/DonorCard';

const PublicDonors = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const res = await axios.get('/api/donors/public');
        setDonors(res.data);
      } catch (err) {
        console.error('Failed to fetch donors:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDonors();
  }, []);

  if (loading) return <div>Loading donors...</div>;

  return (
    <div className="public-donors">
      <h1>Available Blood Donors</h1>
      
      <div className="donor-grid">
        {donors.length > 0 ? (
          donors.map(donor => (
            <DonorCard key={donor.id} donor={donor} />
          ))
        ) : (
          <p>No available donors found</p>
        )}
      </div>
    </div>
  );
};

export default PublicDonors;