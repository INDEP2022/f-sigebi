import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const REGULAR_BILLING_GENERATION_ASSETS_COLUMNS = {
  notGood: {
    title: 'No. Bien',
    sort: false,
    type: 'string',
    // filter: {
    //   type: 'custom',
    //   component: CustomFilterComponent,
    // },
  },
  series: {
    title: 'Serie',
    sort: false,
  },
  Invoice: {
    title: 'Folio',
    sort: false,
    type: 'string',
    // filter: {
    //   type: 'custom',
    //   component: CustomFilterComponent,
    // },
  },
  observations: {
    title: 'Observaciones',
    sort: false,
  },
  eventId: {
    title: 'Evento',
    sort: false,
    type: 'string',
    // filter: {
    //   type: 'custom',
    //   component: CustomFilterComponent,
    // },
  },
  lotPublic: {
    title: 'Lote',
    sort: false,
    type: 'string',
    // filter: {
    //   type: 'custom',
    //   component: CustomFilterComponent,
    // },
  },
  status: {
    title: 'Estatus',
    sort: false,
    filter: {
      type: 'list',
      config: {
        selectText: 'Todos',
        list: [
          { value: 1, title: 'Procesado' },
          { value: 0, title: 'No procesado' },
          { value: 3, title: 'No procesado por validación' },
        ],
      },
    },
    valuePrepareFunction: (cell: any, row: any) => {
      if (row.status == 1) {
        return 'Procesado';
      } else if (row.status == 0) {
        return 'No Procesado';
      } else if (row.status == 3) {
        return 'No procesado por validación';
      }
      return '';
    },
  },
  downloadValidation: {
    title: 'Validación/Motivo',
    sort: false,
  },
  insertDate: {
    title: 'Fecha Proceso',
    sort: false,
    valuePrepareFunction: (val: string) => {
      return val ? val.split('-').reverse().join('/') : '';
    },
    filterFunction: () => {
      return true;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  userinsert: {
    title: 'Usuario',
    sort: false,
  },
};
