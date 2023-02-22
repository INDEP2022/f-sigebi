import { createReducer, on } from '@ngrx/store';
import { ITrackedGood } from 'src/app/core/models/ms-good-tracker/tracked-good.model';
import { ResetTrackedGoods, SetTrackedGoods } from './goods-tracker.actions';

export const initialState: ReadonlyArray<ITrackedGood> = [];

export const trackedGoodsReducer = createReducer(
  initialState,
  on(ResetTrackedGoods, () => initialState),
  on(SetTrackedGoods, (_state, { trackedGoods }) => trackedGoods)
);
