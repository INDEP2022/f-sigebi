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
  noSubtype: {
    title: 'No. Subtipo',
    sort: false,
    type: 'custom',
  },
  description: {
    title: 'Descripción',
    sort: false,
    type: 'custom',
  },
};

export const DELEGATION_COLUMNS_REPORT = {
  delegation: {
    title: 'No. Delegación',
    sort: false,
    type: 'custom',
  },
  description: {
    title: 'Descripción',
    sort: false,
    type: 'custom',
  },
};

export const STATUS_COLUMNS_REPORT = {
  status: {
    title: 'Estatus',
    sort: false,
    type: 'custom',
  },
  description: {
    title: 'Descripción',
    sort: false,
    type: 'custom',
  },
};

export const HISTORY_COLUMNS_REPORT = {
  situation: {
    title: 'Situación',
    sort: false,
    type: 'custom',
  },
  noGood: {
    title: 'No. Bien',
    sort: false,
    type: 'custom',
  },
  status: {
    title: 'Estatus',
    sort: false,
    type: 'custom',
  },
  dateChange: {
    title: 'Fecha del Cambio',
    sort: false,
    type: 'custom',
  },
  userhange: {
    title: 'Usuario Cambio',
    sort: false,
    type: 'custom',
  },
  chanelChange: {
    title: 'Programa Cambio Estatus',
    sort: false,
    type: 'custom',
  },
  reasonChange: {
    title: 'Motivo del Cambio',
    sort: false,
    type: 'custom',
  },
  noRegister: {
    title: 'No. Registro',
    sort: false,
    type: 'custom',
  },
  process: {
    title: 'Proceso Ext. Dom.',
    sort: false,
    type: 'custom',
  },
};

export const HISTORY_EVENT_COLUMNS_REPORT = {
  noGood: {
    title: 'No. Bien',
    sort: false,
    type: 'custom',
  },
  typeEvent: {
    title: 'Tipo Evento',
    sort: false,
    type: 'custom',
  },
  keyEvent: {
    title: 'Clave Evento',
    sort: false,
    type: 'custom',
  },
  dateEvent: {
    title: 'Fecha Evento',
    sort: false,
    type: 'custom',
  },
  dateFail: {
    title: 'Fecha Fallo',
    sort: false,
    type: 'custom',
  },
};
