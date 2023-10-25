//Components

import { formatForIsoDate } from 'src/app/shared/utils/date';

export const COLUMNS = {
  periodEndDate: {
    title: 'Fecha Término',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return formatForIsoDate(text, 'string');
    },
  },
  notificationDate: {
    title: 'Fecha Notificación',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return formatForIsoDate(text, 'string');
    },
  },
  duct: {
    title: 'Conducto',
    sort: false,
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: 'PERSONAL', title: 'PERSONAL' },
          { value: 'CORREO', title: 'CORREO' },
          { value: 'EDICTO', title: 'EDICTO' },
        ],
      },
    },
  },
  notifiedTo: {
    title: 'Notificado a',
    sort: false,
  },
  notifiedPlace: {
    title: 'Lugar',
    sort: false,
  },
  editPublicationDate: {
    title: 'Fecha Publicación',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return formatForIsoDate(text, 'string');
    },
  },
  newspaperPublication: {
    title: 'Periodico de publicación',
    sort: false,
  },
  observation: {
    title: 'Observaciones',
    sort: false,
  },
  statusNotified: {
    title: 'Estatus',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return text == 'AE' ? 'Enterado' : text == 'AN' ? 'No Enterado' : '';
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: 'AE', title: 'Enterado' },
          { value: 'AN', title: 'No Enterado' },
        ],
      },
    },
  },
  insertMethod: {
    title: 'Método de Inserción',
    sort: false,
  },
};
