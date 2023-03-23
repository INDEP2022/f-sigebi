import { format } from 'date-fns';

export const INDICATORS_HISTORY_COLUMNS = {
  num: {
    title: 'No.',
    sort: false,
  },
  id: {
    title: 'Indicador',
    sort: false,
  },
  admissionDate: {
    title: 'Fecha Ingreso',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (!value) {
        return '';
      }
      return format(new Date(value), 'dd-MM-yyyy');
    },
  },
  workDate: {
    title: 'Fecha Trabajo',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (!value) {
        return '';
      }
      return format(new Date(value), 'dd-MM-yyyy');
    },
  },
  maxDate: {
    title: 'Fecha Máxima',
    sort: false,
    valuePrepareFunction: (value: string) => {
      if (!value) {
        return '';
      }
      return format(new Date(value), 'dd-MM-yyyy');
    },
  },
  complied: {
    title: 'Cumplió',
    sort: false,
    valuePrepareFunction: (value: string) =>
      value == 'S' ? 'Si' : value == 'N' ? 'No' : '',
  },
};
