import {
  IExpedient,
  IKey,
  IState,
} from 'src/app/core/models/catalogs/date-documents.model';

export const DATEDOCUMENTS_COLUMNS = {
  expedientNumber: {
    title: 'Exp.',
    type: 'number',
    valuePrepareFunction: (value: IExpedient) => {
      return value.id;
    },
    sort: false,
  },
  stateNumber: {
    title: 'Bien',
    valuePrepareFunction: (value: IState) => {
      return value.id;
    },
    type: 'number',
    sort: false,
  },
  typeDictum: {
    title: 'Tipo Dicta',
    sort: false,
  },
  key: {
    title: 'Documento',
    valuePrepareFunction: (value: IKey) => {
      return value.key + ' - ' + value.description;
    },

    sort: false,
  },
  dateReceipt: {
    title: 'Recibido',
    sort: false,
  },
  notificationDate: {
    title: 'Notificación',
    sort: false,
  },
  userReceipt: {
    title: 'Usuario',
    sort: false,
  },
  insertionDate: {
    title: 'Inserción',
    sort: false,
  },
};
