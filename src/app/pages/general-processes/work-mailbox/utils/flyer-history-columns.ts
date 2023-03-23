import { format } from 'date-fns';

export const FLYER_HISTORY_COLUMNS = {
  consecutive: {
    title: 'Consecutivo',
    sort: false,
  },
  statusProcedure: {
    title: 'Estatus',
    sort: false,
  },
  usrturned: {
    title: 'Usuario Turnado',
    sort: false,
  },
  dateturned: {
    title: 'Fecha Turnado',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (!value) {
        return '';
      }
      return format(new Date(value), 'dd-MM-yyyy');
    },
  },
  observations: {
    title: 'Observaciones',
    sort: false,
  },
};
