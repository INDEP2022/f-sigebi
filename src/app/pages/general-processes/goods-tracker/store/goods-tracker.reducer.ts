import { FormGroup } from '@angular/forms';
import { createReducer, on } from '@ngrx/store';
import { ITrackedGood } from 'src/app/core/models/ms-good-tracker/tracked-good.model';
import { GoodTrackerForm } from '../utils/goods-tracker-form';
import {
  ResetTrackedGoods,
  ResetTrackerFilter,
  SetTrackedGoods,
  SetTrackerFilter,
} from './goods-tracker.actions';

export const initialState: ReadonlyArray<ITrackedGood> = [];

export const trackedGoodsReducer = createReducer(
  initialState,
  on(ResetTrackedGoods, () => initialState),
  on(SetTrackedGoods, (_state, { trackedGoods }) => trackedGoods)
);

export const initialFormState: FormGroup<GoodTrackerForm> = null;
export const trackerFilterReducer = createReducer(
  initialFormState,
  on(ResetTrackerFilter, () => initialFormState),
  on(SetTrackerFilter, (_state, { trackerFilter }) => trackerFilter)
);
