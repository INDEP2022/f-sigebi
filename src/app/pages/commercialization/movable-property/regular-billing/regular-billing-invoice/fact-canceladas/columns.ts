import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const COLUMNS = {
  folio: {
    title: 'Folio',
    sort: true,
  },
  seriefact: {
    title: 'Serie',
    sort: true,
  },
  id_factura: {
    title: 'Id. Factura',
    sort: true,
  },

  id_evento: {
    title: 'Evento',
    sort: false,
  },
  id_lote: {
    title: 'Lote',
    sort: false,
  },
  fecha_impresion: {
    title: 'Fecha Impresión',
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
};
