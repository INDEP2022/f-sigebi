import { formatForIsoDate } from 'src/app/shared/utils/date';

export const COLUMNS = {
  goodNumber: {
    title: 'Id',
    sort: false,
    type: 'string',
  },
  amount: {
    title: 'Monto',
    sort: false,
    type: 'string',
  },
  apply: {
    title: 'Participa Conversión',
    sort: false,
    type: 'string',
  },
  date: {
    title: 'Fecha',
    sort: false,
    type: 'string',
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.date == null) {
        return '';
      } else {
        return formatForIsoDate(row.date, 'string');
      }
    },
  },
};
