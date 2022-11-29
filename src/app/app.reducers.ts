import { ActionReducerMap } from '@ngrx/store';
import { counterReducer } from './pages/admin/reducer/home.reducer';
import { itemReducer } from './pages/request/generate-sampling-supervision/generate-formats-verify-noncompliance/store/item.reducer';
import { ItemState } from './pages/request/generate-sampling-supervision/generate-formats-verify-noncompliance/store/item.state';

export interface AppState {
  count: number;
  items: ItemState;
}

export const ROOT_REDUCERS: ActionReducerMap<AppState> = {
  count: counterReducer,
  items: itemReducer,
};
