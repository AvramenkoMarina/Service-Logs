import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import {
  Box,
  Button,
  CircularProgress,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import type { DraftServiceLog } from '../../features/serviceLogs/types';
import { ServiceType, type ServiceLog } from '../../features/serviceLogs/types';
import { addServiceLog } from '../../features/serviceLogs/serviceLogsSlice';
import {
  clearAllDrafts,
  createDraft,
  deleteDraft,
  updateDraft,
  selectAllDrafts,
  selectActiveDraftSavingStatus,
  setActiveDraft,
} from '../../features/serviceLogs/draftsSlice';
import type { RootState } from '../../app/store';
import { serviceLogFormSchema, type ServiceLogFormValues } from './schema';
import { useAutoSave } from './useAutoSave';

function formatDateLocal(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addOneDay(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  d.setDate(d.getDate() + 1);
  return formatDateLocal(d);
}

function getDefaultValues(activeDraft: DraftServiceLog | null): ServiceLogFormValues {
  const today = formatDateLocal(new Date());
  const tomorrow = addOneDay(today);

  return {
    providerId: activeDraft?.providerId ?? '',
    serviceOrder: activeDraft?.serviceOrder ?? '',
    carId: activeDraft?.carId ?? '',
    odometer: activeDraft?.odometer ?? 0,
    engineHours: activeDraft?.engineHours ?? 0,
    startDate: activeDraft?.startDate ?? today,
    endDate: activeDraft?.endDate ?? (activeDraft?.startDate ? addOneDay(activeDraft.startDate) : tomorrow),
    type: (activeDraft?.type as ServiceLogFormValues['type']) ?? ServiceType.Planned,
    serviceDescription: activeDraft?.serviceDescription ?? '',
  };
}

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

export function ServiceLogForm() {
  const dispatch = useDispatch();

  const activeDraftId = useSelector((state: RootState) => state.drafts.activeDraftId);
  const activeDraft = useSelector((state: RootState) =>
    activeDraftId ? state.drafts.drafts[activeDraftId] ?? null : null
  );
  const draftsCount = useSelector((state: RootState) => Object.keys(state.drafts.drafts).length);
  const draftOptions = useSelector(selectAllDrafts);
  const savingStatus = useSelector(selectActiveDraftSavingStatus);

  const {
    control,
    handleSubmit,
    getValues,
    watch,
    setValue,
    reset,
  } = useForm<ServiceLogFormValues>({
    resolver: yupResolver(serviceLogFormSchema),
    defaultValues: getDefaultValues(activeDraft),
  });

  const startDate = watch('startDate');
  const formValues = watch();

  useAutoSave({ values: formValues, activeDraftId, dispatch });

  useEffect(() => {
    if (startDate) {
      setValue('endDate', addOneDay(startDate));
    }
  }, [startDate, setValue]);

  useEffect(() => {
    reset(getDefaultValues(activeDraft));
  }, [activeDraftId, reset]);

  const onSubmit = (values: ServiceLogFormValues) => {
    if (!activeDraftId) return;

    dispatch(
      updateDraft({
        id: activeDraftId,
        changes: {
          providerId: values.providerId,
          serviceOrder: values.serviceOrder,
          carId: values.carId,
          odometer: values.odometer,
          engineHours: values.engineHours,
          startDate: values.startDate,
          endDate: values.endDate,
          type: values.type as ServiceType,
          serviceDescription: values.serviceDescription,
        },
      })
    );
  };

  const savingStatusLabel =
    savingStatus === 'saving'
      ? 'Saving...'
      : savingStatus === 'saved'
        ? 'Draft saved'
        : null;

  const draftSelectValue = activeDraftId ?? 'new';

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: 'flex', flexDirection: 'column' }}
    >
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Select draft</InputLabel>
            <Select
              label="Select draft"
              value={draftSelectValue}
              onChange={(e) => {
                const value = e.target.value as string;
                if (value === 'new') {
                  dispatch(createDraft(undefined));
                } else {
                  dispatch(setActiveDraft(value));
                }
              }}
            >
              <MenuItem value="new">
                <em>New draft</em>
              </MenuItem>
              {draftOptions.map((d) => (
                <MenuItem key={d.id} value={d.id}>
                  {d.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {savingStatusLabel && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}
            >
              {savingStatus === 'saving' && (
                <CircularProgress size={16} thickness={5} />
              )}
              {savingStatus === 'saved' && (
                <CheckCircleIcon fontSize="small" color="success" />
              )}
              {savingStatusLabel}
            </Typography>
          )}
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
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
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
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
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
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
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
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
                  onChange={(e) =>
                    field.onChange(e.target.value === '' ? 0 : Number(e.target.value))
                  }
                  fullWidth
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
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
                  onChange={(e) =>
                    field.onChange(e.target.value === '' ? 0 : Number(e.target.value))
                  }
                  fullWidth
                />
              )}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
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
                  fullWidth
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
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
                  fullWidth
                />
              )}
            />
          </Grid>
        </Grid>

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

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1.5,
            mt: 'auto',
            pt: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Button
              variant="outlined"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => {
                const v = getValues();
                dispatch(
                  createDraft({
                    providerId: v.providerId,
                    serviceOrder: v.serviceOrder,
                    carId: v.carId,
                    odometer: v.odometer,
                    engineHours: v.engineHours,
                    startDate: v.startDate,
                    endDate: v.endDate,
                    type: v.type as ServiceType,
                    serviceDescription: v.serviceDescription,
                  })
                );
              }}
            >
              Create Draft
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteOutlineIcon />}
              disabled={!activeDraftId}
              onClick={() => {
                if (!activeDraftId) return;
                const confirmed = window.confirm('Delete this draft?');
                if (!confirmed) return;
                dispatch(deleteDraft(activeDraftId));
              }}
            >
              Delete Draft
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteSweepIcon />}
              disabled={draftsCount === 0}
              onClick={() => {
                const confirmed = window.confirm('Clear all drafts?');
                if (!confirmed) return;
                dispatch(clearAllDrafts());
                reset(getDefaultValues(null));
              }}
            >
              Clear All Drafts
            </Button>
          </Stack>

          <Button
            type="button"
            variant="contained"
            size="medium"
            startIcon={<AssignmentTurnedInIcon />}
            disabled={!activeDraftId}
            onClick={handleSubmit((values) => {
              if (!activeDraftId) return;

              const now = new Date().toISOString();
              const serviceLog: ServiceLog = {
                id: activeDraftId,
                providerId: values.providerId,
                serviceOrder: values.serviceOrder,
                carId: values.carId,
                odometer: values.odometer,
                engineHours: values.engineHours,
                startDate: values.startDate,
                endDate: values.endDate,
                type: values.type as ServiceType,
                serviceDescription: values.serviceDescription ?? '',
                createdAt: now,
                updatedAt: now,
              };

              dispatch(addServiceLog(serviceLog));
              dispatch(deleteDraft(activeDraftId));
            })}
          >
            Create Service Log
          </Button>
        </Box>

        {draftsCount === 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5, fontStyle: 'italic' }}
          >
            No drafts yet. Click &quot;Create Draft&quot; to start a new one.
          </Typography>
        )}
      </Stack>
    </Box>
  );
}
