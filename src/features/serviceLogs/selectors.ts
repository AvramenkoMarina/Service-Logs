import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import type { ServiceLog, ServiceType } from './types';

export type ServiceLogsSearchFields = 'providerId' | 'carId' | 'serviceOrder';

export type ServiceLogsFilters = {
  searchText: string;
  type: ServiceType | 'all';
  startDateFrom: string;
  startDateTo: string;
};

export const selectServiceLogsState = (state: RootState) => state.serviceLogs;
export const selectAllServiceLogs = (state: RootState) =>
  selectServiceLogsState(state).logs;

export const makeSelectFilteredServiceLogs = () =>
  createSelector(
    [
      selectAllServiceLogs,
      (_state: RootState, filters: ServiceLogsFilters) => filters,
    ],
    (logs, filters): ServiceLog[] => {
      const q = filters.searchText.trim().toLowerCase();
      const from = filters.startDateFrom || '';
      const to = filters.startDateTo || '';

      return logs.filter((log) => {
        if (filters.type !== 'all' && log.type !== filters.type) return false;
        const start = log.startDate ?? '';
        if (from && start < from) return false;
        if (to && start > to) return false;
        if (!q) return true;
        const hay =
          `${log.providerId} ${log.carId} ${log.serviceOrder}`.toLowerCase();
        return hay.includes(q);
      });
    }
  );

