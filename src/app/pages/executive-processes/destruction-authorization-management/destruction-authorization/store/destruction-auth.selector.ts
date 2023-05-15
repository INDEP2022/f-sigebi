import { createFeatureSelector, createSelector } from '@ngrx/store';
import { IDestructionAuth } from './destruction-auth.interface';

export const selectDestructionAuth =
  createFeatureSelector<IDestructionAuth>('destructionAuth');

export const getDestructionAuth = createSelector(
  selectDestructionAuth,
  (state: IDestructionAuth) => state
);
