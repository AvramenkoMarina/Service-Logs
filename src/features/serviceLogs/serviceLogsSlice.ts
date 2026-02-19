import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ServiceLog } from './types';

export interface ServiceLogsState {
  logs: ServiceLog[];
}

const initialState: ServiceLogsState = {
  logs: [],
};

const serviceLogsSlice = createSlice({
  name: 'serviceLogs',
  initialState,
  reducers: {
    addServiceLog(state, action: PayloadAction<ServiceLog>) {
      state.logs.push(action.payload);
    },
    updateServiceLog(state, action: PayloadAction<ServiceLog>) {
      const index = state.logs.findIndex((log) => log.id === action.payload.id);
      if (index !== -1) {
        state.logs[index] = action.payload;
      }
    },
    deleteServiceLog(state, action: PayloadAction<string>) {
      state.logs = state.logs.filter((log) => log.id !== action.payload);
    },
  },
});

export const { addServiceLog, updateServiceLog, deleteServiceLog } =
  serviceLogsSlice.actions;

export default serviceLogsSlice.reducer;
