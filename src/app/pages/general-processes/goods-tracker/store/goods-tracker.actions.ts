import { FormGroup } from '@angular/forms';
import { createAction, props } from '@ngrx/store';
import { ITrackedGood } from 'src/app/core/models/ms-good-tracker/tracked-good.model';
import { GoodTrackerForm } from '../utils/goods-tracker-form';

export const ResetTrackedGoods = createAction('[Goods Tracked] reset');

export const SetTrackedGoods = createAction(
  '[Goods Tracked] set',
  props<{ trackedGoods: ITrackedGood[] }>()
);

export const ResetTrackerFilter = createAction('[Goods Tracker Filter] reset');
export const SetTrackerFilter = createAction(
  '[Goods Tracker Filter] set',
  props<{ trackerFilter: FormGroup<GoodTrackerForm> }>()
);
