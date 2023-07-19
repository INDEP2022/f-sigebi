import { createAction, props } from '@ngrx/store';
import { IEventPreparationState } from './event-preparation-state.interface';

export const ResetEventPreparation = createAction('[Event Preparation] reset');

export const SetEventPreparation = createAction(
  '[Event Preparation] set',
  props<{ eventPreparation: IEventPreparationState }>()
);
