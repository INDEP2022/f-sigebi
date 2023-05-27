export const COLUMNS_CAPTURE_EVENTS = {
  ref: {
    title: 'Ref',
    type: 'number',
    sort: false,
  },
  destructionOpinion: {
    title: 'Dictamen Destrucción',
    type: 'string',
    sort: false,
  },
  numberGood: {
    title: 'No. Bien',
    type: 'number',
    sort: false,
  },
  status: {
    title: 'Estatus',
    type: 'string',
    sort: false,
  },
  process: {
    title: 'Proceso',
    type: 'string',
    sort: false,
  },
  descriptionGood: {
    title: 'Descripción del Bien',
    valuePrepareFunction: (value: any, row: any) => row.good.description,
    type: 'string',
    sort: false,
  },
  typeGood: {
    title: 'Tipo de Bien',
    type: 'string',
    sort: false,
  },
  proceedings: {
    title: 'Expediente',
    type: 'number',
    valuePrepareFunction: (value: any, row: any) => row.good.fileNumber,
    sort: false,
  },
  quantity: {
    title: 'Cantidad',
    type: 'number',
    sort: false,
  },
  deliveryActDate: {
    title: 'Fecha Acto Entrega',
    type: 'string',
    sort: false,
  },
  dateActCompletion: {
    title: 'Fecha Acto Entrega',
    type: 'string',
    sort: false,
  },
  destinationIndicator: {
    title: 'Indicador Destino',
    type: 'string',
    sort: false,
  },
  select: {
    title: 'Selec.',
    type: 'boolean',
    sort: false,
  },
};
