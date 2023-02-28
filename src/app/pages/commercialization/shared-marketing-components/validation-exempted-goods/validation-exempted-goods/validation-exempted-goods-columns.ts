import { IGood } from "src/app/core/models/ms-good/good";
import { IGoodsTransAva } from "src/app/core/models/ms-good/goods-trans-ava.model";

export const GOODS_COLUMS = {
  id: {
    title: 'Unidad',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
    
  },
  quantity: {
    title: 'Unidad',
    type: 'string',
    sort: false,
  },
};

export const PROCCESS_COLUMNS = {
  goodNumber: {
    title: 'No Bien',
    type: 'string',
    sort: false,
  },
  process: {
    title: 'Proceso',
    type: 'string',
    sort: false,
  },
}
