import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';

const RequestConfirmation = () => {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const res = await axios.get(`/blood-requests/${id}/`);
        setRequest(res.data);
      } catch (err) {
        setError('Failed to load request details.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequest();
  }, [id]);

  if (loading) return <Box p={4}><CircularProgress /></Box>;

  if (error) return <Box p={4}><Alert severity="error">{error}</Alert></Box>;

  return (
    <Box p={4}>
      <Typography variant="h5" gutterBottom>Request Confirmed!</Typography>
      <Typography variant="body1">Request ID: {request.id}</Typography>
      <Typography variant="body1">Blood Type: {request.blood_type}</Typography>
      <Typography variant="body1">Units Needed: {request.units_needed}</Typography>
      <Typography variant="body1">Hospital: {request.hospital}</Typography>
      <Typography variant="body1">Location: {request.location}</Typography>
      <Typography variant="body1">Urgency: {request.urgency}</Typography>
      <Typography variant="body1">Needed By: {new Date(request.needed_by).toLocaleString()}</Typography>
    </Box>
  );
};

export default RequestConfirmation;
