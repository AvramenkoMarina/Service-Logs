import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import draftsReducer from '../features/serviceLogs/draftsSlice';
import serviceLogsReducer from '../features/serviceLogs/serviceLogsSlice';
import { persistConfig } from './persist';

const rootReducer = combineReducers({
  drafts: draftsReducer,
  serviceLogs: serviceLogsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
