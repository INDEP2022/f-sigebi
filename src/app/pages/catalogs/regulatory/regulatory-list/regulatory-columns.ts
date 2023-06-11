import { DatePipe } from '@angular/common';

export const REGULATORY_COLUMNS = {
  id: {
    title: 'Id',
    type: 'number',
    sort: false,
  },
  fractionId: {
    title: 'Id Fracción',
    type: 'number',
    sort: false,
    valuePrepareFunction: (value: any) => {
      return value.id;
    },
  },
  number: {
    title: 'Número',
    type: 'string',
    sort: false,
  },
  description: {
    title: 'Descripción',
    type: 'string',
    sort: false,
  },
  validateEf: {
    title: 'validar Ef',
    type: 'string',
    sort: false,
  },
  validateEc: {
    title: 'Validar Ec',
    type: 'string',
    sort: false,
  },
  userCreation: {
    title: 'Usuario Creación',
    type: 'string',
    sort: false,
  },
  creationDate: {
    title: 'Fecha Creación',
    type: 'Date',
    sort: false,
    valuePrepareFunction: (date: Date) => {
      var raw = new Date(date);
      var formatted = new DatePipe('en-EN').transform(raw, 'dd/MM/yyyy');
      return formatted;
    },
  },
  userModification: {
    title: 'Usuario Modificación',
    type: 'string',
    sort: false,
  },
  modificationDate: {
    title: 'Fecha Modificación',
    type: 'Date',
    sort: false,
    valuePrepareFunction: (date: Date) => {
      var raw = new Date(date);
      var formatted = new DatePipe('en-EN').transform(raw, 'dd/MM/yyyy');
      return formatted;
    },
  },
  version: {
    title: 'Versión',
    type: 'number',
    sort: false,
  },
};
