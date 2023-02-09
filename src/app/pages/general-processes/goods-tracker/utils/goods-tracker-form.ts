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

export class GoodTrackerForm {
  satDepartureNum = new FormControl<string>(null);
  clasifNum = new FormControl<string>(null);
  alternativeClasifNum = new FormControl<string>(null);
  types = new FormControl<string[]>(null);
  subtypes = new FormControl<string[]>(null);
  ssubtypes = new FormControl<string[]>(null);
  sssubtypes = new FormControl<string[]>(null);
  goodNum = new FormControl<string>(null);
  process = new FormControl<string>(null);
  samiInventory = new FormControl<string>(null);
  targetIdentifier = new FormControl<string>(null);
  status = new FormControl<string>(null);
  withPhoto = new FormControl<string>(null);
  menageFather = new FormControl<string>(null);
  valueFrom = new FormControl<string>(null);
  valueTo = new FormControl<string>(null);
  photoDate = new FormControl<string>(null);
  identifier = new FormControl<string>(null);
  description = new FormControl<string>(null);
  attributes = new FormControl<string>(null);
  movableIventory = new FormControl<string>(null);
  siabiInventory = new FormControl<string>(null);
  cisiInventory = new FormControl<string>(null);
  expedientNum = new FormControl<string>(null);
  flyerNum = new FormControl<string>(null);
  judgeNum = new FormControl<string>(null);
  trasnferExp = new FormControl<string>(null);
  flyerType = new FormControl<string>(null);
  officeDate = new FormControl<string>(null);
  protection = new FormControl<string>(null);
  indicatedName = new FormControl<string>(null);
  publicMin = new FormControl<string>(null);
  criminalCase = new FormControl<string>(null);
  officeNum = new FormControl<string>(null);
  previusInvestigation = new FormControl<string>(null);
  dictum = new FormControl<string>(null);
  criminalCause = new FormControl<string>(null);
  receptionForm = new FormControl<string>(null);
  receptionTo = new FormControl<string>(null);
  certificate = new FormControl<string>(null);
  receptionStatus = new FormControl<string>(null);
  statusChangeFrom = new FormControl<string>(null);
  statusChaangeTo = new FormControl<string>(null);
  eventNum = new FormControl<string>(null);
  historicalProcess = new FormControl<string>(null);
  transfers = new FormControl<string>(null);
  transmitters = new FormControl<string>(null);
  autorities = new FormControl<string>(null);
  warehouse = new FormControl<string>(null);
  cordination = new FormControl<string>(null);
  autorityState = new FormControl<string>(null);
  goodState = new FormControl<string>(null);
}
