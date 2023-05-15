import { createReducer, on } from '@ngrx/store';
import {
  ResetDestructionAuth,
  SetDestructionAuth,
} from './destruction-auth.actions';
import { IDestructionAuth } from './destruction-auth.interface';

export const initialState: Readonly<IDestructionAuth> = {
  form: {},
};

export const destructionAuthReducer = createReducer(
  initialState,
  on(ResetDestructionAuth, () => initialState),
  on(SetDestructionAuth, (_state, { destructionAuth }) => destructionAuth)
);
