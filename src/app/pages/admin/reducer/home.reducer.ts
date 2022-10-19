import { Action } from '@ngrx/store';
import { decrement, increment } from '../action/home.actions';

export function counterReducer(state: number = 10, action: Action) {
  switch (action.type) {
    case increment.type:
      return state + 1;
    case decrement.type:
      return state - 1;
    default:
      return state;
  }
}
