import { useEffect, useRef } from 'react';
import type { useDispatch } from 'react-redux';
import { updateDraft, markDraftSaved, markDraftSaving } from '../../features/serviceLogs/draftsSlice';
import { ServiceType } from '../../features/serviceLogs/types';
import type { ServiceLogFormValues } from './schema';

const DEBOUNCE_MS = 600;

export interface UseAutoSaveOptions {
  values: ServiceLogFormValues;
  activeDraftId: string | null;
  dispatch: ReturnType<typeof useDispatch>;
}

export function useAutoSave({ values, activeDraftId, dispatch }: UseAutoSaveOptions): void {
  const lastSavedRef = useRef<string | null>(null);
  const prevDraftIdRef = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!activeDraftId) return;

    const valuesKey = JSON.stringify(values);

    if (prevDraftIdRef.current !== activeDraftId) {
      prevDraftIdRef.current = activeDraftId;
      lastSavedRef.current = valuesKey;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    if (valuesKey === lastSavedRef.current) {
      return;
    }

    dispatch(markDraftSaving());

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    timerRef.current = setTimeout(() => {
      timerRef.current = null;

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

      dispatch(markDraftSaved());
      lastSavedRef.current = JSON.stringify(values);
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [values, activeDraftId, dispatch]);
}
