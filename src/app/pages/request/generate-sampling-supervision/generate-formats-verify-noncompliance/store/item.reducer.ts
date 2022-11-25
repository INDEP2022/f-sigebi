import { createReducer, on } from '@ngrx/store';
//import { addAssets } from './actions';
import { listAssets, loadItems } from './actions';
import { ItemState } from './item.state';

export const initialState: ItemState = { items: [] };

export const itemReducer = createReducer(
  initialState,
  on(loadItems, state => {
    return { ...state };
  }),
  //restructuracion de js. encargado de cambiar el estado a otro
  on(listAssets, (state, { items }) => {
    return { ...state, items };
  })
);
