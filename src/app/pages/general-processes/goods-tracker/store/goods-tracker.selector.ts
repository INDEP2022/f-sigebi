import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ITrackedGood } from 'src/app/core/models/ms-good-tracker/tracked-good.model';

export const selectTrackedGoods =
  createFeatureSelector<ITrackedGood[]>('trackedGoods');

export const getTrackedGoods = createSelector(
  selectTrackedGoods,
  (state: ITrackedGood[]) => state
);
