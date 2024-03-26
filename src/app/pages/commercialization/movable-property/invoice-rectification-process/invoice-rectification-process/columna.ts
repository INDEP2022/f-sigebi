import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';
import { CustomHourFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-hour-filter';

export const REDICET_FACTURAS = {
  invoicefield: {
    title: 'En',
    width: '30%',
    type: 'string',
    sort: false,
  },
  worthCurrent: {
    title: 'Dice',
    width: '35%',
    type: 'string',
    sort: false,
  },
  worthNew: {
    title: 'Debe Decir',
    width: '35%',
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
    filterFunction: () => {
      return true;
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
  // year: {
  //   title: 'Año',
  //   type: 'string',
  //   sort: false,
  //   width: '10%',
  // },
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
    filterFunction: () => {
      return true;
    },
  },
  attentionDate: {
    title: 'Fecha',
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
    filterFunction: () => {
      return true;
    },
  },
  documentspresented: {
    title: 'Documentos Presentados',
    type: 'string',
    sort: false,
  },
  elaborates: {
    title: 'Elabora',
    type: 'string',
    sort: false,
  },
  check: {
    title: 'Verifica',
    type: 'string',
    sort: false,
  },
  issues: {
    title: 'Expide',
    type: 'string',
    sort: false,
  },
  hourAttention: {
    title: 'Hora',
    type: 'string',
    sort: false,
    valuePrepareFunction: (text: string) => {
      if (!text) return null;
      let data = text.split(' ');
      return `${
        text
          ? data[0].split('T')[0].split('-').reverse().join('/') + ' ' + data[1]
          : ''
      }`;
    },
    filter: {
      type: 'custom',
      component: CustomHourFilterComponent,
    },
    filterFunction: () => {
      return true;
    },
  },
  paragraph1: {
    title: 'Párrafo 1',
    type: 'string',
    sort: false,
  },
  paragraph3: {
    title: 'Párrafo 3',
    type: 'string',
    sort: false,
  },
  paragraph4: {
    title: 'Párrafo 4',
    type: 'string',
    sort: false,
  },
  // year: {
  //   title: 'Año',
  //   type: 'string',
  //   sort: false,
  // },
};
