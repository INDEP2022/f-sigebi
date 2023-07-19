import { createReducer, on } from '@ngrx/store';
import { IEventPreparationState } from './event-preparation-state.interface';
import {
  ResetEventPreparation,
  SetEventPreparation,
} from './event-preparation.actions';

export const initialState: IEventPreparationState = {
  eventForm: null,
  lastLot: null,
  lastPublicLot: null,
};

export const eventPreparationReducer = createReducer(
  initialState,
  on(ResetEventPreparation, () => initialState),
  on(SetEventPreparation, (_state, { eventPreparation }) => eventPreparation)
);
