import storage from 'redux-persist/lib/storage';
import type { PersistConfig } from 'redux-persist/es/types';
import type { DraftsState } from '../features/serviceLogs/draftsSlice';
import type { ServiceLogsState } from '../features/serviceLogs/serviceLogsSlice';

export type PersistedState = {
  drafts: DraftsState;
  serviceLogs: ServiceLogsState;
};

export const persistConfig: PersistConfig<PersistedState> = {
  key: 'root',
  storage,
  whitelist: ['drafts', 'serviceLogs'],
};
