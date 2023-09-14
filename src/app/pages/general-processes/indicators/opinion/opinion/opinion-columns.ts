import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

export const GENERAL_PROCESSES_OPINION_COLUNNS = {
  regionalcoordination: {
    title: 'Coordinación Regional',
    sort: false,
  },
  opinioncode: {
    title: 'Tipo de Desahogo',
    sort: false,
  },
  externallettercode: {
    title: 'Número de Oficio',
    sort: false,
  },
  filenumber: {
    title: 'Número de Expediente',
    sort: false,
  },
  flywheelnumber: {
    title: 'Número Volante',
    sort: false,
  },
  startdateofindication: {
    title: 'Fecha Volante',
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
  enddate: {
    title: 'Fecha Desahogo',
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
  maximumdate: {
    title: 'Fecha Máxima',
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
  startdate: {
    title: 'Usuario',
    sort: false,
  },
  // cumplio: {
  //     title: 'Cumplio',
  //     sort: false
  // },
};
