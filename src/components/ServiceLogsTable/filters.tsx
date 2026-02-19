import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { ServiceType } from '../../features/serviceLogs/types';
import type { ServiceLogsFilters } from '../../features/serviceLogs/selectors';

export type ServiceLogsFiltersProps = {
  value: ServiceLogsFilters;
  onChange: (next: ServiceLogsFilters) => void;
};

export function ServiceLogsFiltersBar({ value, onChange }: ServiceLogsFiltersProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        flexWrap: 'wrap',
        alignItems: 'center',
        flexDirection: { xs: 'column', sm: 'row' },
      }}
    >
      <TextField
        label="Search"
        placeholder="providerId, carId, serviceOrder"
        value={value.searchText}
        onChange={(e) => onChange({ ...value, searchText: e.target.value })}
        sx={{ minWidth: { xs: '100%', sm: 260 } }}
      />

      <TextField
        type="date"
        label="Start date from"
        InputLabelProps={{ shrink: true }}
        value={value.startDateFrom}
        onChange={(e) => onChange({ ...value, startDateFrom: e.target.value })}
        sx={{ minWidth: { xs: '100%', sm: 180 } }}
      />

      <TextField
        type="date"
        label="Start date to"
        InputLabelProps={{ shrink: true }}
        value={value.startDateTo}
        onChange={(e) => onChange({ ...value, startDateTo: e.target.value })}
        sx={{ minWidth: { xs: '100%', sm: 180 } }}
      />

      <FormControl sx={{ minWidth: { xs: '100%', sm: 200 } }}>
        <InputLabel>Type</InputLabel>
        <Select
          label="Type"
          value={value.type}
          onChange={(e) =>
            onChange({ ...value, type: e.target.value as ServiceLogsFilters['type'] })
          }
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value={ServiceType.Planned}>
            <Chip label="Planned" size="small" color="default" variant="outlined" />
          </MenuItem>
          <MenuItem value={ServiceType.Unplanned}>
            <Chip label="Unplanned" size="small" color="warning" variant="outlined" />
          </MenuItem>
          <MenuItem value={ServiceType.Emergency}>
            <Chip label="Emergency" size="small" color="error" variant="outlined" />
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

