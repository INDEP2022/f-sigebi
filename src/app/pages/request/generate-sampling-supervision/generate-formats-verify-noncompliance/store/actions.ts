import { createAction, props } from '@ngrx/store';
import { Item } from '../store/item.module';

//sin
export const loadItems = createAction('[Add Assets] Add');
//con parametros
export const listAssets = createAction(
  '[List] List',
  props<{ items: Item[] }>()
);
