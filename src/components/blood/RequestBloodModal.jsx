import { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Stack } from '@mui/material';

const RequestBloodModal = ({ open, onClose, onSubmit, donor }) => {
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

 
  useEffect(() => {
    if (donor?.blood_type) {
      setFormData(prev => ({
        ...prev,
        blood_type: donor.blood_type
      }));
    }
  }, [donor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'units_needed' ? Number(value) : value
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.hospital.trim()) newErrors.hospital = 'Hospital name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (formData.units_needed < 1 || formData.units_needed > 10) {
      newErrors.units_needed = 'Must be between 1-10 units';
    }

    if (!formData.needed_by) {
      newErrors.needed_by = 'Date needed is required';
    } else {
      const selectedDate = new Date(formData.needed_by);
      const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);
      if (selectedDate < oneHourFromNow) {
        newErrors.needed_by = 'Date must be at least 1 hour from now';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        needed_by: new Date(formData.needed_by).toISOString(),
        additional_info: formData.additional_info.trim() || 'No additional information'
      };
      await onSubmit(payload);
    } finally {
      setIsSubmitting(false);
    }
  };

  const now = new Date();
  const minDateTime = new Date(now.getTime() + 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '90%', sm: '80%', md: '600px' },
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 1
      }}>
        <Typography variant="h6" component="h2" mb={2}>
          Request Blood from {donor?.full_name || 'Donor'}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Blood Type"
              value={formData.blood_type}
              disabled
              fullWidth
            />

            <TextField
              label="Units Needed (1-10)"
              name="units_needed"
              type="number"
              value={formData.units_needed}
              onChange={handleChange}
              error={!!errors.units_needed}
              helperText={errors.units_needed}
              fullWidth
              inputProps={{ min: 1, max: 10 }}
            />

            <TextField
              label="Hospital Name"
              name="hospital"
              value={formData.hospital}
              onChange={handleChange}
              error={!!errors.hospital}
              helperText={errors.hospital}
              fullWidth
              required
            />

            <TextField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              error={!!errors.location}
              helperText={errors.location}
              fullWidth
              required
            />

            <TextField
              label="Urgency"
              name="urgency"
              select
              value={formData.urgency}
              onChange={handleChange}
              fullWidth
              SelectProps={{ native: true }}
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="emergency">Emergency</option>
            </TextField>

            <TextField
              label="Additional Information"
              name="additional_info"
              value={formData.additional_info}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
              placeholder="Any special requirements or notes"
            />

            <TextField
              label="Needed By"
              name="needed_by"
              type="datetime-local"
              value={formData.needed_by}
              onChange={handleChange}
              error={!!errors.needed_by}
              helperText={errors.needed_by || "Minimum 1 hour from now"}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min: minDateTime
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant="outlined" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </Box>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};

export default RequestBloodModal;

