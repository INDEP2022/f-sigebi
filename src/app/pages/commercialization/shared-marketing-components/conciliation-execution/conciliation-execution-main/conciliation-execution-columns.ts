import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const CONCILIATION_EXECUTION_COLUMNS = {
  customerId: {
    title: 'ID Cliente',
    type: 'number',
    sort: false,
  },
  name: {
    title: 'Cliente',
    sort: false,
    type: 'string',
  },
  indicted: {
    title: 'Procesado',
    type: 'string',
    sort: false,
    filter: {
      type: 'list',
      config: {
        selectText: 'Todos',
        list: [
          { value: 'S', title: 'SI' },
          { value: 'N', title: 'NO' },
        ],
      },
    },
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.indicted == 'N') {
        return 'NO';
      } else if (row.indicted == 'S') {
        return 'SI';
      } else {
        return row.indicted;
      }
    },
  },
  process: {
    title: 'Procesar',
    type: 'string',
    sort: false,
    filter: {
      type: 'list',
      config: {
        selectText: 'Todos',
        list: [
          { value: 'S', title: 'SI' },
          { value: 'N', title: 'NO' },
        ],
      },
    },
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.process == 'N') {
        return 'NO';
      } else if (row.process == 'S') {
        return 'SI';
      } else {
        return row.process;
      }
    },
  },
  executionDate: {
    title: 'Fecha Ejecución',
    sort: false,
    type: 'html',
    valuePrepareFunction: (text: string) => {
      console.log('text', text);
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
};
