const BloodGroupFilter = ({ value, onChange }) => {
  const bloodGroups = [
    { value: '', label: 'All Blood Types' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' },
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
  ];

  return (
    <div className="flex flex-col gap-2 min-w-[180px]">
      <label htmlFor="blood-type-filter" className="text-sm font-medium text-gray-700">
        Filter by Blood Type
      </label>
    </div>
  );
};
export default BloodGroupFilter;

// import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

// const BloodGroupFilter = ({ value, onChange }) => {
//   const bloodGroups = [
//     { value: '', label: 'All Blood Types' },
//     { value: 'O+', label: 'O+' },
//     { value: 'O-', label: 'O-' },
//     { value: 'A+', label: 'A+' },
//     { value: 'A-', label: 'A-' },
//     { value: 'B+', label: 'B+' },
//     { value: 'B-', label: 'B-' },
//     { value: 'AB+', label: 'AB+' },
//     { value: 'AB-', label: 'AB-' },
//   ];

//   return (
//     <FormControl sx={{ minWidth: 180 }}>
//       <InputLabel id="blood-type-filter-label">Filter by Blood Type</InputLabel>
//       <Select
//         labelId="blood-type-filter-label"
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         label="Filter by Blood Type"
//       >
//         {bloodGroups.map((group) => (
//           <MenuItem key={group.value} value={group.value}>
//             {group.label}
//           </MenuItem>
//         ))}
//       </Select>
//     </FormControl>
//   );
// };

// export default BloodGroupFilter;