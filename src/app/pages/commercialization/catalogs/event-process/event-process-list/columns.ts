import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const COLUMNS = {
  id: {
    title: 'Id Evento',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.comerDetail.id;
    },
    filterFunction(cell?: any, search?: string): boolean {
      console.log('c ' + cell);
      console.log('s ' + search);
      const cellValue = cell.toString().toLowerCase();
      const searchValue = search.toLowerCase();
      return cellValue.includes(searchValue);
    },
  },
  processKey: {
    title: 'CVE Proceso',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.comerDetail.processKey != null
        ? row.comerDetail.processKey
        : '';
    },
    filterFunction(cell?: any, search?: string): boolean {
      return true;
    },
  },
  tpeventoId: {
    title: 'Tipo',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.comerDetail.tpeventoId;
    },
    filterFunction(cell?: any, search?: string): boolean {
      return true;
    },
  },
  statusvtaId: {
    title: 'Estatus',
    sort: false,
    valuePrepareFunction: (cell: any, row: any) => {
      return row.comerDetail.statusvtaId;
    },
    filterFunction(cell?: any, search?: string): boolean {
      return true;
    },
  },
  phase: {
    title: 'Fase',
    sort: false,
  },
  year: {
    title: 'Año',
    sort: false,
  },
  warrantyDate: {
    title: 'Fecha Garantía',
    sort: false,
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  topost: {
    title: 'Publicar',
    sort: false,
    type: 'html',
    valuePrepareFunction: (text: string) => {
      return text ? (text == '1' ? '☑️' : '🔲') : '';
    },
    filter: {
      type: 'checkbox',
      config: {
        true: '1',
        false: '0',
        resetText: 'clear',
      },
    },
  },
};
