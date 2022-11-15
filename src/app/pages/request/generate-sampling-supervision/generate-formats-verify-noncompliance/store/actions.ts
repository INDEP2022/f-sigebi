import { createAction, props } from '@ngrx/store';
import { Item } from '../store/item.module';

export const add = createAction('[Add] Add', props<{ items: Item }>());

export const list = createAction('[List] List');
