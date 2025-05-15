import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  TextField,
  Box,
  CircularProgress,
  Alert,
  Pagination,
} from '@mui/material';
import DonorCard from '../../components/blood/DonorCard';
import apiClient from '../../services/http';
import useAuthContext from '../../hooks/useAuthContext';
import RequestBloodModal from '../../components/blood/RequestBloodModal';
import useDebounce from '../../hooks/useDebounce';

const DonorList = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [bloodTypeFilter, setBloodTypeFilter] = useState('');
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const donorsPerPage = 9;

  const { user, authTokens } = useAuthContext() || {};
  const navigate = useNavigate();

  // Use debounced search term for filtering performance
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    let active = true;
    const fetchDonors = async () => {
      try {
        setLoading(true);
        let url = '/donor-list/';
        if (bloodTypeFilter) {
          url += `?blood_type=${encodeURIComponent(bloodTypeFilter)}`;
        }
        const response = await apiClient.get(url);
        if (!active) return;
        setDonors(response.data);
        setError('');
      } catch (err) {
        if (!active) return;
        setError('Failed to fetch donors. Please try again later.');
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchDonors();

    return () => {
      active = false; // Cancel any pending updates
    };
  }, [bloodTypeFilter]);

  const handleRequestClick = (donor) => {
    if (!authTokens) {
      navigate('/auth/login', { state: { from: '/donors' } });
      return;
    }
    setSelectedDonor(donor);
    setRequestModalOpen(true);
  };

  const handleSubmitRequest = async (formData) => {
    try {
      await apiClient.post('/blood-requests/', {
        ...formData,
        requester: user.id,
      });
      setRequestSuccess(true);
      setRequestModalOpen(false);
      setTimeout(() => setRequestSuccess(false), 5000);
    } catch (err) {
      setError('Failed to submit request. Please try again.');
      console.error(err);
    }
  };


  const filteredDonors = useMemo(() => {
    return donors.filter((donor) => {
      const search = debouncedSearchTerm.toLowerCase();
      return (
        donor.full_name.toLowerCase().includes(search) ||
        donor.address.toLowerCase().includes(search)
      );
    });
  }, [donors, debouncedSearchTerm]);


  const currentDonors = useMemo(() => {
    const indexOfLastDonor = currentPage * donorsPerPage;
    const indexOfFirstDonor = indexOfLastDonor - donorsPerPage;
    return filteredDonors.slice(indexOfFirstDonor, indexOfLastDonor);
  }, [filteredDonors, currentPage]);

  const totalPages = Math.ceil(filteredDonors.length / donorsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Available Blood Donors
      </Typography>

      <Box
        sx={{
          mb: 4,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by name or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1 }}
        />

        <TextField
          select
          label="Blood Group"
          value={bloodTypeFilter}
          onChange={(e) => setBloodTypeFilter(e.target.value)}
          SelectProps={{ native: true }}
          sx={{ minWidth: 150 }}
        >
          <option value="">All</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </TextField>
      </Box>

      {requestSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Blood request submitted successfully!
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : filteredDonors.length === 0 ? (
        <Typography variant="body1" align="center" sx={{ py: 4 }}>
          No donors found matching your criteria.
        </Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {currentDonors.map((donor) => (
              <Grid item key={donor.id} xs={12} sm={6} md={4} lg={4} xl={4}>
                <DonorCard
                  donor={donor}
                  onRequestClick={() => handleRequestClick(donor)}
                />
              </Grid>
            ))}
          </Grid>

          {filteredDonors.length > donorsPerPage && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}

      <RequestBloodModal
        open={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        onSubmit={handleSubmitRequest}
        donor={selectedDonor}
      />
    </Container>
  );
};

export default DonorList;
