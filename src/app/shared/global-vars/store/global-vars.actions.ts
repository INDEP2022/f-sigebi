import { createAction, props } from '@ngrx/store';
import { IGlobalVars } from '../models/IGlobalVars.model';

export const resetAction = createAction('[GlobalVars] Reset Data');

export const loadGlobalVars = createAction('[GlobalVars] Load GlobalVars');

export const setGlobalVars = createAction(
  '[GlobalVars] Update GlobalVars',
  props<{ updateGlobalVars: IGlobalVars }>()
);
