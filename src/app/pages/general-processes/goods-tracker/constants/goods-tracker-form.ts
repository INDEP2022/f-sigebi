import { FormControl, Validators } from '@angular/forms';
import { GoodsTrackerCriteriasEnum } from './goods-tracker-criterias.enum';

export const GOODS_TRACKER_FORM = {
  criterio: new FormControl<GoodsTrackerCriteriasEnum>(null, [
    Validators.required,
  ]),
};

export const TARGET_IDENTIFIERS = [
  {
    label: 'Venta',
    value: '1',
  },
  {
    label: 'Donación',
    value: '2',
  },
  {
    label: 'Resguardo',
    value: '1',
  },
  {
    label: 'Destrucción',
    value: '1',
  },
  {
    label: 'Devolución',
    value: '1',
  },
  {
    label: 'Enterado Lif',
    value: '1',
  },
  {
    label: 'Amparo',
    value: '1',
  },
];

export const GOOD_PHOTOS_OPTIOS = [
  {
    label: 'Todos',
    value: '1',
  },
  {
    label: 'Con fotografías',
    value: '2',
  },
  {
    label: 'Sin fotografías',
    value: '3',
  },
];
