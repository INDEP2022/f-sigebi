import { DetailEventsComponent } from './component-render/detail-events/detail-events.component';
import { DetailStatusComponent } from './component-render/detail-status/detail-status.component';

export const GOODS_COLUMNS = {
  detailStatus: {
    title: 'Detalle Estatus',
    sort: false,
    type: 'custom',
    renderComponent: DetailStatusComponent,
  },
  detailEvents: {
    title: 'Detalle  Eventos',
    sort: false,
    type: 'custom',
    renderComponent: DetailEventsComponent,
  },
  noGood: {
    title: 'No. Bien',
    sort: false,
  },
  status: {
    title: 'Estatus Bien',
    sort: false,
  },
  description: {
    title: 'Descripción del Bien',
    sort: false,
  },

  totalEventsRef: {
    title: 'Número de Eventos Reforma',
    sort: false,
  },
  daysWithoutSellingRef: {
    title: 'Días Trancurridos Reforma',
    sort: false,
  },
  datePubInitialRef: {
    title: 'Publicación Primer Evento Reforma',
    sort: false,
  },
  dateFailRef: {
    title: 'Fallo Primer Evento Reforma',
    sort: false,
  },
  datePubFinalRef: {
    title: 'Publicación Último Evento Reforma',
    sort: false,
  },
  dateFailFinalRef: {
    title: 'Fallo Último Evento Reforma',
    sort: false,
  },

  totalEventsHist: {
    title: 'Número de Eventos Histórico',
    sort: false,
  },
  daysWithoutSellingHist: {
    title: 'Días Trancurridos Histórico',
    sort: false,
  },
  datePubInitialHist: {
    title: 'Publicación Primer Evento Histórico',
    sort: false,
  },
  dateFailHist: {
    title: 'Fallo Primer Evento Histórico',
    sort: false,
  },
  datePubFinalHist: {
    title: 'Publicación Último Evento Histórico',
    sort: false,
  },
  dateFailFinalHist: {
    title: 'Fallo Último Evento Histórico',
    sort: false,
  },

  typeGood: {
    title: 'Tipo de Bien',
    sort: false,
  },
  subTypeGood: {
    title: 'Sub Tipo Bien',
    sort: false,
  },
  delegation: {
    title: 'Delegación Administra',
    sort: false,
  },
};

export const SUBTYPE_COLUMNS_REPORT = {
  no_subtipo: {
    title: 'No. Subtipo',
    sort: false,
    type: 'string',
  },
  nombre_subtipo_bien: {
    title: 'Descripción',
    sort: false,
    type: 'string',
  },
};

export const DELEGATION_COLUMNS_REPORT = {
  id: {
    title: 'No. Delegación',
    sort: false,
    type: 'string',
  },
  description: {
    title: 'Descripción',
    sort: false,
    type: 'string',
  },
};

export const STATUS_COLUMNS_REPORT = {
  status: {
    title: 'Estatus',
    sort: false,
    type: 'string',
  },
  description: {
    title: 'Descripción',
    sort: false,
    type: 'string',
  },
};

export const HISTORY_COLUMNS_REPORT = {
  situation: {
    title: 'Situación',
    sort: false,
    type: 'string',
  },
  noGood: {
    title: 'No. Bien',
    sort: false,
    type: 'string',
  },
  status: {
    title: 'Estatus',
    sort: false,
    type: 'string',
  },
  dateChange: {
    title: 'Fecha del Cambio',
    sort: false,
    type: 'string',
  },
  userhange: {
    title: 'Usuario Cambio',
    sort: false,
    type: 'string',
  },
  chanelChange: {
    title: 'Programa Cambio Estatus',
    sort: false,
    type: 'string',
  },
  reasonChange: {
    title: 'Motivo del Cambio',
    sort: false,
    type: 'string',
  },
  noRegister: {
    title: 'No. Registro',
    sort: false,
    type: 'string',
  },
  process: {
    title: 'Proceso Ext. Dom.',
    sort: false,
    type: 'string',
  },
};

export const HISTORY_EVENT_COLUMNS_REPORT = {
  noGood: {
    title: 'No. Bien',
    sort: false,
    type: 'string',
  },
  typeEvent: {
    title: 'Tipo Evento',
    sort: false,
    type: 'string',
  },
  keyEvent: {
    title: 'Clave Evento',
    sort: false,
    type: 'string',
  },
  dateEvent: {
    title: 'Fecha Evento',
    sort: false,
    type: 'string',
  },
  dateFail: {
    title: 'Fecha Fallo',
    sort: false,
    type: 'string',
  },
};
