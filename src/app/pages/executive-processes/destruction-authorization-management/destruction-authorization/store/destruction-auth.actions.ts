import { createAction, props } from '@ngrx/store';
import { IDestructionAuth } from './destruction-auth.interface';

export const ResetDestructionAuth = createAction('[Goods Tracked] reset');

export const SetDestructionAuth = createAction(
  '[Destruction Auth] set',
  props<{ destructionAuth: IDestructionAuth }>()
);
