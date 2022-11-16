import { createReducer, on } from '@ngrx/store';
import { add } from './actions';

export const initialState: any | null = null;

export const generateReducer = createReducer(
  initialState,
  on(add, (state, items) => ({
    ...state,
    value: items,
  }))
);
