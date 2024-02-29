import { CustomDateFilter2Component } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter2';
import { formatForIsoDate } from 'src/app/shared/utils/date';

export const COLUMNS = {
  goodNumber: {
    title: 'Id Bien',
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
    type: 'html',
    valuePrepareFunction: (value: any) => {
      if (value == 'S')
        return '<strong><span class="badge badge-pill badge-success">Si</span></strong>';
      if (value == 'N' || !value)
        return '<strong><span class="badge badge-pill badge-warning">No</span></strong>';
      return value;
    },
    filter: {
      type: 'list',
      config: {
        selectText: 'Seleccionar',
        list: [
          { value: 'N', title: 'No' },
          { value: 'S', title: 'Si' },
        ],
      },
    },
    filterFunction(cell?: any, search?: string): boolean {
      return true;
    },
  },
  date: {
    title: 'Fecha',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.date == null) {
        return '';
      } else {
        return formatForIsoDate(row.date, 'string');
      }
    },
    filter: {
      type: 'custom',
      component: CustomDateFilter2Component,
    },
  },
};
