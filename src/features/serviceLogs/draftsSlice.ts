import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';
import type { DraftServiceLog } from './types';
import type { RootState } from '../../app/store';

export type DraftsSavingStatus = 'idle' | 'saving' | 'saved';

export interface DraftsState {
  drafts: Record<string, DraftServiceLog>;
  activeDraftId: string | null;
  savingStatusById: Record<string, DraftsSavingStatus>;
}

const initialState: DraftsState = {
  drafts: {},
  activeDraftId: null,
  savingStatusById: {},
};

type DraftChanges = Partial<Omit<DraftServiceLog, 'id'>>;

const draftsSlice = createSlice({
  name: 'drafts',
  initialState,
  reducers: {
    createDraft(state, action: PayloadAction<DraftChanges | undefined>) {
      if (!state.savingStatusById) {
        state.savingStatusById = {};
      }
      const id = nanoid();
      const newDraft: DraftServiceLog = { id, ...(action.payload ?? {}) };
      state.drafts[id] = newDraft;
      state.activeDraftId = id;
      state.savingStatusById[id] = 'saved';
    },
    updateDraft(state, action: PayloadAction<{ id: string; changes: DraftChanges }>) {
      if (!state.savingStatusById) {
        state.savingStatusById = {};
      }
      const { id, changes } = action.payload;
      const existing = state.drafts[id];
      if (existing) {
        state.drafts[id] = {
          ...existing,
          ...changes,
          id: existing.id,
        };
      }
    },
    markDraftSaving(state) {
      if (!state.savingStatusById) {
        state.savingStatusById = {};
      }
      const id = state.activeDraftId;
      if (id) {
        state.savingStatusById[id] = 'saving';
      }
    },
    markDraftSaved(state) {
      if (!state.savingStatusById) {
        state.savingStatusById = {};
      }
      const id = state.activeDraftId;
      if (id) {
        state.savingStatusById[id] = 'saved';
      }
    },
    deleteDraft(state, action: PayloadAction<string>) {
      if (!state.savingStatusById) {
        state.savingStatusById = {};
      }
      const id = action.payload;
      delete state.drafts[id];
      delete state.savingStatusById[id];
      if (state.activeDraftId === id) {
        state.activeDraftId = null;
      }
    },
    clearAllDrafts(state) {
      state.drafts = {};
      state.activeDraftId = null;
      state.savingStatusById = state.savingStatusById ? {} : {};
    },
    setActiveDraft(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (id in state.drafts) {
        state.activeDraftId = id;
      }
    },
  },
});

export const {
  createDraft,
  updateDraft,
  markDraftSaving,
  markDraftSaved,
  deleteDraft,
  clearAllDrafts,
  setActiveDraft,
} = draftsSlice.actions;

export default draftsSlice.reducer;

export const selectDraftsState = (state: RootState): DraftsState => state.drafts;

export const selectActiveDraftId = (state: RootState): string | null =>
  state.drafts.activeDraftId;

export const selectActiveDraft = (state: RootState): DraftServiceLog | null => {
  const { activeDraftId, drafts } = state.drafts;
  if (!activeDraftId) return null;
  return drafts[activeDraftId] ?? null;
};

export const selectActiveDraftSavingStatus = (
  state: RootState
): DraftsSavingStatus => {
  const { activeDraftId, savingStatusById } = state.drafts as DraftsState & {
    savingStatusById?: Record<string, DraftsSavingStatus>;
  };

  if (!activeDraftId || !savingStatusById) return 'idle';
  return savingStatusById[activeDraftId] ?? 'idle';
};

export type DraftListItem = {
  id: string;
  label: string;
};

export const selectAllDrafts = (state: RootState): DraftListItem[] => {
  const { drafts } = state.drafts;
  let emptyCounter = 0;

  return Object.entries(drafts).map(([id, draft]) => {
    const parts = [draft.providerId, draft.serviceOrder, draft.carId].filter(
      Boolean
    ) as string[];

    let label: string;

    if (parts.length > 0) {
      label = parts.join(' • ');
    } else {
      emptyCounter += 1;
      label = `Empty draft #${emptyCounter}`;
    }

    return { id, label };
  });
};

