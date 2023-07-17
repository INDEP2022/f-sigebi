import { FormGroup } from '@angular/forms';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ITrackedGood } from 'src/app/core/models/ms-good-tracker/tracked-good.model';
import { GoodTrackerForm } from '../utils/goods-tracker-form';

export const selectTrackedGoods =
  createFeatureSelector<ITrackedGood[]>('trackedGoods');

export const getTrackedGoods = createSelector(
  selectTrackedGoods,
  (state: ITrackedGood[]) => state
);

export const selectTrackerFilter =
  createFeatureSelector<FormGroup<GoodTrackerForm>>('trackerFilter');

export const getTrackerFilter = createSelector(
  selectTrackerFilter,
  (state: FormGroup<GoodTrackerForm>) => state
);
