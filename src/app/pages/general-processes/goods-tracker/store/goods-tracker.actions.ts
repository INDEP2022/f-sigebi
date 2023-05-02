import { createAction, props } from '@ngrx/store';
import { ITrackedGood } from 'src/app/core/models/ms-good-tracker/tracked-good.model';

export const ResetTrackedGoods = createAction('[Goods Tracked] reset');

export const SetTrackedGoods = createAction(
  '[Goods Tracked] set',
  props<{ trackedGoods: ITrackedGood[] }>()
);
