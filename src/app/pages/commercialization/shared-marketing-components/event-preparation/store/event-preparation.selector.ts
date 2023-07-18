import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IEventPreparationState } from './event-preparation-state.interface';
export const selectEventPreparation =
  createFeatureSelector<IEventPreparationState>('eventPreparation');

export const getEventPreparation = createSelector(
  selectEventPreparation,
  (state: IEventPreparationState) => state
);
