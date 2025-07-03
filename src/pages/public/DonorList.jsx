/* DonorList.jsx – Client-side pagination */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Grid, Typography, TextField, Box,
  CircularProgress, Alert, Pagination,
} from '@mui/material';

import DonorCard from '../../components/blood/DonorCard';
import RequestBloodModal from '../../components/blood/RequestBloodModal';
import apiClient from '../../services/http';
import useAuthContext from '../../hooks/useAuthContext';
import useDebounce from '../../hooks/useDebounce';

// ── Config
const PAGE_SIZE = 16;
const BLOOD_TYPES = ['', 'O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

const DonorList = () => {
  // ── State
  const [allDonors, setAllDonors] = useState([]);         // All donors from API
  const [filteredDonors, setFilteredDonors] = useState([]); // After search/filter
  const [currentPageDonors, setCurrentPageDonors] = useState([]); // Current page
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [bloodTypeFilter, setBloodTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  const { user, authTokens } = useAuthContext() || {};
  const navigate = useNavigate();
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // ───────────────────────────────────────────
  // 📡 Fetch ALL donors initially
  // ───────────────────────────────────────────
  useEffect(() => {
    const controller = new AbortController();

    const fetchDonors = async () => {
      try {
        setLoading(true);
        const params = {};
        if (bloodTypeFilter) params.blood_type = bloodTypeFilter;

        const { data } = await apiClient.get('/donor-list/', {
          params,
          signal: controller.signal,
        });

        const allDonorsData = data.results || data;
        setAllDonors(allDonorsData);
        setError('');
      } catch (err) {
        if (err.name !== 'CanceledError') {
          setError('Failed to fetch donors. Please try again later.');
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
    return () => controller.abort();
  }, [bloodTypeFilter]);

  // ───────────────────────────────────────────
  // 🔍 Apply search and blood type filtering
  // ───────────────────────────────────────────
  useEffect(() => {
    const kw = debouncedSearchTerm.toLowerCase();
    
    const filtered = allDonors.filter(donor => {
      const matchesSearch = donor.full_name.toLowerCase().includes(kw) || 
                          donor.address.toLowerCase().includes(kw);
      const matchesBloodType = !bloodTypeFilter || donor.blood_type === bloodTypeFilter;
      return matchesSearch && matchesBloodType;
    });

    setFilteredDonors(filtered);
    setTotalPages(Math.ceil(filtered.length / PAGE_SIZE));
    setCurrentPage(1); // Reset to first page when filters change
  }, [allDonors, debouncedSearchTerm, bloodTypeFilter]);

  // ───────────────────────────────────────────
  // 📄 Paginate the filtered results
  // ───────────────────────────────────────────
  useEffect(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    setCurrentPageDonors(filteredDonors.slice(startIndex, endIndex));
  }, [filteredDonors, currentPage]);

  // ───────────────────────────────────────────
  // ↪ Handlers
  // ───────────────────────────────────────────
  const handleRequestClick = useCallback(
    (donor) => {
      if (!authTokens) {
        navigate('/auth/login', { state: { from: '/donors' } });
        return;
      }
      setSelectedDonor(donor);
      setRequestModalOpen(true);
    },
    [authTokens, navigate],
  );

  const handlePageChange = (_, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRequestSuccess = () => {
    setRequestSuccess(true);
    setRequestModalOpen(false);
    setTimeout(() => setRequestSuccess(false), 3000);
  };

  // ───────────────────────────────────────────
  // 🖼️  JSX
  // ───────────────────────────────────────────
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" align="center" sx={{ fontWeight: 600, mb: 4 }}>
        Available Blood Donors
      </Typography>

      {/* Search & Filter */}
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
        <TextField
          fullWidth 
          size="small" 
          variant="outlined"
          placeholder="Search by name or location..."
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <TextField
          size="small" 
          select 
          label="Blood Group" 
          value={bloodTypeFilter}
          onChange={(e) => setBloodTypeFilter(e.target.value)} 
          SelectProps={{ native: true }}
          sx={{ minWidth: 160 }}
        >
          {BLOOD_TYPES.map((t) => (
            <option key={t} value={t}>{t || 'All'}</option>
          ))}
        </TextField>
      </Box>

      {/* Alerts */}
      {requestSuccess && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setRequestSuccess(false)}>
          Blood request submitted successfully!
        </Alert>
      )}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Loading State */}
      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress size={60} />
        </Box>
      )}

      {/* Empty State */}
      {!loading && currentPageDonors.length === 0 && (
        <Typography variant="body1" align="center" sx={{ py: 4 }}>
          {allDonors.length === 0 
            ? 'No donors available.' 
            : 'No donors match your search criteria.'}
        </Typography>
      )}

      {/* Donor Grid */}
      {!loading && currentPageDonors.length > 0 && (
        <>
          <Grid container spacing={3}>
            {currentPageDonors.map((donor) => (
              <Grid key={donor.id} item xs={12} sm={6} md={3} lg={3}>
                <DonorCard 
                  donor={donor} 
                  onRequestClick={() => handleRequestClick(donor)} 
                />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                page={currentPage} 
                count={totalPages}
                onChange={handlePageChange}
                color="primary" 
                size="large" 
                showFirstButton 
                showLastButton
                sx={{ '& .MuiPaginationItem-root': { fontSize: '1rem' } }}
              />
            </Box>
          )}
        </>
      )}

      {/* Request Modal */}
      <RequestBloodModal
        open={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        donor={selectedDonor}
        onSuccess={handleRequestSuccess}
      />
    </Container>
  );
};

export default DonorList;