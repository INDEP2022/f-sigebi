import { IFraccion } from 'src/app/core/models/ms-good/fraccion';

export const ASSETS_COLUMNS = {
  goodId: {
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
    title: 'Descripción de Bien INDEP',
    type: 'string',
    sort: false,
  },
  goodTypeName: {
    title: 'Tipo Bien',
    type: 'string',
    sort: false,
  },
  fraccion: {
    title: 'Fracción',
    type: 'string',
    sort: false,
    valuePrepareFunction: (value: IFraccion) => (value ? value.code : ''),
  },
  quantity: {
    title: 'Cantidad de la Transferente',
    type: 'string',
    sort: false,
  },
  ligieUnit: {
    title: 'Unidad de Medida Ligia',
    type: 'string',
    sort: false,
  },
  unitMeasure: {
    title: 'Unidad de Medida Transferente',
    type: 'string',
    sort: false,
  },
  uniqueKey: {
    title: 'Clave Unica',
    type: 'string',
    sort: false,
  },
  physicstateName: {
    title: 'Estado fisico',
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
  transferentDestinyName: {
    title: 'Destino Transferente',
    type: 'string',
    sort: false,
  },
};
