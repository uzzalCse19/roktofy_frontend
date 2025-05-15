import { Chip } from '@mui/material';
import { styled } from '@mui/material/styles';

const bloodTypeColors = {
  'O+': { bg: '#ffebee', text: '#c62828' },
  'O-': { bg: '#ffcdd2', text: '#b71c1c' },
  'A+': { bg: '#e8f5e9', text: '#2e7d32' },
  'A-': { bg: '#c8e6c9', text: '#1b5e20' },
  'B+': { bg: '#e3f2fd', text: '#1565c0' },
  'B-': { bg: '#bbdefb', text: '#0d47a1' },
  'AB+': { bg: '#f3e5f5', text: '#7b1fa2' },
  'AB-': { bg: '#e1bee7', text: '#4a148c' },
  default: { bg: '#f5f5f5', text: '#212121' }
};


const StyledBloodChip = styled(Chip)(({ bloodtype }) => ({
  backgroundColor: bloodTypeColors[bloodtype]?.bg || bloodTypeColors.default.bg,
  color: bloodTypeColors[bloodtype]?.text || bloodTypeColors.default.text,
  fontWeight: 'bold',
  fontSize: '0.875rem',
  height: '28px',
  '& .MuiChip-label': {
    padding: '0 8px'
  },
  border: `1px solid ${bloodTypeColors[bloodtype]?.text || bloodTypeColors.default.text}`,
  borderRadius: '4px'
}));


const BloodGroupBadge = ({ bloodType, size = 'medium', sx = {} }) => {
  if (!bloodType || !bloodTypeColors[bloodType]) return null;

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { fontSize: '0.75rem', height: '24px' };
      case 'large':
        return { fontSize: '1rem', height: '32px' };
      default:
        return { fontSize: '0.875rem', height: '28px' };
    }
  };

  return (
    <StyledBloodChip
      label={bloodType}
      bloodtype={bloodType}
      sx={{
        ...getSizeStyles(),
        ...sx
      }}
    />
  );
};

export default BloodGroupBadge;
