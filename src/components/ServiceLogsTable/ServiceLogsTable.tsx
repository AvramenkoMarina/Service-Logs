import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Stack,
  IconButton,
  Tooltip,
  TableSortLabel,
  TablePagination,
  Chip,
} from '@mui/material';
import type { RootState } from '../../app/store';
import {
  makeSelectFilteredServiceLogs,
  type ServiceLogsFilters,
} from '../../features/serviceLogs/selectors';
import type { ServiceLog } from '../../features/serviceLogs/types';
import { ServiceType } from '../../features/serviceLogs/types';
import { deleteServiceLog } from '../../features/serviceLogs/serviceLogsSlice';
import { ServiceLogsFiltersBar } from './filters';
import { EditServiceLogDialog } from '../EditServiceLogDialog';

const initialFilters: ServiceLogsFilters = {
  searchText: '',
  type: 'all',
  startDateFrom: '',
  startDateTo: '',
};

type SortKey = 'providerId' | 'serviceOrder' | 'startDate' | 'endDate';
type SortDirection = 'asc' | 'desc';

const getTypeChipColor = (type: ServiceType): 'default' | 'warning' | 'error' => {
  switch (type) {
    case ServiceType.Planned:
      return 'default';
    case ServiceType.Unplanned:
      return 'warning';
    case ServiceType.Emergency:
      return 'error';
    default:
      return 'default';
  }
};

export function ServiceLogsTable() {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState<ServiceLogsFilters>(initialFilters);
  const [editingLog, setEditingLog] = useState<ServiceLog | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('startDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const selectFiltered = useMemo(() => makeSelectFilteredServiceLogs(), []);
  const logs = useSelector((state: RootState) => selectFiltered(state, filters));

  const sortedLogs = useMemo(() => {
    const items = [...logs];

    items.sort((a, b) => {
      let aVal: string = '';
      let bVal: string = '';

      switch (sortKey) {
        case 'providerId':
          aVal = a.providerId || '';
          bVal = b.providerId || '';
          break;
        case 'serviceOrder':
          aVal = a.serviceOrder || '';
          bVal = b.serviceOrder || '';
          break;
        case 'startDate':
          aVal = a.startDate || '';
          bVal = b.startDate || '';
          break;
        case 'endDate':
          aVal = a.endDate || '';
          bVal = b.endDate || '';
          break;
        default:
          break;
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return items;
  }, [logs, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  return (
    <Stack spacing={2} sx={{ flex: 1, minHeight: 0 }}>
      <Typography variant="h6">Service Logs</Typography>

      <Stack spacing={1.5} sx={{ flex: 1, minHeight: 0 }}>
        <ServiceLogsFiltersBar value={filters} onChange={setFilters} />

        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{ flex: 1, minHeight: 0, overflowY: 'auto' }}
        >
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sortDirection={sortKey === 'providerId' ? sortDirection : false}>
                  <TableSortLabel
                    active={sortKey === 'providerId'}
                    direction={sortKey === 'providerId' ? sortDirection : 'asc'}
                    onClick={() => handleSort('providerId')}
                  >
                    Provider
                  </TableSortLabel>
                </TableCell>
                <TableCell sortDirection={sortKey === 'serviceOrder' ? sortDirection : false}>
                  <TableSortLabel
                    active={sortKey === 'serviceOrder'}
                    direction={sortKey === 'serviceOrder' ? sortDirection : 'asc'}
                    onClick={() => handleSort('serviceOrder')}
                  >
                    Service Order
                  </TableSortLabel>
                </TableCell>
                <TableCell>Car</TableCell>
                <TableCell align="right">Odometer</TableCell>
                <TableCell align="right">Engine Hours</TableCell>
                <TableCell sortDirection={sortKey === 'startDate' ? sortDirection : false}>
                  <TableSortLabel
                    active={sortKey === 'startDate'}
                    direction={sortKey === 'startDate' ? sortDirection : 'asc'}
                    onClick={() => handleSort('startDate')}
                  >
                    Start
                  </TableSortLabel>
                </TableCell>
                <TableCell sortDirection={sortKey === 'endDate' ? sortDirection : false}>
                  <TableSortLabel
                    active={sortKey === 'endDate'}
                    direction={sortKey === 'endDate' ? sortDirection : 'asc'}
                    onClick={() => handleSort('endDate')}
                  >
                    End
                  </TableSortLabel>
                </TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10}>
                    <Typography variant="body2" color="text.secondary">
                      No service logs found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                sortedLogs
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((log) => (
                  <TableRow key={log.id} hover sx={{ cursor: 'default' }}>
                    <TableCell>{log.providerId}</TableCell>
                    <TableCell>{log.serviceOrder}</TableCell>
                    <TableCell>{log.carId}</TableCell>
                    <TableCell align="right">{log.odometer}</TableCell>
                    <TableCell align="right">{log.engineHours}</TableCell>
                    <TableCell>{log.startDate}</TableCell>
                    <TableCell>{log.endDate}</TableCell>
                    <TableCell>
                      <Chip
                        label={log.type}
                        size="small"
                        color={getTypeChipColor(log.type)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell sx={{ maxWidth: 360 }}>
                      <Typography
                        variant="body2"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                        title={log.serviceDescription}
                      >
                        {log.serviceDescription}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setEditingLog(log);
                              setDialogOpen(true);
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => {
                              const confirmed = window.confirm('Delete this service log?');
                              if (!confirmed) return;
                              dispatch(deleteServiceLog(log.id));
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={sortedLogs.length}
          page={page}
          onPageChange={(_e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Stack>

      <EditServiceLogDialog
        open={isDialogOpen}
        log={editingLog}
        onClose={() => {
          setDialogOpen(false);
          setEditingLog(null);
        }}
      />
    </Stack>
  );
}

