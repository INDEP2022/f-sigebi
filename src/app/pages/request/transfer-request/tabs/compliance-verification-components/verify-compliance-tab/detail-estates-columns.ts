import { SaeInputComponent } from './sae-input/sae-input.component';
import { SelectInputComponent } from './select-input/select-input.component';

export const DETAIL_ESTATE_COLUMNS = {
  id: {
    title: 'No. Gestión',
    type: 'string',
    sort: false,
  },
  goodDescription: {
    title: 'Descripción de Bien Transferente',
    type: 'string',
    sort: false,
  },
  descriptionGoodSae: {
    title: 'Descripción Bien INDEP',
    type: 'custom',
    class: 'custom-field',
    filter: false,
    renderComponent: SaeInputComponent,
    onComponentInitFunction(instance?: any) {},
    sort: false,
  },
  goodTypeName: {
    title: 'Tipo Bien',
    type: 'string',
    sort: false,
  },
  quantity: {
    title: 'Cantidad de la Transferente',
    type: 'string',
    sort: false,
  },
  unitMeasureName: {
    /* title: 'Unidad de Medida Transferente',
    type: 'string',
    sort: false, */
    title: 'Unidad de Medida Transferente',
    type: 'custom',
    class: 'custom-field',
    filter: false,
    renderComponent: SelectInputComponent,
    onComponentInitFunction(instance?: any) {},
    sort: false,
  },
  uniqueKey: {
    title: 'Clave Única',
    type: 'string',
    sort: false,
  },
  physicstateName: {
    title: 'Estado Físico',
    type: 'string',
    sort: false,
  },
  stateConservationName: {
    title: 'Estado de Conservación',
    type: 'string',
    sort: false,
  },
  destinyName: {
    title: 'Destino Ligie',
    type: 'string',
    sort: false,
  },
  ligieUnit: {
    title: 'Unidad de Medida Ligie',
    type: 'string',
    sort: false,
  },
  transferentDestinyName: {
    title: 'Destino Transferente',
    type: 'string',
    sort: false,
  },
};
