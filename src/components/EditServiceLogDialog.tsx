import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import type { ServiceLog } from '../features/serviceLogs/types';
import { ServiceType } from '../features/serviceLogs/types';
import { updateServiceLog, deleteServiceLog } from '../features/serviceLogs/serviceLogsSlice';
import { serviceLogFormSchema, type ServiceLogFormValues } from './ServiceLogForm/schema';

export interface EditServiceLogDialogProps {
  open: boolean;
  log: ServiceLog | null;
  onClose: () => void;
}

export function EditServiceLogDialog({ open, log, onClose }: EditServiceLogDialogProps) {
  const dispatch = useDispatch();

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

  const {
    control,
    handleSubmit,
    reset,
  } = useForm<ServiceLogFormValues>({
    resolver: yupResolver(serviceLogFormSchema),
    defaultValues: log
      ? {
          providerId: log.providerId,
          serviceOrder: log.serviceOrder,
          carId: log.carId,
          odometer: log.odometer,
          engineHours: log.engineHours,
          startDate: log.startDate,
          endDate: log.endDate,
          type: log.type,
          serviceDescription: log.serviceDescription,
        }
      : undefined,
  });

  useEffect(() => {
    if (log && open) {
      reset({
        providerId: log.providerId,
        serviceOrder: log.serviceOrder,
        carId: log.carId,
        odometer: log.odometer,
        engineHours: log.engineHours,
        startDate: log.startDate,
        endDate: log.endDate,
        type: log.type,
        serviceDescription: log.serviceDescription,
      });
    }
  }, [log, open, reset]);

  const onSubmit = (values: ServiceLogFormValues) => {
    if (!log) return;

    const updated: ServiceLog = {
      ...log,
      providerId: values.providerId,
      serviceOrder: values.serviceOrder,
      carId: values.carId,
      odometer: values.odometer,
      engineHours: values.engineHours,
      startDate: values.startDate,
      endDate: values.endDate,
      type: values.type as ServiceType,
      serviceDescription: values.serviceDescription ?? '',
      updatedAt: new Date().toISOString(),
    };

    dispatch(updateServiceLog(updated));
    onClose();
  };

  const handleDelete = () => {
    if (!log) return;
    const confirmed = window.confirm('Delete this service log?');
    if (!confirmed) return;
    dispatch(deleteServiceLog(log.id));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Service Log</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        <Controller
          name="providerId"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Provider ID"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              fullWidth
            />
          )}
        />

        <Controller
          name="serviceOrder"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Service Order"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              fullWidth
            />
          )}
        />

        <Controller
          name="carId"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Car ID"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              fullWidth
            />
          )}
        />

        <Controller
          name="odometer"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              type="number"
              label="Odometer (mi)"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              inputProps={{ min: 0 }}
              onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
            />
          )}
        />

        <Controller
          name="engineHours"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              type="number"
              label="Engine Hours"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              inputProps={{ min: 0 }}
              onChange={(e) => field.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
            />
          )}
        />

        <Controller
          name="startDate"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              type="date"
              label="Start Date"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              InputLabelProps={{ shrink: true }}
            />
          )}
        />

        <Controller
          name="endDate"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              type="date"
              label="End Date"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              InputLabelProps={{ shrink: true }}
            />
          )}
        />

        <Controller
          name="type"
          control={control}
          render={({ field, fieldState }) => (
            <FormControl fullWidth error={!!fieldState.error}>
              <InputLabel>Service Type</InputLabel>
              <Select {...field} label="Service Type">
                <MenuItem value={ServiceType.Planned}>
                  <Chip
                    label="Planned"
                    size="small"
                    color={getTypeChipColor(ServiceType.Planned)}
                    variant="outlined"
                  />
                </MenuItem>
                <MenuItem value={ServiceType.Unplanned}>
                  <Chip
                    label="Unplanned"
                    size="small"
                    color={getTypeChipColor(ServiceType.Unplanned)}
                    variant="outlined"
                  />
                </MenuItem>
                <MenuItem value={ServiceType.Emergency}>
                  <Chip
                    label="Emergency"
                    size="small"
                    color={getTypeChipColor(ServiceType.Emergency)}
                    variant="outlined"
                  />
                </MenuItem>
              </Select>
              {fieldState.error && (
                <FormHelperText>{fieldState.error.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />

        <Controller
          name="serviceDescription"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Service Description"
              multiline
              rows={3}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              fullWidth
            />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={handleDelete} disabled={!log}>
          Delete
        </Button>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit(onSubmit)} variant="contained" disabled={!log}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

