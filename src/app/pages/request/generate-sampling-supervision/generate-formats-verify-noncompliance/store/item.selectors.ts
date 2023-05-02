import { createSelector } from '@ngrx/store';
import { AppState } from '../../../../../app.reducers';
import { ItemState } from './item.state';

//Selector de items
export const selectItemsFeature = (state: AppState) => state.items;

export const selectListItems = createSelector(
  selectItemsFeature,
  (state: ItemState) => state.items
);
