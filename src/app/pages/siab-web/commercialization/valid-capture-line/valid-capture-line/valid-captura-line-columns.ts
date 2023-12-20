import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const VALID_CAPTURE_LINE_COLUMNS = {
  lc: {
    title: 'Id',
    sort: false,
  },
  lote_publico: {
    title: 'Lote Publico',
    sort: false,
  },
  importe: {
    title: 'Monto',
    sort: false,
  },
  estatus: {
    title: 'Estatus',
    sort: false,
  },
  tipo: {
    title: 'Tipo',
    sort: false,
  },
  referencia: {
    title: 'Referencia',
    sort: false,
  },
  fec_vigencia: {
    title: 'Fecha Vigencia',
    sort: false,
    type: 'html',
    valuePrepareFunction: (text: string) => {
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  rfc: {
    title: 'RFC',
    sort: false,
  },
  id_cliente: {
    title: 'Id Cliente',
    sort: false,
  },
  cliente: {
    title: 'Cliente',
    sort: false,
  },
  tipo_ref: {
    title: 'Tipo Ref',
    sort: false,
  },
};
