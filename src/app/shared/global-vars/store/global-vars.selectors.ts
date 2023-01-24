import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromGlobalVars from './global-vars.reducer';

export const selectGlobalVarsState =
  createFeatureSelector<fromGlobalVars.GlobalVarsState>(
    fromGlobalVars.globalVarsFeatureKey
  );

export const getGlobalVars = createSelector(
  selectGlobalVarsState,
  (state: fromGlobalVars.GlobalVarsState) => state.globalVars
);
