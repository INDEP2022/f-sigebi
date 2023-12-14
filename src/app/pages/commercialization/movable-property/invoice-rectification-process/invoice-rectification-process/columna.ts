import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const REDICET_FACTURAS = {
  invoicefield: {
    title: 'En',
    type: 'string',
    sort: false,
  },
  worthCurrent: {
    title: 'Dice',
    type: 'string',
    sort: false,
  },
  worthNew: {
    title: 'Debe Decir',
    type: 'string',
    sort: false,
  },
};

export const COLUMNS = {
  jobNot: {
    title: 'No. Oficio',
    type: 'string',
    sort: false,
    width: '10%',
  },
  expDate: {
    title: 'Fecha de Expedición',
    type: 'string',
    sort: false,
    valuePrepareFunction: (text: string) => {
      if (!text) return null;
      return `${text ? text.split('T')[0].split('-').reverse().join('/') : ''}`;
    },
    filter: {
      type: 'custom',
      component: CustomDateFilterComponent,
    },
  },
  series: {
    title: 'Serie',
    type: 'string',
    sort: false,
    width: '10%',
  },
  name: {
    title: 'Nombre',
    type: 'string',
    sort: false,
  },
  year: {
    title: 'Año',
    type: 'string',
    sort: false,
    width: '10%',
  },
  lastnamePat: {
    title: 'Apellido Paterno',
    type: 'string',
    sort: false,
  },
  lastnameMat: {
    title: 'Apellido Materno',
    type: 'string',
    sort: false,
  },
  inrepresentation: {
    title: 'Representante',
    type: 'string',
    sort: false,
  },
  year: {
    title: 'Año',
    type: 'string',
    sort: false,
  },
};
