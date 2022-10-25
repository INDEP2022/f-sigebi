import { SaeInputComponent } from './sae-input/sae-input.component';

export const DETAIL_ESTATE_COLUMNS = {
  gestion: {
    title: 'Gestion',
    type: 'string',
    sort: false,
  },
  descripEstateTransfe: {
    title: 'Descripción de Bien Transferente',
    type: 'string',
    sort: false,
  },
  descriptionEstateSAE: {
    title: 'Descripción Bien SAE',
    type: 'custom',
    class: 'custom-field',
    filter: false,
    renderComponent: SaeInputComponent,
    onComponentInitFunction(instance?: any) {},
    sort: false,
  },
  typeEstate: {
    title: 'Tipo Bien',
    type: 'string',
    sort: false,
  },
  quantityTransfe: {
    title: 'Cantidad de la Transferente',
    type: 'string',
    sort: false,
  },
  measureUnit: {
    title: 'Unidad de Medida Transferente',
    type: 'string',
    sort: false,
  },
  uniqueKey: {
    title: 'Clave Única',
    type: 'string',
    sort: false,
  },
  physicalState: {
    title: 'Estado Fisico',
    type: 'string',
    sort: false,
  },
  stateConservation: {
    title: 'Estado de Concervación',
    type: 'string',
    sort: false,
  },
  destinyLigie: {
    title: 'Destino Ligie',
    type: 'string',
    sort: false,
  },
  transferDestina: {
    title: 'Destino Transferente',
    type: 'string',
    sort: false,
  },
};
