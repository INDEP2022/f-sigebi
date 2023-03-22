import { format } from 'date-fns';

export const LOG_TABLE_COLUMNS = {
  modifictiondate: {
    title: 'Fecha de Registro',
    sort: false,
    valuePrepareFunction: (_date: string) =>
      _date ? format(new Date(_date), 'dd-MM-yyyy') : '',
  },
  modificationuser: {
    title: 'Usuario',
    sort: false,
  },
  cadmodif1: {
    title: 'Modificación',
    sort: false,
  },
  modif3: {
    title: 'Observaciones',
    sort: false,
  },
};
