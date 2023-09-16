import { format } from 'date-fns';

export const APPRAISAL_TABLE_COLUMNS = {
  appraisalId: {
    title: 'Id',
    sort: false,
  },
  appraisalKey: {
    title: 'Cve. Avalúo',
    sort: false,
  },
  officialKey: {
    title: 'Cve. Oficio',
    sort: false,
  },
  insertDate: {
    title: 'Fecha de Registro',
    sort: false,
    valuePrepareFunction: (value: string) =>
      value ? format(new Date(value), 'dd/MM/yyyy') : '',
  },
};
